import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { GameProvider } from '@/context/GameContext';
import { AuthProvider } from '@/context/AuthContext';
import RootLayoutContent from '@/components/RootLayoutContent';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <GameProvider>
        <RootLayoutContent />
        <StatusBar style="auto" />
      </GameProvider>
    </AuthProvider>
  );
}
