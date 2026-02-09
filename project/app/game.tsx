import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '@/context/GameContext';
import { useState } from 'react';
import { ChevronLeft, Tv2 } from 'lucide-react-native';
import SuccessModal from '@/components/SuccessModal';

export default function GameScreen() {
  const router = useRouter();
  const {
    currentCity,
    currentCityIndex,
    cities,
    hintsRevealed,
    setHintsRevealed,
    selectedAnswer,
    setSelectedAnswer,
    recordCorrectAnswer,
    nextCity,
    isLoading,
  } = useGame();

  const [showSuccess, setShowSuccess] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  if (isLoading || !currentCity) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const handleAnswerSelect = (choice: string) => {
    if (showSuccess) return;

    setSelectedAnswer(choice);
    const isCorrect = choice.toLowerCase() === currentCity.name.toLowerCase();
    setIsCorrectAnswer(isCorrect);

    if (isCorrect) {
      recordCorrectAnswer(hintsRevealed);
      setShowSuccess(true);
    }
  };

  const handleRevealHint = () => {
    if (hintsRevealed < currentCity.hints.length) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  const handleNextCity = () => {
    setShowSuccess(false);
    setSelectedAnswer(null);
    nextCity();
  };

  const handleQuit = () => {
    router.back();
  };

  const progress = ((currentCityIndex + 1) / cities.length) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit} style={styles.quitButton}>
          <ChevronLeft size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            City {currentCityIndex + 1} of {cities.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.imageSection}>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>🏙️</Text>
          </View>
        </View>

        <View style={styles.hintsContainer}>
          <Text style={styles.hintsTitle}>Clues</Text>
          {currentCity.hints.map((hint, index) => (
            <View
              key={index}
              style={[styles.hintItem, index >= hintsRevealed && styles.hintItemLocked]}
            >
              <Text style={styles.hintNumber}>{index + 1}</Text>
              <Text style={[styles.hintText, index >= hintsRevealed && styles.hintTextHidden]}>
                {index < hintsRevealed ? hint : '?'}
              </Text>
            </View>
          ))}

          {hintsRevealed < currentCity.hints.length && (
            <TouchableOpacity style={styles.revealButton} onPress={handleRevealHint}>
              <Tv2 size={18} color="#ffffff" />
              <Text style={styles.revealButtonText}>Watch Ad for Next Clue</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.choicesContainer}>
          <Text style={styles.choicesTitle}>Which city is it?</Text>
          {currentCity.choices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.choiceButton,
                selectedAnswer === choice && styles.choiceButtonSelected,
                selectedAnswer === choice && isCorrectAnswer && styles.choiceButtonCorrect,
                selectedAnswer === choice && !isCorrectAnswer && styles.choiceButtonWrong,
              ]}
              onPress={() => handleAnswerSelect(choice)}
              disabled={showSuccess}
            >
              <Text
                style={[
                  styles.choiceText,
                  selectedAnswer === choice && styles.choiceTextSelected,
                ]}
              >
                {choice}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        cityName={currentCity.name}
        onNext={handleNextCity}
        isLastCity={currentCityIndex === cities.length - 1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  quitButton: {
    padding: 8,
  },
  progressSection: {
    flex: 1,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  imageSection: {
    marginBottom: 24,
  },
  imagePlaceholder: {
    height: 160,
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#c7d2fe',
  },
  imageText: {
    fontSize: 64,
  },
  hintsContainer: {
    marginBottom: 24,
  },
  hintsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  hintItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 12,
  },
  hintItemLocked: {
    backgroundColor: '#f3f4f6',
  },
  hintNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
    minWidth: 24,
  },
  hintText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
    flex: 1,
  },
  hintTextHidden: {
    color: '#9ca3af',
  },
  revealButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  revealButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  choicesContainer: {
    marginBottom: 24,
  },
  choicesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  choiceButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  choiceButtonSelected: {
    borderColor: '#2563eb',
  },
  choiceButtonCorrect: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
  },
  choiceButtonWrong: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  choiceText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  choiceTextSelected: {
    color: '#2563eb',
  },
});
