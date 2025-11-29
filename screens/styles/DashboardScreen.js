import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20, 
    paddingTop: 0, 
    paddingBottom: 20,
  },
 header: {
    flexDirection: 'row', // Permite que los hijos se alineen horizontalmente
    alignItems: 'center', // Centra verticalmente el ícono y el texto
    marginBottom: 25,     // Usa la separación grande de 'Tu progreso'
},

mainTitle: {
    fontWeight: '700',
    fontSize: 24,
    marginLeft: 10, // <-- CLAVE: Espacio de 10px entre el ícono y el texto
},
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8d9399ff',
    textAlign: 'left',
    marginBottom: 15,
  },
  percentText: {
    fontSize: 60,
    fontWeight: '800',
    color: '#007AFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  progressContainer: {
    height: 18,
    backgroundColor: '#f0f0f0',
    borderRadius: 9,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 9,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  statsLabel: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  statsValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  takenText: {
    color: '#2ecc71',
  },
  missedText: {
    color: '#e74c3c',
  },
  infoBox: {
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#34495e',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#00723F',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 10,
  },
  errorSubtitle: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  subText: {
    marginTop: 5
  }
});
