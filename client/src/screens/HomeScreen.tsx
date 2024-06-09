import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import api from '../api';
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../types/types";

interface Local {
    _id: string;
    lat: string;
    long: string;
    type: string;
    rate: number;
    status: string;
    user: string;
}

interface HomeScreenProps {
    userId: string | null;
}
const HomeScreen: React.FC<HomeScreenProps> = ({ userId }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [locals, setLocals] = useState<Local[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [initialRegion, setInitialRegion] = useState<{
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    }>({
        latitude: 37.73333,
        longitude: -25.66667,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [selectedLocal, setSelectedLocal] = useState<Local | null>(null);
    const [selectedLocalImage, setSelectedLocalImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchLocals = async () => {
            try {
                const { status } = await requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    throw new Error('Permission to access location was denied');
                }

                const { coords } = await getCurrentPositionAsync({});

                setInitialRegion({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });

                setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });

                const response = await api.get<Local[]>(`/locals/closest?lat=${coords.latitude}&long=${coords.longitude}`);

                if (response.data && Array.isArray(response.data)) {
                    setLocals(response.data);
                } else {
                    setError('Unexpected response format');
                }
            } catch (err) {
                setError(getErrorMessage(err));
            } finally {
                setLoading(false);
            }
        };

        fetchLocals();
    }, []);

    const getErrorMessage = (error: unknown): string => {
        if (error instanceof Error) {
            return error.message;
        }
        return 'An unknown error occurred';
    };

    const handleCenterMap = async () => {
        try {
            const { status } = await requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                throw new Error('Permission to access location was denied');
            }

            const { coords } = await getCurrentPositionAsync({});
            setInitialRegion({
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
        } catch (err) {
            console.error('Error getting current location:', err);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim() === '') {
            return;
        }

        try {
            const response = await api.get<Local[]>(`/locals/search?query=${searchQuery}`);

            if (response.data && Array.isArray(response.data)) {
                setLocals(response.data);
            } else {
                setError('Unexpected response format');
            }
        } catch (err) {
            setError(getErrorMessage(err));
        }
    };

    const handleSelectLocal = async (local: Local) => {
        setSelectedLocal(local);
        try {
            const response = await api.get(`/locals/${local._id}/photo`);
            setSelectedLocalImage(response.data.imageBase64);
        } catch (err) {
            console.error('Error getting local photo:', err);
            setSelectedLocalImage(null);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchBarContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Pesquisar locais"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Ionicons name="search" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <MapView
                style={styles.map}
                initialRegion={initialRegion}
            >
                {userLocation && (
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude,
                        }}
                        title="Localização do utilizador"
                    >
                        <Ionicons name="car-sport" size={24} color="blue" />
                    </Marker>
                )}
                {locals.map((local) => {
                    const latitude = parseFloat(local.lat);
                    const longitude = parseFloat(local.long);

                    if (isNaN(latitude) || isNaN(longitude)) {
                        console.error(`Invalid coordinates for local with ID ${local._id}`);
                        return null;
                    }

                    return (
                        <Marker
                            key={local._id}
                            coordinate={{ latitude, longitude }}
                            title={local.type}
                            description={`Rate: ${local.rate}, Status: ${local.status}`}
                            onPress={() => handleSelectLocal(local)}
                        />
                    );
                })}
            </MapView>
            {selectedLocal && (
                <View style={styles.detailContainer}>
                    {selectedLocalImage && (
                        <Image source={{ uri: `data:image/jpeg;base64,${selectedLocalImage}` }} style={styles.detailImage} />
                    )}
                    <View style={styles.detailTextContainer}>
                        <Text style={styles.detailType}>{selectedLocal.type}</Text>
                        <Text>Rate: {selectedLocal.rate}</Text>
                        <Text>Status: {selectedLocal.status}</Text>
                        <TouchableOpacity
                            style={styles.reserveButton}
                            onPress={() => {
                                if (selectedLocal) {
                                    navigation.navigate('AddCharge', { locationId: selectedLocal._id, userId: userId ? userId : '' });
                                }
                            }}
                        >
                            <Text style={styles.reserveButtonText}>Reservar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            )}
            <TouchableOpacity style={styles.button} onPress={handleCenterMap}>
                <Ionicons name="locate" size={22} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    searchBar: {
        flex: 1,
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    searchButton: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: 'grey',
        borderRadius: 5,
    },
    map: {
        flex: 1,
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'grey',
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    detailImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    detailTextContainer: {
        flex: 1,
        marginLeft: 10,
    },
    detailType: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    reserveButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
        alignItems: 'center',
    },
    reserveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default HomeScreen;
