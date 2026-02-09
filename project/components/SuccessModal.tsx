import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Check, Trophy } from 'lucide-react-native';

type SuccessModalProps = {
  visible: boolean;
  cityName: string;
  onNext: () => void;
  isLastCity: boolean;
};

export default function SuccessModal({ visible, cityName, onNext, isLastCity }: SuccessModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Check size={48} color="#22c55e" />
          </View>

          <Text style={styles.title}>Correct!</Text>
          <Text style={styles.cityName}>{cityName}</Text>

          <View style={styles.celebrationText}>
            <Trophy size={20} color="#f59e0b" />
            <Text style={styles.bonusText}>You earned 10 coins!</Text>
          </View>

          {isLastCity ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.completeButton} onPress={onNext}>
                <Text style={styles.completeButtonText}>Level Complete!</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.nextButton} onPress={onNext}>
              <Text style={styles.nextButtonText}>Next City</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    maxWidth: 300,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#dcfce7',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#22c55e',
    marginBottom: 8,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  celebrationText: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  buttonContainer: {
    width: '100%',
  },
  nextButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
