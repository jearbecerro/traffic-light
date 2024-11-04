// ToggleButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface ToggleButtonProps {
  isShowingAll: boolean; // Renamed for clarity
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isShowingAll,
  onToggle,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View
        style={[
          styles.toggleContainer,
          isShowingAll ? styles.active : styles.inactive,
        ]}
      >
        <Text style={styles.toggleText}>
          {isShowingAll ? 'Show Active Timer' : 'Show All Timers'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
  },
  toggleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  active: {
    backgroundColor: '#007BFF',
  },
  inactive: {
    backgroundColor: '#ccc',
  },
  toggleText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ToggleButton;
