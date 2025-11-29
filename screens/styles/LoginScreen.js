import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff', 
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30, // Más padding
  },
keepLoggedInContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: 15,
  paddingHorizontal: 5,
},
keepLoggedInText: {
  fontSize: 14,
  color: '#2c3e50',
  fontWeight: '500',
},
  // --- TÍTULO Y SUBTÍTULO ---
  welcomeText: {
    fontSize: 32,
    fontWeight: '800', // Más negrita
    textAlign: 'left',
    color: '#2c3e50', // Azul oscuro profesional
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#7f8c8d',
    marginBottom: 40, // Más espacio debajo del subtítulo
  },

  // --- CAMPOS DE ENTRADA (Inputs) ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Inputs más grandes
    height: 55, 
    borderRadius: 12, // Más redondeado
    marginBottom: 18,
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
  inputLabel: {
    marginBottom: 10,
    color: '#636363ff',
  },
  passwordInputField: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    paddingLeft: 10,
    height: '100%',
    justifyContent: 'center',
  },

  // --- ENLACE OLVIDASTE CONTRASEÑA ---
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#00723F', // Color de acento
    fontSize: 14,
    fontWeight: '600',
  },

  // --- BOTÓN PRINCIPAL PERSONALIZADO (INGRESAR) ---
loginButton: {
        backgroundColor: '#00723F', // Color de acento fuerte
        paddingVertical: 15,
        borderRadius: 12,
        marginBottom: 25,
        shadowColor: '#024731',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
loginButtonDisabled: {
        backgroundColor: '#7f8c8d', // Un gris para indicar que está inactivo
        shadowOpacity: 0.1, // Sombra más sutil
        elevation: 3,
    },
  loginButtonText: {
    color: '#ffffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // --- SWITCH ---
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  switchLabel: {
    marginLeft: 10,
    fontSize: 15,
    color: '#555',
  },

  // --- ENLACE REGISTRO ---
  registerLink: {
    marginTop: 20,
    alignSelf: 'center',
  },
  registerText: {
    color: '#7f8c8d',
    fontSize: 15,
  },
  registerLinkText: {
    color: '#00723F', 
    fontWeight: 'bold',
  },
// IMAGEN
logo: {
    width: 250, // Define el ancho
    height: 250, // Define el alto
    resizeMode: 'contain', // Ajusta la imagen sin cortarla
    alignSelf: 'center', // Centra el logo horizontalmente
    marginBottom: 40, 
  },
});