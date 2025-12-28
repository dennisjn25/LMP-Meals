import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { User } from '../types';

interface DashboardProps {
    user: User;
}

export default function DashboardScreen({ user }: DashboardProps) {
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [shiftStart, setShiftStart] = useState<Date | null>(null);
    const [elapsed, setElapsed] = useState('00:00:00');

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isClockedIn && shiftStart) {
            timer = setInterval(() => {
                const now = new Date();
                const diff = now.getTime() - shiftStart.getTime();
                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                const seconds = Math.floor((diff % 60000) / 1000);
                setElapsed(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isClockedIn, shiftStart]);

    const handleClockToggle = () => {
        if (isClockedIn) {
            setIsClockedIn(false);
            setShiftStart(null);
        } else {
            setIsClockedIn(true);
            setShiftStart(new Date());
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>WELCOME BACK</Text>
                <Text style={styles.userName}>{user.name}</Text>
            </View>

            {/* Time Tracking Card */}
            <View style={styles.timeCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>⏱️ TIME TRACKING</Text>
                    {isClockedIn && (
                        <View style={styles.liveIndicator}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                    )}
                </View>

                <View style={styles.timerDisplay}>
                    <Text style={[styles.timerText, !isClockedIn && styles.timerInactive]}>
                        {isClockedIn ? elapsed : '00:00:00'}
                    </Text>
                    <Text style={styles.timerLabel}>
                        {isClockedIn ? 'Hours Logged Today' : 'Not Clocked In'}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.clockButton, isClockedIn && styles.clockedIn]}
                    onPress={handleClockToggle}
                >
                    <Text style={styles.clockButtonText}>
                        {isClockedIn ? 'CLOCK OUT' : 'CLOCK IN'}
                    </Text>
                </TouchableOpacity>

                {isClockedIn && (
                    <Text style={styles.locationText}>📍 Location tracked</Text>
                )}
            </View>

            {/* Today's Summary */}
            <Text style={styles.sectionTitle}>TODAY'S SUMMARY</Text>
            <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                        <Text style={styles.statIcon}>📦</Text>
                    </View>
                    <Text style={styles.statValue}>12</Text>
                    <Text style={styles.statLabel}>Pending Tasks</Text>
                </View>

                <View style={styles.statCard}>
                    <View style={styles.statIconContainer}>
                        <Text style={styles.statIcon}>✅</Text>
                    </View>
                    <Text style={styles.statValue}>8</Text>
                    <Text style={styles.statLabel}>Completed</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
            <View style={styles.actionList}>
                <TouchableOpacity style={styles.actionCard}>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionIcon}>📅</Text>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>View Schedule</Text>
                            <Text style={styles.actionSubtitle}>Check your shifts</Text>
                        </View>
                    </View>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard}>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionIcon}>💬</Text>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Team Chat</Text>
                            <Text style={styles.actionSubtitle}>3 new messages</Text>
                        </View>
                    </View>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard}>
                    <View style={styles.actionContent}>
                        <Text style={styles.actionIcon}>⚠️</Text>
                        <View style={styles.actionTextContainer}>
                            <Text style={styles.actionTitle}>Report Issue</Text>
                            <Text style={styles.actionSubtitle}>Get help</Text>
                        </View>
                    </View>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background,
    },
    header: {
        marginBottom: theme.spacing.xl,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
        paddingLeft: theme.spacing.md,
    },
    greeting: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.text.secondary,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    userName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    timeCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.md,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.text.primary,
        letterSpacing: 1,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.3)',
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: theme.colors.error,
        marginRight: 4,
    },
    liveText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: theme.colors.error,
        letterSpacing: 1,
    },
    timerDisplay: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.borderDark,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: theme.colors.primary,
        fontVariant: ['tabular-nums'],
        letterSpacing: 4,
    },
    timerInactive: {
        color: theme.colors.text.muted,
    },
    timerLabel: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginTop: theme.spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    clockButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md + 2,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        ...theme.shadows.md,
    },
    clockedIn: {
        backgroundColor: theme.colors.error,
    },
    clockButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    locationText: {
        textAlign: 'center',
        color: theme.colors.text.secondary,
        fontSize: 12,
        marginTop: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.md,
        letterSpacing: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    statCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    statIconContainer: {
        marginBottom: theme.spacing.sm,
    },
    statIcon: {
        fontSize: 32,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 11,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    actionList: {
        gap: theme.spacing.sm,
        marginBottom: 40,
    },
    actionCard: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    actionIcon: {
        fontSize: 28,
        marginRight: theme.spacing.md,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    actionSubtitle: {
        fontSize: 12,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
    actionArrow: {
        fontSize: 24,
        color: theme.colors.text.muted,
    }
});
