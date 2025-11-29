import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // fondo blanco profesional
    paddingHorizontal: 20, 
    paddingTop: 0, 
    paddingBottom: 20,
  },
header: { 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // CLAVE: Separa el 'titleContainer' y el 'notificationButton'
        paddingHorizontal: 20,           // Margen a los lados de la pantalla
        paddingTop: 10,                 
        marginBottom: 10,               
    },
mainTitle: {
        fontWeight: '700',
        fontSize: 24,
        color: '#1f2937',
    },
notificationButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
},

    notificationCountText: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#e34a40', // Color rojo del badge
        borderRadius: 10,
        minWidth: 20, 
        height: 20,
        zIndex: 10,
        color: 'white',
        fontSize: 10, 
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 18, // Ajuste para centrar el texto verticalmente
        paddingHorizontal: 3,
    },
notificationBadge: {
    position: "absolute",
    top: 1,
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
  notificationBadgeSubText: {
    color: '#dbeafe',
    fontSize: 11,
    textAlign: 'center',
  },
   subtitleFixed: {
        fontSize: 16,
        color: '#6b7280',
        lineHeight: 22,
     marginBottom: 20, // Espacio antes de la zona de scroll
        paddingHorizontal: 20, 
    },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#00723f',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#ffffff',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  dateInfoContainer: {
    marginBottom: 10,
  },
  titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10, // CLAVE: Crea 10px de espacio entre el ícono "medical" y el texto "Seguimiento Diario"
    },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 10,
  },
  horizontalNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#252525ff',
    fontWeight: '600',
  },
  dateButtonTextDisabled: {
    color: '#9cafa2ff',
  },
  intakeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#dd971a',
  },
  intakeCardTaken: {
    borderLeftColor: '#00723F',
    backgroundColor: '#ebf5eaff',
  },
  intakeCardDisabled: {
    opacity: 0.6,
  },
  intakeTimeContainer: {
    flex: 1,
    marginRight: 15,
  },
  intakeTime: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  intakeName: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 3,
    textTransform: 'capitalize',
  },
  statusBadge: {
    alignItems: 'flex-end',
  },
  statusText: {
    fontWeight: '600',
    fontSize: 14,
  },
  statusTextTaken: {
    color: '#15803d',
  },
  statusTextPending: {
    color: '#f59e0b',
  },
  realTimeText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
},

reminderCard: {
  backgroundColor: '#f6fcf9',
  padding: 14,
  borderRadius: 12,
  marginTop: 8,
  alignSelf: 'center',       // centra la tarjeta
  width: '100%',              // controla el ancho (ajusta este número)
  shadowColor: '#000',
  shadowOpacity: 0.05,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 2,
},


reminderCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
},

reminderCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#50BB48',
},

reminderCardBody: {
    fontSize: 14
},

reminderCardHint: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
    fontStyle: 'italic',
},
warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    gap: 10,
},
warningText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
},
notificationButton: {
    flexDirection: 'row', // <-- CLAVE: Alinea los hijos (ícono y texto) lado a lado
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    gap: 5, // Espacio entre el ícono y el número
},
notificationCountText: {
    color: '#20419A', // Color rojo para que se destaque
    fontSize: 18,     // Un tamaño de fuente decente
    fontWeight: 'bold',
},
notificationBadgeText: {
    color: 'white', 
    fontSize: 12,   
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: 'System', // <-- ¡NUEVO! Forzamos una fuente del sistema
},
header: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 18
},
titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Para separar el icono del texto del título principal
},
});
