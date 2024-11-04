import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IDirectionState } from "@/redux/timerSlice";
import { Statuses } from "@/constants";
import { setDirectionSettings } from "@/utils/storage";

const initialSettings: Record<string, IDirectionState> = {
  NORTH: {
    greenTime: 20,
    leftTurnTime: 30,
    greenCountdown: 0,
    leftTurnCountdown: 0,
    goStatus: Statuses.STOP,
    leftStatus: Statuses.STOP,
  },
  SOUTH: {
    greenTime: 15,
    leftTurnTime: 20,
    greenCountdown: 0,
    leftTurnCountdown: 0,
    goStatus: Statuses.STOP,
    leftStatus: Statuses.STOP,
  },
  EAST: {
    greenTime: 15,
    leftTurnTime: 15,
    greenCountdown: 0,
    leftTurnCountdown: 0,
    goStatus: Statuses.STOP,
    leftStatus: Statuses.STOP,
  },
  WEST: {
    greenTime: 10,
    leftTurnTime: 15,
    greenCountdown: 0,
    leftTurnCountdown: 0,
    goStatus: Statuses.STOP,
    leftStatus: Statuses.STOP,
  },
};

const TrafficLightSettings = () => {
  const [settings, setSettings] =
    useState<Record<string, IDirectionState>>(initialSettings);
  const [expandedDirection, setExpandedDirection] = useState<string | null>(
    "NORTH"
  );

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(
          "trafficLightSettings"
        );
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    loadSettings();
    
  }, []);

  const handleInputChange = (
    direction: string,
    field: keyof IDirectionState,
    value: string
  ) => {
    const updatedValue = parseInt(value, 10);
    setSettings((prevSettings) => ({
      ...prevSettings,
      [direction]: {
        ...prevSettings[direction],
        [field]: isNaN(updatedValue) ? 0 : updatedValue, // Avoid NaN
      },
    }));
  };

  const toggleDirection = (direction: string) => {
    setExpandedDirection((prev) => (prev === direction ? null : direction));
  };

  const handleSaveSettings = async () => {
    const saved = await setDirectionSettings(settings);
    console.log(saved);
    if (saved) {
      Alert.alert(
        "Settings Saved",
        "Your traffic light settings have been saved successfully."
      );
    } else {
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainTitle}>Traffic Light Timer Settings</Text>
      {Object.keys(settings).map((direction) => (
        <View key={direction} style={styles.directionWrapper}>
          <TouchableOpacity
            onPress={() => toggleDirection(direction)}
            style={styles.directionTitleContainer}
          >
            <Text style={[styles.directionTitle]}>{direction}</Text>
          </TouchableOpacity>
          {expandedDirection === direction && (
            <DirectionInput
              direction={direction}
              settings={settings[direction]}
              onInputChange={handleInputChange}
            />
          )}
        </View>
      ))}
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
interface DirectionInputProps {
  direction: string;
  settings: IDirectionState;
  onInputChange: (
    direction: string,
    field: keyof IDirectionState,
    value: string
  ) => void;
}

const DirectionInput: React.FC<DirectionInputProps> = ({
  direction,
  settings,
  onInputChange,
}) => {
  return (
    <View style={styles.directionContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Green Time (seconds)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(settings.greenTime)}
          onChangeText={(value) => onInputChange(direction, "greenTime", value)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Left Turn Time (seconds)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={String(settings.leftTurnTime)}
          onChangeText={(value) =>
            onInputChange(direction, "leftTurnTime", value)
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  directionWrapper: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  directionTitleContainer: {
    padding: 10,
    backgroundColor: "#007BFF", // Blueish background for direction title
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    width: "80%",
    alignItems: "center",
  },
  directionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  directionContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    elevation: 3,
    width: "80%",
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: "#000", // Default color for labels
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fafafa",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#28a745", // Greenish color for the save button
    borderRadius: 5,
    paddingVertical: 15, // Increased padding for a bigger button
    paddingHorizontal: 30,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // White text for contrast
    textAlign: "center",
  },
});

export default TrafficLightSettings;
