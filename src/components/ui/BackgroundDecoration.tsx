// ============================================
// BACKGROUND DECORATION
// Háttér kristály dekorációk és gradient
// ============================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export function BackgroundDecoration() {
  return (
    <View style={styles.container}>
      {/* Main gradient overlay */}
      <LinearGradient
        colors={[
          'rgba(139, 92, 246, 0.3)',
          'rgba(168, 85, 247, 0.2)',
          'rgba(15, 23, 42, 0.8)',
          'rgba(88, 28, 135, 0.4)',
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradientOverlay}
      />

      {/* Crystal decorations */}
      {/* Bottom left crystal */}
      <LinearGradient
        colors={['rgba(147, 51, 234, 0.4)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.crystalBottomLeft}
      />

      {/* Bottom right crystal */}
      <LinearGradient
        colors={['rgba(37, 99, 235, 0.3)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.crystalBottomRight}
      />

      {/* Top left crystal */}
      <LinearGradient
        colors={['rgba(168, 85, 247, 0.2)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.crystalTopLeft}
      />

      {/* Top right crystal */}
      <LinearGradient
        colors={['rgba(236, 72, 153, 0.2)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.crystalTopRight}
      />

      {/* Scatter crystals */}
      <LinearGradient
        colors={['rgba(147, 51, 234, 0.5)', 'rgba(168, 85, 247, 0.3)']}
        style={styles.crystalScatter1}
      />

      <LinearGradient
        colors={['rgba(37, 99, 235, 0.4)', 'rgba(59, 130, 246, 0.2)']}
        style={styles.crystalScatter2}
      />

      <LinearGradient
        colors={['rgba(219, 39, 119, 0.4)', 'rgba(236, 72, 153, 0.2)']}
        style={styles.crystalScatter3}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  // Crystal decorations
  crystalBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 128,
    height: 160,
    borderTopRightRadius: 9999,
  },
  crystalBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 160,
    height: 128,
    borderTopLeftRadius: 9999,
  },
  crystalTopLeft: {
    position: 'absolute',
    top: '33%',
    left: '25%',
    width: 96,
    height: 128,
    transform: [{ rotate: '-12deg' }],
  },
  crystalTopRight: {
    position: 'absolute',
    top: '50%',
    right: '33%',
    width: 80,
    height: 112,
    transform: [{ rotate: '12deg' }],
  },
  crystalScatter1: {
    position: 'absolute',
    bottom: 192,
    left: 32,
    width: 64,
    height: 80,
    transform: [{ rotate: '12deg' }],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  crystalScatter2: {
    position: 'absolute',
    bottom: 208,
    left: 80,
    width: 48,
    height: 64,
    transform: [{ rotate: '-6deg' }],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  crystalScatter3: {
    position: 'absolute',
    bottom: 192,
    right: 48,
    width: 80,
    height: 96,
    transform: [{ rotate: '6deg' }],
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
});
