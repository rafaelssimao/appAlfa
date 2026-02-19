import { useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { getLetterSoundForCharacter } from '../../data/letterSounds';
import { DEFAULT_LETTER_SOUND_URI } from '../../core/constants/sound';

/**
 * Toca o som da letra na voz do personagem selecionado.
 * Evita condição de corrida ao trocar de letra rápido e faz fallback se o arquivo falhar.
 */
export function useLetterSound() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentKeyRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  const playLetterSound = useCallback(
    async (characterId: string | undefined, letterId?: string) => {
      if (!letterId) return;

      const key =
        characterId && letterId ? `${characterId}:${letterId}` : letterId;
      const source =
        characterId && letterId
          ? getLetterSoundForCharacter(characterId, letterId)
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
            await playSource(source);
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
