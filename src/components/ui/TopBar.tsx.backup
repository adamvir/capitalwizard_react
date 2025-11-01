// ============================================
// TOPBAR KOMPONENS
// Játékos információk megjelenítése: avatar, szint, pénz, szakasz progresszió
// ============================================

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { storage } from '../../utils/storage';
import { COLORS, FONT_WEIGHT, SHADOWS, SIZES, SPACING } from '../../utils/styleConstants';

interface TopBarProps {
  coins?: number;
  gems?: number;
  progressPosition?: number;  // 0-based index (0-5)
  playerLevel?: number;
  currentLesson?: number;
  onAvatarClick?: () => void;
  currentStageInSection?: number;  // 1-based (1-6)
}

// Lecke nehézségi szintek - szinkronizálva a LessonHeader-rel
const lessonDifficulties: Record<number, 'Könnyű' | 'Közepes' | 'Nehéz'> = {
  7: 'Közepes',
  8: 'Nehéz',
  9: 'Könnyű',
  10: 'Nehéz',
  11: 'Nehéz',
  12: 'Nehéz',
  13: 'Nehéz',
  14: 'Nehéz',
  15: 'Nehéz'
};

export function TopBar({
  coins = 680,
  gems = 0,
  progressPosition = 3,
  playerLevel = 2,
  currentLesson = 7,
  onAvatarClick,
  currentStageInSection = 1
}: TopBarProps) {

  // ===== STATE MANAGEMENT =====
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null);

  // ===== EFFECTS =====
  useEffect(() => {
    console.log('🔝 TopBar received props:', {
      progressPosition,
      currentStageInSection,
      expectedProgressPosition: currentStageInSection - 1
    });
  }, [progressPosition, currentStageInSection]);

  // Avatar betöltése AsyncStorage-ból
  useEffect(() => {
    loadAvatar();
  }, []);

  // Reload avatar when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadAvatar();
    }, [])
  );

  const loadAvatar = async () => {
    try {
      const saved = await storage.getItem<string>('player_avatar');
      setCurrentAvatar(saved);
    } catch (error) {
      console.error('Error loading avatar:', error);
    }
  };

  // ===== HELPER FUNCTIONS =====
  const getNextLessonDifficulty = () => {
    const nextLesson = currentLesson;
    const difficulty = lessonDifficulties[nextLesson] || 'Közepes';

    switch (difficulty) {
      case 'Könnyű':
        return 'easy';
      case 'Nehéz':
        return 'hard';
      default:
        return 'medium';
    }
  };

  const difficulty = getNextLessonDifficulty();

  const getDifficultyBackgroundColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'rgba(16, 185, 129, 0.2)';
      case 'hard':
        return 'rgba(239, 68, 68, 0.2)';
      default:
        return 'rgba(6, 182, 212, 0.2)';
    }
  };

  const getDifficultyBorderColor = () => {
    switch (difficulty) {
      case 'easy':
        return 'rgba(52, 211, 153, 0.3)';
      case 'hard':
        return 'rgba(248, 113, 113, 0.3)';
      default:
        return 'rgba(34, 211, 238, 0.3)';
    }
  };

  const getDifficultyTextColor = () => {
    switch (difficulty) {
      case 'easy':
        return '#6EE7B7';
      case 'hard':
        return '#FCA5A5';
      default:
        return '#67E8F9';
    }
  };

  // Szakasz node-ok pozíciói és típusai (kompakt zigzag)
  const stageNodes = [
    { x: 8, y: 28, type: 'square' },
    { x: 32, y: 12, type: 'square' },
    { x: 56, y: 28, type: 'square' },
    { x: 80, y: 12, type: 'circle' },
    { x: 104, y: 28, type: 'square' },
    { x: 128, y: 12, type: 'square' }
  ];

  // ===== EVENT HANDLERS =====
  const handleAvatarClick = () => {
    console.log('Avatar clicked!', onAvatarClick);
    onAvatarClick?.();
  };

  return (
    <View style={styles.container}>
      {/* JÁTÉKOS INFORMÁCIÓS KÁRTYA */}
      <View style={styles.playerInfoContainer}>
        <LinearGradient
          colors={['rgba(30, 41, 59, 0.95)', 'rgba(15, 23, 42, 0.95)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.playerCard}
        >
          {/* Avatar gomb */}
          <Pressable
            onPress={handleAvatarClick}
            style={({ pressed }) => [
              styles.avatarButton,
              pressed && styles.avatarButtonPressed
            ]}
          >
            <View style={currentAvatar ? styles.avatarWithImage : styles.avatarWithoutImage}>
              {currentAvatar ? (
                <Text style={styles.avatarEmoji}>{currentAvatar}</Text>
              ) : (
                <Text style={styles.avatarPlaceholder}>+</Text>
              )}
            </View>
            {/* Glow effect */}
            <LinearGradient
              colors={currentAvatar ? ['#22D3EE', '#3B82F6'] : ['#6B7280', '#6B7280']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.avatarGlow}
            />
          </Pressable>

          {/* Info szekció */}
          <View style={styles.infoSection}>
            {/* Szint progresszió */}
            <View style={styles.levelRow}>
              <Text style={styles.levelText}>Szint {playerLevel}.</Text>
              <View style={styles.progressBarBg}>
                <LinearGradient
                  colors={['#FBBF24', '#FB923C', '#F97316']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[
                    styles.progressBarFill,
                    { width: playerLevel === 1 ? '0%' : '1%' }
                  ]}
                />
              </View>
            </View>

            {/* Pénznem (Arany és Gyémánt) */}
            <View style={styles.currencyRow}>
              <View style={styles.coinsContainer}>
                <LinearGradient
                  colors={['#FDE047', '#EAB308']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.coinIconBg}
                >
                  <MaterialCommunityIcons name="currency-usd" size={12} color="#78350F" />
                </LinearGradient>
                <Text style={styles.currencyText}>{coins}</Text>
              </View>
              <View style={styles.gemsContainer}>
                <LinearGradient
                  colors={['#C084FC', '#9333EA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gemIconBg}
                >
                  <MaterialCommunityIcons name="diamond-stone" size={12} color={COLORS.white} />
                </LinearGradient>
                <Text style={styles.currencyText}>{gems}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* SZAKASZ PROGRESSZIÓ - Jobb felső sarok */}
      <View style={styles.stageProgressContainer}>
        {/* Gyémánt ikon - jobb felső sarok */}
        <LinearGradient
          colors={['#C084FC', '#9333EA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gemIcon}
        >
          <MaterialCommunityIcons name="diamond-stone" size={14} color={COLORS.white} />
        </LinearGradient>

        {/* Node-ok zigzag path */}
        <View style={styles.stagePathContainer}>
          {stageNodes.slice(0, -1).map((node, index, arr) => {
            const isActive = index < progressPosition;
            const isCurrent = index === progressPosition;

            // Connection line
            let connectionLineStyle = {};
            if (index < arr.length - 1) {
              const nextNode = arr[index + 1];
              const deltaX = nextNode.x - node.x;
              const deltaY = nextNode.y - node.y;
              const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
              const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

              connectionLineStyle = {
                position: 'absolute',
                left: node.x + (node.type === 'circle' ? 5 : 4),
                top: node.y + (node.type === 'circle' ? 5 : 4),
                width: length,
                height: 1.5,
                backgroundColor: isActive ? 'rgba(220, 38, 38, 0.6)' : 'rgba(71, 85, 105, 0.3)',
                transform: [{ rotate: `${angle}deg` }],
              };
            }

            return (
              <View key={index}>
                {/* Kapcsolat vonal */}
                {index < arr.length - 1 && (
                  <View style={connectionLineStyle as any} />
                )}

                {/* Node megjelenítése */}
                {node.type === 'circle' ? (
                  <View
                    style={[
                      isCurrent ? styles.nodeCurrentCircle : (isActive ? styles.nodeActiveCircle : styles.nodeInactiveCircle),
                      { left: node.x, top: node.y }
                    ]}
                  />
                ) : isCurrent ? (
                  <View
                    style={[
                      styles.nodeCurrent,
                      { left: node.x, top: node.y }
                    ]}
                  />
                ) : (
                  <View
                    style={[
                      isActive ? styles.nodeActive : styles.nodeInactive,
                      { left: node.x, top: node.y }
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>

        {/* Szakasz információ - node-ok alatt */}
        <View style={styles.stageInfoRow}>
          <View style={[
            styles.difficultyBadge,
            {
              backgroundColor: getDifficultyBackgroundColor(),
              borderColor: getDifficultyBorderColor(),
            }
          ]}>
            <Text style={[styles.difficultyText, { color: getDifficultyTextColor() }]}>
              Nehézség
            </Text>
          </View>
          <Text style={styles.stageText}>
            Szakasz {currentStageInSection}/6
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    paddingHorizontal: SPACING.base,
    paddingTop: 48,
    paddingBottom: SPACING.sm,
    zIndex: 100,
  },
  playerInfoContainer: {
    width: 'auto',
    maxWidth: 225,
    marginBottom: SPACING.sm,
    zIndex: 100,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radiusLG,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    padding: SPACING.sm,
    ...SHADOWS.large,
  },
  avatarButton: {
    position: 'relative',
    zIndex: 100,
  },
  avatarButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  avatarWithImage: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radiusLG,
    borderWidth: 2,
    borderColor: 'rgba(34, 211, 238, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9333EA',
  },
  avatarWithoutImage: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radiusLG,
    borderWidth: 2,
    borderColor: 'rgba(100, 116, 139, 0.5)',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 30,
  },
  avatarPlaceholder: {
    fontSize: 30,
    color: COLORS.gray400,
  },
  avatarGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: SIZES.radiusLG,
    opacity: 0.2,
    zIndex: -10,
  },
  infoSection: {
    flex: 1,
    marginLeft: 10,
    minWidth: 140,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  levelText: {
    color: '#22D3EE',
    fontSize: SIZES.fontSM,
    fontWeight: FONT_WEIGHT.semibold,
    marginRight: SPACING.sm,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
  },
  progressBarFill: {
    height: '100%',
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  coinIconBg: {
    width: 20,
    height: 20,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(202, 138, 4, 0.2)',
    marginRight: 4,
  },
  gemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gemIconBg: {
    width: 20,
    height: 20,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(126, 34, 206, 0.2)',
    marginRight: 4,
  },
  currencyText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.medium,
  },
  stageProgressContainer: {
    position: 'absolute',
    right: SPACING.base,
    top: SPACING.md,
    zIndex: 40,
    alignItems: 'flex-end',
  },
  gemIcon: {
    width: 28,
    height: 28,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(126, 34, 206, 0.3)',
    marginBottom: SPACING.xs,
  },
  stagePathContainer: {
    position: 'relative',
    width: 140,
    height: 45,
    marginBottom: SPACING.xs,
  },
  nodeCurrent: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  nodeCurrentCircle: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radiusFull,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  nodeActive: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#DC2626',
    borderWidth: 1,
    borderColor: 'rgba(127, 29, 29, 0.5)',
    borderRadius: 1.5,
  },
  nodeActiveCircle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#DC2626',
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(127, 29, 29, 0.5)',
  },
  nodeInactive: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
    borderRadius: 1.5,
  },
  nodeInactiveCircle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: 'rgba(51, 65, 85, 0.7)',
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
  },
  stageInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 140,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: SIZES.radiusXS,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.medium,
  },
  stageText: {
    color: COLORS.white,
    fontSize: SIZES.fontXS,
    fontWeight: FONT_WEIGHT.medium,
  },
});
