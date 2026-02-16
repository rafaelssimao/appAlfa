import React, { useEffect } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { colors, spacing, typography } from '../../core/theme';
import type { LetterItem } from '../../core/types/letter';
import { useLetterSound } from '../hooks/useLetterSound';

interface LetterModalProps {
  visible: boolean;
  letterItem: LetterItem | null;
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

export function LetterModal({ visible, letterItem, onClose }: LetterModalProps) {
  const { playLetterSound } = useLetterSound();
  const [mensagem, setMensagem] = React.useState('');

  useEffect(() => {
    if (visible && letterItem) {
      setMensagem(mensagemAleatoria());
      playLetterSound(letterItem.id).catch(() => {});
    }
  }, [visible, letterItem?.id]);

  const handleTapLetter = () => {
    if (letterItem) {
      playLetterSound(letterItem.id).catch(() => {});
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
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {letterItem ? (
            <>
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
