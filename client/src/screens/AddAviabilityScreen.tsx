import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import api from '../api';

type AddAvailabilityScreenRouteProp = RouteProp<RootStackParamList, 'AddAvailability'>;

const AddAvailabilityScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<AddAvailabilityScreenRouteProp>();
    const { locationId } = route.params;

    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const handleSave = async () => {
        try {
            await api.post('/availabilities', {
                start: new Date(start),
                end: new Date(end),
                local: locationId,
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error saving availability:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput
                style={styles.input}
                value={start}
                onChangeText={setStart}
                placeholder="YYYY-MM-DD"
            />
            <Text style={styles.label}>End Date</Text>
            <TextInput
                style={styles.input}
                value={end}
                onChangeText={setEnd}
                placeholder="YYYY-MM-DD"
            />
            <Button title="Save Availability" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
        marginVertical: 8,
    },
});

export default AddAvailabilityScreen;
