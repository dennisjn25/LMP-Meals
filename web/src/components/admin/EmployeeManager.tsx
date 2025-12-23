"use client";

import { useState, useMemo } from "react";
import {
    Users,
    UserPlus,
    Search,
    Filter,
    Edit2,
    Trash2,
    MoreVertical,
    Shield,
    UserCheck,
    Mail,
    Phone,
    Briefcase,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Loader2,
    X,
    FileText,
    History
} from "lucide-react";
import { createEmployee, updateEmployee, deleteEmployee } from "@/actions/employee";

interface Employee {
    id: string;
    userId?: string | null;
    name: string;
    email: string;
    phone?: string | null;
    position: string;
    department: string;
    status: string;
    salary?: number | null;
    hireDate: string | Date;
    startDate: string | Date;
    notes?: string | null;
    createdAt: string | Date;
    user?: {
        role: string;
        image?: string | null;
    } | null;
}

interface EmployeeManagerProps {
    initialEmployees: any[];
}

export default function EmployeeManager({ initialEmployees }: EmployeeManagerProps) {
    const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [deptFilter, setDeptFilter] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"LIST" | "AUDIT">("LIST");
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [fetchingLogs, setFetchingLogs] = useState(false);

    // Modal states
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
        department: "",
        status: "ACTIVE",
        salary: "",
        hireDate: "",
        notes: "",
        password: "",
        isAdmin: false
    });

    const fetchLogs = async () => {
        setFetchingLogs(true);
        try {
            const { getAuditLogs } = await import("@/actions/employee");
            const logs = await getAuditLogs();
            setAuditLogs(logs);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingLogs(false);
        }
    };

    const handleTabChange = (tab: "LIST" | "AUDIT") => {
        setActiveTab(tab);
        if (tab === "AUDIT") {
            fetchLogs();
        }
    };

    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchesSearch =
                emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.position.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "ALL" || emp.status === statusFilter;
            const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;

            return matchesSearch && matchesStatus && matchesDept;
        });
    }, [employees, searchTerm, statusFilter, deptFilter]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
    const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const openEdit = (emp: Employee) => {
        setSelectedEmployee(emp);
        setFormData({
            name: emp.name,
            email: emp.email,
            phone: emp.phone || "",
            position: emp.position,
            department: emp.department,
            status: emp.status,
            salary: emp.salary?.toString() || "",
            hireDate: emp.hireDate ? new Date(emp.hireDate).toISOString().split('T')[0] : "",
            notes: emp.notes || "",
            password: "",
            isAdmin: emp.user?.role === "ADMIN"
        });
        setShowFormModal(true);
    };

    const openAdd = () => {
        setSelectedEmployee(null);
        setFormData({
            name: "",
            email: "",
            phone: "",
            position: "",
            department: "",
            status: "ACTIVE",
            salary: "",
            hireDate: new Date().toISOString().split('T')[0],
            notes: "",
            password: "",
            isAdmin: false
        });
        setShowFormModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare data with proper types
            const submitData = {
                ...formData,
                salary: formData.salary ? parseFloat(formData.salary) : undefined,
                hireDate: formData.hireDate ? new Date(formData.hireDate) : undefined,
                password: formData.password || undefined,
                role: formData.isAdmin ? "ADMIN" : "USER"
            };

            if (selectedEmployee) {
                const res = await updateEmployee(selectedEmployee.id, submitData);
                if (res.success) {
                    window.location.reload();
                } else {
                    alert(res.error);
                }
            } else {
                const res = await createEmployee(submitData);
                if (res.success) {
                    window.location.reload();
                } else {
                    alert(res.error);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const res = await deleteEmployee(id);
            if (res.success) {
                window.location.reload();
            } else {
                alert(res.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setShowDeleteConfirm(null);
        }
    };

    const departments = Array.from(new Set(employees.map(e => e.department))).sort();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Header / Tabs */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                borderBottom: '1px solid var(--glass-border)',
                paddingBottom: '20px'
            }}>
                <div style={{ display: 'flex', gap: '40px' }}>
                    <TabItem
                        active={activeTab === "LIST"}
                        onClick={() => handleTabChange("LIST")}
                        icon={<Users size={20} />}
                        label="Directory"
                    />
                    <TabItem
                        active={activeTab === "AUDIT"}
                        onClick={() => handleTabChange("AUDIT")}
                        icon={<History size={20} />}
                        label="Audit Logs"
                    />
                </div>
                <button
                    onClick={openAdd}
                    className="btn-black"
                    style={{
                        padding: '12px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: '2px solid #fbbf24',
                        color: '#fbbf24',
                        background: 'transparent'
                    }}
                >
                    <UserPlus size={18} />
                    Add Employee
                </button>
            </div>

            {activeTab === "LIST" ? (
                <>
                    {/* Filters Bar */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr',
                        gap: '16px',
                        background: 'rgba(255,255,255,0.02)',
                        padding: '20px',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or position..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none'
                            }}
                        >
                            <option value="ALL" style={{ background: '#1e293b', color: 'white' }}>All Statuses</option>
                            <option value="ACTIVE" style={{ background: '#1e293b', color: 'white' }}>Active</option>
                            <option value="INACTIVE" style={{ background: '#1e293b', color: 'white' }}>Inactive</option>
                            <option value="ON_LEAVE" style={{ background: '#1e293b', color: 'white' }}>On Leave</option>
                        </select>
                        <select
                            value={deptFilter}
                            onChange={(e) => setDeptFilter(e.target.value)}
                            style={{
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '12px',
                                color: 'white',
                                outline: 'none'
                            }}
                        >
                            <option value="ALL" style={{ background: '#1e293b', color: 'white' }}>All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept} style={{ background: '#1e293b', color: 'white' }}>{dept}</option>
                            ))}
                        </select>
                    </div>

                    {/* Table */}
                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '24px',
                        border: '1px solid var(--glass-border)',
                        overflow: 'hidden'
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
                                    <th style={tableHeaderStyle}>Employee</th>
                                    <th style={tableHeaderStyle}>Position & Dept</th>
                                    <th style={tableHeaderStyle}>Status</th>
                                    <th style={tableHeaderStyle}>Salary</th>
                                    <th style={tableHeaderStyle}>Hire Date</th>
                                    <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedEmployees.length > 0 ? paginatedEmployees.map((emp) => (
                                    <tr key={emp.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    background: 'rgba(251, 191, 36, 0.1)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fbbf24',
                                                    fontWeight: 700
                                                }}>
                                                    {emp.name[0]}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 700, color: 'white' }}>{emp.name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{emp.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontWeight: 600, color: '#e2e8f0' }}>{emp.position}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{emp.department}</div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <StatusBadge status={emp.status} />
                                        </td>
                                        <td style={{ padding: '20px 24px', color: '#cbd5e1' }}>
                                            {emp.salary ? `$${emp.salary.toLocaleString()}` : '-'}
                                        </td>
                                        <td style={{ padding: '20px 24px', color: '#cbd5e1' }}>
                                            {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : new Date(emp.startDate).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => openEdit(emp)}
                                                    style={actionButtonStyle}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(emp.id)}
                                                    style={{ ...actionButtonStyle, color: '#ef4444' }}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '80px', textAlign: 'center', color: '#94a3b8' }}>
                                            <Users size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                                            <div>No employees found matching your criteria.</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                style={paginationButtonStyle}
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <span style={{ color: 'white', fontWeight: 600 }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                style={paginationButtonStyle}
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '24px',
                        border: '1px solid var(--glass-border)',
                        overflow: 'hidden'
                    }}>
                        {fetchingLogs ? (
                            <div style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>
                                <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto 16px' }} />
                                <div>Loading audit logs...</div>
                            </div>
                        ) : auditLogs.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)' }}>
                                        <th style={tableHeaderStyle}>Action</th>
                                        <th style={tableHeaderStyle}>Admin</th>
                                        <th style={tableHeaderStyle}>Date & Time</th>
                                        <th style={tableHeaderStyle}>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLogs.map((log) => (
                                        <tr key={log.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '20px 24px' }}>
                                                <ActionBadge action={log.action} />
                                            </td>
                                            <td style={{ padding: '20px 24px', color: 'white', fontWeight: 600 }}>
                                                {log.userName || 'System'}
                                            </td>
                                            <td style={{ padding: '20px 24px', color: '#94a3b8' }}>
                                                {new Date(log.createdAt).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '20px 24px', color: '#cbd5e1', fontSize: '0.85rem', maxWidth: '400px' }}>
                                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {log.details}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '100px', textAlign: 'center', color: '#94a3b8' }}>
                                <History size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                                <div>No audit logs found.</div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {showFormModal && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'white', margin: 0 }}>
                                {selectedEmployee ? "Edit Employee" : "Add New Employee"}
                            </h2>
                            <button onClick={() => setShowFormModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={formGridStyle}>
                                <div>
                                    <label style={labelStyle}>Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        style={inputStyle}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        style={inputStyle}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Phone Number</label>
                                    <input
                                        type="tel"
                                        style={inputStyle}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Position</label>
                                    <input
                                        required
                                        type="text"
                                        style={inputStyle}
                                        placeholder="e.g. Head Chef"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Department</label>
                                    <input
                                        required
                                        type="text"
                                        style={inputStyle}
                                        placeholder="e.g. Kitchen"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Status</label>
                                    <select
                                        style={inputStyle}
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="ACTIVE" style={{ background: '#1e293b', color: 'white' }}>Active</option>
                                        <option value="INACTIVE" style={{ background: '#1e293b', color: 'white' }}>Inactive</option>
                                        <option value="ON_LEAVE" style={{ background: '#1e293b', color: 'white' }}>On Leave</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Salary</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        style={inputStyle}
                                        placeholder="e.g. 50000"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Date of Hire</label>
                                    <input
                                        required
                                        type="date"
                                        style={inputStyle}
                                        value={formData.hireDate}
                                        onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Notes</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <h3 style={{ ...labelStyle, fontSize: '0.95rem', color: 'white', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                                    Login Credentials
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginTop: '16px' }}>
                                    <div>
                                        <label style={labelStyle}>
                                            Password {selectedEmployee && <span style={{ textTransform: 'none', fontWeight: 400, color: '#64748b' }}>(Leave blank to keep unchanged)</span>}
                                        </label>
                                        <input
                                            type="password"
                                            style={inputStyle}
                                            placeholder={selectedEmployee ? "********" : "Create a password for login..."}
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <input
                                            type="checkbox"
                                            id="adminAccess"
                                            checked={formData.isAdmin}
                                            onChange={(e) => setFormData({ ...formData, isAdmin: e.target.checked })}
                                            style={{ width: '20px', height: '20px', accentColor: '#fbbf24' }}
                                        />
                                        <label htmlFor="adminAccess" style={{ color: 'white', fontWeight: 600, cursor: 'pointer' }}>
                                            Grant Admin Portal Access
                                        </label>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                                        Enabling admin access allows this employee to sign in to the admin panel using their email and the password set above.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="btn-black"
                                    style={{ flex: 1, padding: '16px', background: '#fbbf24', color: 'black', border: 'none', fontWeight: 800 }}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (selectedEmployee ? "Update Employee" : "Create Employee")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowFormModal(false)}
                                    style={{ flex: 1, padding: '16px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContentStyle, maxWidth: '400px', textAlign: 'center' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: '#ef4444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px'
                        }}>
                            <Trash2 size={32} />
                        </div>
                        <h2 style={{ fontFamily: 'var(--font-heading)', color: 'white', marginBottom: '12px' }}>Confirm Deletion</h2>
                        <p style={{ color: '#94a3b8', marginBottom: '32px' }}>
                            Are you sure you want to remove this employee? This action will be logged and cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                style={{ flex: 1, padding: '14px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Delete"}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                style={{ flex: 1, padding: '14px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ActionBadge({ action }: { action: string }) {
    const colors: any = {
        CREATE_EMPLOYEE: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', label: 'Create' },
        UPDATE_EMPLOYEE: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', label: 'Update' },
        DELETE_EMPLOYEE: { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', label: 'Delete' },
    };
    const config = colors[action] || { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8', label: action };

    return (
        <span style={{
            padding: '4px 10px',
            borderRadius: '6px',
            background: config.bg,
            color: config.text,
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase'
        }}>
            {config.label}
        </span>
    );
}

function TabItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                paddingBottom: '20px',
                borderBottom: `2px solid ${active ? '#fbbf24' : 'transparent'}`,
                background: 'transparent',
                border: 'none',
                color: active ? '#fbbf24' : '#64748b',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.2s',
                marginBottom: '-21px'
            }}
        >
            {icon}
            {label}
        </button>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: any = {
        ACTIVE: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', label: 'Active' },
        INACTIVE: { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8', label: 'Inactive' },
        ON_LEAVE: { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'On Leave' },
    };
    const config = configs[status] || configs.ACTIVE;

    return (
        <span style={{
            padding: '6px 12px',
            borderRadius: '20px',
            background: config.bg,
            color: config.text,
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
        }}>
            {config.label}
        </span>
    );
}

const tableHeaderStyle: React.CSSProperties = {
    padding: '20px 24px',
    fontWeight: 700,
    color: '#f8f9fa',
    fontFamily: 'var(--font-heading)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontSize: '0.85rem'
};

const actionButtonStyle: React.CSSProperties = {
    padding: '8px',
    borderRadius: '10px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)',
    color: '#94a3b8',
    cursor: 'pointer',
    transition: 'all 0.2s'
};

const paginationButtonStyle: React.CSSProperties = {
    padding: '10px',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    cursor: 'pointer',
    disabled: { opacity: 0.5, cursor: 'not-allowed' }
} as any;

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
};

const modalContentStyle: React.CSSProperties = {
    background: '#0B0E14',
    border: '1px solid var(--glass-border)',
    borderRadius: '24px',
    padding: '40px',
    width: '100%',
    maxWidth: '800px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    maxHeight: '90vh',
    overflowY: 'auto'
};

const formGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px'
};

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#94a3b8',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s'
};
