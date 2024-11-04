// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "./timerSlice";

const store = configureStore({
  reducer: {
    timer: timerReducer,
  },
});

// Define RootState and AppDispatch types for usage in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
