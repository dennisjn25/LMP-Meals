import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { theme } from '../theme';

interface Message {
    id: string;
    sender: string;
    text: string;
    time: string;
    isCurrentUser: boolean;
}

interface ChatChannel {
    id: string;
    name: string;
    lastMessage: string;
    unreadCount: number;
    time: string;
}

const MOCK_CHANNELS: ChatChannel[] = [
    { id: '1', name: 'All Team', lastMessage: 'Sarah: Got it, thanks!', unreadCount: 3, time: '2m ago' },
    { id: '2', name: 'Delivery Drivers', lastMessage: 'Mike: Route updated', unreadCount: 1, time: '15m ago' },
    { id: '3', name: 'Kitchen Staff', lastMessage: 'Ready for pickup', unreadCount: 0, time: '1h ago' },
    { id: '4', name: 'Management', lastMessage: 'Schedule posted', unreadCount: 0, time: '3h ago' },
];

const MOCK_MESSAGES: Message[] = [
    { id: '1', sender: 'Josh Dennis', text: 'Good morning team! Ready for a great day?', time: '8:00 AM', isCurrentUser: false },
    { id: '2', sender: 'Sarah', text: 'Morning! Just clocked in', time: '8:05 AM', isCurrentUser: false },
    { id: '3', sender: 'You', text: 'Morning everyone! On my way', time: '8:10 AM', isCurrentUser: true },
    { id: '4', sender: 'Mike', text: 'Route is looking good today', time: '8:15 AM', isCurrentUser: false },
    { id: '5', sender: 'Josh Dennis', text: 'Great! Remember the special delivery instructions for order #1024', time: '8:20 AM', isCurrentUser: false },
    { id: '6', sender: 'You', text: 'Got it, thanks!', time: '8:22 AM', isCurrentUser: true },
];

export default function ChatScreen() {
    const [selectedChannel, setSelectedChannel] = useState<string | null>('1');
    const [messageText, setMessageText] = useState('');

    const handleSendMessage = () => {
        if (messageText.trim()) {
            // In a real app, this would send to backend
            console.log('Sending:', messageText);
            setMessageText('');
        }
    };

    if (!selectedChannel) {
        // Channels list view
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Team Chat</Text>
                    <Text style={styles.headerSubtitle}>Stay connected with your team</Text>
                </View>

                <ScrollView style={styles.channelsList}>
                    {MOCK_CHANNELS.map(channel => (
                        <TouchableOpacity
                            key={channel.id}
                            style={styles.channelCard}
                            onPress={() => setSelectedChannel(channel.id)}
                        >
                            <View style={styles.channelIcon}>
                                <Text style={styles.channelIconText}>
                                    {channel.name.substring(0, 2).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.channelContent}>
                                <View style={styles.channelHeader}>
                                    <Text style={styles.channelName}>{channel.name}</Text>
                                    <Text style={styles.channelTime}>{channel.time}</Text>
                                </View>
                                <Text style={styles.channelLastMessage} numberOfLines={1}>
                                    {channel.lastMessage}
                                </Text>
                            </View>
                            {channel.unreadCount > 0 && (
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadText}>{channel.unreadCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    }

    // Active chat view
    const currentChannel = MOCK_CHANNELS.find(c => c.id === selectedChannel);

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        >
            {/* Chat Header */}
            <View style={styles.chatHeader}>
                <TouchableOpacity onPress={() => setSelectedChannel(null)} style={styles.backButton}>
                    <Text style={styles.backText}>‹ Back</Text>
                </TouchableOpacity>
                <View style={styles.chatHeaderContent}>
                    <Text style={styles.chatTitle}>{currentChannel?.name}</Text>
                    <Text style={styles.chatSubtitle}>Active now</Text>
                </View>
            </View>

            {/* Messages */}
            <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                {MOCK_MESSAGES.map(message => (
                    <View
                        key={message.id}
                        style={[
                            styles.messageBubble,
                            message.isCurrentUser ? styles.myMessage : styles.theirMessage
                        ]}
                    >
                        {!message.isCurrentUser && (
                            <Text style={styles.messageSender}>{message.sender}</Text>
                        )}
                        <Text style={[
                            styles.messageText,
                            message.isCurrentUser && styles.myMessageText
                        ]}>
                            {message.text}
                        </Text>
                        <Text style={[
                            styles.messageTime,
                            message.isCurrentUser && styles.myMessageTime
                        ]}>
                            {message.time}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            {/* Message Input */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.colors.text.muted}
                    value={messageText}
                    onChangeText={setMessageText}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
                    onPress={handleSendMessage}
                    disabled={!messageText.trim()}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
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
    channelsList: {
        flex: 1,
    },
    channelCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        marginHorizontal: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        ...theme.shadows.sm,
    },
    channelIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    channelIconText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    channelContent: {
        flex: 1,
    },
    channelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    channelName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    channelTime: {
        fontSize: 12,
        color: theme.colors.text.muted,
    },
    channelLastMessage: {
        fontSize: 14,
        color: theme.colors.text.secondary,
    },
    unreadBadge: {
        backgroundColor: theme.colors.error,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: theme.spacing.sm,
    },
    unreadText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    chatHeader: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        ...theme.shadows.sm,
    },
    backButton: {
        marginBottom: theme.spacing.sm,
    },
    backText: {
        color: theme.colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    chatHeaderContent: {
        alignItems: 'center',
    },
    chatTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: theme.colors.text.primary,
    },
    chatSubtitle: {
        fontSize: 12,
        color: theme.colors.success,
        marginTop: 2,
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    messagesContent: {
        padding: theme.spacing.md,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.surface,
        borderBottomLeftRadius: 4,
        ...theme.shadows.sm,
    },
    messageSender: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.secondary,
        marginBottom: 4,
    },
    messageText: {
        fontSize: 15,
        color: theme.colors.text.primary,
        lineHeight: 20,
    },
    myMessageText: {
        color: '#fff',
    },
    messageTime: {
        fontSize: 11,
        color: theme.colors.text.muted,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    myMessageTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        alignItems: 'flex-end',
        ...theme.shadows.sm,
    },
    input: {
        flex: 1,
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        marginRight: theme.spacing.sm,
        fontSize: 15,
        color: theme.colors.text.primary,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sendButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm + 2,
        borderRadius: theme.borderRadius.lg,
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
