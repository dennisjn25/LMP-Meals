"use client";

import { useState, useTransition } from "react";
import { updateUserAddress } from "@/actions/user";

interface AddressSettingsProps {
    initialData: {
        phone?: string | null;
        deliveryAddress?: string | null;
        deliveryCity?: string | null;
        deliveryState?: string | null;
        deliveryZip?: string | null;
        billingAddress?: string | null;
        billingCity?: string | null;
        billingState?: string | null;
        billingZip?: string | null;
    };
}

export default function AddressSettings({ initialData }: AddressSettingsProps) {
    const [isPending, startTransition] = useTransition();
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        phone: initialData.phone || "",
        deliveryAddress: initialData.deliveryAddress || "",
        deliveryCity: initialData.deliveryCity || "",
        deliveryState: initialData.deliveryState || "Arizona",
        deliveryZip: initialData.deliveryZip || "",
        billingAddress: initialData.billingAddress || "",
        billingCity: initialData.billingCity || "",
        billingState: initialData.billingState || "Arizona",
        billingZip: initialData.billingZip || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setSuccess(false);
        startTransition(async () => {
            try {
                await updateUserAddress(formData);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } catch (error) {
                console.error("Failed to update address:", error);
            }
        });
    };

    return (
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Delivery Address Section */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: '#1f2937' }}>Delivery Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>Phone Number</label>
                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={isPending}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>Address</label>
                            <input
                                name="deliveryAddress"
                                value={formData.deliveryAddress}
                                onChange={handleChange}
                                disabled={isPending}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>City</label>
                                <input
                                    name="deliveryCity"
                                    value={formData.deliveryCity}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>State</label>
                                <input
                                    name="deliveryState"
                                    value="Arizona"
                                    readOnly
                                    disabled
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#f3f4f6', cursor: 'not-allowed', color: '#6b7280' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>Zip</label>
                                <input
                                    name="deliveryZip"
                                    value={formData.deliveryZip}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Billing Address Section */}
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px', color: '#1f2937' }}>Billing Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>Address</label>
                            <input
                                name="billingAddress"
                                value={formData.billingAddress}
                                onChange={handleChange}
                                disabled={isPending}
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>City</label>
                                <input
                                    name="billingCity"
                                    value={formData.billingCity}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>State</label>
                                <input
                                    name="billingState"
                                    value={formData.billingState}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '6px' }}>Zip</label>
                                <input
                                    name="billingZip"
                                    value={formData.billingZip}
                                    onChange={handleChange}
                                    disabled={isPending}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="btn-black"
                    style={{ padding: '12px 32px' }}
                >
                    {isPending ? "Saving..." : "Save Changes"}
                </button>
                {success && <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.9rem' }}>✓ Changes saved successfully</span>}
            </div>
        </div>
    );
}
