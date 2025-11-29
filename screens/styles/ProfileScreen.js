import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    // 1. FONDO Y CONTENEDORES
    scrollContainer: {
        backgroundColor: '#fdfdfaff', // Color de fondo suave
    },
    container: {
        flex: 1,
        padding: 0, // Quitamos el padding aquí y lo ponemos en el content
        justifyContent: 'flex-start', // Alinear al inicio para el scroll
        paddingTop: 30,
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25, // Mayor padding
        marginHorizontal: 20, // Agregamos margen horizontal
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08, // Sombra más sutil
        shadowRadius: 10,
        backgroundColor: '#fffefcff',
        elevation: 5,
    },

    // 2. TÍTULOS
    title: {
        fontSize: 28,
        fontWeight: '800', // Más negrita
        color: '#2e2e2eff', // Azul oscuro (consistente con login)
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#7f8c8d',
        textAlign: 'center',
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 22, // Un poco más grande
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 15,
        borderBottomWidth: 0, // Quitamos el subrayado
        paddingBottom: 0,
    },
    divider: {
        borderBottomColor: '#febe10',
        borderBottomWidth: 1,
        marginVertical: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 8,
        marginTop: 10,
    },
    infoText: {
        fontSize: 12,
        color: '#7f8c8d', // Color más neutro para información
        marginTop: -10,
        marginBottom: 15,
        textAlign: 'right', // Alinear a la derecha
        paddingRight: 5,
    },

    // 3. INPUTS Y SELECTORES (Estilo Unificado)
    input: {
        backgroundColor: '#fffefbff', // Fondo blanco limpio
        borderRadius: 12, // Más redondeado
        padding: 15,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0', // Borde sutil
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    pickerButton: {
        // Usa el mismo estilo del input
        backgroundColor: '#fffefbff', 
        borderRadius: 12, 
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    pickerButtonText: {
        fontSize: 16,
        color: '#2c3e50',
    },

    // 4. SELECTOR SÍ/NO (Colores de Acento)
    yesNoContainer: {
        marginBottom: 15,
    },
    yesNoButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: 5,
    },
    yesNoButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#dfdfdfff',
        backgroundColor: '#ebebebff',
        minWidth: 80,
        alignItems: 'center',
    },
    yesNoButtonSelected: {
        backgroundColor: '#00723F', // Color de acento
        borderColor: '#00723F',
        shadowColor: '#00723F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    yesNoButtonText: {
        color: '#2c3e50',
        fontWeight: '600',
    },
    yesNoButtonTextSelected: {
        color: 'white',
    },
    yesNoButtonDisabled: {
        opacity: 0.6,
    },
sectionTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center', // Centra el ícono y el texto verticalmente
        marginBottom: 15,
        marginTop: 20,
    },
    sectionTitleIcon: {
        marginRight: 8, // Espacio discreto entre el ícono y el texto
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#226d70',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonIcon: {
        marginRight: 10,
    },
    // 5. CHECKBOX DE MEDICAMENTOS (Colores de Acento)
    medicationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12, // Más espacio vertical
        borderBottomWidth: 1,
        borderBottomColor: '#fffefcff', // Línea más clara
    },
    checkbox: {
        height: 22,
        width: 22,
        borderRadius: 6, // Un poco más grande y redondeado
        borderWidth: 2,
        borderColor: '#50b848',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    checkboxChecked: {
        backgroundColor: '#50b848',
        borderColor: '#50b848',
    },
    checkmark: {
        color: 'white',
        fontSize: 14, // Checkmark más visible
        fontWeight: 'bold',
    },
    medicationLabel: {
        fontSize: 15,
        color: '#2c3e50',
        flexShrink: 1, // Permite que el texto se ajuste
    },

    // 6. BOTÓN PRINCIPAL (Guardar)
    button: {
        backgroundColor: '#00723F', // Azul fuerte (consistente con Login)
        padding: 18, // Más relleno
        borderRadius: 12, // Más redondeado
        alignItems: 'center',
        marginTop: 30, // Más espacio arriba
        marginBottom: 20,
        shadowColor: '#002715ff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
    buttonDisabled: {
        backgroundColor: '#7f8c8d',
        shadowOpacity: 0.1, 
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    
    // 7. MODAL (Mantienen la estética limpia)
    modalContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Overlay un poco más oscuro
        justifyContent: 'center', 
        alignItems: 'center',     
        zIndex: 100, 
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 25, // Más padding
        width: '85%', // Un poco más ancho
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2c3e50',
    },
    modalItem: {
        padding: 12,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f4f4f4',
    },
    modalItemSelected: {
        backgroundColor: '#e9f3f9', // Fondo azul muy claro
        borderRadius: 8,
    },
    modalItemText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    modalCloseButton: {
        backgroundColor: '#00723F',
        padding: 12,
        borderRadius: 10,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
logo: {
    width: 250, // Define el ancho
    height: 250, // Define el alto
    resizeMode: 'contain', // Ajusta la imagen sin cortarla
    alignSelf: 'center', // Centra el logo horizontalmente
    marginBottom: 40, 
  },
});