
import QuickBooks from 'node-quickbooks';
import { db } from './db';
import { getValidToken, getQuickBooksConfig } from './quickbooks';
import { logError, logInfo } from './logger';

const clientId = process.env.QB_CLIENT_ID!;
const clientSecret = process.env.QB_CLIENT_SECRET!;
const environment = process.env.QB_ENV || 'sandbox';

export async function getQuickBooksClient() {
    const accessToken = await getValidToken();
    const config = await getQuickBooksConfig();

    if (!accessToken || !config?.realmId) {
        return null;
    }

    return new QuickBooks(
        clientId,
        clientSecret,
        accessToken,
        false, // no token secret for OAuth 2.0
        config.realmId,
        environment === 'sandbox', // sandbox mode
        true, // logging
        null, // minor version
        '2.0' // oauth version
    );
}

// Promisify QB methods
const qbRequest = (qbo: any, method: string, ...args: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
        qbo[method].apply(qbo, [
            ...args,
            (err: any, data: any, res: any) => {
                const tid = res?.headers?.['intuit-tid'];
                if (tid) {
                    console.log(`[QuickBooks] Intuit TID: ${tid} (Method: ${method})`);
                }

                if (err) {
                    // Attach TID to error for visibility
                    if (tid && typeof err === 'object') {
                        err.intuit_tid = tid;
                    }
                    console.error(`[QuickBooks] Error in ${method}. TID: ${tid || 'N/A'}`);
                    reject(err);
                } else {
                    resolve(data);
                }
            }
        ]);
    });
};

export async function syncData() {
    const qbo = await getQuickBooksClient();
    if (!qbo) throw new Error("QuickBooks not connected");

    const orders = await db.order.findMany({
        where: {
            status: { in: ['PAID', 'COMPLETED', 'DELIVERED'] }
        },
        include: {
            items: {
                include: {
                    meal: true
                }
            }
        }
    });

    const results = {
        invoices: 0,
        payments: 0,
        expenses: 0,
        errors: [] as string[]
    };

    // 1. Sync Sales (Pushes to QB)
    for (const order of orders) {
        try {
            // Check if already synced (you might want to add a qbId field to Order model)
            // For now, let's assume we search by DocNumber (orderNumber)

            const existingInvoices = await qbRequest(qbo, 'findInvoices', [
                { DocNumber: order.orderNumber }
            ]);

            if (existingInvoices.QueryResponse.Invoice?.length > 0) {
                continue; // Already synced
            }

            // 1. Create/Find Customer
            let qbCustomer;
            const existingCustomers = await qbRequest(qbo, 'findCustomers', [
                { PrimaryEmailAddr: order.customerEmail }
            ]);

            if (existingCustomers.QueryResponse.Customer?.length > 0) {
                qbCustomer = existingCustomers.QueryResponse.Customer[0];
            } else {
                qbCustomer = await qbRequest(qbo, 'createCustomer', {
                    DisplayName: order.customerName,
                    PrimaryEmailAddr: { Address: order.customerEmail },
                    PrimaryPhone: { FreeFormNumber: order.customerPhone || '' }
                });
            }

            // 2. Create Invoice
            // 2. Create Invoice
            const invoiceLines: any[] = order.items.map(item => ({
                Amount: item.price * item.quantity,
                DetailType: "SalesItemLineDetail",
                SalesItemLineDetail: {
                    ItemRef: {
                        name: item.meal.title,
                        value: "1" // Default item or search for meal in QB
                    },
                    UnitPrice: item.price,
                    Qty: item.quantity
                }
            }));

            const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = order.total - subtotal;

            if (tax > 0.01) {
                invoiceLines.push({
                    Amount: Number(tax.toFixed(2)),
                    DetailType: "SalesItemLineDetail",
                    SalesItemLineDetail: {
                        ItemRef: {
                            name: "Sales Tax",
                            value: "1"
                        },
                        UnitPrice: Number(tax.toFixed(2)),
                        Qty: 1
                    }
                });
            }

            const invoice = await qbRequest(qbo, 'createInvoice', {
                Line: invoiceLines,
                CustomerRef: {
                    value: qbCustomer.Id
                },
                DocNumber: order.orderNumber,
                // Add tax logic here if needed
            });

            results.invoices++;

            // 3. Create Payment if paid
            if (['PAID', 'COMPLETED', 'DELIVERED'].includes(order.status)) {
                await qbRequest(qbo, 'createPayment', {
                    CustomerRef: {
                        value: qbCustomer.Id
                    },
                    TotalAmt: order.total,
                    Line: [
                        {
                            Amount: order.total,
                            LinkedTxn: [
                                {
                                    TxnId: invoice.Id,
                                    TxnType: "Invoice"
                                }
                            ]
                        }
                    ]
                });
                results.payments++;
            }

        } catch (error: any) {
            logError(`Error syncing order ${order.orderNumber}`, "QuickBooksSync", error);
            results.errors.push(`Order ${order.orderNumber}: ${error.message}`);
        }
    }

    // 2. Sync Expenses (Pulls from QB)
    try {
        const qbExpenses = await qbRequest(qbo, 'findPurchases', [
            { PaymentType: 'Check' } // Or search for all purchases
        ]);

        if (qbExpenses.QueryResponse.Purchase) {
            for (const purchase of qbExpenses.QueryResponse.Purchase) {
                await db.expense.upsert({
                    where: { qbId: purchase.Id },
                    update: {
                        description: purchase.EntityRef?.name || purchase.Line?.[0]?.Description || "QuickBooks Expense",
                        amount: purchase.TotalAmt,
                        category: purchase.Line?.[0]?.AccountBasedExpenseLineDetail?.AccountRef?.name || "General Business",
                        date: new Date(purchase.TxnDate)
                    },
                    create: {
                        qbId: purchase.Id,
                        description: purchase.EntityRef?.name || purchase.Line?.[0]?.Description || "QuickBooks Expense",
                        amount: purchase.TotalAmt,
                        category: purchase.Line?.[0]?.AccountBasedExpenseLineDetail?.AccountRef?.name || "General Business",
                        date: new Date(purchase.TxnDate)
                    }
                });
                results.expenses++;
            }
        }
    } catch (error: any) {
        logError("Error pulling expenses from QuickBooks", "QuickBooksSync", error);
        results.errors.push(`Expenses: ${error.message}`);
    }

    logInfo(`QuickBooks sync completed. Results: ${JSON.stringify(results)}`, "QuickBooksSync");

    // Update last sync time
    const config = await getQuickBooksConfig();
    if (config) {
        await db.quickBooksConfig.update({
            where: { id: config.id },
            data: { lastSyncAt: new Date() }
        });
    }

    return results;
}
