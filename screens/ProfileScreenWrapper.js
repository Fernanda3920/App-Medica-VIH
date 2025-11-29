// screens/ProfileScreenWrapper.js

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { styles } from './styles/ProfileScreenWrapper';
import InformationProfileScreen from '../components/InformationProfileScreen';
export default function ProfileScreenWrapper() {
    return (
        <SafeAreaView style={styles.container}>
            <InformationProfileScreen/>
        </SafeAreaView>
    );
}
