# VIH-App: Aplicación de Salud Integral con IA

> Una aplicación móvil completa para monitoreo de adherencia a medicamentos, seguimiento emocional y notificaciones de salud. Desarrollada con **React Native + Expo** y **Firebase**.

![Status](https://img.shields.io/badge/Version-1.0.1-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61dafb?logo=react)
![Firebase](https://img.shields.io/badge/Firebase-12.4.0-FFCA28?logo=firebase)


---

##  Descripción General

VIH-App es una **aplicación móvil de salud inteligente** diseñada específicamente para personas con VIH. Combina:

✅ **Adherencia a Medicamentos**: Rastreo diario con indicadores de progreso y análisis de cumplimiento  
✅ **Monitoreo Emocional**: Análisis de estado emocional con tendencias de 30 días  
✅ **Notificaciones Inteligentes**: Sistema de recordatorios personalizados  
✅ **Autenticación Segura**: Firebase Authentication con persistencia de sesión  
✅ **Sincronización en Tiempo Real**: Firestore para datos en la nube  
✅ **Detección de Conectividad**: Manejo automático de pérdida de conexión  

---

## 🏗️ Arquitectura del Proyecto

```
prototipo_2/
├── screens/                    # 🎨 Pantallas Principales
│   ├── DashboardScreen         # Adherencia a medicamentos (con análisis en tiempo real)
│   ├── EstadoEmocionalScreen   # Seguimiento emocional (30 días)
│   ├── TrackerScreen           # Componente tracker de medicamentos
│   ├── NotificationsScreen     # Historial y gestión de notificaciones
│   ├── ProfileScreen           # Perfil de usuario (información médica)
│   ├── LoginScreen             # Autenticación
│   ├── RegisterScreen          # Registro de usuarios
│   ├── ForgotPasswordScreen    # Recuperación de contraseña
│   ├── NoConnectionScreen      # UI para indicar al usuario que no tiene conexion
│   └── styles/                 # Estilos componentizados por pantalla
│
├── components/                 # 🧩 Componentes Reutilizables
│   ├── MedicationTrackerScreen # Tracker visual de medicamentos
│   ├── DateSelectorCalendar    # Selector de fechas con calendario
│   ├── InformationProfileScreen# Edición de información del perfil
│   ├── NotificationButton      # Botón de notificaciones
│   ├── useNotifications        # 🪝 Hook personalizado para notificaciones
│   └── styles/                 # Estilos locales de componentes
│
├── services/                   # 🔧 Lógica de Negocio
│   ├── firebaseService.js      # Integración Firebase (Auth, Firestore, CRUD)
│   └── firebaseSecret.js       # Configuración segura
│
├── assets/                     # 📦 Recursos (iconos, imágenes)
├── App.js                      # 🚀 Punto de entrada (Navegación)
├── index.js                    # Configuración inicial
├── app.json                    # Config de Expo
├── package.json                # Dependencias
└── eas.json                    # Configuración de builds (EAS)
```

---

## 🔧 Stack Tecnológico

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React Native** | 0.81.4 | Framework multiplataforma |
| **Expo** | ~54.0.13 | Herramienta de desarrollo y distribución |
| **React Navigation** | 7.x | Navegación bottom-tab + stack |
| **React Native Paper** | 5.14.5 | Componentes Material Design |
| **React Native Calendars** | 1.1313.0 | Selector de fechas avanzado |
| **Ionicons** | 15.0.3 | Iconografía |

### Backend & Base de Datos
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Firebase** | 12.4.0 | Backend as a Service |
| **Firestore** | Última | Base de datos en tiempo real |
| **Firebase Auth** | Última | Autenticación segura |

### Notificaciones & Conectividad
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Expo Notifications** | 0.32.12 | Sistema de notificaciones |
| **Notifee** | 9.1.8 | Notificaciones avanzadas |
| **NetInfo** | 11.4.1 | Detección de conectividad |
| **AsyncStorage** | 2.2.0 | Almacenamiento persistente |

---

## 🎯 Características Principales

###  **Dashboard de Adherencia** 📊
- Cálculo automático de adherencia diaria
- Indicador de progreso con colores dinámicos:
  - 🟢 **Verde** (≥80%): Excelente adherencia
  - 🟡 **Amarillo** (50-79%): Adherencia buena
  - 🔴 **Rojo** (<50%): Requiere mejora
- Registro de medicamentos tomados por dosis (3 por día)
- Análisis histórico desde fecha de inicio
- Actualización en tiempo real con Firestore

### **Monitoreo Emocional Inteligente** 💭
- Registro diario de estado emocional
- Clasificación automática:
  - **Positivas**: Contento, Alegría, Confiado, Autocompasivo
  - **Negativas**: Enojado, Ansioso, Miedo, Tristeza, etc.
  - **Neutral**: Otras emociones
- Análisis de tendencias últimos 30 días
- Porcentaje de positividad con recomendaciones
- Mensajes motivacionales adaptativos

### **Sistema de Notificaciones Inteligentes** 🔔
- Recordatorios automáticos para medicamentos
- Permutación aleatoria de frases motivacionales
- Segmentación por tipo de notificación
- Historial completo de notificaciones
- Integración con Notifee para notificaciones nativas

### **Autenticación** 🔐
- Registro con validación de email
- Login con persistencia de sesión
- Recuperación de contraseña por email
- Persistencia automática con AsyncStorage
- Control de sesión avanzado

### **Perfil de Usuario Completo** 👤
- Información médica (CD4, carga viral, etc.)
- Medicamentos asignados
- Historial médico
- Validación de datos completos antes de usar app
- Edición segura con sincronización Firebase

### **Manejo de Conectividad** 📡
- Detección automática de pérdida de conexión
- Pantalla especial para modo offline
- Reintentos automáticos

---


## 🚀 Instalación

### Requisitos Previos
- **Node.js** 16+ y npm
- **Expo CLI**: `npm install -g expo-cli`
- **Git**
- Cuenta de Firebase con proyecto creado

### Pasos

1. **Clonar repositorio**
```bash
git clone https://github.com/Fernanda3920/Prototipo.git
cd prototipo_2
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar Firebase** (⚠️ IMPORTANTE)
- Crear archivo `.env` con credenciales de Firebase
- Actualizar `firebaseService.js` con tu configuración
- Crear reglas de seguridad en Firestore

4. **Ejecutar en desarrollo**
```bash
npm start

# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🔐 Seguridad

### Implementado
✅ Autenticación Firebase con persistencia segura  
✅ Validación de datos en cliente y servidor  
✅ AsyncStorage con cifrado nativo  
✅ Reglas de seguridad en Firestore por usuario  
✅ Variables de entorno para credenciales  

---


##  Equipo de Desarrollo

El desarrollo de esta aplicación fue un **esfuerzo colaborativo** entre dos desarrolladores Full-Stack. Ambos **co-creamos** y **contribuimos** a la arquitectura completa, el desarrollo de la lógica de negocio y la implementación del *stack* tecnológico (React Native, Expo, Firebase).

- **Desarrollador:** Fernanda3920
- **Desarrollador** LuisRoldanC
- **Fecha de Inicio**: 2025
- **Versión Actual**: 1.0.1
- **Estado**: 🚀 En producción

## 🎓 Notas Técnicas Avanzadas

### Patrones Implementados
- **Component-based Architecture**: Separación clara de componentes y pantallas
- **Custom Hooks**: `useNotifications` para lógica de notificaciones reutilizable
- **Firebase Realtime**: Suscripción a cambios con `onSnapshot`
- **Adaptive UI**: Estilos dinámicos según estado y progreso
- **State Management**: Context API + AsyncStorage

### Optimizaciones
🚀 Lazy loading de pantallas  
🚀 Memoización de componentes  
🚀 Queries limitados a 30 días  
🚀 Caché local con AsyncStorage  
🚀 Compilación con Expo EAS  

---

<div align="center">

**Hecho con ❤️ para la salud integral**

*Última actualización: Noviembre 2025*

</div>
