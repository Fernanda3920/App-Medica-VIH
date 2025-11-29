import { initializeApp } from 'firebase/app';
// <-- CAMBIO: Se agregan las funciones de persistencia

import { 
  getAuth, 
  signInAnonymously,
initializeAuth, 
  setPersistence,
  getReactNativePersistence,
  inMemoryPersistence,
  sendPasswordResetEmail // 💡 <-- ¡IMPORTACIÓN AÑADIDA!
} from 'firebase/auth'; 
import { 
    getFirestore, // Aquí se importa la función getFirestore correctamente
    collection, 
    addDoc, 
    deleteDoc, 
    updateDoc,
    doc, 
    getDocs,
    getDoc,
    setDoc,
    orderBy,
    startAt,
    query,
    limit,
    where,
    serverTimestamp 
} from 'firebase/firestore'; 
// <-- CAMBIO: Se importa AsyncStorage para guardar la sesión
import AsyncStorage from '@react-native-async-storage/async-storage';
// <-- CAMBIO: Se importan las notificaciones (faltaba en tu función useNotifications)
import * as Notifications from 'expo-notifications'; 

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  xxxxxxxx
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Tu inicialización original de auth (¡No se ha movido!)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});


setPersistence(auth, getReactNativePersistence(AsyncStorage))
  .then(() => console.log("✅ Persistencia de sesión configurada"))
  .catch((err) => console.error("❌ Error configurando persistencia:", err));

export const ensureUserIsAuthenticated = async () => {
    if (auth.currentUser) {
        console.log("✅ Usuario autenticado:", auth.currentUser.uid);
        return auth.currentUser.uid;
    }
    
    // Ya no usamos signInAnonymously - el usuario DEBE estar logueado
    throw new Error("Usuario no autenticado. Debes iniciar sesión primero.");
};
export const saveLoginPreference = async (keepLoggedIn) => {
  try {
    await AsyncStorage.setItem('keepLoggedIn', JSON.stringify(keepLoggedIn));
  } catch (error) {
    console.error('Error guardando preferencia:', error);
  }
};
export const getLoginPreference = async () => {
  try {
    const value = await AsyncStorage.getItem('keepLoggedIn');
    return value !== null ? JSON.parse(value) : true;
  } catch (error) {
    console.error('Error obteniendo preferencia:', error);
    return true;
  }
};

export const checkUserProfileComplete = async (userId) => {
    if (!userId) {
        const currentUser = auth.currentUser;
        if (!currentUser) return false;
        userId = currentUser.uid;
    }

    try {
        const profileRef = collection(db, 'Usuarios', userId, 'InformacionPerfil');
        const querySnapshot = await getDocs(profileRef);
        
        // Si existe al menos un documento, el perfil está completo
        const isComplete = !querySnapshot.empty;
        console.log(`ℹ️ Perfil completo para ${userId}:`, isComplete);
        return isComplete;
    } catch (error) {
        console.error("❌ Error al verificar perfil:", error);
        return false;
    }
};

export const saveUserProfile = async (userId, profileData) => {
    if (!userId) {
        throw new Error("El ID de usuario es requerido.");
    }

    try {
        // 1️⃣ Guardar en la subcolección InformacionPerfil
        const docRef = await addDoc(
            collection(db, 'Usuarios', userId, 'InformacionPerfil'),
            {
                ...profileData, // nombre, genero, condiciones, etc.
                tipoUsuario: profileData.tipoUsuario || '', // 🔹 NUEVO CAMPO
                fechaCreacion: serverTimestamp(),
                createdAt: new Date().toISOString()
            }
        );

        console.log("✅ Perfil guardado en Firebase, ID:", docRef.id);

        // 2️⃣ Actualizar el documento raíz de Usuarios/{uid} con 'activo: true'
        const userRef = doc(db, 'Usuarios', userId);
        await setDoc(userRef, { activo: true }, { merge: true }); // merge:true para no borrar otros campos

        console.log("✅ Campo 'activo' agregado en el usuario raíz:", userId);

        return docRef.id;
    } catch (error) {
        console.error("❌ Error al guardar perfil:", error);
        throw error;
    }
};

export const getUserProfile = async (userId) => {
    if (!userId) {
        const currentUser = auth.currentUser;
        if (!currentUser) throw new Error("Usuario no autenticado.");
        userId = currentUser.uid;
    }

    try {
        const profileRef = collection(db, 'Usuarios', userId, 'InformacionPerfil');
        const querySnapshot = await getDocs(profileRef);
        
        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            const data = docSnap.data();

            // 🔒 Conversión segura de tipos
           return {
    id: docSnap.id,
    nombre: data.nombre ? String(data.nombre) : '',
    genero: data.genero ? String(data.genero) : '',
    anoNacimiento: data.anoNacimiento != null ? String(data.anoNacimiento) : '',
    createdAt: data.createdAt || null,
    escolaridad: data.escolaridad ? String(data.escolaridad) : '',
    paisOrigen: data.paisOrigen ? String(data.paisOrigen) : '',
    anosRadicandoBC: data.anosRadicandoBC != null ? String(data.anosRadicandoBC) : '',
    tipoUsuario: data.tipoUsuario ? String(data.tipoUsuario) : '', // 🔹 NUEVO CAMPO
    condiciones: {
        pruebaVIH: data.condiciones?.pruebaVIH ?? null,
        hipercolesterolemia: data.condiciones?.hipercolesterolemia ?? null,
        hipertrigliceridemia: data.condiciones?.hipertrigliceridemia ?? null,
        diabetes: data.condiciones?.diabetes ?? null,
        hipertension: data.condiciones?.hipertension ?? null,
        otraCondicionSalud: data.condiciones?.otraCondicionSalud ?? null,
    },
    medicacionVIH: {
        efavirenz: data.medicacionVIH?.efavirenz ?? false,
        doravirina: data.medicacionVIH?.doravirina ?? false,
        bictegravir: data.medicacionVIH?.bictegravir ?? false,
        dolutegravir: data.medicacionVIH?.dolutegravir ?? false,
        raltegravir: data.medicacionVIH?.raltegravir ?? false,
        darunavir: data.medicacionVIH?.darunavir ?? false,
    }
};

        } else {
            console.log("ℹ️ No se encontró perfil para:", userId);
            return null;
        }
    } catch (error) {
        console.error("❌ Error al obtener perfil:", error);
        throw error;
    }
};



export const deleteNoteFromFirestore = async (userId, firebaseId) => {
    if (!userId || !firebaseId) {
        throw new Error("Se requiere userId y firebaseId para eliminar.");
    }

    try {
        const noteRef = doc(db, 'Usuarios', userId, 'RegistrosDiarios', firebaseId);
        await deleteDoc(noteRef);
        console.log("✅ Nota eliminada de Firebase. ID:", firebaseId);
    } catch (error) {
        console.error("❌ Error al eliminar nota:", error);
        throw error;
    }
};


export const saveMedicationToFirestore = async (userId, medicationData) => {
    if (!userId) {
        throw new Error("El ID de usuario es requerido.");
    }

    try {
        const docRef = await addDoc(
            collection(db, 'Usuarios', userId, 'Medicamentos'),
            {
                nombre: medicationData.nombre,
                dosis: medicationData.dosis || '',
                notas: medicationData.notas || '',
                hora: medicationData.hora,
                frecuencia: medicationData.frecuencia,
                horasPersonalizadas: medicationData.horasPersonalizadas || null,
                activo: medicationData.activo,
                fechaInicio: medicationData.fechaInicio,
                fechaServidor: serverTimestamp(),
                createdAt: new Date().toISOString()
            }
        );
        console.log("✅ Medicamento guardado en Firebase, ID:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("❌ Error al guardar medicamento en Firebase:", error);
        throw error;
    }
};

export const updateMedicationStatusInFirestore = async (userId, firebaseId, isActive) => {
    if (!userId || !firebaseId) {
        throw new Error("Se requiere userId y firebaseId.");
    }

    try {
        const medRef = doc(db, 'Usuarios', userId, 'Medicamentos', firebaseId);
        await updateDoc(medRef, {
            activo: isActive,
            updatedAt: serverTimestamp()
        });
        console.log("✅ Estado de medicamento actualizado en Firebase");
    } catch (error) {
        console.error("❌ Error al actualizar estado:", error);
        throw error;
    }
};

export const deleteMedicationFromFirestore = async (userId, firebaseId) => {
    if (!userId || !firebaseId) {
        throw new Error("Se requiere userId y firebaseId para eliminar.");
    }

    try {
        const medRef = doc(db, 'Usuarios', userId, 'Medicamentos', firebaseId);
        await deleteDoc(medRef);
        console.log("✅ Medicamento eliminado de Firebase. ID:", firebaseId);
    } catch (error) {
        console.error("❌ Error al eliminar medicamento:", error);
        throw error;
    }
};
export const toggleMedicationIntake = async (userId, formattedDate, horaProgramada, medicamentoNombre, newStatus) => {
    if (!userId || !formattedDate) {
        throw new Error("Datos de toma incompletos.");
    }
    const dailyIntakeRef = doc(db, 'Usuarios', userId, 'TomasDiarias', formattedDate);
    const dailyIntakeDoc = await getDoc(dailyIntakeRef);

    const horaTomada = newStatus ? new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : null;

    const updatePath = `tomas.${horaProgramada}.${medicamentoNombre}`;
    
    const intakeRecord = {
        tomado: newStatus,
        horaReal: horaTomada,
        medicamentoNombre: medicamentoNombre
    };

    if (dailyIntakeDoc.exists()) {
        await updateDoc(dailyIntakeRef, {
            [updatePath]: intakeRecord,
            ultimaActualizacion: serverTimestamp()
        });
        console.log(`✅ Toma actualizada: ${medicamentoNombre} a las ${horaProgramada} en ${formattedDate}`);
        return formattedDate;
    } else {
        await setDoc(dailyIntakeRef, {
            fecha: formattedDate,
            userId: userId,
            tomas: {
                [horaProgramada]: {
                    [medicamentoNombre]: intakeRecord
                }
            },
            fechaCreacion: serverTimestamp(),
            ultimaActualizacion: serverTimestamp()
        });
        console.log(`✅ Documento diario creado y toma registrada: ${formattedDate}`);
        return formattedDate;
    }
};

export const getMedicationIntakesForDay = async (userId, formattedDate) => {
    if (!userId || !formattedDate) {
        throw new Error("El ID de usuario y la fecha son requeridos.");
    }
    
    try {
        const docRef = doc(db, 'Usuarios', userId, 'TomasDiarias', formattedDate);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log(`✅ Documento diario de tomas cargado para ${formattedDate}`);
            return docSnap.data().tomas || {}; // Retorna el mapa de tomas
        } else {
            console.log(`ℹ️ No hay registro de tomas para ${formattedDate}`);
            return {};
        }
    } catch (error) {
        console.error("❌ Error al cargar tomas de medicamentos:", error);
        throw error;
    }
};
export const updateUserProfile = async (userId, docId, updatedData) => {
    if (!userId || !docId) {
        throw new Error("El ID de usuario y el ID del documento de perfil son requeridos para la actualización.");
     }
    
    try {
        // La referencia DEBE apuntar al documento específico, no a la colección
        const profileDocRef = doc(db, 'Usuarios', userId, 'InformacionPerfil', docId);
        
        // Usar setDoc para reemplazar completamente o updateDoc para solo cambiar campos
        await setDoc(profileDocRef, updatedData, { merge: true }); // Usamos merge para no borrar campos existentes
        
        console.log("✅ Perfil actualizado en Firebase, ID:", docId);
        
    } catch (error) {
        console.error("❌ Error al actualizar perfil:", error);
        throw error;
    }
};
export const getMedicationsFromFirestore = async (userId) => {
    if (!userId) {
        throw new Error("El ID de usuario es requerido.");
  	}

    try {
        const medicationsRef = collection(db, 'Usuarios', userId, 'Medicamentos');
        const querySnapshot = await getDocs(medicationsRef);
        
        const medications = [];
        querySnapshot.forEach((doc) => {
            medications.push({
                firebaseId: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ ${medications.length} medicamentos cargados de Firebase`);
        return medications;
    } catch (error) {
        console.error("❌ Error al cargar medicamentos:", error);
        throw error;
    }
};

export const saveMedicationIntakeToFirestore = async (userId, intakeData) => {
    if (!userId) {
        throw new Error("El ID de usuario es requerido.");
  	}

    try {
        const docRef = await addDoc(
            collection(db, 'Usuarios', userId, 'TomasMedicamentos'),
            {
                medicamentoId: intakeData.medicamentoId,
                medicamentoNombre: intakeData.medicamentoNombre,
                fecha: intakeData.fecha,
                horaProgramada: intakeData.horaProgramada,
                horaTomada: intakeData.horaTomada || null,
                tomado: intakeData.tomado,
                fechaServidor: serverTimestamp(),
                createdAt: new Date().toISOString()
            }
        );
        console.log("✅ Toma de medicamento guardada en Firebase, ID:", docRef.id);
      	return docRef.id;
  	} catch (error) {
        console.error("❌ Error al guardar toma en Firebase:", error);
        throw error;
  	}
};

export const updateMedicationIntakeInFirestore = async (userId, firebaseId, taken, timeTaken = null) => {
    if (!userId || !firebaseId) {
        throw new Error("Se requiere userId y firebaseId.");
  	}

    try {
        const intakeRef = doc(db, 'Usuarios', userId, 'TomasMedicamentos', firebaseId);
        await updateDoc(intakeRef, {
            tomado: taken,
          	horaTomada: timeTaken,
          	updatedAt: serverTimestamp()
        });
        console.log("✅ Estado de toma actualizado en Firebase");
  	} catch (error) {
        console.error("❌ Error al actualizar toma:", error);
        throw error;
  	}
};

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('¡Falló al obtener el token para las notificaciones!');
    return false;
  }
  // Especificar el projectId de Expo aquí si es necesario
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);
  return true;
}

export function useNotifications() {
    const scheduleLocalNotification = async (title, body, seconds = 2, data = {}) => {
        
        const hasPermission = await registerForPushNotificationsAsync(); // <-- Ahora esta función existe

        if (hasPermission) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: title || "🔔 Recordatorio", 
                  	body: body || '¡Notificación local disparada!',
                  	data: { timestamp: new Date().toISOString(), ...data }, 
                },
                trigger: { seconds: seconds },
            });
          	console.log('Notificación programada con éxito.');
        } else {
          	console.log('No se puede programar la notificación: permiso denegado.');
        }
    };

    const getRandomDocument = async (db, dimension) => {
        const subCollectionPath = `Recursos/${dimension}/mensajes`;
        const randomStart = Math.random();

      	// Consulta 1: Intentar encontrar un documento a partir de randomStart
      	let q = query(
          	collection(db, subCollectionPath),
          	orderBy("randomSort"),
          	startAt(randomStart),
          	limit(1)
      	);

      	let snapshot = await getDocs(q);

      	if (snapshot.empty) {
          	// Consulta 2 (Fallback): Si no se encuentra uno al final de la lista, volver al inicio.
          	q = query(
            	collection(db, subCollectionPath),
            	orderBy("randomSort"),
            	limit(1)
          	);
          	snapshot = await getDocs(q);
      	}

      	return snapshot.empty ? null : snapshot.docs[0];
  	};


  	const scheduleDailyMotivationalMessages = async (delaySeconds = 1) => {
      	const db = getFirestore(); // No es necesario 'getFirestore()', 'db' ya está disponible globalmente
      	const dimensions = [
          	'Alimentacion',
          	'ActividadFisica',
          	'Estigma',
          	'Farmaco',
      	];
      	
      	console.log('Iniciando programación de mensajes motivacionales diarios...');

      	for (let i = 0; i < dimensions.length; i++) {
          	const dimension = dimensions[i];
          	
          	try {
              	const randomDoc = await getRandomDocument(db, dimension); // Usamos 'db' global

              	if (randomDoc) {
                  	const message = randomDoc.data().mensaje;
                  	const messageId = randomDoc.id;
                  	await scheduleLocalNotification(
                      	`🌟 ${dimension.toUpperCase()}`,
message,
                      	delaySeconds + i * 5, 
                      	{ 
                          	type: 'MOTIVATION', 
                          	dimension: dimension, 
                          	resourceId: messageId 
                      	} // Datos útiles para el manejo de notificaciones
                	);
              	} else {
                  	console.warn(`No se encontró contenido en la dimensión: ${dimension}`);
              	}
          	} catch (error) {
              	console.error(`Error al procesar la dimensión ${dimension}:`, error);
          	}
      	}
  	
      	scheduleLocalNotification(
          	"📝 Tarea del día", 
          	"No olvides completar tu seguimiento diario de bienestar.", 
          	60 * 60 * 8, // Programar para 8 horas después, por ejemplo.
          	{ type: 'DAILY_CHECKUP' }
      	);
  	};
  	return { scheduleLocalNotification, scheduleDailyMotivationalMessages };
}

/**
 * Establece la persistencia de la sesión ANTES de iniciar sesión.
 * @param {boolean} shouldPersist - Si es true, usa AsyncStorage. Si es false, usa inMemoryPersistence.
 */
export const setAuthPersistence = async (shouldPersist) => {
  try {
    const persistenceType = shouldPersist
      ? getReactNativePersistence(AsyncStorage) // Persistente (guardado en dispositivo)
      : inMemoryPersistence;                   // Sesión (solo mientras la app está abierta)

    // Se aplica la persistencia a la instancia 'auth' que ya tienes
  	await setPersistence(auth, persistenceType);
  	console.log(`ℹ️ Persistencia de Auth establecida a: ${shouldPersist ? 'PERMANENTE' : 'SESIÓN'}`);
  } catch (error) {
  	console.error("❌ Error al establecer la persistencia:", error);
  }
};
export async function getAllMedicationIntakes(userId) {
  const snapshot = await db.collection('medicationIntakes')
    .doc(userId)
    .get();

  if (!snapshot.exists) return {};

  return snapshot.data(); // debe tener todas las fechas y tomas
}

/**
 * Envía un correo para restablecer la contraseña.
 * @param {string} email - El correo del usuario.
 */
export const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log(`✅ Correo de restablecimiento enviado a: ${email}`);
  } catch (error) {
    console.error("❌ Error al enviar correo de restablecimiento:", error);
    throw error; // Re-lanzamos el error para que la UI lo maneje
  }
};


// Exportar auth y db (Tu export original)
export { auth, db };
