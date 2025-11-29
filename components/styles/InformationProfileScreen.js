import { StyleSheet } from 'react-native';

// Colores primarios para consistencia
const PRIMARY_BLUE = '#00723f'; // Azul de acento (para bordes, íconos)
const DARK_BLUE = '#00723f'; // Azul fuerte (para botones principales)
const SUCCESS_GREEN = '#2ecc71'; // Verde para activo/checkbox
const ERROR_RED = '#e34a42'; // Rojo para cerrar sesión/alertas
const GRAY_BACKGROUND = '#ffffffff'; // Fondo de pantalla
const LIGHT_BORDER = '#e0e0e0'; // Borde sutil

export const styles = StyleSheet.create({
    // 1. CONTENEDOR PRINCIPAL
    container: { 
        flex: 1, 
        backgroundColor: GRAY_BACKGROUND, // Fondo limpio y suave
        padding: 20 
    },
    centerContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    title: { 
        fontSize: 26, // Ligeramente más grande
        fontWeight: '800', // Más negrita
        marginBottom: 20, 
        textAlign: 'center', 
        color: '#2c3e50' 
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: '700', 
        marginTop: 25, // Más espacio
        marginBottom: 15, 
        color: '#000' // Color de acento
    },
    label: { 
        fontSize: 14, 
        marginBottom: 8, // Más espacio bajo el label
        fontWeight: '600',
        color: '#2c3e50' 
    },
shieldIcon: {
    width: 80,  // Ajusta el tamaño que desees
    height: 80, // Ajusta el tamaño que desees
    marginRight: 10,
  },
  
  // Si quieres que la imagen y el título estén en la misma línea:
  profileHeader: {
    flexDirection: 'row', // Para que el escudo y el título estén uno al lado del otro
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
  },
    // 2. INPUTS Y DROPDOWNS UNIFICADOS
    input: {
        borderWidth: 1, 
        borderColor: LIGHT_BORDER, 
        borderRadius: 12, // Más redondeado
        padding: 15, // Más padding interno
        marginBottom: 15, // Más espacio
        backgroundColor: '#fff',
        // Sombra sutil para un look moderno
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    divider: { 
        borderBottomWidth: 1, 
        borderBottomColor: '#f0f0f0', // Divisor más claro
        marginVertical: 20 
    },
    
    // ESTILOS DE CUSTOM DROPDOWN (Usa la estética del input)
    dropdownContainer: { marginBottom: 15 },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1, 
        borderColor: LIGHT_BORDER, 
        borderRadius: 12,
        padding: 15, 
        backgroundColor: '#fff',
        // Sombra sutil
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    dropdownButtonDisabled: {
        backgroundColor: '#f9f9f9',
        borderColor: '#eee',
        shadowOpacity: 0,
        elevation: 0,
    },
    dropdownTextDisabled: {
        color: '#a0a0a0',
    },
    dropdownText: { fontSize: 16, color: '#2c3e50' },
    dropdownPlaceholder: { fontSize: 16, color: '#95a5a6' },
    dropdownArrow: { fontSize: 16, color: PRIMARY_BLUE }, // Flecha de acento
    
    // 3. ESTILOS PARA MODAL
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Oscurecido suave
    },
    modalContent: {
        width: '85%', // Ligeramente más ancho
        maxHeight: '60%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20, // Más padding
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2, // Sombra más notoria
        shadowRadius: 10,
        elevation: 10,
    },
    optionsScrollView: {
        maxHeight: 300, 
    },
    optionItem: {
        padding: 12, // Menos padding
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f4', // Divisor más sutil
    },
    optionItemSelected: {
        backgroundColor: '#e9f3f9', // Fondo azul muy claro
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    optionTextSelected: {
        fontWeight: 'bold',
        color: PRIMARY_BLUE,
    },
    optionTextDisabledMessage: { 
        fontSize: 15, 
        color: '#95a5a6', 
        textAlign: 'center', 
        paddingVertical: 20 
    },
    modalCloseButton: {
        backgroundColor: ERROR_RED,
        padding: 12,
        borderRadius: 10,
        marginTop: 15, // Más espacio arriba
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },

    // 4. SELECTOR SÍ/NO
    yesNoContainer: { marginBottom: 15 },
    yesNoButtons: { 
        flexDirection: 'row', 
        marginTop: 5,
        gap: 10, // Espacio entre botones
        marginHorizontal: -5, // Compensación de margen para gap
    },
    yesNoButton: { 
        flex: 1, 
        borderWidth: 1, 
        borderColor: LIGHT_BORDER, 
        borderRadius: 10, // Ligeramente más redondeado
        padding: 12, // Más padding
        alignItems: 'center', 
        backgroundColor: '#fff',
        marginHorizontal: 0, // Quitamos el margin horizontal y usamos gap
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    yesNoButtonSelected: { 
        backgroundColor: PRIMARY_BLUE, 
        borderColor: PRIMARY_BLUE,
        shadowColor: PRIMARY_BLUE,
        shadowOpacity: 0.2,
        elevation: 4,
    },
    yesNoText: { color: '#333' },
    yesNoTextSelected: { color: '#fff', fontWeight: 'bold' },
    
    // 5. CHECKBOX DE MEDICAMENTOS
    medicationToggle: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#fff', 
        borderWidth: 1, 
        borderColor: LIGHT_BORDER, 
        borderRadius: 10,
        padding: 15, // Más padding
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    medicationText: { fontSize: 16, color: '#2c3e50' },
    checkbox: {
        width: 22, 
        height: 22, 
        borderRadius: 6, 
        borderWidth: 2,
        borderColor: PRIMARY_BLUE, // Borde de color de acento
        alignItems: 'center', 
        justifyContent: 'center'
    },
    checkboxActive: { 
        backgroundColor: SUCCESS_GREEN, // Verde para activo
        borderColor: SUCCESS_GREEN 
    },
    checkMark: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    
    // 6. BOTONES DE ACCIÓN
    saveButton: { 
        backgroundColor: DARK_BLUE, // Azul fuerte para el botón principal
        padding: 18, 
        borderRadius: 12, 
        alignItems: 'center', 
        marginTop: 30,
        shadowColor: DARK_BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    saveButtonText: { 
        color: '#fff', 
        fontSize: 17, 
        fontWeight: 'bold' 
    },
    logoutButton: {
        backgroundColor: ERROR_RED, 
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20, 
        shadowColor: ERROR_RED,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
 profileHeader: {
    flexDirection: 'row',       // Coloca icono y texto en línea
    alignItems: 'center',       // Centrado vertical
    marginBottom: 12,           // Espacio debajo
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222222',
    marginLeft: 8,              // Espacio entre icono y texto
  },
  logoutButton: {
    backgroundColor: ERROR_RED, 
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 30, 
    shadowColor: ERROR_RED,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
},
logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Espacio entre icono y texto
},
logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
},

});