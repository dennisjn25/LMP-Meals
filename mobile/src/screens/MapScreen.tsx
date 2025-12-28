import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

export default function MapScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Live Tracking</Text>
                <Text style={styles.headerSubtitle}>Real-time location monitoring</Text>
            </View>

            <View style={styles.mapPlaceholder}>
                <View style={styles.mapContent}>
                    <Text style={styles.mapEmoji}>🗺️</Text>
                    <Text style={styles.mapTitle}>Map Integration Active</Text>
                    <Text style={styles.mapSubtitle}>GPS location is being broadcast to dispatch</Text>

                    <View style={styles.routeInfo}>
                        <View style={styles.routeRow}>
                            <View style={styles.pulseDot} />
                            <Text style={styles.routeText}>Live tracking enabled</Text>
                        </View>
                        <Text style={styles.routeDetail}>Next stop: 12 minutes away</Text>
                    </View>

                    <TouchableOpacity style={styles.navButton}>
                        <Text style={styles.navButtonText}>🧭 Open Navigation</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Route Summary */}
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Today's Route</Text>
                <View style={styles.summaryStats}>
                    <View style={styles.summaryStat}>
                        <Text style={styles.summaryValue}>12</Text>
                        <Text style={styles.summaryLabel}>Total Stops</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryStat}>
                        <Text style={[styles.summaryValue, { color: theme.colors.success }]}>4</Text>
                        <Text style={styles.summaryLabel}>Completed</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryStat}>
                        <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>8</Text>
                        <Text style={styles.summaryLabel}>Remaining</Text>
                    </View>
                </View>
            </View>
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
    mapPlaceholder: {
        margin: theme.spacing.lg,
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        padding: theme.spacing.xl,
        ...theme.shadows.md,
    },
    mapContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapEmoji: {
        fontSize: 64,
        marginBottom: theme.spacing.md,
    },
    mapTitle: {
        color: theme.colors.text.primary,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: theme.spacing.xs,
    },
    mapSubtitle: {
        color: theme.colors.text.secondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    routeInfo: {
        backgroundColor: theme.colors.background,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        width: '100%',
        marginBottom: theme.spacing.lg,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.xs,
    },
    pulseDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.success,
    },
    routeText: {
        color: theme.colors.success,
        fontWeight: 'bold',
        fontSize: 14,
    },
    routeDetail: {
        color: theme.colors.text.secondary,
        fontSize: 13,
        marginLeft: 18,
    },
    navButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.md,
    },
    navButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    summaryCard: {
        backgroundColor: theme.colors.surface,
        margin: theme.spacing.lg,
        marginTop: 0,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.sm,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    summaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    summaryStat: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    summaryLabel: {
        fontSize: 11,
        color: theme.colors.text.secondary,
        marginTop: 4,
    },
    summaryDivider: {
        width: 1,
        backgroundColor: theme.colors.border,
    },
});
