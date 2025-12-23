"use client";

import { useTransition } from "react";
import { deleteUser, updateUserRole } from "@/actions/admin";

export default function AdminUserList({ user }: { user: any }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("Are you sure?")) {
            startTransition(() => {
                deleteUser(user.id);
            });
        }
    };

    const handleRoleChange = () => {
        const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        startTransition(() => {
            updateUserRole(user.id, newRole);
        });
    }

    return (
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
            <td style={{ padding: '20px 24px' }}>
                <div style={{ fontWeight: 700, color: 'white' }}>{user.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{user.email}</div>
            </td>
            <td style={{ padding: '20px 24px' }}>
                <button
                    onClick={handleRoleChange}
                    disabled={isPending}
                    style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: user.role === 'ADMIN' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: user.role === 'ADMIN' ? '#fbbf24' : '#94a3b8',
                        cursor: 'pointer',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}
                >
                    {user.role}
                </button>
            </td>
            <td style={{ padding: '20px 24px', color: '#94a3b8', fontSize: '0.9rem' }}>
                {new Date(user.createdAt).toLocaleDateString()}
            </td>
            <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    style={{
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                    Delete
                </button>
            </td>
        </tr>
    )
}

