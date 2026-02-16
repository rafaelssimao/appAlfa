import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av';
import { HomeScreen } from './src/presentation/screens/HomeScreen';

export default function App() {
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <HomeScreen />
    </>
  );
}
