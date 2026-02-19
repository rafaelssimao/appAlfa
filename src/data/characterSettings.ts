/**
 * Tipos para configuração salva de cada personagem (foto + sons das letras).
 */
export interface CharacterLetterSounds {
  [letterId: string]: string; // letterId -> file URI
}

export interface CharacterSettingsData {
  photoUri: string | null;
  letterSounds: CharacterLetterSounds;
}

export type CharacterSettingsMap = Record<string, CharacterSettingsData>;

const STORAGE_KEY = '@alfa/character_settings';

const defaultSettings = (): CharacterSettingsData => ({
  photoUri: null,
  letterSounds: {},
});

/** Carrega todas as configurações de personagens do AsyncStorage. */
export async function loadCharacterSettings(): Promise<CharacterSettingsMap> {
  try {
    const { default: AsyncStorage } = await import(
      '@react-native-async-storage/async-storage'
    );
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as CharacterSettingsMap;
    return parsed;
  } catch {
    return {};
  }
}

/** Salva as configurações de um personagem. */
export async function saveCharacterSettings(
  characterId: string,
  data: Partial<CharacterSettingsData>
): Promise<void> {
  const all = await loadCharacterSettings();
  const current = all[characterId] ?? defaultSettings();
  const next: CharacterSettingsData = {
    photoUri: data.photoUri !== undefined ? data.photoUri : current.photoUri,
    letterSounds:
      data.letterSounds !== undefined ? data.letterSounds : current.letterSounds,
  };
  all[characterId] = next;
  const { default: AsyncStorage } = await import(
    '@react-native-async-storage/async-storage'
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

/** Retorna as configurações de um personagem. */
export async function getCharacterSettings(
  characterId: string
): Promise<CharacterSettingsData> {
  const all = await loadCharacterSettings();
  return all[characterId] ?? defaultSettings();
}
