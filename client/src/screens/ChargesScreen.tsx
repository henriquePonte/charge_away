import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import api from '../api';

interface Charge {
    _id: string;
    date: Date;
    duration: Date;
    wattConsumed: number;
    rate: number;
    cost: number;
    initialHour: Date;
    finalHour: Date;
    status: string;
    user: string;
}

interface ChargeScreenProps {
    userId: string | null;
}

const ChargesScreen: React.FC<ChargeScreenProps> = ({ userId }) => {
    const [charges, setCharges] = useState<Charge[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        if (userId) {
            fetchCharges();
        }
    }, [userId]);

    const fetchCharges = async () => {
        if (!userId) return;

        setLoading(true);
        try {
            console.log('Fetching charges for userId:', userId);
            const response = await api.get(`/charges/${userId}`);
            setCharges(response.data);
        } catch (error) {
            console.error('Error fetching charges:', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelCharge = async (id: string) => {
        setLoading(true);
        try {
            await api.delete(`/charges/${id}`);
            setCharges(charges.filter(charge => charge._id !== id));
            Alert.alert('Success', 'Charge canceled successfully');
        } catch (error) {
            console.error('Error canceling charge:', error);
            Alert.alert('Error', 'Failed to cancel charge');
        } finally {
            setLoading(false);
        }
    };

    const confirmCancelCharge = (id: string) => {
        Alert.alert(
            'Confirm Cancelation',
            'Are you sure you want to cancel this charge?',
            [
                {
                    text: 'No',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => cancelCharge(id),
                },
            ],
            { cancelable: false }
        );
    };

    const handleModifyCharge = (charge: Charge) => {
        //navigation.navigate('ModifyChargeScreen', { charge });
    };

    const formatNumber = (num?: number) => {
        if (num !== undefined && num !== null) {
            return num.toLocaleString();
        } else {
            return '';
        }
    };


    const formatDate = (dateString?: Date) => {
        if (dateString) {
            return moment(dateString).format('YYYY-MM-DD HH:mm:ss');
        } else {
            return '';
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : charges.length === 0 ? (
                <Text style={styles.noChargesText}>No Charges Available</Text>
            ) : (
                <FlatList
                    data={charges}
                    renderItem={({ item }) => (
                        <View style={styles.chargeItem}>
                            <Text style={styles.boldText}>Status:</Text><Text> {item.status}</Text>
                            <Text style={styles.boldText}>Date:</Text><Text> {formatDate(item.date)}</Text>
                            <Text style={styles.boldText}>Duration:</Text><Text> {formatDate(item.duration)}</Text>
                            <Text style={styles.boldText}>Watt Consumed:</Text><Text> {formatNumber(item.wattConsumed)}</Text>
                            <Text style={styles.boldText}>Rate:</Text><Text> {item.rate}</Text>
                            <Text style={styles.boldText}>Cost:</Text><Text> {formatNumber(item.cost)}</Text>
                            <Text style={styles.boldText}>Initial Hour:</Text><Text> {formatDate(item.initialHour)}</Text>
                            <Text style={styles.boldText}>Final Hour:</Text><Text> {formatDate(item.finalHour)}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={styles.modifyButton}
                                    onPress={() => handleModifyCharge(item)}
                                >
                                    <FontAwesome name="edit" size={24} color="blue" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => confirmCancelCharge(item._id)}
                                >
                                    <FontAwesome name="trash" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={fetchCharges} />
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    noChargesText: {
        textAlign: 'center',
        fontSize: 16,
        marginVertical: 20,
    },
    chargeItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    boldText: {
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modifyButton: {
        marginRight: 10,
    },
    cancelButton: {},
});

export default ChargesScreen;