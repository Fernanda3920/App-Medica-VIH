import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { auth, db } from '../services/firebaseService';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './styles/EstadoEmocionalStyles';

const DIAS_ANALISIS = 30; 

const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const clasificarEmocion = (emocion) => {
  const emocionTrimmed = (emocion || '').trim();
  const emocionesPositivas = [
    'Contento', 'bien', 'Alegria', 'Confiado', 'Autocompasivo'
  ];
  
  const emocionesNegativas = [
    'Enojado', 'Ansioso', 'Miedo', 'Tristeza', 'Preocupación', 'Humillado', 
    'Avergonzado', 'Orgulloso'
  ];
  if (emocionesPositivas.includes(emocionTrimmed)) {
    return 'positiva';
  } else if (emocionesNegativas.includes(emocionTrimmed)) {
    return 'negativa';
  }
  return 'neutral';
};

// Obtener color según estado emocional
const getColorPorEstado = (porcentajePositivas) => {
  if (porcentajePositivas >= 70) return '#50b848';
  if (porcentajePositivas >= 50) return '#febe10';
  if (porcentajePositivas >= 30) return '#e67e22';
  return '#e34a42';
};

// Obtener mensaje motivacional
const getMensajeMotivacional = (porcentajePositivas) => {
  if (porcentajePositivas >= 80) {
    return '¡Excelente! Tu estado emocional es muy positivo. Sigue así 💪';
  } else if (porcentajePositivas >= 60) {
    return 'Tu estado emocional es bueno. Continúa cuidándote 🌟';
  } else if (porcentajePositivas >= 40) {
    return 'Has tenido días difíciles. Recuerda que no estás solo 💙';
  } else {
    return 'Tu bienestar emocional es importante. Considera recibir algo de apoyo';
  }
};

const ProgressBar = ({ progress, color }) => {
  const progressPercent = Math.max(0, Math.min(100, progress));

  return (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${progressPercent}%`, backgroundColor: color }]} />
    </View>
  );
};

export default function EstadoEmocionalScreen() {
  const [loading, setLoading] = useState(true);
  const [totalRespuestas, setTotalRespuestas] = useState(0);
  const [respuestasPositivas, setRespuestasPositivas] = useState(0);
  const [respuestasNegativas, setRespuestasNegativas] = useState(0);
  const [respuestasNeutrales, setRespuestasNeutrales] = useState(0);
  const [porcentajePositivas, setPorcentajePositivas] = useState(0);
  const [diasConRegistro, setDiasConRegistro] = useState(0);
  const [error, setError] = useState(null);
  const [ultimasEmociones, setUltimasEmociones] = useState([]);
  useFocusEffect(
    useCallback(() => {
      const analizarEstadoEmocional = async () => {
        setLoading(true);
        setError(null);

        const userId = auth.currentUser?.uid;
        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          // 1. Calcular fecha de inicio (últimos 30 días)
          const today = new Date();
          const startDate = new Date();
          startDate.setDate(today.getDate() - DIAS_ANALISIS);
          const startDateFormatted = getFormattedDate(startDate);

          console.log('📅 Fecha inicio:', startDateFormatted);
          const q = query(
            collection(db, 'Usuarios', userId, 'Seguimiento')
          );

          const querySnapshot = await getDocs(q);
          let contadorPositivas = 0;
          let contadorNegativas = 0;
          let contadorNeutrales = 0;
          let totalRespuestasEmocionales = 0;
          const diasRegistrados = new Set();
          const emocionesRecientes = [];

          // 3. Analizar cada documento de seguimiento
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            const fechaDocumento = doc.id; 
            
            console.log('📄 Procesando documento:', fechaDocumento);

            if (fechaDocumento >= startDateFormatted) {
              diasRegistrados.add(fechaDocumento);

              // Buscar preguntas de la categoría "Estigma" (estado emocional)
              Object.keys(data).forEach(key => {
                if (key === 'id' || key === 'fecha') return;
                
                const pregunta = data[key];
                if (!pregunta || typeof pregunta !== 'object') return;
                
                if (pregunta.categoria === 'Estigma') {
                  const respuesta = pregunta.respuesta || '';
                  const clasificacion = clasificarEmocion(respuesta);
                  
                  console.log(`  ❤️ Estigma encontrado: "${respuesta}" → ${clasificacion}`);
                  
                  totalRespuestasEmocionales++;
                  
                  if (clasificacion === 'positiva') {
                    contadorPositivas++;
                  } else if (clasificacion === 'negativa') {
                    contadorNegativas++;
                  } else {
                    contadorNeutrales++;
                  }

                  // Guardar últimas 5 emociones para mostrar
                  if (emocionesRecientes.length < 5) {
                    emocionesRecientes.push({
                      fecha: fechaDocumento, // 🔥 USAR ID DEL DOCUMENTO
                      pregunta: pregunta.pregunta,
                      respuesta: respuesta,
                      tipo: clasificacion
                    });
                  }
                }
              });
            }
          });

          console.log('✅ Resultados finales:', {
            totalRespuestasEmocionales,
            contadorPositivas,
            contadorNegativas,
            contadorNeutrales,
            diasRegistrados: diasRegistrados.size
          });

          // 4. Calcular estadísticas
          if (totalRespuestasEmocionales === 0) {
            setError('No tienes registros de estado emocional aún. Completa tu seguimiento diario para ver tu progreso.');
            setLoading(false);
            return;
          }

          const porcentaje = (contadorPositivas / totalRespuestasEmocionales) * 100;

          setTotalRespuestas(totalRespuestasEmocionales);
          setRespuestasPositivas(contadorPositivas);
          setRespuestasNegativas(contadorNegativas);
          setRespuestasNeutrales(contadorNeutrales);
          setPorcentajePositivas(porcentaje);
          setDiasConRegistro(diasRegistrados.size);
          setUltimasEmociones(emocionesRecientes);
          setLoading(false);

        } catch (error) {
          console.error('❌ Error al analizar estado emocional:', error);
          setError('Ocurrió un error al cargar tu estado emocional.');
          setLoading(false);
        }
      };

      analizarEstadoEmocional();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00723f" />
        <Text style={styles.loadingText}>Analizando tu estado emocional...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="heart-outline" size={60} color="#e34a42" />
        <Text style={styles.errorTitle}>Sin datos</Text>
        <Text style={styles.errorSubtitle}>{error}</Text>
      </View>
    );
  }

const color = getColorPorEstado(porcentajePositivas);
    const mensaje = getMensajeMotivacional(porcentajePositivas);

  return (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.scrollContent}>
      {/* Header con Título */}
      <View style={styles.headerWithNotification}>
        <View style={styles.titleContainer}>
          <Ionicons name="heart-outline" size={36} color="#007AFF" />
          <Text style={styles.mainTitle}>Estado Emocional</Text>
        </View>
      </View>

      {/* Subtítulo Descriptivo */}
      <Text style={styles.subtitleFixed}>
        Visualiza tu progreso emocional basado en tus respuestas del seguimiento diario.
      </Text>

      {/* Tarjeta Principal */}
      <View style={styles.card}>
        <View style={styles.iconoGrandeContainer}> 
                    <Ionicons name="heart-circle" size={100} color="#007AFF" />
                
        <Text style={styles.cardTitle}>Estado Emocional General</Text>
        </View>
        <Text style={[styles.percentText, { color }]}>
          {porcentajePositivas.toFixed(0)}% Positivo
        </Text>
        <ProgressBar progress={porcentajePositivas} color={color} />
        <Text style={styles.subText}>Últimos {DIAS_ANALISIS} días ({diasConRegistro} días con registro)</Text>
      </View>

      {/* Mensaje Motivacional */}
      <View style={[styles.motivationalBox, { borderLeftColor: color }]}>
        <Ionicons name="star-outline" size={20} color={color} />
        <Text style={styles.motivationalText}>{mensaje}</Text>
      </View>

      {/* Detalles */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen de Emociones</Text>
        
        <View style={styles.statsRow}>
          <Ionicons name="happy-outline" size={20} color="#50b848" />
          <Text style={styles.statsLabel}>Emociones Positivas</Text>
          <Text style={[styles.statsValue, { color: '#50b848' }]}>{respuestasPositivas}</Text>
        </View>

        <View style={styles.statsRow}>
          <Ionicons name="sad-outline" size={20} color="#e34a42" />
          <Text style={styles.statsLabel}>Emociones Negativas</Text>
          <Text style={[styles.statsValue, { color: '#e34a42' }]}>{respuestasNegativas}</Text>
        </View>

        <View style={styles.statsRow}>
          <Ionicons name="remove-circle-outline" size={20} color="#95a5a6" />
          <Text style={styles.statsLabel}>Emociones Neutrales</Text>
          <Text style={[styles.statsValue, { color: '#95a5a6' }]}>{respuestasNeutrales}</Text>
        </View>

        <View style={[styles.statsRow, { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#ecf0f1' }]}>
          <Ionicons name="list-outline" size={20} color="#3498db" />
          <Text style={styles.statsLabel}>Total de Registros</Text>
          <Text style={styles.statsValue}>{totalRespuestas}</Text>
        </View>
      </View>

      {/* Últimas Emociones Registradas */}
      {ultimasEmociones.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Últimos Registros</Text>
          {ultimasEmociones.map((emocion, index) => (
            <View key={index} style={styles.emocionItem}>
              <View style={styles.emocionHeader}>
                <Ionicons 
                  name={
                    emocion.tipo === 'positiva' ? 'happy-outline' :
                    emocion.tipo === 'negativa' ? 'sad-outline' : 
                    'remove-circle-outline'
                  }
                  size={18}
                  color={
                    emocion.tipo === 'positiva' ? '#50b848' :
                    emocion.tipo === 'negativa' ? '#e34a42' : 
                    '#95a5a6'
                  }
                />
                <Text style={styles.emocionFecha}>{emocion.fecha}</Text>
              </View>
              <Text style={styles.emocionPregunta}>{emocion.pregunta}</Text>
              <Text style={styles.emocionRespuesta}>"{emocion.respuesta}"</Text>
            </View>
          ))}
        </View>
      )}

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#00723f" style={{ marginBottom: 8 }} />
        <Text style={styles.infoText}>
          Este análisis se basa en tus respuestas sobre cómo te sientes. Es importante que continues registrando tu estado emocional diariamente.
        </Text>
        <Text style={[styles.infoText, { marginTop: 8, fontWeight: 'bold' }]}>
          Recuerda: Tu salud mental es tan importante como tu salud física. 💙
        </Text>
      </View>
    </ScrollView>
  );
}
/*
*/