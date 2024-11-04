import { IDirectionState, ITimerState } from "@/redux/timerSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getDirectionSettings = async (): Promise<
  ITimerState["directions"] | null
> => {
  const res = await AsyncStorage.getItem("trafficLightSettings");
  if (res) {
    return JSON.parse(res);
  } else return null;
};

export const setDirectionSettings = async (
  settings: Record<string, IDirectionState>
): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(
      "trafficLightSettings",
      JSON.stringify(settings)
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
