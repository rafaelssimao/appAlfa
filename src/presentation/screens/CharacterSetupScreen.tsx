import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { copyAsync, deleteAsync, cacheDirectory, documentDirectory } from 'expo-file-system/legacy';
import { useCharacterSettingsContext } from '../context/CharacterSettingsContext';
import {
  ensureCharacterDir,
  getCharacterPhotoPath,
  getCharacterPhotoPathWithTimestamp,
  getCharacterLetterSoundPath,
} from '../../data/characterStoragePaths';
import { LETTERS } from '../../data/letters';
import { FilteredPhotoPreview } from '../components/FilteredPhotoPreview';
import { colors, spacing, typography } from '../../core/theme';
import type { Character } from '../../data/characters';

interface CharacterSetupScreenProps {
  character: Character;
  onComplete: () => void;
}

export function CharacterSetupScreen({ character, onComplete }: CharacterSetupScreenProps) {
  const { getSettings, updateCharacter } = useCharacterSettingsContext();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [letterSounds, setLetterSounds] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [recordingLetter, setRecordingLetter] = useState<string | null>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const recordingRef = React.useRef<Audio.Recording | null>(null);

  const settings = getSettings(character.id);

  useEffect(() => {
    setPhotoUri(settings.photoUri);
    setLetterSounds(settings.letterSounds ?? {});
  }, [character.id, settings.photoUri, settings.letterSounds]);

  const takePhoto = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão', 'Precisamos da câmera para tirar a foto.');
        return;
      }
      setLoading(true);
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) {
        setLoading(false);
        return;
      }
      const sourceUri = result.assets[0].uri;
      await ensureCharacterDir(character.id);
      const baseDir = cacheDirectory ?? documentDirectory ?? '';
      let uriParaPreview = sourceUri;
      if (baseDir) {
        const previewPath = `${baseDir}character_photo_preview_${Date.now()}.jpg`;
        try {
          await copyAsync({ from: sourceUri, to: previewPath });
          uriParaPreview = previewPath;
        } catch {
          uriParaPreview = sourceUri;
        }
      }
      setPreviewUri(uriParaPreview);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    } finally {
      setLoading(false);
    }
  }, [character.id]);

  const handlePhotoSaved = useCallback(
    async (path: string) => {
      try {
        if (photoUri && photoUri !== path) {
          await deleteAsync(photoUri, { idempotent: true });
        }
        await updateCharacter(character.id, { photoUri: path });
        setPhotoUri(path);
        setPreviewUri(null);
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível salvar a foto. Tente novamente.');
      }
    },
    [character.id, photoUri, updateCharacter]
  );

  const startRecording = useCallback(
    async (letterId: string) => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão', 'Precisamos do microfone para gravar.');
          return;
        }
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        setRecordingLetter(letterId);
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        recordingRef.current = recording;
      } catch (e) {
        setRecordingLetter(null);
        Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
      }
    },
    []
  );

  const stopRecording = useCallback(
    async (letterId: string) => {
      const rec = recordingRef.current;
      if (!rec) return;
      try {
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI();
        recordingRef.current = null;
        setRecordingLetter(null);
        if (!uri) return;
        await ensureCharacterDir(character.id);
        const destPath = getCharacterLetterSoundPath(character.id, letterId);
        await copyAsync({ from: uri, to: destPath });
        const next = { ...letterSounds, [letterId]: destPath };
        await updateCharacter(character.id, { letterSounds: next });
        setLetterSounds(next);
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível salvar o áudio.');
      }
    },
    [character.id, letterSounds, updateCharacter]
  );

  const handleLetterRecord = useCallback(
    async (letterId: string) => {
      if (recordingLetter === letterId) {
        await stopRecording(letterId);
      } else if (recordingLetter) {
        await stopRecording(recordingLetter);
        await startRecording(letterId);
      } else {
        await startRecording(letterId);
      }
    },
    [recordingLetter, startRecording, stopRecording]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Cadastro: {character.name}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foto do rosto</Text>
          <TouchableOpacity
            style={styles.photoBox}
            onPress={takePhoto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="large" color={colors.primary} />
            ) : photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <>
                <Text style={styles.photoPlaceholder}>{character.emoji}</Text>
                <Text style={styles.photoHint}>Toque para tirar a foto</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sons das letras (voz do personagem)</Text>
          <Text style={styles.sectionHint}>
            Toque em uma letra para gravar. Toque de novo para parar.
          </Text>
          <View style={styles.lettersRow}>
            {LETTERS.map((item) => {
              const hasSound = !!letterSounds[item.id];
              const isRecording = recordingLetter === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.letterRecordBtn,
                    hasSound && styles.letterRecordBtnDone,
                    isRecording && styles.letterRecordBtnRecording,
                  ]}
                  onPress={() => handleLetterRecord(item.id)}
                >
                  <Text style={styles.letterRecordText}>{item.letter}</Text>
                  {hasSound && <Text style={styles.check}>✓</Text>}
                  {isRecording && <Text style={styles.recDot}>●</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Vamos lá!</Text>
        </TouchableOpacity>
      </ScrollView>

      <FilteredPhotoPreview
        visible={!!previewUri}
        imageUri={previewUri ?? ''}
        getDestPath={() => getCharacterPhotoPathWithTimestamp(character.id)}
        ensureDestDir={() => ensureCharacterDir(character.id).then(() => undefined)}
        onSaved={handlePhotoSaved}
        onCancel={() => setPreviewUri(null)}
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
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  photoBox: {
    width: 160,
    height: 160,
    alignSelf: 'center',
    borderRadius: 80,
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.letterTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    fontSize: 56,
    marginBottom: spacing.xs,
  },
  photoHint: {
    ...typography.caption,
    color: colors.textLight,
  },
  lettersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  letterRecordBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.letterTileBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterRecordBtnDone: {
    borderColor: colors.success,
    backgroundColor: colors.success + '20',
  },
  letterRecordBtnRecording: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '30',
  },
  letterRecordText: {
    ...typography.letterTile,
    color: colors.text,
    fontSize: 18,
  },
  check: {
    position: 'absolute',
    right: 2,
    top: 0,
    fontSize: 12,
    color: colors.success,
  },
  recDot: {
    position: 'absolute',
    right: 2,
    top: 0,
    fontSize: 10,
    color: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl * 2,
    borderRadius: 24,
    alignSelf: 'center',
    marginTop: spacing.lg,
  },
  buttonText: {
    ...typography.title,
    fontSize: 22,
    color: colors.surface,
  },
});
