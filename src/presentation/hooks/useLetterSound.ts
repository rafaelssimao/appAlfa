import { useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { LETTER_SOUNDS } from '../../data/letterSounds';
import { DEFAULT_LETTER_SOUND_URI } from '../../core/constants/sound';

/**
 * Hook para tocar o som da letra ao ser clicada.
 * Usa o arquivo .m4a local da letra quando existir; senão, som padrão (fallback).
 */
export function useLetterSound() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const currentLetterIdRef = useRef<string | null>(null);

  const playLetterSound = useCallback(async (letterId?: string) => {
    try {
      const source = letterId && LETTER_SOUNDS[letterId] != null
        ? LETTER_SOUNDS[letterId]
        : null;

      if (source !== null) {
        // Som local da letra
        if (soundRef.current && currentLetterIdRef.current === letterId) {
          await soundRef.current.replayAsync();
          return;
        }
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
          currentLetterIdRef.current = null;
        }
        const { sound } = await Audio.Sound.createAsync(
          source,
          { shouldPlay: true }
        );
        soundRef.current = sound;
        currentLetterIdRef.current = letterId ?? null;
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync().catch(() => {});
            soundRef.current = null;
            currentLetterIdRef.current = null;
          }
        });
      } else {
        // Fallback: som genérico (rede)
        if (soundRef.current) {
          await soundRef.current.replayAsync();
          return;
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri: DEFAULT_LETTER_SOUND_URI },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        currentLetterIdRef.current = null;
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync().catch(() => {});
            soundRef.current = null;
          }
        });
      }
    } catch {
      // Silencioso se falhar
    }
  }, []);

  return { playLetterSound };
}
