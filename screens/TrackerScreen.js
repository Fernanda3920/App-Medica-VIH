// screens/TrackerScreen.js
import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MedicationTrackerScreen from '../components/MedicationTrackerScreen';
import { styles } from './styles/TrackerScreen';
export default function TrackerScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <MedicationTrackerScreen/>
        </SafeAreaView>
    );
}
