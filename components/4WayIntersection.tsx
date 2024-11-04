import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  Button,
} from "react-native";
import { RootState, AppDispatch } from "@/redux/store";
import {
  doCountdown,
  setMode,
  ITimerState,
  setShowAllTimers,
  setAllRedPhase,
  initializeTimers,
} from "@/redux/timerSlice";
import TrafficLight from "@/components/TrafficLight";
import DirectionSequence from "./DirectionSequence";
import ManualMode from "./ManualMode";

const FourWayIntersection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const timerState = useSelector((state: RootState) => state.timer);
  const orders = timerState.order;
  const mode = timerState.mode;
  const showAllTimers = timerState.showAllTimers;
  
  useEffect(() => {
    if (mode === "Automated") {
      dispatch(initializeTimers()); // Call the thunk to initialize timers
      const intervalId = setInterval(() => {
        dispatch(doCountdown());
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [mode, dispatch]);

  const handleModeChange = (newMode: ITimerState["mode"]) => {
    setAllRedPhase(newMode === "Manual");
    dispatch(setMode(newMode));
  };

  const handleShowAllTimers = (showAllTimers: boolean) => {
    dispatch(setShowAllTimers(showAllTimers));
  };

  return (
    <View style={styles.container}>
      {/* Fixed title, image with traffic lights, and mode buttons */}
      <View style={styles.fixedTopContainer}>
        <Text style={styles.title}>4-Way Intersection</Text>

        <View style={styles.crossroadContainer}>
          <Image
            source={require("../assets/images/crossroad.png")}
            style={styles.backgroundImage}
            resizeMode="cover"
          />

          <TrafficLight
            go={{
              style: { top: "18%", left: "13%" },
              facing: "WEST",
              status: timerState.directions.WEST.goStatus,
              active:
                timerState.currentDirection === "WEST" ||
                timerState.directions.WEST.goStatus === "GO",
              placement: "LEFT",
              timer: timerState.directions.WEST.greenCountdown,
            }}
            left={{
              style: { top: "16.5%", left: "22.5%" },
              facing: "WEST",
              status: timerState.directions.WEST.leftStatus,
              active:
                timerState.currentDirection === "WEST" ||
                timerState.directions.WEST.leftStatus === "GO",
              placement: "RIGHT",
              timer: timerState.directions.WEST.leftTurnCountdown,
            }}
          />
          <TrafficLight
            go={{
              style: { bottom: "29.5%", right: "6%" },
              facing: "EAST",
              status: timerState.directions.EAST.goStatus,
              active:
                timerState.currentDirection === "EAST" ||
                timerState.directions.EAST.goStatus === "GO",
              placement: "RIGHT",
              timer: timerState.directions.EAST.greenCountdown,
            }}
            left={{
              style: { bottom: "32%", right: "15%" },
              facing: "EAST",
              status: timerState.directions.EAST.leftStatus,
              active:
                timerState.currentDirection === "EAST" ||
                timerState.directions.EAST.leftStatus === "GO",
              placement: "LEFT",
              timer: timerState.directions.EAST.leftTurnCountdown,
            }}
          />
          <TrafficLight
            go={{
              style: { bottom: "15%", left: "20%" },
              facing: "SOUTH",
              status: timerState.directions.SOUTH.goStatus,
              active:
                timerState.currentDirection === "SOUTH" ||
                timerState.directions.SOUTH.goStatus === "GO",
              placement: "LEFT",
              timer: timerState.directions.SOUTH.greenCountdown,
            }}
            left={{
              style: { bottom: "15%", left: "29%" },
              facing: "SOUTH",
              status: timerState.directions.SOUTH.leftStatus,
              active:
                timerState.currentDirection === "SOUTH" ||
                timerState.directions.SOUTH.leftStatus === "GO",
              placement: "RIGHT",
              timer: timerState.directions.SOUTH.leftTurnCountdown,
            }}
          />
          <TrafficLight
            go={{
              style: { top: "8%", right: "23.5%" },
              facing: "NORTH",
              status: timerState.directions.NORTH.goStatus,
              active:
                timerState.currentDirection === "NORTH" ||
                timerState.directions.NORTH.goStatus === "GO",
              placement: "RIGHT",
              timer: timerState.directions.NORTH.greenCountdown,
            }}
            left={{
              style: { top: "7.8%", right: "33%" },
              facing: "NORTH",
              status: timerState.directions.NORTH.leftStatus,
              active:
                timerState.currentDirection === "NORTH" ||
                timerState.directions.NORTH.leftStatus === "GO",
              placement: "LEFT",
              timer: timerState.directions.NORTH.leftTurnCountdown,
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Manual Mode"
            onPress={() => handleModeChange("Manual")}
            color={mode === "Manual" ? "#007BFF" : "#ccc"}
          />
          <Button
            title="Automated"
            onPress={() => handleModeChange("Automated")}
            color={mode === "Automated" ? "#007BFF" : "#ccc"}
          />
        </View>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mode === "Automated" && <DirectionSequence orders={orders} />}
        {mode === "Automated" && (
          <View style={[styles.timerContainer]}>
            <Button
              title="Show All Timers"
              onPress={() => handleShowAllTimers(true)}
              color={showAllTimers ? "#007BFF" : "#ccc"}
            />
            <Button
              title="Active Timer"
              onPress={() => handleShowAllTimers(false)}
              color={!showAllTimers ? "#007BFF" : "#ccc"}
            />
          </View>
        )}

        {mode === "Manual" && <ManualMode />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  fixedTopContainer: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 70,
    textAlign: "center",
  },
  crossroadContainer: {
    position: "relative",
    width: 300,
    height: 300,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 10,
  },
  timerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginTop: 30,
  },
  scrollContent: {
    paddingVertical: 10,
    alignItems: "center",
  },
  compassContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  centerButton: {
    width: 20,
  },
});

export default FourWayIntersection;
