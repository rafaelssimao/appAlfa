import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { LetterTile } from '../components/LetterTile';
import { LetterModal } from '../components/LetterModal';
import { LETTERS } from '../../data/letters';
import { colors, spacing, typography } from '../../core/theme';
import type { LetterItem } from '../../core/types/letter';

const COLS = 4;
const TILE_GAP = 10;

export function HomeScreen() {
  const [selectedLetter, setSelectedLetter] = useState<LetterItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { width } = useWindowDimensions();

  const tileSize = Math.min(56, Math.floor((width - spacing.lg * 2 - (COLS - 1) * TILE_GAP) / COLS));
  const tileStyle = { width: tileSize, height: tileSize, marginRight: TILE_GAP, marginBottom: TILE_GAP };

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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tralalelu!</Text>
        <Text style={styles.subtitle}>Toque numa letra e divirta-se</Text>

        <View style={styles.grid}>
          {LETTERS.map((item, index) => (
            <LetterTile
              key={item.id}
              letter={item.letter}
              onPress={() => handleLetterPress(item)}
              style={[
                tileStyle,
                (index + 1) % COLS === 0 ? { marginRight: 0 } : undefined,
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <LetterModal
        visible={modalVisible}
        letterItem={selectedLetter}
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
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
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
  },
});
