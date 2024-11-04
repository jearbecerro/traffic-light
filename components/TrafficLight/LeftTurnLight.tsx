import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LightInterface {
  type: 'GO' | 'STOP' | 'CAUTION';
  active: boolean;
  flipArrow?: boolean;
  doBlink?: boolean; // Add this prop for blinking behavior
}

const LeftTurnLight = ({
  type,
  active,
  flipArrow = true,
  doBlink = false,
}: LightInterface) => {
  const color = {
    GO: 'lightgreen',
    STOP: '#FF0500',
    CAUTION: 'orange',
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
        setIsBlinking(false); // Stop blinking after 1.8 seconds
      }, 1800);
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
    <View
      style={[
        styles.light,
        {
          opacity,
          backgroundColor: 'transparent',
          borderColor: color[type],
        },
      ]}
    >
      <Text
        style={[
          styles.arrow,
          { color: color[type] },
          flipArrow ? { transform: [{ scaleX: -1 }] } : {},
        ]}
      >
        {'➦'}
      </Text>
    </View>
  );
};

export default LeftTurnLight;

const styles = StyleSheet.create({
  light: {
    width: 18,
    height: 18,
    borderRadius: 50,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1.5,
  },
  arrow: {
    fontSize: 12,
    lineHeight: 13,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
