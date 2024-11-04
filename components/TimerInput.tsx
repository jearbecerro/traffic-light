import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface TimerInputProps {
  direction: string;
  timer: { green: number; leftTurn: number };
  onChange: (direction: string, type: string, value: string) => void;
}

const TimerInput: React.FC<TimerInputProps> = ({ direction, timer, onChange }) => (
  <View style={styles.container}>
    <Text>{direction.charAt(0).toUpperCase() + direction.slice(1)} Lane</Text>
    <TextInput
      style={styles.input}
      placeholder="Green Time"
      keyboardType="numeric"
      value={String(timer.green)}
      onChangeText={(value) => onChange(direction, 'green', value)}
    />
    <TextInput
      style={styles.input}
      placeholder="Left Turn Time"
      keyboardType="numeric"
      value={String(timer.leftTurn)}
      onChangeText={(value) => onChange(direction, 'leftTurn', value)}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  input: { borderWidth: 1, borderRadius: 5, padding: 8, marginVertical: 5 },
});

export default TimerInput;