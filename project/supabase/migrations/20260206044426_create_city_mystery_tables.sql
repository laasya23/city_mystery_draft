/*
  # City Mystery Game Schema

  1. New Tables
    - `cities` - Core city data for the game
      - `id` (uuid, primary key)
      - `name` (text)
      - `country` (text)
      - `continent` (text)
      - `hints` (jsonb array of 3 hints)
      - `choices` (jsonb array of 4 answer choices)
      - `image_url` (text for blurred city image)
      - `difficulty_level` (integer 1-3)
      - `created_at` (timestamp)
    
    - `user_progress` - Tracks user game progress
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `completed_cities` (jsonb array of city IDs)
      - `current_streak` (integer)
      - `total_points` (integer)
      - `last_played_date` (date)
      - `collection_count` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `daily_challenges` - Daily featured city
      - `id` (uuid, primary key)
      - `city_id` (uuid, foreign key to cities)
      - `challenge_date` (date)
      - `created_at` (timestamp)
    
    - `user_achievements` - Track user achievements
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `achievement_type` (text)
      - `progress` (integer)
      - `unlocked` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Users can only read/update their own progress
    - Cities table is public read-only
    - Daily challenges are public read-only
*/

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  continent text NOT NULL,
  hints jsonb NOT NULL DEFAULT '[]'::jsonb,
  choices jsonb NOT NULL DEFAULT '[]'::jsonb,
  image_url text,
  difficulty_level integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_cities jsonb NOT NULL DEFAULT '[]'::jsonb,
  current_streak integer DEFAULT 0,
  total_points integer DEFAULT 0,
  last_played_date date,
  collection_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  challenge_date date NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  progress integer DEFAULT 0,
  unlocked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_type)
);

-- Enable RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for cities (public read-only)
CREATE POLICY "Cities are readable by everyone"
  ON cities FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for user_progress
CREATE POLICY "Users can read own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for daily_challenges (public read-only)
CREATE POLICY "Daily challenges are readable by everyone"
  ON daily_challenges FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create policies for user_achievements
CREATE POLICY "Users can read own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements"
  ON user_achievements FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_cities_difficulty ON cities(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
