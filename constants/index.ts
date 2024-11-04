import { IDirections, IStatuses } from "@/interfaces";

export const Directions: IDirections = {
  NORTH: "NORTH",
  SOUTH: "SOUTH",
  EAST: "EAST",
  WEST: "WEST",
};

export const Statuses: IStatuses = {
  GO: "GO",
  CAUTION: "CAUTION",
  STOP: "STOP",
};

export const TrafficLightColors: Record<keyof IStatuses, string> = {
  GO: "lightgreen",
  CAUTION: "#ffae42",
  STOP: "red",
};

export const DirectionLabels: Record<keyof IDirections, string> = {
  NORTH: "From South, head North and turn left to West.",
  SOUTH: "From North, head South and turn left to East.",
  EAST: "From West, head East and turn left to North.",
  WEST: "From East, head West and turn left to South.",
};

export const DirectionColors: Record<keyof IDirections, string> = {
  NORTH: "#8A2BE2", // Blue Violet outline for the north light
  EAST: "#FF4500", // Orange Red outline for the east light
  SOUTH: "#32CD32", // Lime Green outline for the south light
  WEST: "#FFD700", // Gold outline for the west light
};

export const Orders: (keyof IDirections)[] = ["NORTH", "SOUTH", "EAST", "WEST"];

export const conflictMapping: Record<string, string[]> = {
  NORTH: ["EAST", "WEST", "SOUTH_LEFT", "EAST_LEFT", "WEST_LEFT"],
  NORTH_LEFT: ["SOUTH", "EAST", "WEST"],
  SOUTH: ["EAST", "WEST", "NORTH_LEFT"],
  SOUTH_LEFT: ["WEST", "EAST_LEFT", "NORTH"],
  EAST: ["NORTH", "SOUTH", "SOUTH_LEFT", "NORTH_LEFT", "WEST_LEFT"],
  EAST_LEFT: ["NORTH_LEFT", "SOUTH_LEFT", "SOUTH", "WEST"],
  WEST: ["NORTH", "SOUTH", "NORTH_LEFT", "SOUTH_LEFT", "EAST_LEFT"],
  WEST_LEFT: ["NORTH", "SOUTH", "SOUTH_LEFT", "EAST", ],
};
