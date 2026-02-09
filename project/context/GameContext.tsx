import React, { createContext, useContext, useEffect, useState } from 'react';
import { City, UserProgress } from '@/types';
import { supabase } from '@/lib/supabase';

type GameContextType = {
  cities: City[];
  userProgress: UserProgress | null;
  currentCity: City | null;
  currentCityIndex: number;
  hintsRevealed: number;
  selectedAnswer: string | null;
  isLoading: boolean;
  isGameOver: boolean;
  streak: number;
  totalPoints: number;
  setCurrentCityIndex: (index: number) => void;
  setSelectedAnswer: (answer: string | null) => void;
  setHintsRevealed: (count: number) => void;
  recordCorrectAnswer: (hintsUsed: number) => void;
  resetGame: () => void;
  loadCities: () => Promise<void>;
  loadUserProgress: () => Promise<void>;
  nextCity: () => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<City[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentCity = cities[currentCityIndex] || null;

  useEffect(() => {
    loadCities();
    loadUserProgress();
  }, []);

  const loadCities = async () => {
    try {
      const { data, error } = await supabase.from('cities').select('*');
      if (error) throw error;
      setCities(data || []);
    } catch (err) {
      console.error('Failed to load cities:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        const newProgress: Omit<UserProgress, 'id' | 'created_at' | 'updated_at'> = {
          user_id: user.id,
          completed_cities: [],
          current_streak: 0,
          total_points: 0,
          collection_count: 0,
        };
        const { data: created } = await supabase.from('user_progress').insert([newProgress]).select().single();
        setUserProgress(created);
      } else {
        setUserProgress(data);
      }
    } catch (err) {
      console.error('Failed to load user progress:', err);
    }
  };

  const recordCorrectAnswer = async (hintsUsed: number) => {
    if (!userProgress || !currentCity) return;

    const points = Math.max(10 - hintsUsed * 2, 1);
    const updatedCities = [...new Set([...userProgress.completed_cities, currentCity.id])];
    const newProgress: Partial<UserProgress> = {
      completed_cities: updatedCities,
      total_points: userProgress.total_points + points,
      collection_count: updatedCities.length,
      current_streak: userProgress.current_streak + 1,
    };

    try {
      const { data } = await supabase
        .from('user_progress')
        .update(newProgress)
        .eq('user_id', userProgress.user_id)
        .select()
        .single();

      if (data) setUserProgress(data);
    } catch (err) {
      console.error('Failed to record answer:', err);
    }
  };

  const nextCity = () => {
    if (currentCityIndex < cities.length - 1) {
      setCurrentCityIndex(currentCityIndex + 1);
      setSelectedAnswer(null);
      setHintsRevealed(0);
    } else {
      setIsGameOver(true);
    }
  };

  const resetGame = () => {
    setCurrentCityIndex(0);
    setSelectedAnswer(null);
    setHintsRevealed(0);
    setIsGameOver(false);
  };

  const value: GameContextType = {
    cities,
    userProgress,
    currentCity,
    currentCityIndex,
    hintsRevealed,
    selectedAnswer,
    isLoading,
    isGameOver,
    streak: userProgress?.current_streak || 0,
    totalPoints: userProgress?.total_points || 0,
    setCurrentCityIndex,
    setSelectedAnswer,
    setHintsRevealed,
    recordCorrectAnswer,
    resetGame,
    loadCities,
    loadUserProgress,
    nextCity,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
