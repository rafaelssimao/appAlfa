import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Platform,
  StyleProp,
} from 'react-native';
import { colors, spacing, typography } from '../../core/theme';

interface LetterTileProps {
  letter: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function LetterTile({ letter, onPress, style }: LetterTileProps) {
  return (
    <TouchableOpacity
      style={[styles.tile, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Letra ${letter}. Toque para ouvir o som.`}
      accessibilityRole="button"
    >
      <Text style={styles.letter}>{letter}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.letterTile,
    borderWidth: 3,
    borderColor: colors.letterTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  letter: {
    ...typography.letterTile,
    color: colors.primary,
  },
});
