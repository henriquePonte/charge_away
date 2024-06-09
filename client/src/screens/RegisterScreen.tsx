import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import api from '../api';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from '../types/types';

const RegisterScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [location, setLocation] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleRegister = async () => {
        if (!selectedImage) {
            Alert.alert('Error', 'Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        // formData.append('confirmPassword', confirmPassword);
        formData.append('localidade', location);
        formData.append('urlPhoto', {
            uri: selectedImage,
            name: selectedImage.split('/').pop(),
            type: 'image/jpeg',
        } as any);

        try {
            const response = await api.post('/users', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Registration successful');
                navigation.navigate('LoginScreen');
            } else {
                Alert.alert('Error', 'Registration failed: ' + response.status);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', 'Registration error: ' + error.message);
            } else {
                Alert.alert('Error', 'Unknown error occurred');
            }
        }
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
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Dados de Registo</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirmar Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Localidade"
                value={location}
                onChangeText={setLocation}
            />
            <TouchableOpacity onPress={pickImage}>
                <Text style={styles.imagePickerText}>Escolha uma imagem</Text>
            </TouchableOpacity>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    logo: {
        width: 150 ,
        height: 150,
        marginBottom: 40,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        width: '100%',
    },
    button: {
        backgroundColor: 'rgba(20, 37, 59, 1)',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    imagePickerText: {
        color: 'red',
        marginBottom: 10,
    },
    image: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
});

export default RegisterScreen;
