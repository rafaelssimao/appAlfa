import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { CHARACTERS } from '../../data/characters';
import type { Character } from '../../data/characters';
import { colors, spacing, typography } from '../../core/theme';

interface CharactersScreenProps {
  onStart: (character: Character) => void;
}

export function CharactersScreen({ onStart }: CharactersScreenProps) {
  const [selected, setSelected] = useState<Character | null>(null);
  const { width } = useWindowDimensions();
  const isLandscape = width > 400;
  const cardSize = isLandscape ? Math.min(110, (width - spacing.lg * 2) / 4 - spacing.sm) : 100;

  const handleSelect = useCallback((char: Character) => {
    setSelected(char);
  }, []);

  const handleStart = useCallback(() => {
    if (selected) onStart(selected);
  }, [selected, onStart]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tralalelu!</Text>
        <Text style={styles.subtitle}>Escolha quem vai narrar as letras</Text>

        <View style={styles.grid}>
          {CHARACTERS.map((char) => {
            const isSelected = selected?.id === char.id;
            return (
              <TouchableOpacity
                key={char.id}
                style={[styles.card, { width: cardSize }, isSelected && styles.cardSelected]}
                onPress={() => handleSelect(char)}
                activeOpacity={0.8}
                accessibilityLabel={`Selecionar ${char.name}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Text style={styles.emoji}>{char.emoji}</Text>
                <Text style={styles.name}>{char.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.button, !selected && styles.buttonDisabled]}
          onPress={handleStart}
          disabled={!selected}
          activeOpacity={0.8}
          accessibilityLabel="Começar a brincar com as letras"
          accessibilityRole="button"
          accessibilityState={{ disabled: !selected }}
        >
          <Text style={styles.buttonText}>Vamos lá!</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.letterTileBorder,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardSelected: {
    borderColor: colors.primary,
    borderWidth: 4,
    backgroundColor: colors.letterTileBorder,
  },
  emoji: {
    fontSize: 40,
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.title,
    fontSize: 22,
    color: colors.surface,
  },
});
