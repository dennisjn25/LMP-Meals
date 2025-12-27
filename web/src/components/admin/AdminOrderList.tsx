"use client";

import { updateOrderStatus, createAdminOrder, updateAdminOrder, deleteOrder } from "@/actions/orders";
import { utils, writeFile } from 'xlsx';
import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Package, Plus, X, Trash2, Edit2, Loader2, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";

interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    shippingAddress: string;
    city: string;
    zipCode: string;
    deliveryDate?: Date | string | null;
    status: string;
    total: number;
    createdAt: Date;
    items: {
        id: string;
        quantity: number;
        price: number;
        meal: {
            id: string;
            title: string;
        }
    }[];
}

interface Meal {
    id: string;
    title: string;
    price: number;
}

export default function AdminOrderList({ initialOrders, meals }: { initialOrders: Order[], meals: Meal[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [password, setPassword] = useState("");

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' } | null>({ key: 'createdAt', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Derived State
    const filteredOrders = useMemo(() => {
        let filtered = [...orders];

        // 1. Filter by Status
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(o => o.status === statusFilter);
        }

        // 2. Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(o =>
                o.customerName.toLowerCase().includes(lowerQuery) ||
                o.customerEmail.toLowerCase().includes(lowerQuery) ||
                o.id.toLowerCase().includes(lowerQuery) ||
                (o.orderNumber && o.orderNumber.toLowerCase().includes(lowerQuery))
            );
        }

        // 3. Sort
        if (sortConfig) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === bValue) return 0;
                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [orders, statusFilter, searchQuery, sortConfig]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredOrders, currentPage]);

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const handleSort = (key: keyof Order) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Form inputs state
    const [formData, setFormData] = useState({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        shippingAddress: "",
        city: "",
        zipCode: "",
        deliveryDate: "",
        status: "PENDING",
        items: [] as { mealId: string; quantity: number; price: number }[]
    });
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (id: string, newStatus: string) => {
        toast.promise(updateOrderStatus(id, newStatus), {
            loading: "Updating status...",
            success: () => {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
                return "Order status updated";
            },
            error: "Failed to update status"
        });
    };

    const openCreate = () => {
        setSelectedOrder(null);
        setFormData({
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            shippingAddress: "",
            city: "Scottsdale",
            zipCode: "",
            deliveryDate: "",
            status: "PENDING",
            items: []
        });
        setShowModal(true);
    };

    const openEdit = (order: Order) => {
        setSelectedOrder(order);
        setFormData({
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone || "",
            shippingAddress: order.shippingAddress,
            city: order.city,
            zipCode: order.zipCode,
            deliveryDate: order.deliveryDate ? new Date(order.deliveryDate).toISOString().split('T')[0] : "",
            status: order.status,
            items: order.items.map(item => ({
                mealId: item.meal.id,
                quantity: item.quantity,
                price: item.price
            }))
        });
        setShowModal(true);
    };

    const addItem = () => {
        if (meals.length === 0) return;
        setFormData({
            ...formData,
            items: [...formData.items, { mealId: meals[0].id, quantity: 1, price: meals[0].price }]
        });
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };

        // If meal changed, update price
        if (field === 'mealId') {
            const meal = meals.find(m => m.id === value);
            if (meal) newItems[index].price = meal.price;
        }

        setFormData({ ...formData, items: newItems });
    };

    const removeItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index)
        });
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            total: calculateTotal(),
            items: formData.items.map(i => ({ id: i.mealId, quantity: i.quantity, price: i.price }))
        };

        let res;
        if (selectedOrder) {
            res = await updateAdminOrder(selectedOrder.id, payload);
        } else {
            res = await createAdminOrder(payload);
        }

        setLoading(false);

        if (res.success) {
            window.location.reload(); // Still doing reload for now to keep it simple, could optimize later
            toast.success(selectedOrder ? "Order updated" : "Order created");
        } else {
            toast.error(res.error || "Operation failed");
        }
    };

    const openDeleteModal = (order: Order) => {
        setOrderToDelete(order);
        setPassword("");
        setDeleteModalOpen(true);
    };

    const confirmDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderToDelete) return;
        setLoading(true);

        const res = await deleteOrder(orderToDelete.id, password);
        setLoading(false);

        if (res.success) {
            setDeleteModalOpen(false);
            window.location.reload();
            toast.success("Order deleted successfully");
        } else {
            toast.error(res.error || "Failed to delete order");
        }
    };

    const handleExport = () => {
        const data = filteredOrders.map(order => ({
            "Order ID": order.id,
            "Date": new Date(order.createdAt).toLocaleDateString(),
            "Customer Name": order.customerName,
            "Email": order.customerEmail,
            "Total": order.total,
            "Status": order.status,
            "Items": order.items.map(i => `${i.quantity}x ${i.meal.title}`).join(", "),
            "Shipping Address": order.shippingAddress,
            "City": order.city,
            "Zip": order.zipCode
        }));

        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Orders");
        writeFile(wb, `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
        toast.success("Orders exported successfully");
    };

    return <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>

            {/* Search & Filter Group */}
            <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
                <div style={{ position: 'relative', flex: 2 }}>
                    <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: '48px', width: '100%' }} // Reuse inputStyle
                    />
                </div>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Filter size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: '48px', appearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="ALL" style={{ color: 'black' }}>All Status</option>
                        <option value="PENDING" style={{ color: 'black' }}>Pending</option>
                        <option value="PAID" style={{ color: 'black' }}>Paid</option>
                        <option value="COMPLETED" style={{ color: 'black' }}>Completed</option>
                        <option value="DELIVERED" style={{ color: 'black' }}>Delivered</option>
                        <option value="CANCELLED" style={{ color: 'black' }}>Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
                {/* Sort Controls (Visual only for now, can be expanded) */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', border: '1px solid var(--glass-border)' }}>
                    <button
                        onClick={handleExport}
                        title="Export filtered orders to CSV"
                        style={{ padding: '8px 12px', background: 'transparent', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <Download size={18} />
                    </button>
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
                    <button
                        onClick={() => handleSort('createdAt')}
                        style={{ padding: '8px 12px', background: sortConfig?.key === 'createdAt' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                        Date {sortConfig?.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                        onClick={() => handleSort('total')}
                        style={{ padding: '8px 12px', background: sortConfig?.key === 'total' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                        Total {sortConfig?.key === 'total' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                    </button>
                </div>

                <button
                    onClick={openCreate}
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
                    <Plus size={18} />
                    Create New Order
                </button>
            </div>
        </div>

        {filteredOrders.length === 0 ? (
            <div style={{
                padding: '80px 40px',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                <Package size={48} style={{ marginBottom: '16px', opacity: 0.2 }} />
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>No orders found.</div>
                {searchQuery && <div style={{ fontSize: '0.9rem', marginTop: '8px' }}>Try adjusting your search or filters.</div>}
            </div>
        ) : (
            <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {paginatedOrders.map(order => (
                        <OrderRow key={order.id} order={order} onStatusChange={handleStatusChange} onEdit={openEdit} onDelete={openDeleteModal} />
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '20px' }}>
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            style={{
                                padding: '8px 16px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1
                            }}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '8px 16px', background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1
                            }}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
            }}>
                <div style={{
                    background: '#0B0E14', border: '1px solid var(--glass-border)', borderRadius: '24px',
                    padding: '40px', width: '100%', maxWidth: '800px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                    maxHeight: '90vh', overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontFamily: 'var(--font-heading)', textTransform: 'uppercase', color: 'white', margin: 0 }}>
                            {selectedOrder ? `Edit Order ${selectedOrder.id.slice(-6)}` : "Create New Order"}
                        </h2>
                        <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Customer Name</label>
                                <input required type="text" style={inputStyle} value={formData.customerName} onChange={e => setFormData({ ...formData, customerName: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input required type="email" style={inputStyle} value={formData.customerEmail} onChange={e => setFormData({ ...formData, customerEmail: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Phone</label>
                                <input type="tel" style={inputStyle} value={formData.customerPhone} onChange={e => setFormData({ ...formData, customerPhone: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Status</label>
                                <select style={inputStyle} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                    <option value="PENDING" style={{ color: 'black' }}>Pending</option>
                                    <option value="PAID" style={{ color: 'black' }}>Paid</option>
                                    <option value="COMPLETED" style={{ color: 'black' }}>Completed</option>
                                    <option value="DELIVERED" style={{ color: 'black' }}>Delivered</option>
                                    <option value="CANCELLED" style={{ color: 'black' }}>Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={labelStyle}>Shipping Address</label>
                                <input required type="text" style={inputStyle} value={formData.shippingAddress} onChange={e => setFormData({ ...formData, shippingAddress: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>City</label>
                                <input required type="text" style={inputStyle} value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} />
                            </div>
                            <div>
                                <label style={labelStyle}>Zip Code</label>
                                <input required type="text" style={inputStyle} value={formData.zipCode} onChange={e => setFormData({ ...formData, zipCode: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Delivery Date</label>
                            <input type="date" style={inputStyle} value={formData.deliveryDate} onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })} />
                        </div>

                        {/* Items Section */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <label style={{ ...labelStyle, marginBottom: 0 }}>Order Items</label>
                                <button type="button" onClick={addItem} style={{ fontSize: '0.8rem', color: '#fbbf24', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+ Add Item</button>
                            </div>

                            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '12px', overflow: 'hidden' }}>
                                {formData.items.length === 0 && (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>No items added yet.</div>
                                )}
                                {formData.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '12px', padding: '12px', borderBottom: '1px solid var(--glass-border)', alignItems: 'center' }}>
                                        <select
                                            style={{ ...inputStyle, flex: 3 }}
                                            value={item.mealId}
                                            onChange={e => updateItem(idx, 'mealId', e.target.value)}
                                        >
                                            {meals.map(m => (
                                                <option key={m.id} value={m.id} style={{ color: 'black' }}>{m.title} (${m.price})</option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            min="1"
                                            style={{ ...inputStyle, flex: 1 }}
                                            value={item.quantity}
                                            onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value))}
                                        />
                                        <div style={{ width: '80px', color: 'white', fontWeight: 600, textAlign: 'right' }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <button type="button" onClick={() => removeItem(idx)} style={{ color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {formData.items.length > 0 && (
                                    <div style={{ padding: '16px', textAlign: 'right', borderTop: '1px solid var(--glass-border)', color: '#fbbf24', fontWeight: 700, fontSize: '1.2rem' }}>
                                        Total: ${calculateTotal().toFixed(2)}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                            <button
                                disabled={loading}
                                type="submit"
                                className="btn-black"
                                style={{ flex: 1, padding: '16px', background: '#fbbf24', color: 'black', border: 'none', fontWeight: 800 }}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : (selectedOrder ? "Update Order" : "Create Order")}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                style={{ flex: 1, padding: '16px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
            }}>
                <div style={{
                    background: '#0B0E14', border: '1px solid var(--glass-border)', borderRadius: '24px',
                    padding: '40px', width: '100%', maxWidth: '500px',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', color: '#ef4444', margin: '0 0 16px 0' }}>
                        Delete Order?
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '24px', lineHeight: 1.6 }}>
                        Are you sure you want to delete Order <strong style={{ color: 'white' }}>{orderToDelete?.orderNumber || orderToDelete?.id.slice(-6)}</strong>?
                        <br />
                        This action cannot be undone.
                    </p>

                    <form onSubmit={confirmDelete}>
                        <div style={{ marginBottom: '24px' }}>
                            <label style={labelStyle}>Admin Password</label>
                            <input
                                required
                                type="password"
                                placeholder="Enter your password to confirm"
                                style={inputStyle}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                disabled={loading}
                                type="submit"
                                style={{
                                    flex: 1, padding: '16px', background: '#ef4444', color: 'white',
                                    border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Delete Forever"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeleteModalOpen(false)}
                                style={{
                                    flex: 1, padding: '16px', background: 'transparent',
                                    border: '1px solid var(--glass-border)', color: 'white',
                                    borderRadius: '12px', fontWeight: 600, cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
    );
}


function OrderRow({ order, onStatusChange, onEdit, onDelete }: { order: Order, onStatusChange: (id: string, s: string) => void, onEdit: (o: Order) => void, onDelete: (o: Order) => void }) {
    const [expanded, setExpanded] = useState(false);

    const statusColors: any = {
        'PENDING': '#fbbf24',
        'PAID': '#3b82f6',
        'COMPLETED': '#10b981',
        'CANCELLED': '#ef4444',
        'DELIVERED': '#8b5cf6'
    };

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        }}>
            {/* Header Row */}
            <div
                onClick={() => setExpanded(!expanded)}
                style={{
                    padding: '24px 32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    cursor: 'pointer',
                    background: expanded ? 'rgba(255,255,255,0.02)' : 'transparent',
                    flexWrap: 'wrap'
                }}
            >
                <div style={{ width: '120px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700 }}>Order #</div>
                    <div style={{ color: 'white', fontFamily: 'monospace' }}>{order.id.slice(-6)}</div>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'white', fontFamily: 'var(--font-heading)' }}>{order.customerName}</div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{order.customerEmail}</div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.05em' }}>Date</div>
                    <div style={{ color: 'white' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>

                <div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 700, letterSpacing: '0.05em' }}>Total</div>
                    <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1.1rem' }}>${order.total.toFixed(2)}</div>
                </div>

                <div>
                    <span style={{
                        padding: '6px 16px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: `${statusColors[order.status]}15`,
                        color: statusColors[order.status],
                        border: `1px solid ${statusColors[order.status]}30`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {order.status}
                    </span>
                </div>

                <div style={{ color: '#94a3b8' }}>
                    {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div style={{ padding: '32px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '32px' }}>
                        <div>
                            <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Shipping Information</h4>
                            <p style={{ lineHeight: 1.8, color: '#e2e8f0' }}>
                                <span style={{ color: '#94a3b8' }}>Address:</span> {order.shippingAddress}<br />
                                <span style={{ color: '#94a3b8' }}>Location:</span> {order.city}, {order.zipCode}<br />
                                {order.customerPhone && <><span style={{ color: '#94a3b8' }}>Phone:</span> {order.customerPhone}</>}
                            </p>
                            <button
                                onClick={(e) => { e.stopPropagation(); onEdit(order); }}
                                style={{
                                    marginTop: '16px',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <Edit2 size={16} /> Edit Order Details
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(order); }}
                                style={{
                                    marginTop: '8px',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    width: '100%'
                                }}
                            >
                                <Trash2 size={16} /> Delete Order
                            </button>
                        </div>
                        <div>
                            <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Quick Actions</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {['PAID', 'COMPLETED', 'DELIVERED', 'CANCELLED'].map(s => (
                                    <button
                                        key={s}
                                        onClick={(e) => { e.stopPropagation(); onStatusChange(order.id, s); }}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: order.status === s ? 'white' : 'rgba(255,255,255,0.05)',
                                            color: order.status === s ? 'black' : 'white',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}
                                        onMouseOver={(e) => {
                                            if (order.status !== s) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            if (order.status !== s) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            }
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <h4 style={{ fontSize: '0.85rem', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-heading)', letterSpacing: '0.05em' }}>Order Content</h4>
                    <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        {order.items.map((item, i) => (
                            <div key={item.id} style={{
                                padding: '16px 24px',
                                borderBottom: i === order.items.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div style={{ color: '#e2e8f0' }}>
                                    <span style={{ fontWeight: 800, color: '#fbbf24', marginRight: '12px' }}>{item.quantity}x</span>
                                    <span style={{ fontWeight: 600 }}>{item.meal.title}</span>
                                </div>
                                <div style={{ color: 'white', fontWeight: 700 }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

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
    outline: 'none',
    fontSize: '0.95rem'
};
