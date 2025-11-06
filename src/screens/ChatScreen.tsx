// ============================================
// CHAT SCREEN - REACT NATIVE VERSION
// ============================================
// Üzenetek küldése és fogadása egy baráttal
// STÍLUS: FriendsScreen-nel megegyező (slate/blue)

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Send, MessageCircle } from 'lucide-react-native';
import { RootStackParamList } from '../navigation/types';
import { useChat, Message } from '../hooks/useChat';
import { usePresence } from '../hooks/usePresence';
import { storage, STORAGE_KEYS } from '../utils/storage';

// ============================================
// CONSTANTS (Same as FriendsScreen)
// ============================================

const COLORS = {
  white: '#FFFFFF',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  blue900: '#1E3A8A',
  blue800: '#1E40AF',
  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  blue300: '#93C5FD',
  cyan500: '#06B6D4',
  cyan400: '#22D3EE',
  green600: '#16A34A',
  green700: '#15803D',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
};

const SIZES = {
  fontXS: 10,
  fontSM: 12,
  fontBase: 14,
  fontLG: 18,
  fontXL: 20,
  radiusLG: 12,
  radiusXL: 16,
  radiusFull: 9999,
  iconBase: 18,
  iconLG: 24,
};

const FONT_WEIGHT = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============================================
// TYPES
// ============================================

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;
type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

interface ChatScreenProps {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

// ============================================
// COMPONENT
// ============================================

export default function ChatScreen({ navigation, route }: ChatScreenProps) {
  const { friendId, friendName } = route.params;

  const {
    messages,
    loading,
    sendMessage,
    markConversationAsRead,
  } = useChat(friendId);

  // ✅ Use presence hook to track friend's online status
  const { isOnline } = usePresence([friendId]);

  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Check if friend is online
  const friendIsOnline = isOnline(friendId);

  // Get current player ID
  useEffect(() => {
    const getPlayerId = async () => {
      const id = await storage.getItem<string>(STORAGE_KEYS.PLAYER_DATA);
      setCurrentPlayerId(id);
    };
    getPlayerId();
  }, []);

  // Mark conversation as read when entering
  useEffect(() => {
    markConversationAsRead(friendId);
  }, [friendId, markConversationAsRead]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageText.trim() || sending) return;

    setSending(true);
    const success = await sendMessage(friendId, messageText.trim());

    if (success) {
      setMessageText('');
    }
    setSending(false);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender_id === currentPlayerId;
    const time = new Date(item.created_at).toLocaleTimeString('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        {/* Message Bubble with Gradient */}
        {isMe ? (
          <LinearGradient
            colors={[COLORS.blue600, COLORS.blue700]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.messageBubble, styles.myBubble]}
          >
            <Text style={styles.myMessageText}>{item.message}</Text>
            <Text style={styles.myMessageTime}>{time}</Text>
          </LinearGradient>
        ) : (
          <View style={[styles.messageBubble, styles.theirBubble]}>
            <Text style={styles.theirMessageText}>{item.message}</Text>
            <Text style={styles.theirMessageTime}>{time}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={[COLORS.slate900, COLORS.slate800]} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft size={SIZES.iconLG} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{friendName || 'Ismeretlen'}</Text>
            <Text
              style={[
                styles.headerSubtitle,
                friendIsOnline ? styles.statusOnline : styles.statusOffline,
              ]}
            >
              {friendIsOnline ? 'Online' : 'Offline'}
            </Text>
          </View>

          <View style={styles.headerRight} />
        </View>

        {/* Messages List */}
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.blue500} />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MessageCircle size={64} color={COLORS.slate500} />
              <Text style={styles.emptyText}>Még nincsenek üzenetek</Text>
              <Text style={styles.emptySubtext}>Kezdj el beszélgetni {friendName}-val!</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          )}

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <LinearGradient
              colors={[COLORS.slate700, COLORS.slate800]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.inputWrapper}
            >
              <TextInput
                style={styles.input}
                value={messageText}
                onChangeText={setMessageText}
                placeholder="Írj egy üzenetet..."
                placeholderTextColor={COLORS.slate400}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleSend}
                style={styles.sendButtonContainer}
                disabled={!messageText.trim() || sending}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    !messageText.trim() || sending
                      ? [COLORS.slate600, COLORS.slate700]
                      : [COLORS.blue600, COLORS.blue700]
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sendButton}
                >
                  {sending ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Send size={SIZES.iconBase} color={COLORS.white} />
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate700,
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: SIZES.fontSM,
    marginTop: 2,
    fontWeight: FONT_WEIGHT.medium,
  },
  statusOnline: {
    color: COLORS.green600,
  },
  statusOffline: {
    color: COLORS.slate400,
  },
  headerRight: {
    width: 40,
  },

  // Messages
  keyboardView: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
  },
  messageContainer: {
    marginBottom: SPACING.md,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md,
    borderRadius: SIZES.radiusXL,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  myBubble: {
    // Gradient applied via LinearGradient component
  },
  theirBubble: {
    backgroundColor: COLORS.slate700,
  },
  myMessageText: {
    fontSize: SIZES.fontBase,
    lineHeight: SIZES.fontBase * 1.4,
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.medium,
  },
  theirMessageText: {
    fontSize: SIZES.fontBase,
    lineHeight: SIZES.fontBase * 1.4,
    color: COLORS.slate300,
    fontWeight: FONT_WEIGHT.medium,
  },
  myMessageTime: {
    fontSize: SIZES.fontXS,
    color: COLORS.blue200,
    marginTop: 4,
    textAlign: 'right',
    fontWeight: FONT_WEIGHT.normal,
  },
  theirMessageTime: {
    fontSize: SIZES.fontXS,
    color: COLORS.slate400,
    marginTop: 4,
    fontWeight: FONT_WEIGHT.normal,
  },

  // Input
  inputContainer: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    paddingBottom: SPACING.base,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate700,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: SIZES.radiusXL,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.slate600,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: SIZES.fontBase,
    maxHeight: 100,
    marginRight: SPACING.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  sendButtonContainer: {
    borderRadius: SIZES.radiusFull,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Loading & Empty
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyText: {
    fontSize: SIZES.fontLG,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.white,
    marginTop: SPACING.lg,
  },
  emptySubtext: {
    fontSize: SIZES.fontBase,
    color: COLORS.slate400,
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontWeight: FONT_WEIGHT.medium,
  },
});
