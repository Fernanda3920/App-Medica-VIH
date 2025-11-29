import { useEffect } from 'react';
import { View, Button, Platform, Alert } from 'react-native'; 
import * as Notifications from 'expo-notifications';
import { collection, query, orderBy, startAt, limit, getDocs } from "firebase/firestore";
import { getFirestore } from 'firebase/firestore'; 

// --- Configuración de Notificaciones (Fuera del componente/hook) ---

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,  // ✅ Reemplaza shouldShowAlert
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// --- Función de Utilidad ---

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
    
    // 3. Obtiene un documento aleatorio de Firestore
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

    // 4. ✅ NUEVA VERSIÓN: Programa mensajes motivacionales diarios (CON TRIGGERDATE)
    const scheduleDailyMotivationalMessages = async (hour, minute) => {
        const hasPermission = await registerForPushNotificationsAsync();
        if (!hasPermission) {
            console.log('❌ Sin permisos de notificaciones');
            return [];
        }

        try {
            const db = getFirestore(); 
            let dimensions = ['Alimentacion', 'ActividadFisica', 'Estigma', 'Farmaco'];
            
            console.log(`📅 Programando mensajes motivacionales a partir de las ${hour}:${minute}...`);
            
            // ✅ SOLO CANCELAR NOTIFICACIONES MOTIVACIONALES (no las de medicamentos)
            const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
            for (const notification of allScheduled) {
                if (notification.content?.data?.type === 'MOTIVATION' || 
                    notification.content?.data?.type === 'DAILY_CHECKUP') {
                    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
                }
            }
            console.log('🗑️ Notificaciones motivacionales previas canceladas (medicamentos intactos)');

            const notificationIds = [];
            const daysToSchedule = 30;

            for (let day = 0; day < daysToSchedule; day++) {
                const shuffledDimensions = shuffleArray([...dimensions]);
                
                for (let i = 0; i < shuffledDimensions.length; i++) {
                    const dimension = shuffledDimensions[i];
                    
                    let notifMinute = minute + i;
                    let notifHour = hour;
                    
                    if (notifMinute >= 60) {
                        notifHour = (hour + Math.floor(notifMinute / 60)) % 24;
                        notifMinute = notifMinute % 60;
                    }
                    
                    const triggerDate = new Date();
                    triggerDate.setDate(triggerDate.getDate() + day);
                    triggerDate.setHours(notifHour, notifMinute, 0, 0);
                    
                    if (triggerDate > new Date()) {
                        try {
                            const randomDoc = await getRandomDocument(db, dimension);
                            
                            if (randomDoc) {
                                const message = randomDoc.data().mensaje;
                                const messageId = randomDoc.id;
                                
                                const notificationId = await Notifications.scheduleNotificationAsync({
                                    content: {
                                        title: `🌟 ${dimension}`,
                                        body: message,
                                        sound: true,
                                        priority: 'high',
                                        data: { 
                                            type: 'MOTIVATION', // ← Identificador para cancelar solo estas
                                            dimension,
                                            resourceId: messageId,
                                            scheduledTime: `${notifHour}:${String(notifMinute).padStart(2, '0')}`,
                                            date: triggerDate.toISOString()
                                        },
                                    },
                                    trigger: { type: 'date', date: triggerDate },
                                });
                                
                                notificationIds.push(notificationId);
                            }
                        } catch (error) {
                            console.error(`Error con ${dimension} el día ${day}:`, error);
                        }
                    }
                }
                
                let finalMinute = minute + dimensions.length;
                let finalHour = hour;
                
                if (finalMinute >= 60) {
                    finalHour = (hour + Math.floor(finalMinute / 60)) % 24;
                    finalMinute = finalMinute % 60;
                }
                
                const finalTriggerDate = new Date();
                finalTriggerDate.setDate(finalTriggerDate.getDate() + day);
                finalTriggerDate.setHours(finalHour, finalMinute, 0, 0);
                
                if (finalTriggerDate > new Date()) {
                    try {
                        const notificationId = await Notifications.scheduleNotificationAsync({
                            content: {
                                title: "📝 Tarea del día",
                                body: "¡Es momento de tu seguimiento de bienestar!",
                                sound: true,
                                priority: 'high',
                                data: { 
                                    type: 'DAILY_CHECKUP', // ← Identificador para cancelar solo estas
                                    scheduledTime: `${finalHour}:${String(finalMinute).padStart(2, '0')}`,
                                    date: finalTriggerDate.toISOString()
                                },
                            },
                            trigger: { type: 'date', date: finalTriggerDate },
                        });
                        
                        notificationIds.push(notificationId);
                    } catch (error) {
                        console.error(`Error con recordatorio final el día ${day}:`, error);
                    }
                }
            }

            console.log(`✅ ${notificationIds.length} notificaciones motivacionales programadas para ${daysToSchedule} días`);
            console.log(`📊 Total: ${dimensions.length} dimensiones + 1 recordatorio = 5 notificaciones por día`);
            
            return notificationIds;

        } catch (error) {
            console.error('❌ Error al programar mensajes motivacionales:', error);
            Alert.alert('Error', 'No se pudieron programar los mensajes motivacionales');
            return [];
        }
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
            onPressCustom(); 
        } else {
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