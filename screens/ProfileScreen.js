import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { saveUserProfile, auth } from '../services/firebaseService';
import { signOut } from 'firebase/auth';
import { styles } from './styles/ProfileScreen';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import logo from '../assets/icon.png';
const CURRENT_YEAR = new Date().getFullYear();

const YesNoSelector = ({ label, value, onSelect }) => (
    <View style={styles.yesNoContainer}>
        <Text style={styles.label}>{label} *</Text>
        <View style={styles.yesNoButtons}>
            <TouchableOpacity
                style={[styles.yesNoButton, value === true && styles.yesNoButtonSelected]}
                onPress={() => onSelect(true)}
            >
                <Text style={[styles.yesNoButtonText, value === true && styles.yesNoButtonTextSelected]}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.yesNoButton, value === false && styles.yesNoButtonSelected]}
                onPress={() => onSelect(false)}
            >
                <Text style={[styles.yesNoButtonText, value === false && styles.yesNoButtonTextSelected]}>No</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const MedicationSelector = ({ label, value, onToggle }) => (
    <TouchableOpacity style={styles.medicationItem} onPress={onToggle}>
        <View style={[styles.checkbox, value && styles.checkboxChecked]}>
            {value && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.medicationLabel}>{label}</Text>
    </TouchableOpacity>
);

export default function CompleteProfileScreen({ onProfileComplete }) {
    
    const [nombre, setNombre] = useState('');
    const [genero, setGenero] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [escolaridad, setEscolaridad] = useState('');
    const [paisOrigen, setPaisOrigen] = useState('');
    const [yearsInBaja, setYearsInBaja] = useState('');
    
    const [pruebaVIH, setPruebaVIH] = useState(null);
    const [hipercolesterolemia, setHipercolesterolemia] = useState(null);
    const [hipertrigliceridemia, setHipertrigliceridemia] = useState(null);
    const [diabetes, setDiabetes] = useState(null);
    const [hipertension, setHipertension] = useState(null);
    const [otraCondicion, setOtraCondicion] = useState(null);
    
    const [efavirenz, setEfavirenz] = useState(false);
    const [doravirina, setDoravirina] = useState(false);
    const [bictegravir, setBictegravir] = useState(false);
    const [dolutegravir, setDolutegravir] = useState(false);
    const [raltegravir, setRaltegravir] = useState(false);
    const [darunavir, setDarunavir] = useState(false);

    const [loading, setLoading] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);
    const [showSchoolPicker, setShowSchoolPicker] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [showTipoUsuarioPicker, setShowTipoUsuarioPicker] = useState(false);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const generos = ['Masculino', 'Femenino', 'No Binario', 'Prefiero no decir'];
    const escolaridades = ['Primaria', 'Secundaria', 'Preparatoria', 'Carrera Técnica', 'Licenciatura', 'Posgrado'];
    const tiposUsuarios = ['Usuario A', 'Usuario B'];
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

    const calculateAge = (year) => {
        const y = parseInt(year);
        if (isNaN(y) || y > CURRENT_YEAR) return null;
        return CURRENT_YEAR - y;
    };
    
    const handleSaveProfile = async () => {
        try {
            const age = calculateAge(birthYear);
            
            // Validaciones
            if (!nombre.trim() || !genero || !birthYear.trim() || !escolaridad || !paisOrigen.trim() || !yearsInBaja.trim() || !tipoUsuario.trim()) {
                Alert.alert('Campos Incompletos', 'Por favor, completa todos los campos de datos personales.');
                return;
            }
            
            if (isNaN(age) || age < 16 || age > 100) {
                Alert.alert('Error de Fecha', 'Ingresa un año de nacimiento válido.');
                return;
            }
            
            const yearsBC = parseInt(yearsInBaja);
            if (isNaN(yearsBC) || yearsBC < 0) {
                Alert.alert('Error de Años', 'Ingresa un número válido de años en Baja California.');
                return;
            }
            
            if (age !== null && yearsBC > age) {
                Alert.alert('Error en el registro', `Los años radicando (${yearsBC}) no pueden ser mayores que tu edad (${age}).`);
                return;
            }

            if (pruebaVIH === null || hipercolesterolemia === null || hipertrigliceridemia === null || 
                diabetes === null || hipertension === null || otraCondicion === null) {
                Alert.alert('Condiciones Incompletas', 'Por favor, responde todas las preguntas de condiciones médicas.');
                return;
            }

            setLoading(true);
            
            const userId = auth.currentUser?.uid;
            if (!userId) {
                Alert.alert('Error', 'No hay usuario autenticado');
                setLoading(false);
                return;
            }

            const profileData = {
                nombre: nombre.trim(),
                genero: genero,
                anoNacimiento: parseInt(birthYear),
                edad: age,
                escolaridad: escolaridad,
                paisOrigen: paisOrigen.trim(),
                anosRadicandoBC: yearsBC,
                tipoUsuario: tipoUsuario, 
                condiciones: {
                    pruebaVIH: pruebaVIH,
                    hipercolesterolemia: hipercolesterolemia,
                    hipertrigliceridemia: hipertrigliceridemia,
                    diabetes: diabetes,
                    hipertension: hipertension,
                    otraCondicionSalud: otraCondicion,
                },
                medicacionVIH: {
                    efavirenz: efavirenz,
                    doravirina: doravirina,
                    bictegravir: bictegravir,
                    dolutegravir: dolutegravir,
                    raltegravir: raltegravir,
                    darunavir: darunavir,
                }
            };

            await saveUserProfile(userId, profileData);
            
            console.log('✅ Perfil guardado exitosamente');
            setLoading(false);
            if (onProfileComplete) {
                onProfileComplete();
            }
            
            Alert.alert(
                '¡Perfil Completado!', 
                'Tu información ha sido guardada. Bienvenido a la aplicación.', 
                [{ text: 'Continuar' }]
            );
            
        } catch (error) {
            setLoading(false);
            console.error('❌ Error al guardar perfil:', error);
            Alert.alert('Error', `No se pudo guardar el perfil: ${error.message}`);
        }
    };

    const CustomPicker = ({ label, value, options, onSelect }) => (
        <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>{label} *</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => onSelect(true)}>
                <Text style={styles.pickerButtonText}>{value || `Selecciona tu ${label.toLowerCase()}`}</Text>
            </TouchableOpacity>
        </View>
    );

    const PickerModal = ({ visible, options, onSelect, onClose, title, currentValue, setValue }) => (
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{title}</Text>
                <ScrollView style={{ maxHeight: 200, width: '100%' }}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[styles.modalItem, currentValue === option && styles.modalItemSelected]}
                            onPress={() => {
                                setValue(option);
                                onClose();
                            }}
                        >
                            <Text style={styles.modalItemText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={styles.scrollContainer}>
                <View style={styles.container}>
                    <View style={styles.content}>
                         <Image source={logo} style={styles.logo} />
                        <Text style={styles.title}>¡Bienvenido!</Text>
                        <Text style={styles.subtitle}>
                            Completa tu perfil para una mejor experiencia. (Todos los campos son obligatorios)
                        </Text>
                        <View style={styles.divider} />
                        <View style={styles.sectionTitleContainer}>
                            <FontAwesome 
                                name="user"
                                size={20} 
                                color="#226d70" 
                                style={styles.sectionTitleIcon}
                            />
                            <Text style={styles.sectionTitle}>Datos</Text>
                        </View>
                        <Text style={styles.label}>Nombre </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tu nombre"
                            value={nombre}
                            onChangeText={setNombre}
                            autoCapitalize="words"
                        />

                        <CustomPicker
                            label="Género"
                            value={genero}
                            options={generos}
                            onSelect={setShowGenderPicker}
                        />
                        <CustomPicker
                            label="Tipo de Usuario"
                            value={tipoUsuario}
                            options={tiposUsuarios}
                            onSelect={setShowTipoUsuarioPicker}
                        />
                        <Text style={styles.label}>Año de Nacimiento (Ej: 1985)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Año (YYYY)"
                            value={birthYear}
                            onChangeText={setBirthYear}
                            keyboardType="numeric"
                            maxLength={4}
                        />
                        {birthYear.length === 4 && calculateAge(birthYear) && (
                            <Text style={styles.infoText}>Edad estimada: {calculateAge(birthYear)} años</Text>
                        )}

                        <CustomPicker
                            label="Escolaridad"
                            value={escolaridad}
                            options={escolaridades}
                            onSelect={setShowSchoolPicker}
                        />

                        <CustomPicker
                            label="País de Origen"
                            value={paisOrigen}
                            options={PAISES}
                            onSelect={setShowCountryPicker}
                        />

                        <Text style={styles.label}>Años Radicando en Baja California </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de años"
                            value={yearsInBaja}
                            onChangeText={setYearsInBaja}
                            keyboardType="numeric"
                            maxLength={3}
                        />
                        
                        <View style={styles.divider} />
                        <View style={styles.sectionTitleContainer}>
                            <FontAwesome 
                                name="hospital-o"
                                size={20} 
                                color="#cad1e4ff" 
                                style={styles.sectionTitleIcon}
                            />
                            <Text style={styles.sectionTitle}>Condiciones Médicas</Text>
                        </View>
                        <YesNoSelector
                            label="¿Te hiciste la prueba de VIH?"
                            value={pruebaVIH}
                            onSelect={setPruebaVIH}
                        />
                        <YesNoSelector
                            label="Hipercolesterolemia (niveles altos de colesterol total)"
                            value={hipercolesterolemia}
                            onSelect={setHipercolesterolemia}
                        />
                        <YesNoSelector
                            label="Hipertrigliceridemia (niveles altos de triglicéridos)"
                            value={hipertrigliceridemia}
                            onSelect={setHipertrigliceridemia}
                        />
                        <YesNoSelector
                            label="Diabetes (niveles altos de azúcar en la sangre)"
                            value={diabetes}
                            onSelect={setDiabetes}
                        />
                        <YesNoSelector
                            label="Hipertensión (niveles altos de tensión arterial)"
                            value={hipertension}
                            onSelect={setHipertension}
                        />
                        <YesNoSelector
                            label="¿Vives con alguna otra condición de salud?"
                            value={otraCondicion}
                            onSelect={setOtraCondicion}
                        />

                        <View style={styles.divider} />

                        <View style={styles.sectionTitleContainer}>
                            <MaterialCommunityIcons 
                                name="pill" 
                                size={20} 
                                color="#226d70" 
                                style={styles.sectionTitleIcon}
                            />
                            <Text style={styles.sectionTitle}>Medicamentos ARV</Text>
                        </View>
                        <Text style={styles.subtitle}>
                            Marca los medicamentos antirretrovirales (ARV) que estás tomando actualmente.
                        </Text>
                        
                        <MedicationSelector label="1. EFV (Efavirenz)" value={efavirenz} onToggle={() => setEfavirenz(!efavirenz)} />
                        <MedicationSelector label="2. Doravirina" value={doravirina} onToggle={() => setDoravirina(!doravirina)} />
                        <MedicationSelector label="3. Bictegravir" value={bictegravir} onToggle={() => setBictegravir(!bictegravir)} />
                        <MedicationSelector label="4. Dolutegravir" value={dolutegravir} onToggle={() => setDolutegravir(!dolutegravir)} />
                        <MedicationSelector label="5. Raltegravir" value={raltegravir} onToggle={() => setRaltegravir(!raltegravir)} />
                        <MedicationSelector label="6. Darunavir" value={darunavir} onToggle={() => setDarunavir(!darunavir)} />

                        <TouchableOpacity 
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSaveProfile}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Guardar Perfil Completo</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView> 
            {showGenderPicker && (
                <PickerModal
                    visible={showGenderPicker}
                    options={generos}
                    onSelect={setGenero}
                    onClose={() => setShowGenderPicker(false)}
                    title="Selecciona tu Género"
                    currentValue={genero}
                    setValue={setGenero}
                />
            )}
            {showSchoolPicker && (
                <PickerModal
                    visible={showSchoolPicker}
                    options={escolaridades}
                    onSelect={setEscolaridad}
                    onClose={() => setShowSchoolPicker(false)}
                    title="Selecciona tu Escolaridad"
                    currentValue={escolaridad}
                    setValue={setEscolaridad}
                />
            )}
            {showTipoUsuarioPicker && (
                <PickerModal
                    visible={showTipoUsuarioPicker}
                    options={tiposUsuarios}
                    onSelect={setTipoUsuario}
                    onClose={() => setShowTipoUsuarioPicker(false)}
                    title="Selecciona tu Tipo de Usuario"
                    currentValue={tipoUsuario}
                    setValue={setTipoUsuario}
                />
            )}
            {showCountryPicker && (
                <PickerModal
                    visible={showCountryPicker}
                    options={PAISES}
                    onSelect={setPaisOrigen}
                    onClose={() => setShowCountryPicker(false)}
                    title="Selecciona tu País de Origen"
                    currentValue={paisOrigen}
                    setValue={setPaisOrigen}
                />
            )}
        </View> 
    );
}