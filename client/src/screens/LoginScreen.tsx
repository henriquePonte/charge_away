import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ImageSourcePropType } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import api from '../api';
import { RootStackParamList } from '../types/types';

interface LoginScreenProps {
    onLogin: (id: string, token: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleLogin = async () => {
        try {
            const response = await api.post('/users/login', { email, password });

            if (response.status === 200) {
                const user = response.data;
                onLogin(user._id, user.token);
                navigation.navigate('Home');
            } else {
                console.error('Login failed:', response.statusText);
                Alert.alert('Error', 'Login failed: ' + response.statusText);
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Login error:', error);
                Alert.alert('Error', 'Login error: ' + error.message);
            } else {
                console.error('Unknown error:', error);
                Alert.alert('Error', 'Unknown error occurred');
            }
        }
    };

    const handleRegister = () => {
        navigation.navigate('Register');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={styles.title}>Dados de Acesso</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Registar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 250, // Ajuste de acordo com o tamanho da sua imagem
        height: 250, // Ajuste de acordo com o tamanho da sua imagem
        marginBottom: 50,
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
    registerButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    registerButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
