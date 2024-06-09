import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import api from '../api';

type LocalsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Locals'>;

interface Location {
    _id: string;
    long: string;
    lat: string;
    type: string;
    rate: number;
    status: string;
    urlPhoto: string;
    user: string;
}

interface LocalScreenProps {
    userId: string | null;
}

const LocalScreen: React.FC<LocalScreenProps> = ({ userId }) => {
    const navigation = useNavigation<LocalsScreenNavigationProp>();
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLocations = async () => {
        try {
            setRefreshing(true);
            const response = await api.get(`/locals/user/${userId}`);
            setLocations(response.data);
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, [userId]);

    const handleCreateLocal = () => {
        navigation.navigate('AddLocal');
    };

    const handleLocationPress = (id: string) => {
        navigation.navigate('LocalDetail', { locationId: id });
    };
    const handleModifyLocation = (id: string) => {
        navigation.navigate('ModifyLocal', { locationId: id });
    };

    const handleDeleteLocal = async (id: string) => {
        Alert.alert(
            'Delete Location',
            'Are you sure you want to delete this location?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        try {
                            await api.delete(`/locals/${id}`);
                            fetchLocations();
                        } catch (error) {
                            console.error('Error deleting location:', error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const renderLocationItem = ({ item }: { item: Location }) => (
        <View style={styles.locationItem}>
            <TouchableOpacity onPress={() => handleLocationPress(item._id)} style={styles.locationInfo}>
                <Text style={styles.locationName}>{item.type}</Text>
                <Text style={styles.locationAddress}>{item.status}</Text>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => handleDeleteLocal(item._id)} style={styles.button}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleModifyLocation(item._id)} style={styles.button}>
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
                data={locations}
                renderItem={renderLocationItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
                refreshing={refreshing}
                onRefresh={fetchLocations}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleCreateLocal}>
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
    locationItem: {
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
    locationInfo: {
        flex: 1,
    },
    locationName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationAddress: {
        fontSize: 14,
        color: 'gray',
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

export default LocalScreen;
