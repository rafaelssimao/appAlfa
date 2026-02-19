import React, { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import * as NavigationBar from 'expo-navigation-bar';
import { CharacterSettingsProvider } from './src/presentation/context/CharacterSettingsContext';
import {
  CharactersScreen,
  CharacterSetupScreen,
  HomeScreen,
} from './src/presentation/screens';
import type { Character } from './src/data/characters';

type Screen = 'characters' | 'setup' | 'home';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('characters');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (isLandscape) {
      NavigationBar.setVisibilityAsync('hidden').catch(() => {});
      NavigationBar.setBehaviorAsync('overlay-swipe').catch(() => {});
    } else {
      NavigationBar.setVisibilityAsync('visible').catch(() => {});
    }
  }, [isLandscape]);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setScreen('setup');
  };

  const handleSetupComplete = () => {
    setScreen('home');
  };

  const handleBackToMenu = () => {
    setScreen('characters');
    setSelectedCharacter(null);
  };

  return (
    <>
      <StatusBar style="dark" />
      {screen === 'characters' && (
        <CharactersScreen onSelectCharacter={handleSelectCharacter} />
      )}
      {screen === 'setup' && selectedCharacter && (
        <CharacterSetupScreen
          character={selectedCharacter}
          onComplete={handleSetupComplete}
        />
      )}
      {screen === 'home' && selectedCharacter && (
        <HomeScreen
          selectedCharacter={selectedCharacter}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CharacterSettingsProvider>
        <AppContent />
      </CharacterSettingsProvider>
    </SafeAreaProvider>
  );
}
