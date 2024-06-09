import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../types/types"; // Import your configured axios instance

interface User {
    _id: string;
    email: string;
    name: string;
    localidade: string;
    imageBase64: string; // URL or base64 string
    urlPhoto: string; // URL or base64 string
}

const AccountScreen: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                console.log('Retrieved userId:', userId);
                if (userId) {
                    const response = await api.get(`/users/${userId}`);
                    console.log('API Response:', response.data);
                    setUser(response.data);
                } else {
                    console.error('No user ID found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>No user data found.</Text>
            </View>
        );
    }

    const handleLogout = () => {
        AsyncStorage.clear()
            .then(() => {
                console.log('AsyncStorage successfully cleared!');
            })
            .catch((error) => {
                console.error('Error clearing AsyncStorage:', error);
            });
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: `data:image/jpeg;base64,${user.imageBase64}`}} style={styles.photo} />
            <Text style={styles.text}>{user.name}</Text>
            <Text style={styles.text}>{user.email}</Text>
            <Text style={styles.text}>{user.localidade}</Text>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.ButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    photo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignSelf: 'center',
        marginVertical: 16,
    },
    text: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',
    },
    ButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: 'rgba(20, 37, 59, 1)',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
});

export default AccountScreen;
