import React, { useEffect } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';
import { colors, spacing, typography } from '../../core/theme';
import type { LetterItem } from '../../core/types/letter';
import type { Character } from '../../data/characters';
import { useLetterSound } from '../hooks/useLetterSound';

interface LetterModalProps {
  visible: boolean;
  letterItem: LetterItem | null;
  selectedCharacter: Character;
  onClose: () => void;
}

const MENSAGENS_ENGAJAMENTO = [
  'Oba! Que letra linda!',
  'Tralalá! Muito bem!',
  'Isso aí, campeão(ã)!',
  'Eba! Você é demais!',
  'Tralalelu! Aprender é bom!',
];

function mensagemAleatoria() {
  return MENSAGENS_ENGAJAMENTO[
    Math.floor(Math.random() * MENSAGENS_ENGAJAMENTO.length)
  ];
}

export function LetterModal({
  visible,
  letterItem,
  selectedCharacter,
  onClose,
}: LetterModalProps) {
  const { playLetterSound } = useLetterSound();
  const [mensagem, setMensagem] = React.useState('');
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const cardMaxWidth = Math.min(340, (isLandscape ? height : width) - spacing.lg * 2);

  useEffect(() => {
    if (visible && letterItem) {
      setMensagem(mensagemAleatoria());
      playLetterSound(selectedCharacter.id, letterItem.id).catch(() => {});
    }
  }, [visible, letterItem?.id, selectedCharacter.id]);

  const handleTapLetter = () => {
    if (letterItem) {
      playLetterSound(selectedCharacter.id, letterItem.id).catch(() => {});
    }
    setMensagem(mensagemAleatoria());
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.card, { maxWidth: cardMaxWidth }]}
          onPress={(e) => e.stopPropagation()}
        >
          {letterItem ? (
            <>
              <View style={styles.narratorRow}>
                <Text style={styles.narratorEmoji}>{selectedCharacter.emoji}</Text>
                <Text style={styles.narratorName}>{selectedCharacter.name}</Text>
              </View>
              <Text style={styles.mensagem}>{mensagem || 'Oba! Que letra linda!'}</Text>

              <TouchableOpacity
                style={styles.letterContainer}
                onPress={handleTapLetter}
                activeOpacity={0.9}
                accessibilityLabel={`Letra ${letterItem.letter}. Toque para ouvir o som novamente.`}
                accessibilityRole="button"
              >
                <Text style={styles.letter}>{letterItem.letter}</Text>
              </TouchableOpacity>

              <Text style={styles.animalEmoji}>{letterItem.emoji}</Text>
              <Text style={styles.animalName}>
                {letterItem.letter} de {letterItem.animalName}
              </Text>
              <Text style={styles.tapHint}>Toque na letra para ouvir de novo!</Text>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                accessibilityLabel="Fechar"
                accessibilityRole="button"
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: spacing.xl,
    alignItems: 'center',
    maxWidth: 340,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  narratorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  narratorEmoji: {
    fontSize: 28,
    marginRight: spacing.xs,
  },
  narratorName: {
    ...typography.caption,
    color: colors.textLight,
  },
  mensagem: {
    ...typography.subtitle,
    color: colors.secondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  letterContainer: {
    width: 120,
    height: 120,
    borderRadius: 24,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 4,
    borderColor: colors.orange,
  },
  letter: {
    ...typography.letterBig,
    color: colors.primaryDark,
  },
  animalEmoji: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  animalName: {
    ...typography.animalName,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tapHint: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.lg,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 20,
  },
  closeButtonText: {
    ...typography.subtitle,
    color: colors.surface,
  },
});
