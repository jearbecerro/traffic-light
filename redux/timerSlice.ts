import { Statuses, Directions, conflictMapping } from "@/constants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  decrementCountdowns,
  getActiveDirections,
  handleCurrentDirection,
  resetTimers,
  resetTrafficLightState,
  stopConflictingDirections,
  updateStatuses,
} from "./timerUtils";
import { getDirectionSettings } from "@/utils/storage";

export interface IDirectionState {
  greenTime: number;
  leftTurnTime: number;
  greenCountdown: number;
  leftTurnCountdown: number;
  goStatus: (typeof Statuses)[keyof typeof Statuses];
  leftStatus: (typeof Statuses)[keyof typeof Statuses];
}

export interface ITimerState {
  directions: {
    [key in keyof typeof Directions]: IDirectionState;
  };
  order: (keyof typeof Directions)[];
  currentDirection: keyof typeof Directions;
  allRedPhase: boolean;
  mode: "Manual" | "Automated";
  showAllTimers: boolean;
}

const initialState: ITimerState = {
  directions: {
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
  },
  order: [Directions.NORTH, Directions.SOUTH, Directions.EAST, Directions.WEST],
  currentDirection: "NORTH",
  allRedPhase: false,
  mode: "Automated",
  showAllTimers: true,
};

interface SetDirectionProps {
  direction: keyof typeof Directions;
  status: keyof typeof Statuses;
  isLeftStatus: boolean;
}

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setDirections(state, action: PayloadAction<ITimerState["directions"]>) {
      state.directions = action.payload;
    },
    setAllRedPhase(state, action: PayloadAction<boolean>) {
      state.allRedPhase = action.payload;
    },
    setMode(state, action: PayloadAction<ITimerState["mode"]>) {
      state.mode = action.payload;
      if (action.payload === "Manual") {
        state.currentDirection = "NORTH";
        state.directions = resetTrafficLightState(state.directions);
      }
    },
    setShowAllTimers(state, action: PayloadAction<boolean>) {
      state.showAllTimers = action.payload;
    },
    startTimers(state) {
      state.order = initialState.order;
      resetTimers(state);
      const current = state.directions[state.currentDirection];
      current.goStatus = Statuses.GO;
      current.leftStatus = Statuses.GO;
    },
    doCountdown: (state: ITimerState) => {
      state.order.forEach((dir) => {
        const dirState = state.directions[dir];
        decrementCountdowns(dirState);
        updateStatuses(dirState);
      });

      handleCurrentDirection(state);
    },
    setDirectionStatus(state, action: PayloadAction<SetDirectionProps>) {
      const { direction, status, isLeftStatus } = action.payload;

      // Determine the conflict key based on left turn or straight
      const conflictKey = isLeftStatus
        ? (`${direction}_LEFT` as keyof typeof conflictMapping)
        : direction;
      const conflicts = conflictMapping[conflictKey];

      // Collect all active directions set to `GO`
      const activeDirections = getActiveDirections(state);

      // Set the status for the selected direction
      if (isLeftStatus) {
        state.directions[direction].leftStatus = status;
      } else {
        state.directions[direction].goStatus = status;
      }

      // Handle conflicts if the status is GO
      if (status === Statuses.GO) {
        stopConflictingDirections(state, conflicts, activeDirections.go, false);

        // If it's a left turn, check left turn conflicts separately
        if (isLeftStatus) {
          const leftConflicts =
            conflictMapping[
              `${direction}_LEFT` as keyof typeof conflictMapping
            ];
          stopConflictingDirections(
            state,
            leftConflicts,
            activeDirections.left,
            true
          );
        }

        // Set the current direction to the selected one
        state.currentDirection = direction;
      }
    },
  },
});

export const initializeTimers = createAsyncThunk(
  "timer/initializeTimers",
  async (_, { dispatch }) => {
    // Fetch persistent directions from AsyncStorage
    const persistentDir: ITimerState["directions"] | null =
      await getDirectionSettings();

    if (!persistentDir) {
      // If no persistent directions are found, set default values
      dispatch(setDirections(initialState.directions));
      return;
    }
    console.log("persistentDir");
    console.log(persistentDir["NORTH"]);
    // Dispatch the setDirections action with the loaded settings
    dispatch(setDirections(persistentDir));

    // Dispatch the startTimers action to set the statuses
    dispatch(startTimers());
  }
);

export const {
  setAllRedPhase,
  setDirections,
  setMode,
  setShowAllTimers,
  startTimers,
  doCountdown,
  setDirectionStatus,
} = timerSlice.actions;

export default timerSlice.reducer;
