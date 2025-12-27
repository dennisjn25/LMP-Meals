"use client";

import { useState } from "react";
import { Bell, Mail, Clock, CheckCircle, Smartphone, Globe, Save } from "lucide-react";
import { toast } from "sonner";
import { tokens } from "@/lib/design-tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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

    const headerStyle = {
        fontSize: '1.rem',
        fontWeight: 800,
        color: 'white',
        marginBottom: tokens.spacing.lg,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing.md,
        fontFamily: 'var(--font-heading)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em'
    };

    const rowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: `${tokens.spacing.md} 0`,
        borderBottom: `1px solid ${tokens.colors.border.dark}`
    };

    const toggleStyle = (active: boolean) => ({
        width: '50px',
        height: '28px',
        background: active ? tokens.colors.text.success : tokens.colors.surface.medium,
        borderRadius: '50px',
        position: 'relative' as const,
        cursor: 'pointer',
        transition: tokens.transitions.normal,
        border: `1px solid ${active ? 'transparent' : tokens.colors.border.dark}`
    });

    const knobStyle = (active: boolean) => ({
        width: '22px',
        height: '22px',
        background: 'white',
        borderRadius: '50%',
        position: 'absolute' as const,
        top: '2px',
        left: active ? '24px' : '2px',
        transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        boxShadow: tokens.shadows.sm
    });

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', color: tokens.colors.text.inverseSecondary }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacing.xxl, flexWrap: 'wrap', gap: tokens.spacing.lg }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', fontFamily: 'var(--font-heading)', margin: 0 }}>Settings</h1>
                    <p style={{ color: tokens.colors.text.inverseSecondary, fontSize: '1rem', marginTop: tokens.spacing.xs }}>Manage automation, notifications, and system preferences.</p>
                </div>
                <Button
                    onClick={handleSave}
                    isLoading={loading}
                    variant="primary"
                    size="lg"
                    style={{ minWidth: '200px' }}
                >
                    <Save size={20} style={{ marginRight: tokens.spacing.sm }} />
                    Save Changes
                </Button>
            </div>

            {/* Email Notifications */}
            <Card style={{ marginBottom: tokens.spacing.xl, padding: tokens.spacing.xl }}>
                <h2 style={headerStyle}><Mail size={24} color={tokens.colors.accent.DEFAULT} /> Email Notifications</h2>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Order Confirmation</div>
                        <div style={{ fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>Sent to customer immediately after purchase</div>
                    </div>
                    <div onClick={() => handleToggle('email', 'orderConfirmation')} style={toggleStyle(settings.email.orderConfirmation)}>
                        <div style={knobStyle(settings.email.orderConfirmation)} />
                    </div>
                </div>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Order Ready for Pickup/Delivery</div>
                        <div style={{ fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>Sent when status changes to 'COMPLETED'</div>
                    </div>
                    <div onClick={() => handleToggle('email', 'orderReady')} style={toggleStyle(settings.email.orderReady)}>
                        <div style={knobStyle(settings.email.orderReady)} />
                    </div>
                </div>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Delivery Confirmation</div>
                        <div style={{ fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>Sent when status changes to 'DELIVERED'</div>
                    </div>
                    <div onClick={() => handleToggle('email', 'orderDelivered')} style={toggleStyle(settings.email.orderDelivered)}>
                        <div style={knobStyle(settings.email.orderDelivered)} />
                    </div>
                </div>

                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Welcome Email</div>
                        <div style={{ fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>Sent to new customers upon registration</div>
                    </div>
                    <div onClick={() => handleToggle('email', 'welcomeEmail')} style={toggleStyle(settings.email.welcomeEmail)}>
                        <div style={knobStyle(settings.email.welcomeEmail)} />
                    </div>
                </div>
            </Card>

            {/* Workflow Automation */}
            <Card style={{ marginBottom: tokens.spacing.xl, padding: tokens.spacing.xl }}>
                <h2 style={headerStyle}><Clock size={24} color="#3b82f6" /> Workflow Automation</h2>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Auto-Create Delivery Job</div>
                        <div style={{ fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>Automatically create a delivery record when an order is paid</div>
                    </div>
                    <div onClick={() => handleToggle('automation', 'autoCreateDelivery')} style={toggleStyle(settings.automation.autoCreateDelivery)}>
                        <div style={knobStyle(settings.automation.autoCreateDelivery)} />
                    </div>
                </div>

                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Mark Paid on Creation</div>
                        <div style={{ fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>Automatically set status to 'PAID' for new orders (e.g. Credit Card)</div>
                    </div>
                    <div onClick={() => handleToggle('automation', 'markPaidOnCreation')} style={toggleStyle(settings.automation.markPaidOnCreation)}>
                        <div style={knobStyle(settings.automation.markPaidOnCreation)} />
                    </div>
                </div>
            </Card>

            {/* Kitchen Operations */}
            <Card style={{ marginBottom: tokens.spacing.xl, padding: tokens.spacing.xl }}>
                <h2 style={headerStyle}><Smartphone size={24} color={tokens.colors.text.error} /> Kitchen Operations</h2>

                <div style={rowStyle}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>Prep Buffer Time</div>
                        <div style={{ fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>Minutes added to estimated prep time</div>
                    </div>
                    <input
                        type="number"
                        value={settings.kitchen.prepBufferMinutes}
                        onChange={(e) => handleChange('kitchen', 'prepBufferMinutes', parseInt(e.target.value))}
                        style={{
                            background: tokens.colors.surface.medium,
                            border: `1px solid ${tokens.colors.border.dark}`,
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: tokens.radius.md,
                            width: '80px',
                            textAlign: 'center',
                            fontFamily: 'inherit',
                            fontWeight: 700
                        }}
                    />
                </div>

                <div style={{ ...rowStyle, borderBottom: 'none' }}>
                    <div>
                        <div style={{ color: 'white', fontWeight: 600 }}>KDS Refresh Rate</div>
                        <div style={{ fontSize: '0.85rem', color: tokens.colors.text.inverseSecondary, opacity: 0.7 }}>Seconds between kitchen display updates</div>
                    </div>
                    <input
                        type="number"
                        value={settings.kitchen.kitchenDisplayRefresh}
                        onChange={(e) => handleChange('kitchen', 'kitchenDisplayRefresh', parseInt(e.target.value))}
                        style={{
                            background: tokens.colors.surface.medium,
                            border: `1px solid ${tokens.colors.border.dark}`,
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: tokens.radius.md,
                            width: '80px',
                            textAlign: 'center',
                            fontFamily: 'inherit',
                            fontWeight: 700
                        }}
                    />
                </div>
            </Card>

        </div>
    );
}
