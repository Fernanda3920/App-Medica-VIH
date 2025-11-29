import React from 'react';
import { View } from 'react-native';
import { styles } from './styles/DateSelectorCalendar'; 
import { Calendar, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

export default function CalendarView({ currentDate, onDateChange }) {

    const getFormattedDateString = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const initialDateString = getFormattedDateString(currentDate);

    return (
        <View style={styles.container}>
            <Calendar
                current={initialDateString}
                firstDay={1}
                onDayPress={(day) => {
                    const newDate = new Date(day.year, day.month - 1, day.day);
                    onDateChange(newDate); 
                }}
                
                markedDates={{
                    [initialDateString]: { 
                        selected: true, 
                        selectedColor: '#dd971a', // Usamos el azul fuerte para la selección
                        disableTouchEvent: false
                    }
                }}
                
                theme={{
                    // Colores Principales
                    backgroundColor: '#ffffff', // Fondo blanco limpio
                    calendarBackground: '#ffffff',
                    
                    // Botones y flechas de navegación
                    arrowColor: '#dd971a', // Flechas de color de acento
                    indicatorColor: '#dd971a', // Indicador de carga si se usa
                    
                    // Encabezado (Nombre del mes y días de la semana)
                    textSectionTitleColor: '#7f8c8d', // Gris para días de la semana
                    textSectionTitleDisabledColor: '#d9e1e8',
                    textMonthFontWeight: '800', // Mes en negrita
                    textMonthFontSize: 20, // Mes ligeramente más grande
                    
                    // Días del mes
                    dayTextColor: '#2c3e50', // Color oscur o para los días
                    textDisabledColor: '#d9e1e8', // Días deshabilitados
                    todayTextColor: '#dd971a', // El día de hoy en color de acento
                    
                    // Días Seleccionados
                    selectedDayBackgroundColor: '#dd971a', // Azul fuerte para el día seleccionado
                    selectedDayTextColor: '#ffffff',
                    
                    // Estilo del día (para lograr un look más redondeado)
                    'stylesheet.day.basic': {
                        selected: {
                            borderRadius: 8, // Ligeramente redondeado
                        }
                    }
                }}
            />
        </View>
    );
}