import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../utils/styleConstants';

export default function BookViewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Book View Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgWhite,
  },
  text: {
    fontSize: SIZES.font2XL,
    color: COLORS.gray900,
  },
});
