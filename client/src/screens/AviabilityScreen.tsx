import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import api from '../api';

type AvailabilityScreenRouteProp = RouteProp<RootStackParamList, 'Availability'>;

interface Availability {
    _id: string;
    start: Date;
    end: Date;
    local: string;
}

const AvailabilityScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'AddAvailability'>>();
    const route = useRoute<AvailabilityScreenRouteProp>();
    const locationId = route.params.locationId;

    const [availabilities, setAvailabilities] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAvailabilities = async () => {
        try {
            setRefreshing(true);
            const response = await api.get(`/availabilities/local/${locationId}`);
            // console.log('response:', response);

            if (Array.isArray(response.data)) {
                const availabilitiesData = response.data.map((item: any) => ({
                    ...item,
                    start: new Date(item.start),
                    end: new Date(item.end),
                }));
                setAvailabilities(availabilitiesData);
            } else {
                console.error('Unexpected response data format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching availabilities:', error);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailabilities();
    }, [locationId]);

    const handleCreateAvailability = () => {
        navigation.navigate('AddAvailability', { locationId });
    };

    const handleModifyAvailability = (id: string) => {
        navigation.navigate('ModifyAvailability', { availabilityId: id });
    };

    const handleDeleteAvailability = async (id: string) => {
        Alert.alert(
            'Delete Availability',
            'Are you sure you want to delete this availability?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await api.delete(`/availabilities/${id}`);
                            fetchAvailabilities();
                        } catch (error) {
                            console.error('Error deleting availability:', error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const renderAvailabilityItem = ({ item }: { item: Availability }) => (
        <View style={styles.availabilityItem}>
            <View style={styles.availabilityInfo}>
                <Text style={styles.availabilityTime}>{item.start.toDateString()} - {item.end.toDateString()}</Text>
                {/*<Text>{item.local}</Text>*/}
            </View>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => handleDeleteAvailability(item._id)} style={styles.button}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleModifyAvailability(item._id)} style={styles.button}>
                    <Ionicons name="create-outline" size={24} color="green" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={availabilities}
                renderItem={renderAvailabilityItem}
                keyExtractor={(item) => item._id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing}
                onRefresh={fetchAvailabilities}
            />

            <TouchableOpacity style={styles.addButton} onPress={handleCreateAvailability}>
                <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContainer: {
        padding: 16,
    },
    availabilityItem: {
        backgroundColor: 'white',
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    availabilityInfo: {
        flex: 1,
    },
    availabilityTime: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        padding: 8,
        borderRadius: 8,
        marginLeft: 8,
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'blue',
        borderRadius: 30,
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AvailabilityScreen;
