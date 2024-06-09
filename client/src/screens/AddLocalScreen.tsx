import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Image, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { requestForegroundPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import api from '../api';

interface AddLocalScreenProps {
    userId: string | null;
}

type AddLocalScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddLocal'>;

const AddLocalScreen: React.FC<AddLocalScreenProps> = ({ userId }) => {
    const navigation = useNavigation<AddLocalScreenNavigationProp>();
    const [localData, setLocalData] = useState({
        long: '',
        lat: '',
        type: '',
        status: '',
        urlPhoto: '',
        address: '',
        user: userId,
    });

    const [selectedLocation, setSelectedLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        getLocation();
    }, []);

    const getLocation = async () => {
        const { status } = await requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            setLoading(false);
            return;
        }

        const location = await getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        setLocalData({ ...localData, long: longitude.toString(), lat: latitude.toString() });
        setSelectedLocation({ latitude, longitude });
        setLoading(false);
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && 'assets' in result) {
            const imageUri = result.assets[0].uri;
            setSelectedImage(imageUri);
            setLocalData({ ...localData, urlPhoto: imageUri });
        }
    };

    const handleCreateLocal = async () => {
        if (!localData.urlPhoto) {
            Alert.alert('Error', 'Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('long', localData.long);
        formData.append('lat', localData.lat);
        formData.append('type', localData.type);
        formData.append('status', localData.status);
        formData.append('address', localData.address);
        formData.append('user', localData.user || '');

        formData.append('imageData', {
            uri: localData.urlPhoto,
            name: localData.urlPhoto.split('/').pop(),
            type: 'image/jpeg',
        } as any);

        try {
            const response = await api.post('/locals', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                setLocalData({
                    long: '',
                    lat: '',
                    type: '',
                    status: '',
                    urlPhoto: '',
                    address: '',
                    user: userId,
                });
                setSelectedImage(null);
                Alert.alert('Success', 'Local created successfully');
                navigation.navigate('Locals');
            } else {
                console.error('Failed to create local:', response.statusText);
                Alert.alert('Error', 'Failed to create local');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error creating local:', error.message);
            } else {
                console.error('Error creating local:', error);
            }
            Alert.alert('Error', 'Error creating local');
        }
    };

    const handleMapPress = (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setLocalData({ ...localData, long: longitude.toString(), lat: latitude.toString() });
        setSelectedLocation({ latitude, longitude });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <>
                    <Text style={styles.title}>New Local</Text>
                    <MapView
                        style={styles.map}
                        onPress={handleMapPress}
                        initialRegion={{
                            latitude: selectedLocation ? selectedLocation.latitude : 0,
                            longitude: selectedLocation ? selectedLocation.longitude : 0,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {selectedLocation && (
                            <Marker coordinate={selectedLocation} />
                        )}
                    </MapView>
                    <TextInput
                        style={styles.input}
                        placeholder="Type"
                        value={localData.type}
                        onChangeText={(text) => setLocalData({ ...localData, type: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Status"
                        value={localData.status}
                        onChangeText={(text) => setLocalData({ ...localData, status: text })}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={localData.address}
                        onChangeText={(text) => setLocalData({ ...localData, address: text })}
                    />
                    <TouchableOpacity onPress={pickImage}>
                        <Text style={styles.imagePickerText}>Pick an image</Text>
                    </TouchableOpacity>
                    {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
                    <TouchableOpacity style={styles.createButton} onPress={handleCreateLocal}>
                        <Text style={styles.createButtonText}>Create</Text>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    map: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    imagePickerText: {
        color: 'blue',
        marginBottom: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    createButton: {
        backgroundColor: 'tomato',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    createButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddLocalScreen;

