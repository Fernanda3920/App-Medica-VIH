import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { auth, db, getUserProfile } from '../services/firebaseService';
import { collection, query, where, getDocs, limit, orderBy, onSnapshot } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles/DashboardScreen';

const DOSIS_POR_DIA = 3; // Cada medicamento se toma 3 veces al día

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ProgressBar = ({ progress }) => {
  const progressPercent = Math.max(0, Math.min(100, progress));
  let barColor = '#50b848';
  if (progress < 80) barColor = '#f39c12';
  if (progress < 50) barColor = '#e44b43';

  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${progressPercent}%`, backgroundColor: barColor }]} />
    </View>
  );
};

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [adherence, setAdherence] = useState(0);
  const [totalExpected, setTotalExpected] = useState(0);
  const [totalTaken, setTotalTaken] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let unsubscribe = () => {};
      let isActive = true;

      const calculateAdherence = async () => {
        if (isActive) {
          setLoading(true);
          setError(null);
        }

        const userId = auth.currentUser?.uid;
        if (!userId) {
          if (isActive) setLoading(false);
          return;
        }

        try {
          // 1. Obtener el perfil del usuario
          const profile = await getUserProfile(userId);
          if (!profile || !profile.medicacionVIH) {
            if (isActive) {
              setError("Perfil incompleto. Ve a 'Perfil' y selecciona tus medicamentos.");
              setLoading(false);
            }
            return;
          }

          // 2. Contar medicamentos activos (en true)
          const activeMeds = Object.keys(profile.medicacionVIH).filter(
            (key) => profile.medicacionVIH[key] === true
          );

          if (activeMeds.length === 0) {
            if (isActive) {
              setError('No tienes medicamentos activos en tu perfil.');
              setLoading(false);
            }
            return;
          }

          // 3. 🆕 Determinar fecha de inicio del cálculo
          let startCalculationDate;
          
          // Función auxiliar para convertir cualquier formato de fecha
          const parseDate = (dateField) => {
            if (!dateField) return null;
            
            // Si es Timestamp de Firestore
            if (dateField.toDate && typeof dateField.toDate === 'function') {
              return dateField.toDate();
            }
            
            // Si es string ISO
            if (typeof dateField === 'string') {
              return new Date(dateField);
            }
            
            // Si ya es Date
            if (dateField instanceof Date) {
              return dateField;
            }
            
            return null;
          };
          
          // Prioridad 1: Si existe fechaUltimoCambioMedicacion, usar esa
          if (profile.fechaUltimoCambioMedicacion) {
            startCalculationDate = parseDate(profile.fechaUltimoCambioMedicacion);
          } 
          // Prioridad 2: Si no existe, usar la fecha de creación del perfil
          else if (profile.fechaCreacion) {
            startCalculationDate = parseDate(profile.fechaCreacion);
          } else if (profile.createdAt) {
            startCalculationDate = parseDate(profile.createdAt);
          }
          
          // Validar que tengamos una fecha válida
          if (!startCalculationDate || isNaN(startCalculationDate.getTime())) {
            if (isActive) {
              setError('No se pudo determinar la fecha de inicio del tratamiento.');
              setLoading(false);
            }
            return;
          }

          // Formatear fecha para mostrar
          if (isActive) {
            setStartDate(
              startCalculationDate.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            );
          }

          // 4. Calcular días transcurridos desde la fecha de inicio hasta HOY
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Normalizar a medianoche
          startCalculationDate.setHours(0, 0, 0, 0); // Normalizar a medianoche
          
          const timeDiff = today - startCalculationDate;
          const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir el día actual

          // 5. Calcular dosis programadas totales
          // Fórmula: medicamentos_activos × 3 × días_transcurridos
          const calculatedExpected = activeMeds.length * DOSIS_POR_DIA * daysPassed;

          // 6. 🆕 Obtener solo las tomas DESDE la fecha de inicio del cálculo
          const startDateFormatted = getFormattedDate(startCalculationDate);
          const q = query(
            collection(db, 'Usuarios', userId, 'TomasDiarias'),
            where('fecha', '>=', startDateFormatted)
          );

          // 7. Escuchar cambios en tiempo real
          unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
              let calculatedTaken = 0;
              
              // 🆕 Contar solo las dosis de medicamentos que están activos actualmente
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.tomas) {
                  Object.values(data.tomas).forEach((medsInHour) => {
                    Object.values(medsInHour).forEach((medRecord) => {
                      // 🆕 Solo contar si el medicamento está activo Y fue tomado
                      const medName = medRecord.medicamentoNombre;
                      const isActiveMed = activeMeds.includes(medName);
                      
                      if (medRecord.tomado === true && isActiveMed) {
                        calculatedTaken += 1;
                      }
                    });
                  });
                }
              });

              // 8. Calcular adherencia
              if (isActive) {
                setTotalTaken(calculatedTaken);
                setTotalExpected(calculatedExpected);
                
                if (calculatedExpected > 0) {
                  const adherencePercentage = (calculatedTaken / calculatedExpected) * 100;
                  setAdherence(adherencePercentage);
                } else {
                  setAdherence(0);
                }
                
                setLoading(false);
              }
            },
            (err) => {
              console.error('Error en listener de adherencia:', err);
              if (isActive) {
                setError('Ocurrió un error al cargar tu progreso en tiempo real.');
                setLoading(false);
              }
            }
          );
        } catch (error) {
          console.error('Error al calcular adherencia:', error);
          if (isActive) {
            setError('Ocurrió un error al calcular tu progreso.');
            setLoading(false);
          }
        }
      };

      calculateAdherence();

      return () => {
        isActive = false;
        unsubscribe();
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00723F" />
        <Text style={styles.loadingText}>Calculando progreso...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#e34a42" />
        <Text style={styles.errorTitle}>Sin datos</Text>
        <Text style={styles.errorSubtitle}>{error}</Text>
      </View>
    );
  }

  const adherencePercent = adherence.toFixed(0);

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.header}>
        <Ionicons name="stats-chart-outline" size={36} color="#007AFF" />
        <Text style={styles.mainTitle}>Tu progreso</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Porcentaje de seguimiento de tu plan de fármacos</Text>
        <Text style={styles.percentText}>{adherencePercent}%</Text>
        <ProgressBar progress={adherence} />
        <Text style={styles.subText}>Desde el {startDate}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Detalles</Text>
        <View style={styles.statsRow}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#50b848" />
          <Text style={styles.statsLabel}>Dosis Tomadas</Text>
          <Text style={[styles.statsValue, styles.takenText]}>{totalTaken}</Text>
        </View>
        <View style={styles.statsRow}>
          <Ionicons name="timer-outline" size={20} color="#20419A" />
          <Text style={styles.statsLabel}>Dosis Esperadas</Text>
          <Text style={styles.statsValue}>{totalExpected}</Text>
        </View>
        {adherence < 100 && (
          <View style={styles.statsRow}>
            <Ionicons name="close-circle-outline" size={20} color="#e44b43" />
            <Text style={styles.statsLabel}>Dosis Omitidas</Text>
            <Text style={[styles.statsValue, styles.missedText]}>{totalExpected - totalTaken}</Text>
          </View>
        )}
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" style={{ marginBottom: 8 }} />
        <Text style={styles.infoText}>
          Este cálculo compara todas las dósis que debiste tomar (según tus medicamentos activos × 3 tomas diarias) con las que marcaste como "Tomadas".
        </Text>
      </View>
    </ScrollView>
  );
}