export type City = {
  id: string;
  name: string;
  country: string;
  continent: string;
  hints: string[];
  choices: string[];
  image_url?: string;
  difficulty_level: number;
  created_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  completed_cities: string[];
  current_streak: number;
  total_points: number;
  last_played_date?: string;
  collection_count: number;
  created_at: string;
  updated_at: string;
};

export type Achievement = {
  id: string;
  user_id: string;
  achievement_type: string;
  progress: number;
  unlocked: boolean;
  created_at: string;
};

export type GameState = {
  currentCityIndex: number;
  currentCity: City | null;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  hintsRevealed: number;
  score: number;
  streak: number;
};
