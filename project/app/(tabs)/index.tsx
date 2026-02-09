import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { useAuth } from '@/context/AuthContext';
import { Flame, Star, LogOut } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { isLoading, streak, totalPoints, cities, userProgress } = useGame();
  const { signOut } = useAuth();

  const handlePlayPress = () => {
    router.push('/game');
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const citiesCompleted = userProgress?.collection_count || 0;
  const totalCities = cities.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>City Mystery</Text>
            <Text style={styles.subtitle}>Guess the city from the clues!</Text>
          </View>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <LogOut size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Flame size={28} color="#ef4444" />
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{streak}</Text>
        </View>

        <View style={styles.statCard}>
          <Star size={28} color="#f59e0b" />
          <Text style={styles.statLabel}>Points</Text>
          <Text style={styles.statValue}>{totalPoints}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Progress</Text>
          <Text style={styles.statValue}>{citiesCompleted}/{totalCities}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(citiesCompleted / totalCities) * 100}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {citiesCompleted} cities discovered
        </Text>
      </View>

      <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
        <Text style={styles.playButtonText}>PLAY NOW</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>How to Play</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>1.</Text>
          <Text style={styles.infoText}>Read the clues about a mystery city</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>2.</Text>
          <Text style={styles.infoText}>Unlock additional hints by watching ads</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>3.</Text>
          <Text style={styles.infoText}>Select your answer from 4 choices</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoBullet}>4.</Text>
          <Text style={styles.infoText}>Build your collection of discovered cities</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  signOutButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  infoBullet: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
    minWidth: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
});
