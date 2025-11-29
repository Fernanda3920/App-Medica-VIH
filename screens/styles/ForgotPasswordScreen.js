import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Color de fondo suave (ligero azul pálido, consistente)
    backgroundColor: '#ffffffff', 
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30, // Mayor padding, consistente con las otras pantallas
    zIndex: 1, // Para ir encima de la figura de fondo
  },

  // --- TÍTULO Y SUBTÍTULO ---
  title: {
    fontSize: 28, // Tamaño consistente
    fontWeight: '800', // Más negrita
    textAlign: 'center',
    color: '#2c3e50', // Azul oscuro profesional
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 40, // Más espacio debajo del subtítulo
    paddingHorizontal: 10,
  },

  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    height: 55, 
    borderRadius: 12, 
    marginBottom: 25, // Espacio antes del botón
    backgroundColor: '#ffffffff',
    paddingHorizontal: 15,
    
    // Sombra (efecto Neumórfico Suave)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },

  // --- BOTÓN PRINCIPAL (ENVIAR CORREO) ---
  loginButton: { // Se mantiene el nombre para consistencia de estilo
        backgroundColor: '#00723F', // Color de acento fuerte
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 25,
        shadowColor: '#02416bff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
  loginButtonDisabled: {
        backgroundColor: '#7f8c8d', // Gris para inactivo
        shadowOpacity: 0.1, 
        elevation: 3,
    },
  loginButtonText: {
    color: '#ffffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
    
  // --- BOTÓN SECUNDARIO (VOLVER) ---
  linkButtonContainer: {
    alignSelf: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#7f8c8d',
    fontSize: 15,
    textAlign: 'center',
  },
  secondaryButtonLinkText: {
    color: '#00723F', 
    fontWeight: 'bold',
  },

});