import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { RootStackParamList } from '../types/types';
import api from '../api';

type ChargersScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chargers'>;

interface Charger {
    _id: string;
    portType: string;
    status: string;
}

interface ChargerScreenProps {
    userId: string | null;
}

const ChargersScreen: React.FC<ChargerScreenProps> = ({ userId }) => {
    const navigation = useNavigation<ChargersScreenNavigationProp>();
    const [chargers, setChargers] = useState<Charger[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchChargers = async () => {
        try {
            const response = await api.get(`/chargers/`);
            setChargers(response.data);
        } catch (error) {
            console.error('Error fetching chargers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChargers();
    }, [userId]);

    // const handleCreateLocal = () => {
    //     navigation.navigate('AddCharger');
    // };

    // const handleDeleteLocal = async (id: string) => {
    //     try {
    //         await api.delete(`/chargers/${id}`);
    //         fetchChargers();
    //     } catch (error) {
    //         console.error('Error deleting charger:', error);
    //     }
    // };

    const renderLocationItem = ({ item }: { item: Charger }) => (
        <View style={styles.locationItem}>
            <Text style={styles.locationName}>{item.portType}</Text>
            <Text style={styles.locationAddress}>{item.status}</Text>
            <Menu>
                <MenuTrigger>
                    <Ionicons name="settings-sharp" size={24} color="black" />
                </MenuTrigger>
                <MenuOptions>
                    {/*<MenuOption onSelect={() => handleDeleteLocal(item._id)}>*/}
                    {/*    <Text style={styles.menuOptionText}>Eliminar</Text>*/}
                    {/*</MenuOption>*/}
                    <MenuOption onSelect={() => {/* Código para modificar */}}>
                        <Text style={styles.menuOptionText}>Modificar</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => {/* Código para adicionar*/}}>
                        <Text style={styles.menuOptionText}>Adicionar Carregador</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
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
                data={chargers}
                renderItem={renderLocationItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContainer}
            />
            {/*<TouchableOpacity style={styles.addButton} onPress={handleCreateLocal}>*/}
            {/*    <Ionicons name="add" size={24} color="white" />*/}
            {/*</TouchableOpacity>*/}
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
    },
    locationName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationAddress: {
        fontSize: 14,
        color: 'gray',
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
    menuOptionText: {
        fontSize: 16,
        padding: 10,
    },
});

export default ChargersScreen;
