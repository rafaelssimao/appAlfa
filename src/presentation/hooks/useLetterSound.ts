import { useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { getLetterSoundForCharacter } from '../../data/letterSounds';
import { DEFAULT_LETTER_SOUND_URI } from '../../core/constants/sound';
import type { CharacterLetterSounds } from '../../data/characterSettings';

/**
 * Toca o som da letra na voz do personagem (bundled ou gravado).
 * customLetterSounds: URIs dos áudios gravados para o personagem.
 */
export function useLetterSound() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentKeyRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  const playLetterSound = useCallback(
    async (
      characterId: string | undefined,
      letterId?: string,
      customLetterSounds?: CharacterLetterSounds
    ) => {
      if (!letterId) return;

      const key =
        characterId && letterId ? `${characterId}:${letterId}` : letterId;
      const customUri = customLetterSounds?.[letterId];
      const bundledSource =
        characterId && letterId && !customUri
          ? getLetterSoundForCharacter(characterId, letterId)
          : undefined;
      const source = customUri
        ? { uri: customUri }
        : bundledSource != null
          ? bundledSource
          : undefined;

      try {
        if (soundRef.current && currentKeyRef.current === key) {
          try {
            await soundRef.current.replayAsync();
          } catch {
            soundRef.current = null;
            currentKeyRef.current = null;
          }
          if (soundRef.current) return;
        }

        if (soundRef.current) {
          try {
            await soundRef.current.unloadAsync();
          } catch {
            /* ignora */
          }
          soundRef.current = null;
          currentKeyRef.current = null;
        }

        const myRequestId = ++requestIdRef.current;

        const playSource = async (src: number | { uri: string }) => {
          const { sound } = await Audio.Sound.createAsync(src, {
            shouldPlay: true,
          });
          if (myRequestId !== requestIdRef.current) {
            sound.unloadAsync().catch(() => {});
            return;
          }
          soundRef.current = sound;
          currentKeyRef.current = key;
          await sound.playAsync();
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync().catch(() => {});
              if (soundRef.current === sound) {
                soundRef.current = null;
                currentKeyRef.current = null;
              }
            }
          });
        };

        if (source != null) {
          try {
            await playSource(source as number | { uri: string });
          } catch {
            if (myRequestId !== requestIdRef.current) return;
            try {
              await playSource({ uri: DEFAULT_LETTER_SOUND_URI });
            } catch {
              /* fallback também falhou */
            }
          }
        } else {
          await playSource({ uri: DEFAULT_LETTER_SOUND_URI });
        }
      } catch {
        /* silencioso */
      }
    },
    []
  );

  return { playLetterSound };
}
