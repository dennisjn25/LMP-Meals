"use client";

import { useState } from "react";
import { Bell, Mail, Clock, CheckCircle, Smartphone, Globe, Save } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        email: {
            orderConfirmation: true,
            orderReady: true,
            orderDelivered: true,
            welcomeEmail: true
        },
        automation: {
            autoCreateDelivery: true,
            autoPrintKitchen: false,
            markPaidOnCreation: true
        },
        kitchen: {
            prepBufferMinutes: 30,
            kitchenDisplayRefresh: 60
        }
    });

    const [loading, setLoading] = useState(false);

    const handleToggle = (category: keyof typeof settings, key: string) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                // @ts-ignore
                ...prev[category],
                // @ts-ignore
                [key]: !prev[category][key]
            }
        }));
    };

    const handleChange = (category: keyof typeof settings, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                // @ts-ignore
                ...prev[category],
                // @ts-ignore
                [key]: value
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        toast.success("Settings saved successfully");
    };

    const sectionStyle = {
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '32px',
        marginBottom: '32px'
    };

    const headerStyle = {
        fontSize: '1.1rem',
        fontWeight: 700,
        color: 'white',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontFamily: 'var(--font-heading)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em'
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    };

    const toggleStyle = (active: boolean) => ({
        width: '50px',
        height: '28px',
        background: active ? '#10b981' : 'rgba(255,255,255,0.1)',
        borderRadius: '50px',
        position: 'relative' as const,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    });

    const knobStyle = (active: boolean) => ({
        width: '24px',
        height: '24px',
        background: 'white',
        borderRadius: '50%',
        position: 'absolute' as const,
        top: '2px',
        left: active ? '24px' : '2px',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    });

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-heading)', margin: 0 }}>Settings</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '8px' }}>Manage automation, notifications, and system preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    style={{
                        padding: '12px 32px',
                        background: '#fbbf24',
                        color: 'black',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    <Save size={20} />
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Email Notifications */}
            <div style={sectionStyle}>
                <h2 style={headerStyle}><Mail size={24} color="#fbbf24" /> Email Notifications</h2>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Order Confirmation</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Sent to customer immediately after purchase</div>
                    </div>
                    <div onClick={() => handleToggle('email', 'orderConfirmation')} style={toggleStyle(settings.email.orderConfirmation)}>
                        <div style={knobStyle(settings.email.orderConfirmation)} />
                    </div>
                </div>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Order Ready for Pickup/Delivery</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Sent when status changes to 'COMPLETED'</div>
                    </div>
                    <div onClick={() => handleToggle('email', 'orderReady')} style={toggleStyle(settings.email.orderReady)}>
                        <div style={knobStyle(settings.email.orderReady)} />
                    </div>
                </div>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Delivery Confirmation</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Sent when status changes to 'DELIVERED', includes feedback link</div>
                    </div>
                    <div onClick={() => handleToggle('email', 'orderDelivered')} style={toggleStyle(settings.email.orderDelivered)}>
                        <div style={knobStyle(settings.email.orderDelivered)} />
                    </div>
                </div>

                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Welcome Email</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Sent to new customers upon registration</div>
                    </div>
                    <div onClick={() => handleToggle('email', 'welcomeEmail')} style={toggleStyle(settings.email.welcomeEmail)}>
                        <div style={knobStyle(settings.email.welcomeEmail)} />
                    </div>
                </div>
            </div>

            {/* Workflow Automation */}
            <div style={sectionStyle}>
                <h2 style={headerStyle}><Clock size={24} color="#3b82f6" /> Workflow Automation</h2>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Auto-Create Delivery Job</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Automatically create a delivery record when an order is paid</div>
                    </div>
                    <div onClick={() => handleToggle('automation', 'autoCreateDelivery')} style={toggleStyle(settings.automation.autoCreateDelivery)}>
                        <div style={knobStyle(settings.automation.autoCreateDelivery)} />
                    </div>
                </div>

                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Mark Paid on Creation</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Automatically set status to 'PAID' for new orders (e.g. Credit Card)</div>
                    </div>
                    <div onClick={() => handleToggle('automation', 'markPaidOnCreation')} style={toggleStyle(settings.automation.markPaidOnCreation)}>
                        <div style={knobStyle(settings.automation.markPaidOnCreation)} />
                    </div>
                </div>
            </div>

            {/* Kitchen Operations */}
            <div style={sectionStyle}>
                <h2 style={headerStyle}><Smartphone size={24} color="#ef4444" /> Kitchen Operations</h2>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Prep Buffer Time</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Minutes added to estimated prep time</div>
                    </div>
                    <input
                        type="number"
                        value={settings.kitchen.prepBufferMinutes}
                        onChange={(e) => handleChange('kitchen', 'prepBufferMinutes', parseInt(e.target.value))}
                        style={{
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            width: '80px',
                            textAlign: 'center'
                        }}
                    />
                </div>

                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>KDS Refresh Rate</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Seconds between kitchen display updates</div>
                    </div>
                    <input
                        type="number"
                        value={settings.kitchen.kitchenDisplayRefresh}
                        onChange={(e) => handleChange('kitchen', 'kitchenDisplayRefresh', parseInt(e.target.value))}
                        style={{
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            width: '80px',
                            textAlign: 'center'
                        }}
                    />
                </div>
            </div>

        </div>
    );
}
