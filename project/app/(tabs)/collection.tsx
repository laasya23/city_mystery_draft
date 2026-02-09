import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useGame } from '@/context/GameContext';

export default function CollectionScreen() {
  const { isLoading, cities, userProgress } = useGame();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const completedCityIds = new Set(userProgress?.completed_cities || []);
  const completedCities = cities.filter((city) => completedCityIds.has(city.id));
  const lockedCount = cities.length - completedCities.length;

  const renderCard = ({ item }: { item: typeof completedCities[0] }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cityName}>{item.name}</Text>
        <Text style={styles.countryName}>{item.country}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>My Collection</Text>
        <Text style={styles.subtitle}>
          {completedCities.length} of {cities.length} cities discovered
        </Text>
      </View>

      {completedCities.length > 0 ? (
        <>
          <FlatList
            data={completedCities}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No cities discovered yet</Text>
          <Text style={styles.emptyText}>Play the game to discover cities and build your collection!</Text>
        </View>
      )}

      {lockedCount > 0 && (
        <View style={styles.lockedSection}>
          <Text style={styles.lockedTitle}>{lockedCount} Cities Locked</Text>
          <Text style={styles.lockedText}>Keep playing to unlock more cities!</Text>
        </View>
      )}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    alignItems: 'center',
  },
  cityName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  countryName: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    maxWidth: '80%',
  },
  lockedSection: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#fcd34d',
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 4,
  },
  lockedText: {
    fontSize: 14,
    color: '#b45309',
  },
});
