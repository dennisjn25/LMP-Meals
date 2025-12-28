import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../theme';

interface LoginScreenProps {
    onLogin: (email: string, role: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Mock login logic
        if (email.includes('driver')) {
            onLogin(email, 'driver');
        } else if (email.includes('kitchen')) {
            onLogin(email, 'kitchen');
        } else {
            onLogin(email, 'admin');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar style="light" />
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.title}>Liberty Meal Prep</Text>
                    <Text style={styles.subtitle}>Admin Portal</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="name@libertymealprep.com"
                            placeholderTextColor={theme.colors.text.muted}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            placeholderTextColor={theme.colors.text.muted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Sign In</Text>
                    </TouchableOpacity>

                    <View style={styles.helper}>
                        <Text style={styles.helperText}>Use 'driver@...' or 'kitchen@...' to test roles</Text>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    header: {
        marginBottom: theme.spacing.xl * 2,
        alignItems: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        marginBottom: theme.spacing.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 60,
        padding: theme.spacing.md,
        ...theme.shadows.lg,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm,
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        color: theme.colors.text.primary,
        borderWidth: 1,
        borderColor: theme.colors.border,
        fontSize: 16,
    },
    button: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        alignItems: 'center',
        marginTop: theme.spacing.md,
        ...theme.shadows.md,
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    helper: {
        marginTop: theme.spacing.xl,
        alignItems: 'center',
    },
    helperText: {
        color: theme.colors.text.muted,
        fontSize: 11,
    }
});
