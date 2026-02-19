import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { copyAsync } from 'expo-file-system/legacy';
import { colors, spacing, typography } from '../../core/theme';

const PREVIEW_SIZE = 320;

export interface FilteredPhotoPreviewProps {
  visible: boolean;
  imageUri: string;
  /** Retorna o caminho onde salvar (chamado na hora de salvar; use path único para evitar cache). */
  getDestPath: () => string;
  /** Garante o diretório de destino antes de salvar (ex.: ensureCharacterDir(characterId)) */
  ensureDestDir?: () => Promise<void>;
  onSaved: (path: string) => void;
  onCancel: () => void;
}

/**
 * Modal de preview da foto. Ao clicar em "Usar esta foto", substitui a imagem do personagem
 * em destPath e notifica onSaved, para a foto aparecer em todos os pontos do app.
 */
function FilteredPhotoPreviewContent({
  visible,
  imageUri,
  getDestPath,
  ensureDestDir,
  onSaved,
  onCancel,
}: FilteredPhotoPreviewProps) {
  const [saving, setSaving] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    if (!visible) savedRef.current = false;
  }, [visible]);

  const savePhoto = useCallback(async () => {
    if (ensureDestDir) await ensureDestDir();
    const destPath = getDestPath();
    const { uri } = await ImageManipulator.manipulateAsync(imageUri, [], {
      compress: 0.9,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    await copyAsync({ from: uri, to: destPath });
    onSaved(destPath);
  }, [imageUri, getDestPath, ensureDestDir, onSaved]);

  const handleUsePhoto = useCallback(async () => {
    if (!imageUri || saving || savedRef.current) return;
    setSaving(true);
    try {
      await savePhoto();
      savedRef.current = true;
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    } finally {
      setSaving(false);
    }
  }, [imageUri, saving, savePhoto]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Preview da foto</Text>
          <View style={styles.imageWrap}>
            {imageUri ? (
              <Image
                key={imageUri}
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : null}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.btn, styles.btnCancel]}
              onPress={onCancel}
              disabled={saving}
            >
              <Text style={styles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, styles.btnUse]}
              onPress={handleUsePhoto}
              disabled={saving || !imageUri}
            >
              {saving ? (
                <ActivityIndicator size="small" color={colors.surface} />
              ) : (
                <Text style={styles.btnUseText}>Usar esta foto</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function FilteredPhotoPreview(props: FilteredPhotoPreviewProps) {
  return <FilteredPhotoPreviewContent {...props} />;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  box: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    maxWidth: '100%',
  },
  title: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.md,
  },
  imageWrap: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.letterTileBorder,
  },
  previewImage: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  btn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  btnCancel: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.letterTileBorder,
  },
  btnCancelText: {
    ...typography.caption,
    color: colors.text,
  },
  btnUse: {
    backgroundColor: colors.primary,
  },
  btnUseText: {
    ...typography.caption,
    color: colors.surface,
    fontWeight: '600',
  },
});
