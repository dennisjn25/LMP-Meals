import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { KitchenItem } from '../types';

const MOCK_PREP_ITEMS: KitchenItem[] = [
    { id: '1', name: 'Lemon Herb Chicken', quantity: 50, completed: 35, unit: 'portions', status: 'in-progress', allergens: [] },
    { id: '2', name: 'Chili Mac', quantity: 40, completed: 0, unit: 'portions', status: 'pending', allergens: ['Dairy', 'Gluten'] },
    { id: '3', name: 'Roasted Veggies', quantity: 20, completed: 20, unit: 'lbs', status: 'done', allergens: [] },
    { id: '4', name: 'Steak & Potatoes', quantity: 30, completed: 5, unit: 'portions', status: 'in-progress', allergens: ['Beef'] },
];

export default function KitchenScreen() {
    const [items, setItems] = useState(MOCK_PREP_ITEMS);

    const toggleStatus = (id: string) => {
        setItems(items.map(item => {
            if (item.id === id) {
                if (item.status === 'pending') return { ...item, status: 'in-progress' as const };
                if (item.status === 'in-progress') return { ...item, status: 'done' as const };
                return { ...item, status: 'pending' as const };
            }
            return item;
        }));
    };

    const getProgressColor = (completed: number, total: number) => {
        const ratio = completed / total;
        if (ratio >= 1) return theme.colors.success;
        if (ratio > 0.5) return theme.colors.primary;
        return theme.colors.text.muted;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return theme.colors.success;
            case 'in-progress': return theme.colors.primary;
            default: return theme.colors.text.muted;
        }
    };

    const totalItems = items.length;
    const completedItems = items.filter(i => i.status === 'done').length;
    const inProgressItems = items.filter(i => i.status === 'in-progress').length;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>KITCHEN PRODUCTION</Text>
                <Text style={styles.subtitle}>PM Shift - December 27</Text>
            </View>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryValue}>{completedItems}/{totalItems}</Text>
                        <Text style={styles.summaryLabel}>Completed</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>{inProgressItems}</Text>
                        <Text style={styles.summaryLabel}>In Progress</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryValue, { color: theme.colors.text.muted }]}>
                            {totalItems - completedItems - inProgressItems}
                        </Text>
                        <Text style={styles.summaryLabel}>Pending</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>PREP QUEUE</Text>

                {items.map(item => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <TouchableOpacity onPress={() => toggleStatus(item.id)}>
                                <View style={[styles.statusBadge, {
                                    backgroundColor: getStatusColor(item.status),
                                }]}>
                                    <Text style={styles.statusText}>
                                        {item.status === 'done' ? 'DONE' :
                                            item.status === 'in-progress' ? 'ACTIVE' : 'PENDING'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.progressContainer}>
                            <View style={styles.progressTextRow}>
                                <Text style={styles.progressLabel}>Progress</Text>
                                <Text style={styles.progressValue}>{item.completed} / {item.quantity} {item.unit}</Text>
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, {
                                    width: `${Math.min((item.completed / item.quantity) * 100, 100)}%`,
                                    backgroundColor: getProgressColor(item.completed, item.quantity)
                                }]} />
                            </View>
                        </View>

                        {item.allergens && item.allergens.length > 0 && (
                            <View style={styles.allergenSection}>
                                <Text style={styles.allergenTitle}>⚠️ ALLERGENS:</Text>
                                <View style={styles.tags}>
                                    {item.allergens.map((allergen, idx) => (
                                        <View key={idx} style={styles.tag}>
                                            <Text style={styles.tagText}>{allergen}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                ))}
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
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginTop: 4,
    },
    summaryCard: {
        backgroundColor: theme.colors.surface,
        margin: theme.spacing.md,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.success,
    },
    summaryLabel: {
        fontSize: 10,
        color: theme.colors.text.secondary,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summaryDivider: {
        width: 1,
        height: 40,
        backgroundColor: theme.colors.border,
    },
    scrollView: {
        paddingHorizontal: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.sm,
        letterSpacing: 1.5,
    },
    card: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    progressContainer: {
        marginBottom: theme.spacing.md,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xs,
    },
    progressLabel: {
        color: theme.colors.text.secondary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    progressValue: {
        color: theme.colors.text.primary,
        fontSize: 12,
        fontWeight: 'bold',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    allergenSection: {
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: theme.spacing.sm,
    },
    allergenTitle: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
        letterSpacing: 0.5,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    tagText: {
        color: theme.colors.error,
        fontSize: 11,
        fontWeight: '600',
    },
});
