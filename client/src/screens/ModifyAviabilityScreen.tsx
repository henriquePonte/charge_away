import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import api from '../api';

type ModifyAvailabilityScreenRouteProp = RouteProp<RootStackParamList, 'ModifyAvailability'>;

const ModifyAvailabilityScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<ModifyAvailabilityScreenRouteProp>();
    const { availabilityId } = route.params;

    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await api.get(`/availabilities/${availabilityId}`);
                const availability = response.data;
                setStart(new Date(availability.start).toISOString().split('T')[0]);
                setEnd(new Date(availability.end).toISOString().split('T')[0]);
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };

        fetchAvailability();
    }, [availabilityId]);

    const handleSave = async () => {
        try {
            await api.put(`/availabilities/${availabilityId}`, {
                start: new Date(start),
                end: new Date(end),
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

export default ModifyAvailabilityScreen;
