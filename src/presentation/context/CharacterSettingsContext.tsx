import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  loadCharacterSettings,
  saveCharacterSettings,
  type CharacterSettingsMap,
  type CharacterSettingsData,
} from '../../data/characterSettings';

interface CharacterSettingsContextValue {
  settingsMap: CharacterSettingsMap;
  getSettings: (characterId: string) => CharacterSettingsData;
  updateCharacter: (
    characterId: string,
    data: Partial<CharacterSettingsData>
  ) => Promise<void>;
  refresh: () => Promise<void>;
}

const CharacterSettingsContext = createContext<CharacterSettingsContextValue | null>(
  null
);

export function CharacterSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settingsMap, setSettingsMap] = useState<CharacterSettingsMap>({});

  const refresh = useCallback(async () => {
    const map = await loadCharacterSettings();
    setSettingsMap(map);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getSettings = useCallback(
    (characterId: string): CharacterSettingsData => {
      return (
        settingsMap[characterId] ?? {
          photoUri: null,
          letterSounds: {},
        }
      );
    },
    [settingsMap]
  );

  const updateCharacter = useCallback(
    async (characterId: string, data: Partial<CharacterSettingsData>) => {
      await saveCharacterSettings(characterId, data);
      await refresh();
    },
    [refresh]
  );

  return (
    <CharacterSettingsContext.Provider
      value={{ settingsMap, getSettings, updateCharacter, refresh }}
    >
      {children}
    </CharacterSettingsContext.Provider>
  );
}

export function useCharacterSettingsContext() {
  const ctx = useContext(CharacterSettingsContext);
  if (!ctx) throw new Error('useCharacterSettingsContext must be used within CharacterSettingsProvider');
  return ctx;
}
