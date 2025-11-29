import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  Text, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  ActivityIndicator // <-- ¡Importado para el spinner!
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseService';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { styles } from './styles/RegisterScreen';

export default function RegisterScreen({ navigation, onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true); 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('¡Usuario registrado!', userCredential.user.email);
      
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
      
    } catch (error) {
      let friendlyMessage = "Ocurrió un error.";
      if (error.code === 'auth/email-already-in-use') {
        friendlyMessage = "Este correo electrónico ya está registrado.";
      } else if (error.code === 'auth/invalid-email') {
        friendlyMessage = "El formato del correo no es válido.";
      }
      Alert.alert('Error de Registro', friendlyMessage);
    } finally {
        setIsLoading(false); 
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Crear una Cuenta</Text>
        
        {/* --- 2. INPUT DE CORREO ELECTRÓNICO (CON ESTILO MODERNO E ÍCONO) --- */}
  <Text style={styles.inputLabel}> Correo Electrónico</Text> 
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
        
        {/* 3. INPUT DE CONTRASEÑA */}
  <Text style={styles.inputLabel}>Contraseña</Text> 
        <View style={styles.passwordContainer}>
          <MaterialCommunityIcons name="lock" size={20} color="#226d70" style={styles.inputIcon} />
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
            style={styles.eyeIcon}
          >
            <MaterialCommunityIcons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={20} 
              color="#7f8c8d" 
            />
          </TouchableOpacity>
        </View>
        
        {/* 4. INPUT DE CONFIRMAR CONTRASEÑA */}
          <Text style={styles.inputLabel}>Confirmar Contraseña</Text> 
        <View style={styles.passwordContainer}>
          <MaterialCommunityIcons name="lock-check" size={20} color="#226d70" style={styles.inputIcon} />
          <TextInput
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
            style={styles.eyeIcon}
          >
            <MaterialCommunityIcons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={20} 
              color="#7f8c8d" 
            />
          </TouchableOpacity>
        </View>

        {/* --- 5. BOTÓN PRINCIPAL: REGISTRARSE (CON SPINNER) --- */}
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleRegister} 
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.loginButtonText}>Registrarme</Text>
          )}
        </TouchableOpacity>

        {/* --- 6. BOTÓN SECUNDARIO: INICIAR SESIÓN (ENLACE) --- */}
        <TouchableOpacity 
          style={styles.linkButtonContainer}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>¿Ya tienes cuenta? <Text style={styles.secondaryButtonLinkText}>Inicia Sesión</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}