// screens/ForgotPasswordScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { sendPasswordReset } from '../services/firebaseService';
import { styles } from './styles/ForgotPasswordScreen';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); 

  const handlePasswordReset = async () => {
    if (email === '') {
      Alert.alert('Campo vacío', 'Por favor, introduce tu correo electrónico.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(email);
      
      Alert.alert(
        'Correo Enviado',
        'Revisa tu bandeja de entrada (y spam) para restablecer tu contraseña. Serás redirigido al inicio de sesión.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      let friendlyMessage = "Error al enviar el correo.";
      if (error.code === 'auth/user-not-found') {
        friendlyMessage = "No se encontró ningún usuario con ese correo electrónico.";
      } else if (error.code === 'auth/invalid-email') {
        friendlyMessage = "El formato del correo no es válido.";
      }
      Alert.alert('Error', friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <Text style={styles.subtitle}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Text>
                <Text 
    style={{ 
      marginBottom: 10,
      color: '#636363ff', 
    }} 
  >
    Correo Electrónico
  </Text>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email" size={20} color="#226d70" style={styles.inputIcon} />
          <TextInput
            style={styles.inputField}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handlePasswordReset} 
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Enviar Correo</Text>
          )}
        </TouchableOpacity>

        {/* --- BOTÓN SECUNDARIO (Volver) --- */}
        <TouchableOpacity 
          style={styles.linkButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.secondaryButtonText}>
                <Text style={styles.secondaryButtonLinkText}>Volver a Inicio de Sesión</Text>
            </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}