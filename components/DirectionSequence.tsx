import { DirectionLabels } from '@/constants';
import { IDirections } from '@/interfaces';
import { StyleSheet, Text, View } from 'react-native';

const DirectionSequence = ({ orders }: { orders: (keyof IDirections)[] }) => {
  const currentDirection = DirectionLabels[orders[0]];
  return (
    <View style={styles.orderContainer}>
      <Text style={styles.orderTitle}>Direction Sequence</Text>
      <View style={styles.orderRow}>
        {orders.map((direction, index) => (
          <View key={index} style={styles.orderItem}>
            <Text
              style={[styles.orderFacing, index === 0 ? styles.highlight : {}]}
            >
              {direction}
            </Text>
            {index < orders.length - 1 && <Text style={styles.arrow}>→</Text>}
          </View>
        ))}
      </View>
      <Text style={styles.orderDescription}>{currentDirection}</Text>
    </View>
  );
};

export default DirectionSequence;

const styles = StyleSheet.create({
  orderContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderFacing: {
    fontSize: 16,
    color: '#007BFF',
  },
  arrow: {
    fontSize: 16,
    color: '#6c757d',
    marginHorizontal: 2,
  },
  highlight: {
    fontWeight: '700',
    color: '#0056b3',
    textDecorationLine: 'underline',
  },
  orderDescription: {
    fontSize: 12,
    color: '#555',
    marginTop: 5,
    textAlign: 'center',
    lineHeight: 18,
  },
});
