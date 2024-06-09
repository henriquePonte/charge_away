import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../types/types';
import api from '../api';
import {StackNavigationProp} from "@react-navigation/stack";

type LocalDetailScreenRouteProp = RouteProp<RootStackParamList, 'LocalDetail'>;

interface Location {
    _id: string;
    long: string;
    lat: string;
    type: string;
    status: string;
    address: string;
    imageBase64: string;
    user: string;
}

interface Charger {
    _id: string;
    portType: string;
    status: string;
    costPerWatt: number;
}

interface User {
    _id: string;
    name: string;
}

const LocalDetailScreen: React.FC = () => {
    const route = useRoute<LocalDetailScreenRouteProp>();
    const {locationId} = route.params;
    const [location, setLocation] = useState<Location | null>(null);
    const [chargers, setChargers] = useState<Charger[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'LocalDetail'>>();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const locationResponse = await api.get(`/locals/${locationId}`);
                setLocation(locationResponse.data);

                const chargersResponse = await api.get(`/chargers/local/${locationId}`);
                setChargers(chargersResponse.data);
                console.log("user" + locationResponse.data.user);
                const userResponse = await api.get(`/users/${locationResponse.data.user}`);
                setUser(userResponse.data);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [locationId]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {location && (
                <>
                    <Image source={{uri: `data:image/jpeg;base64,${location.imageBase64}`}} style={styles.photo}/>
                    <Text style={styles.locationType}>{location.type}</Text>
                    <Text style={styles.locationStatus}>{location.status}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Availability', {locationId: location._id})}>
                        <Text style={styles.calendarButton}>📅</Text>
                    </TouchableOpacity>


                    <Text style={styles.locationDetail}>Longitude: {location.long}</Text>
                    <Text style={styles.locationDetail}>Latitude: {location.lat}</Text>
                    <Text style={styles.locationDetail}>Address: {location.address}</Text>
                    {user && <Text style={styles.locationDetail}>Place Owner: {user.name}</Text>}

                </>
            )}

            <Text style={styles.sectionTitle}>Chargers:</Text>
            <FlatList
                data={chargers}
                keyExtractor={charger => charger._id}
                renderItem={({item}) => (
                    <View>
                        <Text>Port Type: {item.portType}</Text>
                        <Text>Status: {item.status}</Text>
                        <Text>Cost Per Watt: {item.costPerWatt}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    photo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignSelf: 'center',
        marginVertical: 16,
    },
    locationType: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    locationStatus: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 16,
    },
    locationDetail: {
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    calendarButton: {
        fontSize: 24,
        textAlign: 'center',
        marginTop: 10,
    },
});

export default LocalDetailScreen;
