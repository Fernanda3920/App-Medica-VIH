import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles/NoConnectionScreen';

const NoConnectionScreen = ({ onRetry }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="wifi-outline" size={64} color="#ef4444" />
          <View style={styles.slash} />
        </View>

        <Text style={styles.title}>Sin Conexión a Internet</Text>
        
        <Text style={styles.description}>
          Necesitas estar conectado a internet para usar esta aplicación.
        </Text>

        <View style={styles.steps}>
          <Text style={styles.stepsTitle}>Verifica que:</Text>
          <Text style={styles.stepItem}>• WiFi o datos móviles estén activados</Text>
          <Text style={styles.stepItem}>• Estés dentro del rango de tu red</Text>
          <Text style={styles.stepItem}>• El modo avión esté desactivado</Text>
        </View>

        <TouchableOpacity 
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.retryText}>Reintentar Conexión</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default NoConnectionScreen;