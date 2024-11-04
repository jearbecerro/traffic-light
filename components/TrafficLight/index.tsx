import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";
import Light from "./Light";
import LeftTurnLight from "./LeftTurnLight";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DirectionColors } from "@/constants";

interface TrafficLightChildInterface {
  style: ViewStyle;
  facing: "NORTH" | "EAST" | "SOUTH" | "WEST";
  status: "GO" | "STOP" | "CAUTION";
  active: boolean;
  timer: number;
  placement?: "LEFT" | "RIGHT";
}
export interface TrafficLightInterface {
  go: TrafficLightChildInterface;
  left: TrafficLightChildInterface;
}

const ROTATION_ANGLES = {
  NORTH: "0deg", // Facing North
  EAST: "5deg", // Facing East
  SOUTH: "0deg", // Facing South
  WEST: "-5deg", // Facing West
};

const TrafficLight = ({ go, left }: TrafficLightInterface) => {
  const timerState = useSelector((state: RootState) => state.timer);

  const flipArrow = left.facing !== "SOUTH";

  const [goTimeLeft, setGoTimeLeft] = useState(go.timer);
  const [leftTurnTimeLeft, setLeftTurnTimeLeft] = useState(left.timer);

  useEffect(() => {
    setGoTimeLeft(go.timer);
    setLeftTurnTimeLeft(left.timer);
  }, [go.timer, left.timer]);

  const showGoTimer: boolean = timerState.showAllTimers || go.active;
  const showLeftTimer: boolean = (left.active);
  
  return (
    <>
      <View style={[styles.trafficLightContainer, go.style]}>
        {showGoTimer && (
          <TimerUI
            placement={go.placement}
            facing={go.facing}
            timer={goTimeLeft}
          />
        )}

        <View
          style={[
            styles.trafficLight,
            { backgroundColor: go.active ? "black" : "gray" },
            { borderColor: DirectionColors[go.facing], borderWidth: 2 }, // Add border color
            { transform: [{ rotate: ROTATION_ANGLES[go.facing] }] },
          ]}
        >
          <Light type={"GO"} active={go.status === "GO"} />
          <Light
            type={"CAUTION"}
            active={go.active && go.status === "CAUTION"}
            doBlink={(go.active && go.status === "CAUTION")}
          />
          <Light
            type={"STOP"}
            active={go.status === "STOP"}
          />
        </View>
      </View>
      <View style={[styles.trafficLightContainer, left.style]}>
        {showLeftTimer && (
          <TimerUI
            placement={left.placement}
            facing={left.facing}
            timer={leftTurnTimeLeft}
          />
        )}

        <View
          style={[
            styles.trafficLight,
            { backgroundColor: left.active ? "black" : "gray" },
            { borderColor: DirectionColors[left.facing], borderWidth: 2 },
            { transform: [{ rotate: ROTATION_ANGLES[left.facing] }] },
          ]}
        >
          <LeftTurnLight
            type={"GO"}
            active={left.status === "GO"}
            flipArrow={flipArrow}
          />
          <LeftTurnLight
            type={"CAUTION"}
            active={left.active && left.status === "CAUTION"}
            doBlink={(left.active && left.status === "CAUTION") }
            flipArrow={flipArrow}
          />
          <LeftTurnLight
            type={"STOP"}
            active={left.status === "STOP"}
            flipArrow={flipArrow}
          />
        </View>
      </View>
    </>
  );
};
interface TimerUIInterface {
  placement?: "LEFT" | "RIGHT";
  facing: "NORTH" | "EAST" | "SOUTH" | "WEST";
  timer: number;
}

const TimerUI = ({ placement, facing, timer }: TimerUIInterface) => {
  return (
    <View
      style={[
        placement === "LEFT"
          ? styles.timerContainerLeft
          : styles.timerContainerRight,
        { transform: [{ rotate: ROTATION_ANGLES[facing] }] },
      ]}
    >
      <Text style={styles.timerText}>
        {timer >= 90 ? 90 : timer === 0 ? "--" : timer}
      </Text>
    </View>
  );
};

export default TrafficLight;

const styles = StyleSheet.create({
  trafficLightContainer: {
    position: "absolute",
    width: 60,
    height: 80,
    alignItems: "center",
  },
  trafficLight: {
    width: "50%",
    height: "90%",
    borderRadius: 5,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  timerContainerLeft: {
    position: "absolute",
    left: "-30%", // Positioned 35% to the left of the main traffic light
    top: "5%", // Center vertically
    transform: [{ translateY: -50 }],
    backgroundColor: "black",
    opacity: 0.6,
    padding: 5,
    borderRadius: 5,
    width: 30,
  },
  timerContainerRight: {
    position: "absolute",
    right: "-30%",
    top: "50%",
    transform: [{ translateY: -50 }],
    backgroundColor: "black",
    opacity: 0.6,
    padding: 5,
    borderRadius: 5,
    width: 30,
  },
  timerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  leftTurnSymbol: {
    fontSize: 18,
    fontWeight: "bold",
  },
  direction: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
  },
});
