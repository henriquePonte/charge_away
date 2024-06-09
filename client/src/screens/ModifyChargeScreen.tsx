import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import api from '../api';

type ModifyChargeScreenRouteProp = RouteProp<RootStackParamList, 'ModifyChargeScreen'>;

interface ModifyChargeScreenProps {
  route: ModifyChargeScreenRouteProp;
}

const ModifyChargeScreen: React.FC<ModifyChargeScreenProps> = ({ route }) => {
  const { charge } = route.params;
  const navigation = useNavigation();

  const [wattConsumed, setWattConsumed] = React.useState(charge.wattConsumed.toString());
  const [rate, setRate] = React.useState(charge.rate.toString());
  const [cost, setCost] = React.useState(charge.cost.toString());

  const handleSubmit = async () => {
    try {
      const updatedCharge = {
        wattConsumed: parseFloat(wattConsumed),
        rate: parseFloat(rate),
        cost: parseFloat(cost),
      };

      await api.put(`/charges/${charge._id}`, updatedCharge);
      Alert.alert('Success', 'Charge updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating charge:', error);
      Alert.alert('Error', 'Failed to update charge');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Watt Consumed:</Text>
      <TextInput
        style={styles.input}
        value={wattConsumed}
        onChangeText={setWattConsumed}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Rate:</Text>
      <TextInput
        style={styles.input}
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Cost:</Text>
      <TextInput
        style={styles.input}
        value={cost}
        onChangeText={setCost}
        keyboardType="numeric"
      />
      <Button title="Submit Changes" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});

export default ModifyChargeScreen;
