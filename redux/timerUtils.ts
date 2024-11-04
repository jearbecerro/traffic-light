import { conflictMapping, Directions, Statuses } from "@/constants";
import { IDirectionState, ITimerState } from "./timerSlice";

// Utility function to shift the order of directions
export const shiftOrder = (order: (keyof typeof Directions)[]) => {
  const shiftedOrder = [...order];
  const shiftedDirection = shiftedOrder.shift();
  if (shiftedDirection) {
    shiftedOrder.push(shiftedDirection);
  }
  return shiftedOrder;
};

export const resetTrafficLightState = (
  directions: ITimerState["directions"]
) => {
  return Object.keys(directions).reduce<
    Record<keyof typeof Directions, IDirectionState>
  >((newState, directionKey) => {
    const key = directionKey as keyof typeof Directions;
    newState[key] = {
      ...directions[key],
      greenCountdown: 0,
      leftTurnCountdown: 0,
      goStatus: Statuses.STOP,
      leftStatus: Statuses.STOP,
    };
    return newState;
  }, {} as Record<keyof typeof Directions, IDirectionState>);
};

// Utility function to reset timers based on the current direction order
export const resetTimers = (state: ITimerState) => {
  const directionsOrder = state.order;

  for (let i = 0; i < directionsOrder.length; i++) {
    const direction = directionsOrder[i];
    const currentDirection = state.directions[direction];

    if (i === 0) {
      // Retain the current countdown values for the new current direction
      currentDirection.greenCountdown = Math.max(
        currentDirection.greenCountdown,
        currentDirection.greenTime
      );
      currentDirection.leftTurnCountdown = Math.max(
        currentDirection.leftTurnCountdown,
        currentDirection.leftTurnTime
      );

      // Calculate excess if current left turn is greater than green time
      const excess =
        currentDirection.leftTurnCountdown > currentDirection.greenTime
          ? currentDirection.leftTurnCountdown - currentDirection.greenTime
          : 0;

      // If there's a next direction, apply the excess
      if (i + 1 < directionsOrder.length) {
        const nextDirection = directionsOrder[i + 1];
        const nextState = state.directions[nextDirection];

        nextState.greenCountdown = Math.max(
          nextState.greenCountdown,
          nextState.greenTime + excess
        );
        nextState.leftTurnCountdown = Math.max(
          nextState.leftTurnCountdown,
          nextState.leftTurnTime + excess
        );
      }
    } else if (i === 1) {
      // For the second direction, inherit the countdowns from the first
      const prevDirection = directionsOrder[0];
      const prevState = state.directions[prevDirection];

      currentDirection.greenCountdown = Math.max(
        prevState.greenCountdown,
        currentDirection.greenTime
      );

      currentDirection.leftTurnCountdown = Math.max(
        prevState.leftTurnCountdown,
        currentDirection.leftTurnTime
      );

      // Check for excess from the first direction
      const excess =
        prevState.leftTurnCountdown > prevState.greenTime
          ? prevState.leftTurnCountdown - prevState.greenTime
          : 0;

      // Apply excess to the current direction if applicable
      currentDirection.greenCountdown += excess;
      currentDirection.leftTurnCountdown += excess;
    } else {
      // For other directions, sum up previous countdowns
      const prevDirection = directionsOrder[i - 1];
      const prevState = state.directions[prevDirection];

      currentDirection.greenCountdown =
        prevState.greenCountdown + currentDirection.greenTime;
      currentDirection.leftTurnCountdown =
        prevState.leftTurnCountdown + currentDirection.leftTurnTime;
    }

    // Set all directions to STOP status initially
    currentDirection.goStatus = Statuses.STOP;
    currentDirection.leftStatus = Statuses.STOP;
  }
};

// Utility function to decrement countdowns
export const decrementCountdowns = (currentDirection: IDirectionState) => {
  if (currentDirection.greenCountdown > 0) {
    currentDirection.greenCountdown--;
  }

  if (currentDirection.leftTurnCountdown > 0) {
    currentDirection.leftTurnCountdown--;
  }
};

export const updateStatuses = (currentDirection: IDirectionState) => {
  if (currentDirection.greenCountdown <= 2) {
    currentDirection.goStatus = Statuses.CAUTION;
  }

  if (currentDirection.greenCountdown <= 1) {
    currentDirection.goStatus = Statuses.STOP;
  }

  if (currentDirection.leftTurnCountdown <= 2) {
    currentDirection.leftStatus = Statuses.CAUTION;
  }

  if (currentDirection.leftTurnCountdown <= 1) {
    currentDirection.leftStatus = Statuses.STOP;
  }
};

export const handleCurrentDirection = (state: ITimerState) => {
  const current = state.directions[state.currentDirection];

  if (current.greenCountdown === 0 && current.leftTurnCountdown === 0) {
    transitionToNextDirection(state);
  }
};

export const allowLeftTurn = (state: ITimerState) => {
  const currentDirection = state.currentDirection;

  const frontDirectionIndex = state.order.indexOf(currentDirection);
  const frontDirection =
    state.order[(frontDirectionIndex + 1) % state.order.length];
  const frontDirState = state.directions[frontDirection];

  const conflictKey =
    `${currentDirection}_LEFT` as keyof typeof conflictMapping;
  const conflicts = conflictMapping[conflictKey];
  const activeDirections = getActiveDirections(state);

  if (frontDirState.leftTurnCountdown > 0) {
    state.directions[frontDirection].leftStatus = Statuses.GO;
  }

  conflicts.forEach((conflict) => {
    const baseDir = conflict.replace("_LEFT", "") as keyof typeof Directions;
    const isConflictLeft = conflict.includes("_LEFT");

    if (!activeDirections.left.includes(baseDir)) {
      if (isConflictLeft) {
        state.directions[baseDir].leftStatus = Statuses.STOP;
        state.directions[baseDir].leftTurnCountdown = 0;
      }
    }
  });
};

export const transitionToNextDirection = (state: ITimerState) => {
  state.order = shiftOrder(state.order);
  state.currentDirection = state.order[0];
  resetTimers(state); // Only reset timers after changing direction

  const next = state.directions[state.currentDirection];
  next.goStatus = Statuses.GO;
  next.leftStatus = Statuses.GO;
};

// Helper function to collect active directions
export const getActiveDirections = (state: ITimerState) => {
  const active: { go: string[]; left: string[] } = { go: [], left: [] };
  Object.keys(state.directions).forEach((dirKey) => {
    const dir = dirKey as keyof typeof Directions;
    if (state.directions[dir].goStatus === Statuses.GO) active.go.push(dir);
    if (state.directions[dir].leftStatus === Statuses.GO) active.left.push(dir);
  });
  return active;
};

// Helper function to stop conflicting directions
export const stopConflictingDirections = (
  state: ITimerState,
  conflicts: string[],
  activeDirections: string[],
  isLeft: boolean
) => {
  conflicts.forEach((conflict) => {
    const baseDir = conflict.replace("_LEFT", "") as keyof typeof Directions;
    const isConflictLeft = conflict.includes("_LEFT");

    if (!isLeft || !activeDirections.includes(baseDir)) {
      if (isConflictLeft) {
        state.directions[baseDir].leftStatus = Statuses.STOP;
      } else {
        state.directions[baseDir].goStatus = Statuses.STOP;
      }
    }
  });
};
