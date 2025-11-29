import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, getUserProfile } from './services/firebaseService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LocaleConfig } from 'react-native-calendars';
import NetInfo from '@react-native-community/netinfo'; // 🆕 AGREGAR ESTO

// --- Screens ---
import NotificationsScreen from './screens/NotificationsScreen';
import TrackerScreen from './screens/TrackerScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CompleteProfileScreen from './screens/ProfileScreen';
import ProfileScreenWrapper from './screens/ProfileScreenWrapper';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import DashboardScreen from './screens/DashboardScreen';
import EstadoEmocionalScreen from './screens/EstadoEmocionalScreen';
import NoConnectionScreen from './screens/NoConnectionScreen'; // 🆕 AGREGAR ESTO

// --- Configuración calendario ---
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// -----------------------
// AppStack (Barra de Pestañas Principal)
// -----------------------
function AppStack({ user }) {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#5d8d59ff',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: {
          backgroundColor: '#024731',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: '#ffffffff',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleAlign: 'center',
        headerTitleStyle: { fontWeight: '700', color: '#ffffffff', fontSize: 18 },
        sceneContainerStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Tab.Screen
        name="Progreso"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" color={color} size={size} />,
          title: 'Progreso',
        }}
      />
      
      <Tab.Screen
        name="Seguimiento"
        component={TrackerScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="bar-chart" color={color} size={size} />,
          title: 'Medicamento',
        }}
      />

      {user?.tipoUsuario === 'Usuario A' && (
        <Tab.Screen
          name="Notificaciones"
          component={NotificationsScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="notifications" color={color} size={size} />,
            title: 'Diario',
          }}
        />
      )}

      {user?.tipoUsuario === 'Usuario A' && (
        <Tab.Screen
          name="EstadoEmocional"
          component={EstadoEmocionalScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
            title: 'Emoción',
          }}
        />
      )}

      <Tab.Screen
        name="Perfil"
        component={ProfileScreenWrapper}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
          title: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}

// -----------------------
// AuthStack
// -----------------------
function AuthStack({ onRegisterSuccess }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register">
        {(props) => <RegisterScreen {...props} onRegisterSuccess={onRegisterSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// -----------------------
// App principal
// -----------------------
export default function App() {
  const [user, setUser] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true); // 🆕 AGREGAR ESTO

  // 🆕 AGREGAR ESTE useEffect PARA DETECTAR CONEXIÓN
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Restaurar sesión al iniciar la app
  useEffect(() => {
    const restoreUser = async () => {
      try {
        const storedUid = await AsyncStorage.getItem('userUid');
        if (storedUid) {
          const profile = await getUserProfile(storedUid);
          if (profile) setUser({ uid: storedUid, tipoUsuario: profile.tipoUsuario });
        }
      } catch (e) {
        console.log('Error restaurando sesión:', e);
      }
      setLoading(false);
    };
    restoreUser();
  }, []);

  // 🔹 Escuchar cambios de sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        await AsyncStorage.setItem('userUid', currentUser.uid);
        const profile = await getUserProfile(currentUser.uid);
        if (profile && profile.tipoUsuario) {
          setUser({ ...currentUser, tipoUsuario: profile.tipoUsuario });
          setShowProfileForm(false);
        } else {
          setUser(currentUser);
          setShowProfileForm(true);
        }
      } else {
        await AsyncStorage.removeItem('userUid');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleShowProfileForm = () => setShowProfileForm(true);

  const handleProfileComplete = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const profile = await getUserProfile(currentUser.uid);
      if (profile?.tipoUsuario) {
        setUser({ ...currentUser, tipoUsuario: profile.tipoUsuario });
        setShowProfileForm(false);
      }
    }
  };

  // 🆕 FUNCIÓN PARA REINTENTAR CONEXIÓN
  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
  };

  // 🆕 SI NO HAY CONEXIÓN, MOSTRAR PANTALLA
  if (!isConnected) {
    return <NoConnectionScreen onRetry={handleRetry} />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#024731" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="Auth">
              {() => <AuthStack onRegisterSuccess={handleShowProfileForm} />}
            </Stack.Screen>
          ) : showProfileForm ? (
            <Stack.Screen name="CompleteProfile">
              {(props) => <CompleteProfileScreen {...props} onProfileComplete={handleProfileComplete} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Main">
              {() => <AppStack user={user} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});