import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff', 
  },
  
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 30, // Mayor padding, como en el Login
    zIndex: 1, // Para que esté encima de la figura de fondo
  },

  // --- TÍTULO Y SUBTÍTULO ---
  welcomeText: {
    fontSize: 32,
    fontWeight: '800', 
    textAlign: 'left',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'left',
    color: '#7f8c8d',
    marginBottom: 40,
  },
  // El estilo 'title' se renombra o se puede mantener para compatibilidad
  title: {
    fontSize: 28, // Un poco más grande
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2c3e50',
  },

  // --- CAMPOS DE ENTRADA (Inputs) ---
  // Adaptamos el estilo 'input' y 'passwordContainer' al diseño moderno:
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    height: 55, // Inputs más grandes
    borderRadius: 12, // Más redondeado
    marginBottom: 18,
    backgroundColor: '#ffffffff',
    paddingHorizontal: 15,
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
 inputLabel: {
    marginBottom: 10,
    color: '#636363ff',
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },

  // Si usas un inputContainer para la contraseña, usa este estilo
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderRadius: 12,
    marginBottom: 18,
    backgroundColor: '#ffffffff',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 0, // Ya tiene padding en el container
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
  },
  inputIcon: {
    marginRight: 10,
  },

  // --- BOTÓN PRINCIPAL (REGISTRAR) ---
  loginButton: { 
        backgroundColor: '#00723F', // Color de acento fuerte
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 20, // Espacio superior
        marginBottom: 25,
        // Sombra para efecto 3D
        shadowColor: '#caa53fff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },

  loginButtonDisabled: {
        backgroundColor: '#7f8c8d', 
        shadowOpacity: 0.1, 
        elevation: 3,
    },
  loginButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // --- ENLACE A LOGIN ---
  registerLink: { // Renombrado a un nombre más genérico si aplica
    marginTop: 20,
    alignSelf: 'center',
  },
  registerText: {
    color: '#7f8c8d',
    fontSize: 15,
  },
  registerLinkText: {
    color: '#00723F', // Color de acento
    fontWeight: 'bold',
  },
linkButtonContainer: {
    // Este es el TouchableOpacity que reemplaza a <View style={styles.linkButton}>
    alignSelf: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#7f8c8d',
    fontSize: 15,
    textAlign: 'center',
  },
  secondaryButtonLinkText: {
    color: '#00723F', // Color de acento para el enlace
    fontWeight: 'bold',
  }
});