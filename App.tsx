import React, { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import * as NavigationBar from 'expo-navigation-bar';
import { CharactersScreen, HomeScreen } from './src/presentation/screens';
import type { Character } from './src/data/characters';

export default function App() {
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

  return (
    <>
      <StatusBar style="dark" />
      {selectedCharacter === null ? (
        <CharactersScreen
          onStart={(character) => setSelectedCharacter(character)}
        />
      ) : (
        <HomeScreen selectedCharacter={selectedCharacter} />
      )}
    </>
  );
}
