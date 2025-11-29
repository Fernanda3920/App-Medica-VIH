// screens/MedicationTrackerScreen.js
import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    Platform,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import CalendarView from '../components/DateSelectorCalendar'; 
import { styles } from './styles/MedicationTrackerScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { 
    auth, 
    getUserProfile, 
    toggleMedicationIntake, 
    getMedicationIntakesForDay
} from '../services/firebaseService';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowBanner: true,  
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

// ===== FUNCIONES DE UTILIDAD =====
const getTodayMidnight = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return today;
};

const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const FIXED_INTAKE_TIMES = ['6:00', '14:00', '22:00']; 

const requestNotificationPermissions = async () => {
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
        Alert.alert('Permiso Denegado', 'Necesitas habilitar notificaciones para recibir recordatorios.');
        return false;
    }
    
    return true;
};

const scheduleMedicationNotifications = async (medications) => {
    try {
        const hasPermission = await requestNotificationPermissions();
        if (!hasPermission) {
            console.log('❌ Sin permisos de notificaciones');
            return [];
        }

        const allScheduled = await Notifications.getAllScheduledNotificationsAsync();
        for (const notification of allScheduled) {
            if (notification.content?.data?.medicationName) {
                await Notifications.cancelScheduledNotificationAsync(notification.identifier);
            }
        }
        console.log('🗑️ Notificaciones de medicamentos previas canceladas');

        const notificationIds = [];
        const daysToSchedule = 30;

        for (let day = 0; day < daysToSchedule; day++) {
            for (const timeStr of FIXED_INTAKE_TIMES) {
                const [hour, minute] = timeStr.split(':').map(Number);
                
                for (const medName of medications) {
                    const triggerDate = new Date();
                    triggerDate.setDate(triggerDate.getDate() + day);
                    triggerDate.setHours(hour, minute, 0, 0);
                    
                    if (triggerDate > new Date()) {
                        try {
                            const notificationId = await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: `💊 Recordatorio de Medicamento`,
                                    body: `Es hora de tomar: ${medName}`,
                                    sound: true,
                                    priority: 'high',
                                    data: { 
                                        medicationName: medName,
                                        scheduledTime: timeStr,
                                        date: triggerDate.toISOString()
                                    },
                                },
                                trigger: { type: 'date', date: triggerDate },
                            });
                            
                            notificationIds.push(notificationId);
                        } catch (error) {
                            console.error(`Error programando ${medName}:`, error);
                        }
                    }
                }
            }
        }

        console.log(`✅ ${notificationIds.length} notificaciones programadas`);
        return notificationIds;
        
    } catch (error) {
        console.error('❌ Error al programar notificaciones:', error);
        return [];
    }
};

// ===== COMPONENTE PRINCIPAL =====
export default function MedicationTrackerScreen() {
    const [loading, setLoading] = useState(true);
    const [medications, setMedications] = useState([]); 
    const [dailyIntakes, setDailyIntakes] = useState({}); 
    const [currentDate, setCurrentDate] = useState(getTodayMidnight()); 
    const [notificationsScheduled, setNotificationsScheduled] = useState(false);
    const [accountCreationDate, setAccountCreationDate] = useState(null);
    const [isScheduling, setIsScheduling] = useState(false);
    const formattedDate = getFormattedDate(currentDate);

// ===== EFECTO: CARGAR DATOS =====
useEffect(() => {
    const loadData = async () => {
        setLoading(true);
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            return;
        }

        try {
            const profile = await getUserProfile(userId);
            
            console.log('🔍 === DIAGNÓSTICO COMPLETO ===');
            console.log('Profile recibido:', profile);
            console.log('createdAt existe?:', profile?.createdAt);
            console.log('createdAt valor:', profile?.createdAt);
            console.log('createdAt tipo:', typeof profile?.createdAt);
            
            if (profile?.createdAt) {
                console.log('✅ createdAt encontrado, procesando...');
                const utcDate = new Date(profile.createdAt);
                console.log('UTC Date object:', utcDate);

                if (!isNaN(utcDate.getTime())) {
                    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
                    const creationDate = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0);

                    console.log('🕐 Fecha local corregida:', creationDate);
                    console.log('📅 Legible:', creationDate.toLocaleDateString('es-MX', { dateStyle: 'full' }));

                    setAccountCreationDate(creationDate);
                } else {
                    console.warn('❌ Fecha inválida en createdAt:', profile.createdAt);
                }
            }
            
            // CARGAR MEDICAMENTOS Y PROGRAMAR NOTIFICACIONES AUTOMÁTICAMENTE
            if (medications.length === 0 && profile?.medicacionVIH) {
                const activeMeds = Object.keys(profile.medicacionVIH)
                    .filter(key => profile.medicacionVIH[key] === true);
                
                setMedications(activeMeds);
                
                // 🆕 ACTIVAR SPINNER MIENTRAS PROGRAMA
                if (activeMeds.length > 0) {
                    setIsScheduling(true); // 🆕 Mostrar spinner
                    console.log('🔔 Programando notificaciones automáticamente...');
                    const ids = await scheduleMedicationNotifications(activeMeds);
                    if (ids.length > 0) {
                        setNotificationsScheduled(true);
                        console.log(`✅ ${ids.length} notificaciones programadas automáticamente`);
                    }
                    setIsScheduling(false); // 🆕 Ocultar spinner
                }
            }
             setIsScheduling(false);
            const intakes = await getMedicationIntakesForDay(userId, formattedDate);
            setDailyIntakes(intakes);
            
        } catch (error) {
            console.error("Error al cargar datos:", error);
            Alert.alert('Error', 'No se pudieron cargar los datos.');
            setIsScheduling(false); // 🆕 Asegurar que se oculte en caso de error
        } finally {
            setLoading(false);
        }
    };

    loadData();
}, [formattedDate, medications.length]);

    const scheduledIntakes = useMemo(() => {
        const schedule = [];
        if (medications.length === 0) return [];
        
        FIXED_INTAKE_TIMES.forEach(time => {
            medications.forEach(medName => {
                const currentIntake = dailyIntakes[time]?.[medName];
                
                schedule.push({
                    key: `${time}-${medName}`,
                    time: time,
                    name: medName,
                    isTaken: currentIntake?.tomado || false,
                    horaReal: currentIntake?.horaReal || null,
                });
            });
        });
        return schedule.sort((a, b) => a.time.localeCompare(b.time));
    }, [medications, dailyIntakes]); 

    const handleToggleIntake = async (intake) => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        if (accountCreationDate && currentDate < accountCreationDate) {
            Alert.alert(
                '⚠️ Fecha no válida',
                `No puedes registrar tomas antes del ${accountCreationDate.toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}`
            );
            return;
        }

        if (currentDate > getTodayMidnight()) {
            Alert.alert('⚠️ Fecha futura', 'No puedes registrar tomas futuras.');
            return;
        }

        const newStatus = !intake.isTaken;

        try {
            await toggleMedicationIntake(
                userId, 
                formattedDate, 
                intake.time, 
                intake.name, 
                newStatus
            );
            
            setDailyIntakes(prev => {
                const newDailyIntakes = { ...prev };
                if (!newDailyIntakes[intake.time]) {
                    newDailyIntakes[intake.time] = {};
                }
                newDailyIntakes[intake.time][intake.name] = {
                    tomado: newStatus,
                    horaReal: newStatus ? new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : null,
                    medicamentoNombre: intake.name,
                };
                return newDailyIntakes;
            });
            
            const actionText = newStatus ? 'Tomada' : 'Desmarcada';
            Alert.alert('¡Éxito!', `${intake.name} fue marcado como ${actionText}.`);

        } catch (error) {
            console.error("Error al guardar toma:", error);
            Alert.alert('Error', 'No se pudo guardar el estado.');
        }
    };
    
    const changeDate = (days) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + days);
        newDate.setHours(0, 0, 0, 0);
        
        if (accountCreationDate && newDate < accountCreationDate) {
            Alert.alert(
                '⚠️ Límite alcanzado',
                'No puedes ver fechas anteriores a la creación de tu cuenta.'
            );
            return;
        }
        
        setCurrentDate(newDate);
    };

    const handleCalendarDateChange = (date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        
        if (accountCreationDate && newDate < accountCreationDate) {
            Alert.alert(
                '⚠️ Fecha no válida',
                `No puedes seleccionar fechas anteriores al ${accountCreationDate.toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })}.`
            );
            return;
        }
        
        setCurrentDate(newDate);
    };

   const handleReprogramNotifications = async () => {
    if (medications.length === 0) {
        Alert.alert('Sin Medicamentos', 'No hay medicamentos para programar.');
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
                    setIsScheduling(true); // 🆕 Activar el spinner
                    try {
                        const ids = await scheduleMedicationNotifications(medications);
                        if (ids.length > 0) {
                            setNotificationsScheduled(true);
                            Alert.alert(
                                '✅ Completado', 
                                `Se reprogramaron ${ids.length} recordatorios para los próximos 30 días.`
                            );
                        } else {
                            Alert.alert(
                                '⚠️ Advertencia',
                                'No se pudo programar las notificaciones. Verifica los permisos.'
                            );
                        }
                    } catch (error) {
                        console.error('Error reprogramando:', error);
                        Alert.alert('Error', 'No se pudieron reprogramar las notificaciones.');
                    } finally {
                        setIsScheduling(false); // 🆕 Desactivar el spinner
                    }
                }
            }
        ]
    );
};

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00723f" />
                <Text style={styles.loadingText}>Cargando seguimiento...</Text>
            </View>
        );
    }
    
    if (medications.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>¡Atención!</Text>
                <Text style={styles.emptyText}>
                    No tienes medicamentos ARV seleccionados. 
                    Ve a tu perfil y selecciona tus medicamentos.
                </Text>
            </View>
        );
    }

    const isFutureDate = currentDate > getTodayMidnight();
    const isBeforeAccountCreation = accountCreationDate && currentDate < accountCreationDate;
    const isDateDisabled = isFutureDate || isBeforeAccountCreation;

    const totalNotificationsCount = 
        medications.length * FIXED_INTAKE_TIMES.length * 30;
    
        return (
        <ScrollView
            style={styles.screenContainer}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
        >
           <View style={styles.header}>
    <View style={styles.titleContainer}>
        <Ionicons name="medical" size={32} color="#007AFF" />
        <Text style={styles.mainTitle}>Seguimiento Diario</Text>
    </View>
    
    {/* 🆕 QUITAR LA CONDICIÓN notificationsScheduled - Siempre mostrar la campanita */}
   <TouchableOpacity
    style={styles.notificationButton}
    onPress={handleReprogramNotifications}
    disabled={isScheduling}
>
    {isScheduling && (
        <ActivityIndicator 
            size="small"
            color="#007AFF"
            style={{ marginRight: 8 }}
        />
    )}
  <MaterialCommunityIcons 
        name={notificationsScheduled ? "bell-ring-outline" : "bell-outline"}
        size={30}
        color={
            isScheduling
                ? "#9ca3af"
                : (notificationsScheduled ? "#007AFF" : "#9ca3af")
        }
    />
    {/* Badge */}
    {notificationsScheduled && !isScheduling && (
        <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>
                {totalNotificationsCount > 99 ? "99+" : totalNotificationsCount}
            </Text>
        </View>
    )}
</TouchableOpacity>

</View>
<Text style={styles.subtitleFixed}>
                Esta sección te permite registrar la toma de medicamentos.
            </Text>
            <CalendarView
                currentDate={currentDate}
                onDateChange={handleCalendarDateChange}
                isVisible={true}
                onClose={() => {}}
            />

            <View style={styles.dateInfoContainer}>
                <Text style={styles.listTitle}>
                    Tomas para el día:{' '}
                    <Text style={{ color: '#00723F', fontWeight: 'bold' }}>
                        {currentDate.toLocaleDateString('es-MX', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </Text>
                </Text>

                {isBeforeAccountCreation && (
                    <View style={styles.warningBanner}>
                        <MaterialCommunityIcons name="alert-circle" size={20} color="#e74c3c" />
                        <Text style={styles.warningText}>
                            Esta fecha es anterior a la creación de tu cuenta. No puedes registrar tomas.
                        </Text>
                    </View>
                )}

                {isFutureDate && !isBeforeAccountCreation && (
                    <View style={styles.warningBanner}>
                        <MaterialCommunityIcons name="information" size={20} color="#f39c12" />
                        <Text style={styles.warningText}>
                            No puedes registrar tomas en fechas futuras.
                        </Text>
                    </View>
                )}

                <View style={styles.horizontalNav}>
                    <TouchableOpacity 
                        onPress={() => changeDate(-1)} 
                        style={[
                            styles.dateButton,
                            accountCreationDate && currentDate <= accountCreationDate && styles.dateButtonDisabled
                        ]}
                        disabled={accountCreationDate && currentDate <= accountCreationDate}
                    >
                        <Text style={[
                            styles.dateButtonText,
                            accountCreationDate && currentDate <= accountCreationDate && styles.dateButtonTextDisabled
                        ]}>
                            ← Anterior
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => changeDate(1)}
                        style={[
                            styles.dateButton,
                            formattedDate === getFormattedDate(getTodayMidnight()) && styles.dateButtonDisabled
                        ]}
                        disabled={formattedDate === getFormattedDate(getTodayMidnight())}
                    >
                        <Text
                            style={[
                                styles.dateButtonText,
                                formattedDate === getFormattedDate(getTodayMidnight()) &&
                                    styles.dateButtonTextDisabled,
                            ]}
                        >
                            Siguiente →
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {scheduledIntakes.map((intake) => (
                <TouchableOpacity
                    key={intake.key}
                    style={[
                        styles.intakeCard,
                        intake.isTaken && styles.intakeCardTaken,
                        isDateDisabled && styles.intakeCardDisabled,
                    ]}
                    onPress={() => handleToggleIntake(intake)}
                    disabled={isDateDisabled}
                >
                    <View style={styles.intakeTimeContainer}>
                        <Text style={styles.intakeTime}>{intake.time}</Text>
                        <Text style={styles.intakeName}>{intake.name}</Text>
                    </View>

                    <View
                        style={[
                            styles.statusBadge,
                            intake.isTaken ? styles.statusTaken : styles.statusPending,
                        ]}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            {intake.isTaken ? (
                                <MaterialCommunityIcons
                                    name="check-circle-outline"
                                    size={18}
                                    color="#00723f"
                                />
                            ) : (
                                <MaterialCommunityIcons name="clock-outline" size={18} color="#dd971A" />
                            )}
                            <Text
                                style={[
                                    styles.statusText,
                                    intake.isTaken ? styles.statusTextTaken : styles.statusTextPending,
                                ]}
                            >
                                {intake.isTaken ? 'Tomado' : 'Pendiente'}
                            </Text>
                        </View>

                        <Text style={styles.realTimeText}>
                            {intake.isTaken
                                ? intake.horaReal || 'Hora no registrada'
                                : isDateDisabled ? 'No disponible' : 'Toca para confirmar'}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}