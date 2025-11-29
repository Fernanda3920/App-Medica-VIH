import { useEffect } from 'react';
import { View, Button, Platform, Alert } from 'react-native'; 
import * as Notifications from 'expo-notifications';
import { collection, query, orderBy, startAt, limit, getDocs } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore'; 

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true, // Cambié de shouldShowBanner a shouldShowAlert (más moderno en Expo)
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// --- Hook de Notificaciones ---

export function useNotifications() {
    
    // 1. Solicita y registra permisos
    const registerForPushNotificationsAsync = async () => {
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            Alert.alert('Permiso Denegado', 'Falló la obtención del permiso para notificaciones push.');
            return false; 
        }
        
        return true; 
    };

    // 2. Programa una notificación local con retraso
    const scheduleDelayedNotification = async (title, body, seconds = 2, data = {}) => {
        const hasPermission = await registerForPushNotificationsAsync();

        if (hasPermission) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title || "🔔 Recordatorio", 
                    body: body || '¡Notificación local disparada!',
                    data: { timestamp: new Date().toISOString(), ...data },
                },
                trigger: { seconds: seconds },
            });
            console.log(`Notificación programada: ${title}`);
        }
    };
    
    // 3. Programa una notificación diaria a una hora específica
    const scheduleDailyTimeNotification = async (title, body, hour, minute, data = {}) => {
        const hasPermission = await registerForPushNotificationsAsync();

        if (hasPermission) {
            const now = new Date();
            const triggerDate = new Date();
            triggerDate.setHours(hour, minute, 0, 0);
            
            // Si ya pasó hoy, programar para mañana
            if (triggerDate <= now) {
                triggerDate.setDate(triggerDate.getDate() + 1);
            }

            // Nota: El trigger debe ser un objeto con 'hour', 'minute', 'repeats: true'
            // para notificaciones diarias repetitivas, o un Date object para una sola vez.
            // Para repetición diaria:
            const dailyTrigger = {
                hour,
                minute,
                repeats: true
            };

            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title || "🔔 Recordatorio", 
                    body: body || '¡Notificación diaria!',
                    sound: true,
                    priority: 'high',
                    data: { timestamp: new Date().toISOString(), ...data }, 
                },
                trigger: dailyTrigger, // Uso el trigger para repetición diaria
            });
            
            console.log(`✅ ${title} programada para las ${hour}:${minute} diariamente.`);
        }
    };
    
    // 4. Obtiene un documento aleatorio de Firestore
    const getRandomDocument = async (db, dimension) => {
        const subCollectionPath = `Recursos/${dimension}/Mensajes`;
        const randomStart = Math.random();
        let q = query(
            collection(db, subCollectionPath),
            orderBy("randomSort"),
            startAt(randomStart),
            limit(1)
        );

        let snapshot = await getDocs(q);

        // Si startAt no devuelve nada (porque randomStart es muy alto),
        // reinicia la búsqueda desde el principio (limit 1)
        if (snapshot.empty) {
            q = query(
                collection(db, subCollectionPath),
                orderBy("randomSort"),
                limit(1)
            );
            snapshot = await getDocs(q);
        }

        return snapshot.empty ? null : snapshot.docs[0];
    };

    // 5. Programa mensajes motivacionales diarios
    const scheduleDailyMotivationalMessages = async (hour, minute) => {
        const db = getFirestore(); 
        let dimensions = ['Alimentacion', 'ActividadFisica', 'Estigma', 'Farmaco'];
        
        dimensions = shuffleArray(dimensions);
        console.log(`Programando mensajes a partir de las ${hour}:${minute}...`);
        
        // **IMPORTANTE**: Cancelar solo las notificaciones motivacionales/diarias
        // puede ser mejor, pero la cancelación total es más simple para este ejemplo.
        await Notifications.cancelAllScheduledNotificationsAsync();

        for (let i = 0; i < dimensions.length; i++) {
            const dimension = dimensions[i];
            
            let notifMinute = minute + i;
            let notifHour = hour;
            
            // Ajustar hora si los minutos superan 60
            if (notifMinute >= 60) {
                notifHour = (hour + Math.floor(notifMinute / 60)) % 24;
                notifMinute = notifMinute % 60;
            }
            
            try {
                const randomDoc = await getRandomDocument(db, dimension);

                if (randomDoc) {
                    const message = randomDoc.data().mensaje;
                    const messageId = randomDoc.id; 
                    await scheduleDailyTimeNotification(
                        `🌟 ${dimension}`,
                        message,
                        notifHour,
                        notifMinute,
                        { type: 'MOTIVATION', dimension, resourceId: messageId }
                    );
                }
            } catch (error) {
                console.error(`Error con ${dimension}:`, error);
            }
        }
        
        // Programar la notificación de la Tarea del día
        let finalMinute = minute + dimensions.length;
        let finalHour = hour;
        
        if (finalMinute >= 60) {
            finalHour = (hour + Math.floor(finalMinute / 60)) % 24;
            finalMinute = finalMinute % 60;
        }
        
        await scheduleDailyTimeNotification(
            "📝 Tarea del día", 
            "¡Es momento de tu seguimiento de bienestar!", 
            finalHour, 
            finalMinute,
            { type: 'DAILY_CHECKUP' }
        );

        console.log(`✅ ${dimensions.length + 1} notificaciones diarias programadas`);
    };

    // Solicita permisos al cargar el componente que usa el hook
    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);
    
    return { 
        scheduleLocalNotification: scheduleDelayedNotification, 
        scheduleDailyMotivationalMessages 
    };
}

// --- Componente de Botón de Ejemplo ---

export default function NotificationButton({ 
    title, 
    notificationTitle, 
    notificationBody, 
    delaySeconds = 1, 
    color = '#3498db',
    onPressCustom
}) {
    const { scheduleLocalNotification } = useNotifications(); 
    
    const handlePress = () => {
        if (onPressCustom) {
            // Permite una función personalizada al presionar
            onPressCustom(); 
        } else {
            // Dispara la notificación local por defecto
            scheduleLocalNotification(
                notificationTitle, 
                notificationBody, 
                delaySeconds
            );
        }
    };

    return (
        <View style={{ marginVertical: 10 }}>
            <Button
                title={title}
                onPress={handlePress}
                color={color}
            />
        </View>
    );
}
