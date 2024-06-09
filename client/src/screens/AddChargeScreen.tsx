import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import api from '../api';
import { Picker } from '@react-native-picker/picker';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/types";

interface AddChargeScreenProps {
    userId: string | null;
}

type ChargeScreenRouteProp = RouteProp<RootStackParamList, 'AddCharge'>;

interface Charger {
    _id: string;
    portType: string;
    status: string;
    costPerWatt: number;
}

interface Location {
    _id: string;
    name: string;
    chargers: Charger[];
}

const AddChargeScreen: React.FC<AddChargeScreenProps> = ({ userId }) => {
    const [startHour, setStartHour] = useState(new Date());
    const [endHour, setEndHour] = useState(new Date());
    const [selectedCharger, setSelectedCharger] = useState('');
    const [chargers, setChargers] = useState<Charger[]>([]);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const route = useRoute<ChargeScreenRouteProp>();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'AddCharge'>>();
    const { locationId } = route.params;

    useEffect(() => {
        if (!locationId) {
            console.error('locationId is undefined');
            return;
        }

        const fetchChargers = async () => {
            try {
                const chargersResponse = await api.get(`/chargers/local/${locationId}`);
                setChargers(chargersResponse.data);
            } catch (error) {
                console.error('Error fetching chargers:', error);
                setChargers([]);
            }
        };

        fetchChargers();
    }, [locationId]);

    const handleStartHourChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || startHour;
        setShowStartPicker(false);
        setStartHour(currentDate);
    };

    const handleEndHourChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || endHour;
        setShowEndPicker(false);
        setEndHour(currentDate);
    };

    const handleAddCharge = async () => {
        const initialHour = moment(startHour).toISOString();
        const finalHour = moment(endHour).toISOString();
        const status = "a confirmar";
        const chargeData = {
            initialHour,
            finalHour,
            charger: selectedCharger,
            status,
            user: userId,
        };

        console.log('Charge data:', chargeData);

        if (!initialHour || !finalHour || !selectedCharger || !userId) {
            Alert.alert('Error', 'Please fill in all fields correctly.');
            return;
        }

        try {
            const response = await api.post('/charges', chargeData);
            console.log('Charge added successfully:', response.data);
            Alert.alert('Success', 'Charge added successfully');
            navigation.goBack();
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error creating local:', error.message);
            } else {
                console.error('Error creating local:', error);
            }
            Alert.alert('Error', 'Error creating local');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Add New Charge</Text>
            <View style={styles.datePickerContainer}>
                <Text>Start Hour:</Text>
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                    <Text style={styles.dateText}>{moment(startHour).format('YYYY-MM-DD HH:mm')}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={startHour}
                        mode="time"
                        display="default"
                        onChange={handleStartHourChange}
                    />
                )}
            </View>
            <View style={styles.datePickerContainer}>
                <Text>End Hour:</Text>
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                    <Text style={styles.dateText}>{moment(endHour).format('YYYY-MM-DD HH:mm')}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                    <DateTimePicker
                        value={endHour}
                        mode="time"
                        display="default"
                        onChange={handleEndHourChange}
                    />
                )}
            </View>
            <View style={styles.pickerContainer}>
                <Text>Select Charger:</Text>
                <Picker
                    selectedValue={selectedCharger}
                    onValueChange={(itemValue) => {
                        console.log('Selected Charger:', itemValue);
                        setSelectedCharger(itemValue);
                    }}
                    style={styles.picker}
                >
                    {chargers.map((charger) => (
                        <Picker.Item key={charger._id} label={charger.portType} value={charger._id} />
                    ))}
                </Picker>
            </View>
            <Button title="Add Charge" onPress={handleAddCharge} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    datePickerContainer: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        color: '#007BFF',
    },
    pickerContainer: {
        width: '100%',
        marginBottom: 10,
        alignItems: 'center',
    },
    picker: {
        width: '100%',
    },
});

export default AddChargeScreen;
