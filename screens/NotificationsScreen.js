import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { styles } from './styles/NotificationsScreen';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebaseService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// --- Configuración de notificaciones ---
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const FIXED_HOUR = 22;
const FIXED_MINUTE = 0;
const DAYS_TO_SCHEDULE = 30;
const categorias = ["ActividadFisica", "Alimentacion", "Estigma", "Farmaco"];

// --- Utilidades ---
const getLocalDateString = (date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const normalize = (text) =>
    text.normalize("NFD").replace(/[\u0300-\u036f¿?.,!]/g, "").toLowerCase().trim();

const getOpcionesRespuesta = (preguntaTexto) => {
    const normalized = normalize(preguntaTexto);
    if (normalized.includes("como te sientes ahora mismo")) {
        return ["Enojado", "Ansioso", "Contento", "Miedo", "Alegría", "Tristeza", "Preocupación"];
    }
    if (normalized.includes("como te sientes contigo mismo")) {
        return ["Humillado", "Confiado", "Avergonzado", "Culpable", "Orgulloso", "Autocompasivo"];
    }
    return ["Sí", "No"];
};

// --- Componente principal ---
export default function NotificationsScreen() {
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false); 
    const [preguntas, setPreguntas] = useState([]);
    const [loadingPreguntas, setLoadingPreguntas] = useState(true);
    const [respuestas, setRespuestas] = useState({});
    const [fechaHoy, setFechaHoy] = useState(getLocalDateString());

    // --- Lógica para verificar el estado de la notificación ---
 const checkNotificationStatus = async () => {
        const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
        const motivacionalScheduled = allScheduled.some(n => n.content?.data?.type === 'motivacional');
        setIsScheduled(motivacionalScheduled);
    };
    const fetchPreguntas = async (fecha) => {
        setLoadingPreguntas(true);
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Usuario no autenticado");

            const seguimientoRef = doc(db, "Usuarios", user.uid, "Seguimiento", fecha);
            const seguimientoSnap = await getDoc(seguimientoRef);

            if (seguimientoSnap.exists()) {
                const data = seguimientoSnap.data();
                const preguntasDelDia = Object.entries(data).map(([id, obj]) => ({
                    id,
                    pregunta: obj.pregunta,
                    categoria: obj.categoria,
                    respuesta: obj.respuesta || null,
                }));
                setPreguntas(preguntasDelDia);

                const nuevasRespuestas = {};
                preguntasDelDia.forEach(p => {
                    nuevasRespuestas[p.id] = p.respuesta;
                });
                setRespuestas(nuevasRespuestas);

                console.log(`🟢 Registro ya existe para ${fecha}, respuestas bloqueadas`);
            } else {
                // Generar preguntas aleatorias
                const todasPreguntas = [];
                for (const categoria of categorias) {
                    const colRef = collection(db, "Recursos", categoria, "Preguntas");
                    const snapshot = await getDocs(colRef);

                    if (!snapshot.empty) {
                        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), categoria }));
                        if (categoria === "Estigma") {
                            todasPreguntas.push(...docs);
                        } else {
                            const randomIndex = Math.floor(Math.random() * docs.length);
                            todasPreguntas.push(docs[randomIndex]);
                        }
                    } else {
                        todasPreguntas.push({
                            id: `no-preguntas-${categoria}`,
                            pregunta: `No hay preguntas disponibles para ${categoria}.`,
                            categoria
                        });
                    }
                }
                setPreguntas(todasPreguntas);
                console.log(`💾 Preguntas generadas aleatoriamente para ${fecha}`);
            }
        } catch (error) {
            console.error("Error al obtener preguntas:", error);
            Alert.alert("Error", "No se pudieron cargar las preguntas desde la base de datos.");
        } finally {
            setLoadingPreguntas(false);
        }
    };
    // 🆕 MODIFICADA: Programar notificaciones automáticamente al cargar
const autoScheduleNotifications = async () => {
    try {
        setIsScheduling(true); // 🆕 Mostrar spinner desde el inicio
        
        // Verificar si ya están programadas
        const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
        const motivacionalScheduled = allScheduled.some(n => n.content?.data?.type === 'motivacional');
        
        if (motivacionalScheduled) {
            console.log('✅ Notificaciones ya están programadas');
            setIsScheduled(true);
            setIsScheduling(false); // 🆕 Ocultar spinner
            return;
        }

        // Si no están programadas, programarlas automáticamente
        console.log('🔔 Programando notificaciones automáticamente...');
        const ids = await scheduleNotifications();
        
        if (ids.length > 0) {
            setIsScheduled(true);
            console.log(`✅ ${ids.length} notificaciones programadas automáticamente`);
        }
    } catch (error) {
        console.error('Error al programar notificaciones automáticamente:', error);
    } finally {
        setIsScheduling(false); // 🆕 Siempre ocultar spinner al terminar
    }
};

// 🆕 MODIFICADO: Cargar pareguntas y programar notificaciones automáticamente
useEffect(() => {
    const initializeScreen = async () => {
        await fetchPreguntas(fechaHoy);
        await checkNotificationStatus();
        await autoScheduleNotifications(); // 🆕 Esto ahora maneja el spinner internamente
    };
    
    initializeScreen();
}, []);

    // --- Cargar preguntas y verificar estado de notificaciones al montar ---
   useEffect(() => {
        const initializeScreen = async () => {
            await fetchPreguntas(fechaHoy);
            await checkNotificationStatus();
            await autoScheduleNotifications(); // 🆕 Programar automáticamente
        };
        
        initializeScreen();
    }, []);
    // --- Detectar cambio de día ---
   useEffect(() => {
        const interval = setInterval(() => {
            const nuevaFecha = getLocalDateString();
            if (nuevaFecha !== fechaHoy) {
                console.log("🕛 Nuevo día detectado, recargando preguntas...");
                setFechaHoy(nuevaFecha);
                setRespuestas({});
                fetchPreguntas(nuevaFecha);
            }
        }, 60 * 1000);
        return () => clearInterval(interval);
    }, [fechaHoy]);

    const handleGuardarRespuesta = async (categoria, preguntaId, preguntaTexto, respuestaUsuario) => {
        if (!preguntaId || preguntaId.startsWith('no-preguntas')) {
            Alert.alert("Info", "Esta pregunta no se puede responder.");
            return;
        }

        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert("Error", "Usuario no autenticado.");
                return;
            }

            const fechaActual = fechaHoy;
            const seguimientoRef = doc(db, "Usuarios", user.uid, "Seguimiento", fechaActual);

            await setDoc(
                seguimientoRef,
                {
                    [preguntaId]: {
                        categoria: categoria,
                        pregunta: preguntaTexto,
                        respuesta: respuestaUsuario,
                        fechaRespuesta: new Date().toLocaleString(),
                    },
                },
                { merge: true }
            );

            setRespuestas(prev => ({ ...prev, [preguntaId]: respuestaUsuario }));

            const mensajesCol = collection(db, "Recursos", categoria, "Mensajes");
            const mensajesSnap = await getDocs(mensajesCol);

            if (!mensajesSnap.empty) {
                const docs = mensajesSnap.docs.map(doc => doc.data());
                const randomIndex = Math.floor(Math.random() * docs.length);
                const mensajeMotivacional = docs[randomIndex].mensaje || "";
                if (mensajeMotivacional) Alert.alert("💡 Motivación", mensajeMotivacional);
            }

        } catch (error) {
            console.error("Error al guardar respuesta:", error);
            Alert.alert("Error", "No se pudo guardar la respuesta.");
        }
    };

    const scheduleNotifications = async () => {
        try {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Alert.alert('Permiso Denegado', 'Necesitas habilitar notificaciones.');
                return [];
            }

            const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
            for (const n of allScheduled) {
                if (n.content?.data?.type === 'motivacional') {
                    await Notifications.cancelScheduledNotificationAsync(n.identifier);
                }
            }
            console.log("🗑️ Notificaciones anteriores canceladas.");

            const notificationIds = [];
            if (preguntas.length === 0) return [];

            for (let day = 0; day < DAYS_TO_SCHEDULE; day++) {
                const triggerDate = new Date();
                triggerDate.setDate(triggerDate.getDate() + day);
                triggerDate.setHours(FIXED_HOUR, FIXED_MINUTE, 0, 0);

                if (triggerDate > new Date()) {
                    const id = await Notifications.scheduleNotificationAsync({
                        content: {
                            title: "💬 Seguimiento Diario",
                            body: "Recuerda completar tu seguimiento diario de bienestar.",
                            sound: true,
                            data: { type: 'motivacional' },
                        },
                        trigger: triggerDate,
                    });
                    notificationIds.push(id);
                }
            }

            console.log(`✅ ${notificationIds.length} notificaciones programadas`);
            return notificationIds;
        } catch (error) {
            console.error('Error al programar notificaciones:', error);
            Alert.alert("Error", "Ocurrió un error al programar las notificaciones.");
            return [];
        }
    };

     const handleProgramNotifications = async () => {
        if (loadingPreguntas) {
            Alert.alert("Espera", "Cargando preguntas antes de programar.");
            return;
        }

        Alert.alert(
            '🔄 Reprogramar Recordatorios',
            'Esto cancelará todos los recordatorios anteriores y creará nuevos para los próximos 30 días.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Reprogramar',
                    onPress: async () => {
                        setIsScheduling(true);
                        const ids = await scheduleNotifications();
                        setIsScheduling(false);

                        if (ids.length > 0) {
                            setIsScheduled(true);
                            Alert.alert(
                                '✅ Completado', 
                                `Se reprogramaron ${ids.length} recordatorios para los próximos ${DAYS_TO_SCHEDULE} días a las ${FIXED_HOUR}:${String(FIXED_MINUTE).padStart(2, '0')}.`
                            );
                        } else {
                            setIsScheduled(false);
                            Alert.alert(
                                '⚠️ Advertencia',
                                'No se pudo programar las notificaciones. Verifica los permisos.'
                            );
                        }
                    }
                }
            ]
        );
    };

   const formatCategoryName = (category) => {
        if (category === "Estigma") return "Sentimiento";
        return category.replace(/([A-Z])/g, ' $1').trim();
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            
            {/* === ZONA DE CONTENIDO SCROLLABLE === */}
            {/* Ahora todo el contenido, incluyendo el header, está dentro del ScrollView para que se mueva */}
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* === ZONA DEL ENCABEZADO (AHORA SCROLLABLE) === */}
                <View style={styles.headerWithNotification}>
                    {/* IZQUIERDA: Ícono y Título */}
                    <View style={styles.titleContainer}>
                        <Ionicons name="document-text-outline" size={36} color="#007AFF" /> 
                        <Text style={styles.mainTitle}>Seguimiento Diario</Text>
                    </View>

                    {/* DERECHA: Botón de Notificación con Badge */}
                   <TouchableOpacity
    style={styles.notificationButton}
    onPress={handleProgramNotifications}
    disabled={isScheduling}
>
    {/* Spinner a la izquierda */}
    {isScheduling && (
        <ActivityIndicator 
            size="small"
            color="#007AFF"
            style={{ marginRight: 8 }}
        />
    )}

    {/* Campanita */}
    <MaterialCommunityIcons 
        name={isScheduled ? "bell-ring-outline" : "bell-outline"}
        size={30}
        color={
            isScheduling
                ? "#9ca3af" // gris mientras carga
                : (isScheduled ? "#007AFF" : "#9ca3af")
        }
    />

    {/* Badge */}
    {isScheduled && !isScheduling && (
        <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>
                {DAYS_TO_SCHEDULE}
            </Text>
        </View>
    )}
</TouchableOpacity>

                </View>
                <Text style={styles.subtitleFixed}>
                    Responde las preguntas motivacionales con Sí o No y lleva tu registro.
                </Text>
                
                {/* === PREGUNTAS === */}
                {loadingPreguntas ? (
                    <ActivityIndicator size="large" color="#27ae60" style={{ marginTop: 30 }} />
                ) : (
                    preguntas.map((p, index) => {
                        return (
                            <View key={p.id || index} style={styles.questionCard}>
                                <Text style={styles.categoryTitle}>{formatCategoryName(p.categoria)}</Text>
                                <Text style={styles.questionText}>💭 {p.pregunta || `Pregunta ${index + 1}`}</Text>
                                {p.id && !p.id.startsWith('no-preguntas-') && (
                                    <View style={styles.buttonRow}>
                                        {getOpcionesRespuesta(p.pregunta).map(opcion => (
                                            <TouchableOpacity
                                                key={opcion}
                                                style={[
                                                    styles.responseButton,
                                                    respuestas[p.id] === opcion ? styles.yesButtonSelected : styles.yesButton,
                                                    !!respuestas[p.id] && styles.buttonDisabled
                                                ]}
                                                onPress={() => handleGuardarRespuesta(p.categoria, p.id, p.pregunta, opcion)}
                                                disabled={!!respuestas[p.id]}
                                            >
                                                <Text style={[styles.buttonText, respuestas[p.id] === opcion && { color: 'white' }]}>{opcion}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}
                            </View>
                        );
                    })
                )}

            </ScrollView>
        </SafeAreaView>
    );
}