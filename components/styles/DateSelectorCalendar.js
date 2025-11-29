import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        // Contenedor del calendario (similar al modalContent)
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 5, // Un poco menos de padding para que el calendario respire
        marginHorizontal: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, // Sombra sutil
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20, // Espacio si está en un ScrollView
    },
});