"use client";

import { useState } from "react";
import { Users, Shield, UserPlus } from "lucide-react";
import { updateUserRole } from "@/actions/users";

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    createdAt: Date;
}

export default function AdminEmployeeList({ employees, allUsers }: { employees: User[], allUsers: User[] }) {
    const [selectedUsers, setSelectedUsers] = useState<User[]>(employees);
    const [showAddModal, setShowAddModal] = useState(false);

    const handleRoleChange = async (userId: string, newRole: string) => {
        await updateUserRole(userId, newRole);
        // Refresh would happen via server action
        window.location.reload();
    };

    const admins = selectedUsers.filter(u => u.role === 'ADMIN');
    const regularEmployees = selectedUsers.filter(u => u.role === 'EMPLOYEE');

    return (
        <div>
            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
                <StatCard
                    icon={<Shield size={24} />}
                    label="Administrators"
                    value={admins.length}
                    color="#8b5cf6"
                />
                <StatCard
                    icon={<Users size={24} />}
                    label="Employees"
                    value={regularEmployees.length}
                    color="#3b82f6"
                />
                <StatCard
                    icon={<UserPlus size={24} />}
                    label="Total Staff"
                    value={selectedUsers.length}
                    color="#10b981"
                />
            </div>

            {/* Add Employee Button */}
            <div style={{ marginBottom: '24px' }}>
                <button
                    onClick={() => setShowAddModal(!showAddModal)}
                    className="btn-black"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                    <UserPlus size={18} />
                    Promote User to Employee
                </button>
            </div>

            {/* Add Employee Modal */}
            {showAddModal && (
                <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', fontWeight: 700 }}>Promote User to Employee</h3>
                    <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '0.9rem' }}>
                        Select a user to grant employee or admin privileges
                    </p>
                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {allUsers.filter(u => u.role === 'USER').map(user => (
                            <div
                                key={user.id}
                                style={{
                                    padding: '12px',
                                    borderBottom: '1px solid #e5e7eb',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 600 }}>{user.name || 'No Name'}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{user.email}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleRoleChange(user.id, 'EMPLOYEE')}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #e5e7eb',
                                            background: '#fff',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Make Employee
                                    </button>
                                    <button
                                        onClick={() => handleRoleChange(user.id, 'ADMIN')}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #8b5cf6',
                                            background: '#8b5cf6',
                                            color: '#fff',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Make Admin
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Employees Table */}
            <div className="glass-panel" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase' }}>Name</th>
                            <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase' }}>Email</th>
                            <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase' }}>Role</th>
                            <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase' }}>Joined</th>
                            <th style={{ padding: '16px', fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedUsers.map((user, index) => (
                            <tr key={user.id} style={{ borderBottom: index === selectedUsers.length - 1 ? 'none' : '1px solid #e5e7eb' }}>
                                <td style={{ padding: '16px', fontWeight: 600 }}>{user.name || 'No Name'}</td>
                                <td style={{ padding: '16px' }}>{user.email}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '99px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: user.role === 'ADMIN' ? '#8b5cf620' : '#3b82f620',
                                        color: user.role === 'ADMIN' ? '#8b5cf6' : '#3b82f6'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleRoleChange(user.id, 'USER')}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #e5e7eb',
                                            background: '#fff',
                                            fontSize: '0.8rem',
                                            cursor: 'pointer',
                                            color: '#ef4444'
                                        }}
                                    >
                                        Demote to User
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedUsers.length === 0 && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        No employees found.
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) {
    return (
        <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${color}20`,
                    color: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {icon}
                </div>
                <div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '4px' }}>{label}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{value}</div>
                </div>
            </div>
        </div>
    );
}
