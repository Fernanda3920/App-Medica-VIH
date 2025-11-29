import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffffff', // fondo general de la pantalla
    },
    
    // --- 1. AJUSTE: Eliminar paddingTop del scrollContent ---
    scrollContent: {
        paddingHorizontal: 20, // Margen lateral para el contenido
        // Se elimina paddingTop: 20, ya que el header fijo lo cubre
        paddingBottom: 40,
    },
    
    // --- 2. AJUSTE: Añadir paddingHorizontal al headerWithNotification ---
    headerWithNotification: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //paddingHorizontal: 20,  CLAVE: Añadir margen lateral aquí para el contenido fijo
        paddingTop: 10,        // Pequeño espacio superior dentro del safe area
        paddingBottom: 5,      // Espacio antes del subtítulo
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    mainTitle: {
        fontWeight: '700',
        fontSize: 24,
        color: '#1f2937',
    },

    // --- 3. AJUSTE: Renombrar subtitle a subtitleFixed y añadir paddingHorizontal ---
    subtitleFixed: {
        fontSize: 16,
        color: '#6b7280',
        lineHeight: 22,
        marginTop: 19,
        marginBottom: 20, // Espacio antes de la zona de scroll
        paddingHorizontal: 20, // CLAVE: Añadir margen lateral para el contenido fijo
    },
    notificationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
},

notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#e34a40",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
},

notificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
},
    // --- TUS ESTILOS EXISTENTES (Preguntas y Botones) ---
    questionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3, // para Android
    },
    categoryTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3498db',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    questionText: {
        fontSize: 16,
        color: '#2c3e50',
        marginBottom: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    responseButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#ecf0f1',
        minWidth: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    yesButton: {
        // En tu lógica JSX, se usa yesButton para el estado no-seleccionado/no-respondido.
        // Pero en tu JSX anterior, usamos estilos específicos para 'sí' seleccionado:
        borderColor: '#27ae60', 
        backgroundColor: 'white',
        borderWidth: 1,
    },
    yesButtonSelected: {
        // Estilo cuando se selecciona 'Sí' o cualquier opción
        backgroundColor: '#2ecc71',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        // Necesitas que el texto sea visible cuando el botón NO está seleccionado (blanco)
        color: '#27ae60', // Color para el texto cuando no está seleccionado
        fontWeight: '600',
        fontSize: 14,
    },
    // El estilo scheduleButton ya no es necesario en esta pantalla
});