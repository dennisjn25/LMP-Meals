
# QuickBooks Integration Documentation

## Overview
The Liberty Meal Prep platform is now integrated with QuickBooks Online to provide real-time financial tracking, automated invoicing, and expense management.

## Features
- **OAuth 2.0 Authentication**: Securely connect your QuickBooks company account.
- **Real-time Sales Sync**: Invoices and payments are automatically created in QuickBooks when an order is paid or marked as paid.
- **Bidirectional Data Flow**:
    - **Pushes**: Customers, Invoices, line items (meals), and Payments.
    - **Pulls**: Expenses and purchase records.
- **Financial Dashboard**: View Net Profit, Total Revenue, and Expenses pulled directly from QuickBooks on the admin finances page.
- **Tax Categorization**: Expenses are automatically categorized based on your QuickBooks Chart of Accounts.

## Setup Instructions
1. **QuickBooks Developer Portal**:
    - Create an app at [developer.intuit.com](https://developer.intuit.com/).
    - Add the redirect URI: `FRONTEND_URL/api/auth/quickbooks/callback`.
2. **Environment Variables**:
    Add the following to your `.env` or `.env.local`:
    ```env
    QB_CLIENT_ID=your_client_id
    QB_CLIENT_SECRET=your_client_secret
    QB_REDIRECT_URI=http://localhost:3000/api/auth/quickbooks/callback
    QB_ENV=sandbox # use 'production' for live
    ```
3. **Connection**:
    - Go to `/admin/finances`.
    - Click **CONNECT QUICKBOOKS**.
    - Authorize the application.

## Synchronization Logic
- **Sales**: Orders with status `PAID`, `COMPLETED`, or `DELIVERED` are synced as Invoices and Payments.
- **Expenses**: Pulls 'Purchases' from QuickBooks and caches them locally for dashboard reporting.
- **Manual Sync**: You can trigger a full sync at any time using the **SYNC DATA NOW** button on the finances page.
- **Real-time**: Sync is automatically triggered whenever an order is created or updated.

## Categorization for Tax Purposes
- Sales are mapped to "SalesItemLineDetail" in QuickBooks.
- Expenses are categorized using the "AccountRef" name from your QuickBooks transactions, ensuring alignment with your tax reporting categories.

## Logging & Troubleshooting
- **Intuit TID**: The `intuit_tid` (Intuit Transaction ID) is automatically captured from response headers and logged to the server console for every API interaction.
- This ID is critical for debugging issues with Intuit Support.
- Check the server logs for `[QuickBooks] Intuit TID: <value>` entries if you encounter synchronization errors.
