import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  Alert, 
  Image,
  Text, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Switch,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, saveLoginPreference, getLoginPreference } from '../services/firebaseService'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { styles } from './styles/LoginScreen';
import logo from '../assets/icon.png';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar preferencia guardada al iniciar
  useEffect(() => {
    loadLoginPreference();
  }, []);

  const loadLoginPreference = async () => {
    const preference = await getLoginPreference();
    setKeepLoggedIn(preference);
  };

  const handleLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Campos vacíos', 'Por favor, introduce tu correo y contraseña.');
      return;
    }
    setIsLoading(true); 

    try {
      // Guardar la preferencia del usuario
      await saveLoginPreference(keepLoggedIn);
      
      // Iniciar sesión
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('¡Usuario logueado!', userCredential.user.email);
      
      // Si el usuario NO quiere mantener sesión, programar cierre
      if (!keepLoggedIn) {
        // Cerrar sesión después de 30 minutos de inactividad
        // Esto es opcional - puedes ajustar el tiempo o implementar tu propia lógica
        console.log('Sesión temporal - se cerrará al cerrar la app');
      }
      
    } catch (error) {
      let friendlyMessage = "Error al iniciar sesión.";
      if (error.code === 'auth/user-not-found' || 
          error.code === 'auth/wrong-password' || 
          error.code === 'auth/invalid-credential') {
        friendlyMessage = "Correo o contraseña incorrectos.";
      } else if (error.code === 'auth/invalid-email') {
        friendlyMessage = "El formato del correo no es válido.";
      }
      Alert.alert('Error de Login', friendlyMessage);
    } finally {
      setIsLoading(false); 
    }
  };

  const toggleKeepLoggedIn = () => {
    setKeepLoggedIn(previousState => !previousState);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.backgroundShapes}>
        <View style={[styles.shape, styles.shapeTopLeft]} />
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.subtitle}>Inicia sesión para continuar.</Text>
        
        <Text style={styles.inputLabel}>Correo Electrónico</Text> 
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons 
            name="email" 
            size={20} 
            color="#388b79" 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.inputField}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
        </View>
        
        <Text style={styles.inputLabel}>Contraseña</Text> 
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons 
            name="lock" 
            size={20} 
            color="#388b79" 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.passwordInputField}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            editable={!isLoading}
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

        {/* Switch para mantener sesión iniciada 
        <View style={styles.keepLoggedInContainer}>
          <Text style={styles.keepLoggedInText}>Mantener sesión iniciada</Text>
          <Switch
            trackColor={{ false: '#d1d5db', true: '#86efac' }}
            thumbColor={keepLoggedIn ? '#388b79' : '#f3f4f6'}
            ios_backgroundColor="#d1d5db"
            onValueChange={toggleKeepLoggedIn}
            value={keepLoggedIn}
            disabled={isLoading}
          />
        </View>*/}

        {/* Enlace de Olvidaste Contraseña */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotPasswordLink}
        >
          <Text style={styles.forgotPasswordText}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>

        {/* Botón de Ingresar */}
        <TouchableOpacity 
          style={[
            styles.loginButton, 
            isLoading && styles.loginButtonDisabled
          ]} 
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={isLoading} 
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" /> 
          ) : (
            <Text style={styles.loginButtonText}>Ingresar</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')} 
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta? {' '}
            <Text style={styles.registerLinkText}>Regístrate aquí</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}