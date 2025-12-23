"use client";

import { updateEmailPreference } from "@/actions/user";
import { useState } from "react";

export default function EmailPreferenceToggle({ initialValue }: { initialValue: boolean }) {
    const [enabled, setEnabled] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            const newValue = !enabled;
            await updateEmailPreference(newValue);
            setEnabled(newValue);
        } catch (error) {
            console.error("Failed to update preference", error);
            alert("Failed to update setting. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>Email Receipts</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Receive a confirmation email when you place an order.</p>
            </div>
            <button
                onClick={handleToggle}
                disabled={isLoading}
                style={{
                    position: 'relative',
                    width: '52px',
                    height: '28px',
                    borderRadius: '100px',
                    background: enabled ? '#10b981' : '#e5e7eb',
                    border: 'none',
                    cursor: isLoading ? 'wait' : 'pointer',
                    transition: 'all 0.3s ease'
                }}
                aria-label={enabled ? "Disable email receipts" : "Enable email receipts"}
                aria-pressed={enabled}
            >
                <span style={{
                    position: 'absolute',
                    top: '2px',
                    left: enabled ? '26px' : '2px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'left 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)'
                }} />
            </button>
        </div>
    );
}
