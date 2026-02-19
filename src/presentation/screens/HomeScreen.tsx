import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LetterTile } from '../components/LetterTile';
import { LetterModal } from '../components/LetterModal';
import { useCharacterSettingsContext } from '../context/CharacterSettingsContext';
import { LETTERS } from '../../data/letters';
import { colors, spacing, typography } from '../../core/theme';
import type { LetterItem } from '../../core/types/letter';
import type { Character } from '../../data/characters';

const TILE_GAP = 8;
const MIN_TILE_SIZE = 36;
const MAX_TILE_SIZE = 56;

interface HomeScreenProps {
  selectedCharacter: Character;
  onBackToMenu: () => void;
}

export function HomeScreen({ selectedCharacter, onBackToMenu }: HomeScreenProps) {
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { width, height } = useWindowDimensions();
  const { getSettings } = useCharacterSettingsContext();
  const characterSettings = getSettings(selectedCharacter.id);

  const isLandscape = width > height;

  const { containerStyle, panelCharacterStyle, panelLettersStyle, cols, tileSize, tileStyle } =
    useMemo(() => {
      if (isLandscape) {
        const panelLettersWidth = width * 0.6;
        const cols = 4;
        const size = Math.min(
          MAX_TILE_SIZE,
          Math.max(
            MIN_TILE_SIZE,
            Math.floor((panelLettersWidth - spacing.md * 2 - (cols - 1) * TILE_GAP) / cols)
          )
        );
        return {
          containerStyle: styles.containerRow,
          panelCharacterStyle: styles.panelCharacterLandscape,
          panelLettersStyle: styles.panelLetters,
          cols,
          tileSize: size,
          tileStyle: {
            width: size,
            height: size,
            marginRight: TILE_GAP,
            marginBottom: TILE_GAP,
          },
        };
      }
      const cols = 4;
      const contentWidth = width - spacing.md * 2;
      const size = Math.min(
        MAX_TILE_SIZE,
        Math.max(
          MIN_TILE_SIZE,
          Math.floor((contentWidth - (cols - 1) * TILE_GAP) / cols)
        )
      );
      return {
        containerStyle: styles.containerColumn,
        panelCharacterStyle: styles.panelCharacterPortrait,
        panelLettersStyle: styles.panelLetters,
        cols,
        tileSize: size,
        tileStyle: {
          width: size,
          height: size,
          marginRight: TILE_GAP,
          marginBottom: TILE_GAP,
        },
      };
    }, [width, height, isLandscape]);

  const handleLetterPress = useCallback((item: LetterItem) => {
    setSelectedLetter(item);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setSelectedLetter(null);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={containerStyle}>
        <View style={panelCharacterStyle}>
          <Text style={styles.panelLabel}>Seu narrador</Text>
          <View style={styles.characterBox}>
            {characterSettings.photoUri ? (
              <Image
                source={{ uri: characterSettings.photoUri }}
                style={[
                  styles.characterPhoto,
                  isLandscape && styles.characterPhotoLandscape,
                ]}
              />
            ) : (
              <Text style={[styles.characterEmoji, isLandscape && styles.characterEmojiLandscape]}>
                {selectedCharacter.emoji}
              </Text>
            )}
            <Text style={styles.characterName}>{selectedCharacter.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBackToMenu}
            activeOpacity={0.8}
            accessibilityLabel="Voltar ao menu e trocar de personagem"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>Trocar personagem</Text>
          </TouchableOpacity>
        </View>

        <View style={panelLettersStyle}>
          <Text style={styles.title}>Tralalelu!</Text>
          <Text style={styles.subtitle}>Toque numa letra</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {LETTERS.map((item, index) => (
                <LetterTile
                  key={item.id}
                  letter={item.letter}
                  onPress={() => handleLetterPress(item)}
                  style={[
                    tileStyle,
                    (index + 1) % cols === 0 ? { marginRight: 0 } : undefined,
                  ]}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <LetterModal
        visible={modalVisible}
        letterItem={selectedLetter}
        selectedCharacter={selectedCharacter}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerRow: {
    flex: 1,
    flexDirection: 'row',
  },
  containerColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  panelCharacterLandscape: {
    width: '32%',
    minWidth: 100,
    maxWidth: 180,
    backgroundColor: colors.surface,
    borderRightWidth: 2,
    borderRightColor: colors.letterTileBorder,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  panelCharacterPortrait: {
    width: '100%',
    backgroundColor: colors.surface,
    borderBottomWidth: 2,
    borderBottomColor: colors.letterTileBorder,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panelLabel: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  characterBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterEmoji: {
    fontSize: 48,
    marginBottom: spacing.xs,
  },
  characterEmojiLandscape: {
    fontSize: 64,
  },
  characterPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: spacing.xs,
  },
  characterPhotoLandscape: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  characterName: {
    ...typography.subtitle,
    color: colors.text,
  },
  backButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 16,
    backgroundColor: colors.letterTileBorder,
  },
  backButtonText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  panelLetters: {
    flex: 1,
    paddingHorizontal: spacing.md,
    minHeight: 0,
  },
  title: {
    ...typography.title,
    color: colors.primary,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
