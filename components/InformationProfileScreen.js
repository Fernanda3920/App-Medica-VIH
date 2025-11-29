// screens/InformationProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { styles } from './styles/InformationProfileScreen';
import { auth, getUserProfile, updateUserProfile } from '../services/firebaseService';
import { Timestamp } from 'firebase/firestore'; // 🆕 Import para Timestamp
import Ionicons from 'react-native-vector-icons/Ionicons';
import esc from '../assets/esc.png';

const YesNoSelector = ({ label, value, onSelect }) => (
  <View style={styles.yesNoContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.yesNoButtons}>
      <TouchableOpacity
        style={[styles.yesNoButton, value === true && styles.yesNoButtonSelected]}
        onPress={() => onSelect(true)}
      >
        <Text style={[styles.yesNoText, value === true && styles.yesNoTextSelected]}>Sí</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.yesNoButton, value === false && styles.yesNoButtonSelected]}
        onPress={() => onSelect(false)}
      >
        <Text style={[styles.yesNoText, value === false && styles.yesNoTextSelected]}>No</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const CustomDropdown = ({ label, value, options, onSelect, disabled = false }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (option) => {
    if (!disabled) onSelect(option);
    setModalVisible(false);
  };

  return (
    <View style={styles.dropdownContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownButton, disabled && styles.dropdownButtonDisabled]}
        onPress={() => !disabled && setModalVisible(true)}
        disabled={disabled}
      >
        <Text
          style={[
            value ? styles.dropdownText : styles.dropdownPlaceholder,
            disabled && styles.dropdownTextDisabled,
          ]}
        >
          {value || `Selecciona tu ${label.toLowerCase()}`}
        </Text>
        {!disabled && <Text style={styles.dropdownArrow}>▼</Text>}
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView style={styles.optionsScrollView}>
              {!disabled &&
                options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionItem, value === option && styles.optionItemSelected]}
                    onPress={() => handleSelect(option)}
                  >
                    <Text style={[styles.optionText, value === option && styles.optionTextSelected]}>{option}</Text>
                  </TouchableOpacity>
                ))}
              {disabled && <Text style={styles.optionTextDisabledMessage}>Este campo no se puede modificar.</Text>}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function InformationProfileScreen() {
  const generos = ['Masculino', 'Femenino', 'No Binario', 'Prefiero no decir'];
  const escolaridades = ['Primaria', 'Secundaria', 'Preparatoria', 'Carrera Técnica', 'Licenciatura', 'Posgrado'];
  const tiposUsuario = ['Usuario A', 'Usuario B']; 
  const PAISES = [ 
    'México', 
    'Colombia', 
    'Venezuela', 
    'Estados Unidos', 
    'Honduras', 
    'El Salvador', 
    'Guatemala', 
    'Perú', 
    'Ecuador',
    'Otro'
  ];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nombre, setNombre] = useState('');
  const [genero, setGenero] = useState('');
  const [anoNacimiento, setAnoNacimiento] = useState('');
  const [escolaridad, setEscolaridad] = useState('');
  const [paisOrigen, setPaisOrigen] = useState('');
  const [anosRadicandoBC, setAnosRadicandoBC] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');

  const [condiciones, setCondiciones] = useState({
    pruebaVIH: false,
    hipercolesterolemia: false,
    hipertrigliceridemia: false,
    diabetes: false,
    hipertension: false,
    otraCondicionSalud: false,
  });

  const [medicacionVIH, setMedicacionVIH] = useState({
    efavirenz: false,
    doravirina: false,
    bictegravir: false,
    dolutegravir: false,
    raltegravir: false,
    darunavir: false,
  });

  // 🆕 Estado para detectar cambios en medicamentos
  const [initialMedicacionVIH, setInitialMedicacionVIH] = useState({});

  const [profileDocId, setProfileDocId] = useState(null);
  const userId = auth.currentUser?.uid;
  const CURRENT_YEAR = new Date().getFullYear();

  const calculateAge = (year) => {
    const y = parseInt(year);
    if (isNaN(y) || y > CURRENT_YEAR || y < 1900) return null;
    return CURRENT_YEAR - y;
  };

  // --- CARGAR PERFIL ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        Alert.alert('Error', 'Usuario no autenticado.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const profile = await getUserProfile(userId);
        if (profile) {
          setProfileDocId(profile.id);
          setNombre(profile.nombre ?? '');
          setGenero(profile.genero ?? '');
          setAnoNacimiento(profile.anoNacimiento ? String(profile.anoNacimiento) : '');
          setEscolaridad(profile.escolaridad ?? '');
          setPaisOrigen(profile.paisOrigen ?? '');
          setAnosRadicandoBC(profile.anosRadicandoBC ? String(profile.anosRadicandoBC) : '');
          setTipoUsuario(profile.tipoUsuario ?? 'No definido');
          setCondiciones({
            pruebaVIH: profile.condiciones?.pruebaVIH ?? false,
            hipercolesterolemia: profile.condiciones?.hipercolesterolemia ?? false,
            hipertrigliceridemia: profile.condiciones?.hipertrigliceridemia ?? false,
            diabetes: profile.condiciones?.diabetes ?? false,
            hipertension: profile.condiciones?.hipertension ?? false,
            otraCondicionSalud: profile.condiciones?.otraCondicionSalud ?? false,
          });
          
          // 🆕 Cargar medicamentos y guardar copia inicial
          const medsData = {
            efavirenz: profile.medicacionVIH?.efavirenz ?? false,
            doravirina: profile.medicacionVIH?.doravirina ?? false,
            bictegravir: profile.medicacionVIH?.bictegravir ?? false,
            dolutegravir: profile.medicacionVIH?.dolutegravir ?? false,
            raltegravir: profile.medicacionVIH?.raltegravir ?? false,
            darunavir: profile.medicacionVIH?.darunavir ?? false,
          };
          
          setMedicacionVIH(medsData);
          // 🆕 Guardar estado inicial para comparar después
          setInitialMedicacionVIH(medsData);
        } else {
          setTipoUsuario('No asignado');
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
        Alert.alert('Error', 'No se pudo cargar la información del perfil.');
        setTipoUsuario('Error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  // --- GUARDAR PERFIL ---
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const age = calculateAge(anoNacimiento);
      const yearsBC = parseInt(anosRadicandoBC);

      if (isNaN(age) || age < 16 || age > 100) {
        Alert.alert('Error de Fecha', 'Ingresa un año de nacimiento válido (entre 16 y 100 años).');
        return;
      }

      if (isNaN(yearsBC) || yearsBC < 0) {
        Alert.alert('Error de Años', 'Ingresa un número válido (igual o mayor a 0) de años radicando en Baja California.');
        return;
      }

      if (yearsBC > age) {
        Alert.alert(
          'Error de Lógica',
          `Los años radicando en Baja California (${yearsBC}) no pueden ser mayores que tu edad actual (${age}).`,
          [{ text: 'Entendido' }]
        );
        return;
      }

      if (!userId || !profileDocId) {
        throw new Error('Error: ID de usuario o ID del documento de perfil no encontrado.');
      }

      // 🆕 DETECTAR SI CAMBIARON LOS MEDICAMENTOS
      const medicationChanged = Object.keys(medicacionVIH).some(
        (key) => medicacionVIH[key] !== initialMedicacionVIH[key]
      );

      const normalizeString = (val) => (typeof val === 'string' ? val.trim() : '');

      const dataToSave = {
        nombre: normalizeString(nombre),
        genero: normalizeString(genero),
        anoNacimiento: parseInt(anoNacimiento) || null,
        escolaridad: normalizeString(escolaridad),
        paisOrigen: normalizeString(paisOrigen),
        anosRadicandoBC: yearsBC >= 0 ? yearsBC : null,
        tipoUsuario: normalizeString(tipoUsuario),
        condiciones: Object.fromEntries(Object.entries(condiciones).map(([k, v]) => [k, !!v])),
        medicacionVIH: Object.fromEntries(Object.entries(medicacionVIH).map(([k, v]) => [k, !!v])),
      };

      // 🆕 Si cambiaron los medicamentos, agregar timestamp de Firestore
      if (medicationChanged) {
        // Importar Timestamp de Firestore
        const { Timestamp } = require('firebase/firestore');
        dataToSave.fechaUltimoCambioMedicacion = Timestamp.now();
        console.log('✅ Cambio de medicación detectado. Se guardará nueva fecha de inicio.');
      }

      await updateUserProfile(userId, profileDocId, dataToSave);

      // 🆕 Mensaje personalizado si hubo cambios en medicamentos
      const mensaje = medicationChanged 
        ? 'Información actualizada correctamente. Se ha registrado el cambio en tus medicamentos. Por favor, inicia sesión nuevamente para recalcular tu adherencia desde esta fecha.'
        : 'Información actualizada correctamente. Por favor, inicia sesión nuevamente para aplicar los cambios.';

      Alert.alert(
        '✅ Guardado',
        mensaje,
        [
          {
            text: 'OK',
            onPress: async () => {
              try {
                await auth.signOut();
              } catch (signOutError) {
                console.error('Error cerrando sesión:', signOutError);
                Alert.alert('Error', 'No se pudo cerrar la sesión automáticamente.');
              }
            },
          },
        ]
      );

    } catch (error) {
      console.error('❌ Error al guardar perfil:', error.message);
      Alert.alert(
        'Error de Guardado',
        `No se pudo guardar la información. Razón: ${error.message || 'Error desconocido'}`
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error cerrando sesión:", error);
      Alert.alert("Error", "No se pudo cerrar la sesión.");
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={{ marginTop: 10 }}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image 
      source={esc} 
      style={styles.shieldIcon} 
      resizeMode="contain" // Ajusta el modo de visualización si es necesario
    />
        <Text style={styles.title}>Información del Perfil</Text>
      </View>

      <Text style={styles.sectionTitle}>Datos Personales</Text>
      <Text style={styles.label}>Nombre</Text>
      <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

      <CustomDropdown
        label="Tipo de Usuario"
        value={tipoUsuario}
        options={[tipoUsuario]}
        onSelect={() => {}}
        disabled={true}
      />

      <CustomDropdown
        label="Género"
        value={genero}
        options={generos}
        onSelect={setGenero}
      />

      <Text style={styles.label}>Año de nacimiento</Text>
      <TextInput
        style={styles.input}
        value={anoNacimiento}
        onChangeText={setAnoNacimiento}
        keyboardType="numeric"
        maxLength={4}
      />

      <CustomDropdown
        label="Escolaridad"
        value={escolaridad}
        options={escolaridades}
        onSelect={setEscolaridad}
      />

      <CustomDropdown
        label="País de origen"
        value={paisOrigen}
        options={PAISES}
        onSelect={setPaisOrigen}
      />

      <Text style={styles.label}>Años radicando en Baja California</Text>
      <TextInput
        style={styles.input}
        value={anosRadicandoBC}
        onChangeText={setAnosRadicandoBC}
        keyboardType="numeric"
      />

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Condiciones Médicas</Text>
      {Object.keys(condiciones).map((key) => (
        <YesNoSelector
          key={key}
          label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
          value={condiciones[key]}
          onSelect={(val) => setCondiciones((prev) => ({ ...prev, [key]: val }))}
        />
      ))}

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>💊 Medicamentos ARV</Text>
      {Object.keys(medicacionVIH).map((med) => (
        <TouchableOpacity
          key={med}
          style={styles.medicationToggle}
          onPress={() => setMedicacionVIH((prev) => ({ ...prev, [med]: !prev[med] }))}
        >
          <Text style={styles.medicationText}>{med}</Text>
          <View style={[styles.checkbox, medicacionVIH[med] && styles.checkboxActive]}>
            {medicacionVIH[med] && <Text style={styles.checkMark}>✓</Text>}
          </View>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.saveButton, saving && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Guardar Cambios</Text>}
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.logoutButton}
  onPress={handleLogout}
>
  <View style={styles.logoutButtonContent}>
    <Ionicons name="log-out-outline" size={20} color="#fff" />
    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
  </View>
</TouchableOpacity>

    </ScrollView>
  );
}