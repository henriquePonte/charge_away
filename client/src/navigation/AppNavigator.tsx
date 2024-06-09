import React, {useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RegisterScreen from '../screens/RegisterScreen';
import {RootStackParamList} from '../types/types';
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ModifyChargeScreen from '../screens/ModifyChargeScreen';

const Stack = createStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
    setAuthenticated: (authenticated: boolean) => void;
    setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({setAuthenticated, setUserId}) => {
    const [userId, setLocalUserId] = useState<string | null>(null);

    const handleLogin = async (id: string, token: string) => {
        try {
            await AsyncStorage.setItem('authToken', token);
            await AsyncStorage.setItem('userId', id);

            setAuthenticated(true);
            console.log('Authenticated:', true);
            console.log(id);
            setUserId(id);
            setLocalUserId(id);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Stack.Navigator initialRouteName="LoginScreen">
            <Stack.Screen name="LoginScreen" children={() => <LoginScreen onLogin={handleLogin}/>}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
        </Stack.Navigator>
    );
};

export default AppNavigator;
