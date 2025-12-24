import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import { getUserOrders, getUserSettings } from "@/actions/user";
import EmailPreferenceToggle from "@/components/EmailPreferenceToggle";
import AddressSettings from "@/components/AddressSettings";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect("/auth/login");

    const [orders, userSettings] = await Promise.all([
        getUserOrders(),
        getUserSettings()
    ]);

    return (
        <main style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px' }}>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px' }}>
                <header style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Welcome back, {session.user?.name}</h1>
                    <p style={{ color: '#6b7280' }}>Manage your orders and account settings.</p>
                </header>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Account Settings</h2>
                <EmailPreferenceToggle initialValue={userSettings?.sendReceiptEmail ?? true} />

                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', marginTop: '40px' }}>Saved Addresses</h3>
                <AddressSettings initialData={userSettings || {}} />

                <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Order History</h2>

                {orders.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        <p style={{ marginBottom: '24px' }}>You haven't placed any orders yet.</p>
                        <a href="/menu" className="btn-black">Start Ordering</a>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {orders.map((order: any) => (
                            <div key={order.id} className="glass-panel" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Order ID</div>
                                        <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>{order.id}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Date</div>
                                        <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Status</div>
                                        <div style={{ fontWeight: 700 }}>{order.status}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Total</div>
                                        <div style={{ fontWeight: 700 }}>${order.total.toFixed(2)}</div>
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', borderRadius: '4px', overflow: 'hidden' }}>
                                    {order.items.map((item: any) => (
                                        <div key={item.id} style={{ display: 'flex', gap: '16px', padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                                            <div style={{ position: 'relative', width: '60px', height: '60px', flexShrink: 0 }}>
                                                <Image src={item.meal.image} alt={item.meal.title} fill style={{ objectFit: 'cover', borderRadius: '4px' }} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.meal.title}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>Qty: {item.quantity}</div>
                                            </div>
                                            <div style={{ fontWeight: 600 }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
