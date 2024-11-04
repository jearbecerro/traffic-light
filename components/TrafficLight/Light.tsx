import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

interface LightProps {
  type: 'GO' | 'STOP' | 'CAUTION';
  active: boolean;
  doBlink?: boolean;
}

const Light: React.FC<LightProps> = ({ type, active, doBlink = false }) => {
  const colors: Record<string, string> = {
    GO: 'lightgreen',
    STOP: '#ff0500',
    CAUTION: '#ffae42',
  };

  const [opacity, setOpacity] = useState<number>(active ? 1 : 0.5);
  const [isBlinking, setIsBlinking] = useState<boolean>(doBlink);

  // Update opacity based on active status
  useEffect(() => {
    setOpacity(active ? 1 : 0.5);
  }, [active]);

  // Manage blinking state and set timeout for blinking duration
  useEffect(() => {
    setIsBlinking(doBlink);

    if (doBlink) {
      const timeoutId = setTimeout(() => {
        setIsBlinking(false);
      }, 2800);
      return () => clearTimeout(timeoutId);
    }
  }, [doBlink]);

  // Manage blinking effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (isBlinking) {
      intervalId = setInterval(() => {
        setOpacity((prev) => (prev === 1 ? 0.5 : 1));
      }, 250);
    } else {
      setOpacity(active ? 1 : 0.5);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isBlinking, active]);

  return (
    <View style={[styles.light, { backgroundColor: colors[type], opacity }]} />
  );
};

export default Light;

const styles = StyleSheet.create({
  light: {
    width: 17,
    height: 17,
    borderRadius: 50,
    margin: 2,
  },
});
