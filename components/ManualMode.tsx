import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setDirectionStatus } from '@/redux/timerSlice';
import { DirectionColors, TrafficLightColors } from '@/constants';
import { Statuses, Directions } from '@/constants';
import { RootState } from '@/redux/store';
import { IStatuses } from '@/interfaces';

const ManualMode = () => {
  const dispatch = useDispatch();
  const timerState = useSelector((state: RootState) => state.timer);
  const directions = timerState.directions;

  const handleDirectionPress = (
    direction: keyof typeof Directions,
    leftTurn = false
  ) => {
    const { goStatus, leftStatus } = directions[direction];

    const updateStatus = (status: keyof IStatuses, isLeftStatus: boolean) => {
      dispatch(setDirectionStatus({ direction, status, isLeftStatus }));
    };

    if (leftTurn) {
      const newLeftStatus =
        leftStatus === Statuses.STOP ? Statuses.GO : Statuses.CAUTION;
      updateStatus(newLeftStatus, true);
      if (leftStatus !== Statuses.STOP) {
        setTimeout(() => updateStatus(Statuses.STOP, true), 2000);
      }
    } else {
      const newGoStatus =
        goStatus === Statuses.STOP ? Statuses.GO : Statuses.CAUTION;
      updateStatus(newGoStatus, false);
      if (goStatus !== Statuses.STOP) {
        setTimeout(() => updateStatus(Statuses.STOP, false), 2000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: DirectionColors.NORTH,
              backgroundColor: TrafficLightColors[directions.NORTH.leftStatus],
            },
          ]}
          onPress={() => handleDirectionPress('NORTH', true)}
        >
          <Text
            style={[styles.buttonTextLeft, { transform: [{ scaleX: -1 }] }]}
          >
            ➦
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: DirectionColors.NORTH,
              backgroundColor: TrafficLightColors[directions.NORTH.goStatus],
            },
          ]}
          onPress={() => handleDirectionPress('NORTH')}
        >
          <Text style={styles.buttonText}>↑</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <View style={styles.buttonCol}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: DirectionColors.WEST,
                backgroundColor: TrafficLightColors[directions.WEST.goStatus],
              },
            ]}
            onPress={() => handleDirectionPress('WEST')}
          >
            <Text style={styles.buttonText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: DirectionColors.WEST,
                backgroundColor: TrafficLightColors[directions.WEST.leftStatus],
              },
            ]}
            onPress={() => handleDirectionPress('WEST', true)}
          >
            <Text
              style={[
                styles.buttonTextLeft,
                { transform: [{ scaleX: -1 }, { rotate: '90deg' }] },
              ]}
            >
              ➦
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonCol}>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: DirectionColors.EAST,
                backgroundColor: TrafficLightColors[directions.EAST.leftStatus],
              },
            ]}
            onPress={() => handleDirectionPress('EAST', true)}
          >
            <Text
              style={[
                styles.buttonTextLeft,
                { transform: [{ scaleX: -1 }, { rotate: '-90deg' }] },
              ]}
            >
              ➦
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                borderColor: DirectionColors.EAST,
                backgroundColor: TrafficLightColors[directions.EAST.goStatus],
              },
            ]}
            onPress={() => handleDirectionPress('EAST')}
          >
            <Text style={styles.buttonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: DirectionColors.SOUTH,
              backgroundColor: TrafficLightColors[directions.SOUTH.goStatus],
            },
          ]}
          onPress={() => handleDirectionPress('SOUTH')}
        >
          <Text style={styles.buttonText}>↓</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            {
              borderColor: DirectionColors.SOUTH,
              backgroundColor: TrafficLightColors[directions.SOUTH.leftStatus],
            },
          ]}
          onPress={() => handleDirectionPress('SOUTH', true)}
        >
          <Text style={styles.buttonTextLeft}>➦</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManualMode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: 100,
    marginBottom: 0,
    alignItems: 'center',
  },
  buttonCol: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: 100,
    marginBottom: 0,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 30,
    margin: 5,
    borderWidth: 2,
    backgroundColor: '#D3D3D3', // Light gray background color for buttons
  },
  buttonText: {
    color: 'black', // Black text for better contrast
    fontSize: 24,
  },
  buttonTextLeft: {
    color: 'black', // Black text for better contrast
    fontSize: 20,
    textAlign: 'center',
    paddingBottom: 5,
  },
});
