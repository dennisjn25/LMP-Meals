import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Order } from '../types';

const MOCK_ORDERS: Order[] = [
    { id: '1024', customerName: 'Sarah Johnson', address: '7823 E. McDonald Dr, Scottsdale, AZ', status: 'Pending', items: 12, eta: '10:30 AM', specialInstructions: 'Gate code #1234' },
    { id: '1025', customerName: 'Mike Rodriguez', address: '4421 N. Scottsdale Rd, Scottsdale, AZ', status: 'Delivered', items: 8, eta: '09:15 AM' },
    { id: '1026', customerName: 'Jessica Thompson', address: '8901 E. Mountain View Rd, Scottsdale, AZ', status: 'En Route', items: 15, eta: '11:00 AM' },
    { id: '1027', customerName: 'David Lewis', address: '1234 Softwind Dr, Scottsdale, AZ', status: 'Ready', items: 4, eta: '11:45 AM' },
];

export default function OrdersScreen() {
    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case 'Delivered': return theme.colors.success;
            case 'En Route': return theme.colors.primary;
            case 'Ready': return theme.colors.warning;
            case 'Preparing': return theme.colors.accent;
            default: return theme.colors.text.muted;
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'Delivered': return '✓';
            case 'En Route': return '🚗';
            case 'Ready': return '📦';
            case 'Preparing': return '🍳';
            default: return '⏳';
        }
    };

    const pendingOrders = MOCK_ORDERS.filter(o => o.status !== 'Delivered');
    const deliveredOrders = MOCK_ORDERS.filter(o => o.status === 'Delivered');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Delivery Manifest</Text>
                <Text style={styles.headerSubtitle}>Today - {new Date().toLocaleDateString()}</Text>
            </View>

            {/* Stats Bar */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{pendingOrders.length}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.success }]}>{deliveredOrders.length}</Text>
                    <Text style={styles.statLabel}>Delivered</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{MOCK_ORDERS.length}</Text>
                    <Text style={styles.statLabel}>Total</Text>
                </View>
            </View>

            <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {pendingOrders.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Active Deliveries</Text>
                        {pendingOrders.map((order) => (
                            <TouchableOpacity key={order.id} style={styles.card} activeOpacity={0.7}>
                                <View style={styles.cardHeader}>
                                    <View style={styles.orderIdContainer}>
                                        <Text style={styles.orderId}>#{order.id}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                                        <Text style={styles.statusIcon}>{getStatusIcon(order.status)}</Text>
                                        <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                                    </View>
                                </View>

                                <Text style={styles.customerName}>{order.customerName}</Text>
                                <Text style={styles.address}>📍 {order.address}</Text>

                                {order.specialInstructions && (
                                    <View style={styles.instructionsBox}>
                                        <Text style={styles.instructionsLabel}>📝 Special Instructions:</Text>
                                        <Text style={styles.instructionsText}>{order.specialInstructions}</Text>
                                    </View>
                                )}

                                <View style={styles.footer}>
                                    <Text style={styles.metaText}>🍱 {order.items} Items</Text>
                                    {order.eta && <Text style={styles.metaText}>🕐 ETA: {order.eta}</Text>}
                                </View>

                                {order.status === 'En Route' && (
                                    <TouchableOpacity style={styles.actionButton}>
                                        <Text style={styles.actionButtonText}>Mark as Delivered</Text>
                                    </TouchableOpacity>
                                )}
                            </TouchableOpacity>
                        ))}
                    </>
                )}

                {deliveredOrders.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Completed</Text>
                        {deliveredOrders.map((order) => (
                            <View key={order.id} style={[styles.card, styles.completedCard]}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.orderId}>#{order.id}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: theme.colors.success }]}>
                                        <Text style={styles.statusIcon}>✓</Text>
                                        <Text style={styles.statusText}>DELIVERED</Text>
                                    </View>
                                </View>

                                <Text style={[styles.customerName, { color: theme.colors.text.secondary }]}>{order.customerName}</Text>
                                <Text style={[styles.address, { color: theme.colors.text.muted }]}>📍 {order.address}</Text>

                                <View style={styles.footer}>
                                    <Text style={styles.metaText}>{order.items} Items</Text>
                                    <Text style={styles.metaText}>Delivered at {order.eta}</Text>
                                </View>
                            </View>
                        ))}
                    </>
                )}

                <View style={{ height: 20 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    headerSubtitle: {
        fontSize: 14,
        color: theme.colors.text.secondary,
        marginTop: 4,
    },
    statsBar: {
        flexDirection: 'row',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        margin: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.sm,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    statLabel: {
        fontSize: 11,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.border,
        marginHorizontal: theme.spacing.sm,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },
    card: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
    },
    completedCard: {
        opacity: 0.7,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    orderIdContainer: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    orderId: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    statusIcon: {
        fontSize: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    customerName: {
        color: theme.colors.text.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    address: {
        color: theme.colors.text.secondary,
        fontSize: 14,
        marginBottom: theme.spacing.sm,
        lineHeight: 20,
    },
    instructionsBox: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.sm,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.warning,
    },
    instructionsLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.text.secondary,
        marginBottom: 4,
    },
    instructionsText: {
        fontSize: 13,
        color: theme.colors.text.primary,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    metaText: {
        color: theme.colors.text.muted,
        fontSize: 12,
    },
    actionButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.md,
        ...theme.shadows.sm,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
