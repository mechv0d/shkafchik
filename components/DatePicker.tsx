import React, { useMemo, useRef, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { ThemedText } from './themed-text';

interface DatePickerProps {
  visible: boolean;
  currentDate: string | null;
  onDateSelect: (dateString: string) => void;
  onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  visible,
  currentDate,
  onDateSelect,
  onClose,
}) => {
  const itemHeight = 50;
  const visibleItems = 5;
  
  const parseDate = (dateString: string | null) => {
    if (!dateString) return { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
    
    const match = dateString.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return {
        year: parseInt(match[1]),
        month: parseInt(match[2]),
        day: parseInt(match[3])
      };
    }
    
    return { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  };

  const initialDate = parseDate(currentDate);
  const [selectedYear, setSelectedYear] = useState(initialDate.year);
  const [selectedMonth, setSelectedMonth] = useState(initialDate.month);
  const [selectedDay, setSelectedDay] = useState(initialDate.day);

  const dayScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);
  const yearScrollRef = useRef<ScrollView>(null);

  const currentYear = new Date().getFullYear();
  
  const years = useMemo(() => {
    const yearArray = [];
    for (let i = currentYear + 10; i >= currentYear - 50; i--) {
      yearArray.push(i);
    }
    return yearArray;
  }, [currentYear]);

  const months = useMemo(() => {
    return [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];
  }, []);

  const daysInMonth = useMemo(() => {
    const days = new Date(selectedYear, selectedMonth, 0).getDate();
    const dayArray = [];
    for (let i = 1; i <= days; i++) {
      dayArray.push(i);
    }
    return dayArray;
  }, [selectedYear, selectedMonth]);

  // Scroll to selected items when they change
  React.useEffect(() => {
    const dayIndex = selectedDay - 1;
    const monthIndex = selectedMonth - 1;
    const yearIndex = years.indexOf(selectedYear);
    
    setTimeout(() => {
      dayScrollRef.current?.scrollTo({
        y: dayIndex * itemHeight,
        animated: false
      });
      monthScrollRef.current?.scrollTo({
        y: monthIndex * itemHeight,
        animated: false
      });
      yearScrollRef.current?.scrollTo({
        y: yearIndex * itemHeight,
        animated: false
      });
    }, 100);
  }, [selectedDay, selectedMonth, selectedYear]);

  const handleDayScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const newDay = Math.max(1, Math.min(daysInMonth.length, index + 1));
    if (newDay !== selectedDay) {
      setSelectedDay(newDay);
    }
  };

  const handleMonthScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const newMonth = Math.max(1, Math.min(12, index + 1));
    if (newMonth !== selectedMonth) {
      setSelectedMonth(newMonth);
    }
  };

  const handleYearScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    const newYear = Math.max(years[years.length - 1], Math.min(years[0], years[Math.max(0, Math.min(years.length - 1, index))]));
    if (newYear !== selectedYear) {
      setSelectedYear(newYear);
    }
  };

  const handleSave = () => {
    const dateString = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    onDateSelect(dateString);
    onClose();
  };

  const renderPicker = (items: number[] | string[], ref: React.RefObject<any>, onScroll: (event: any) => void, width: number, selectedValue: number | string, onSelect: (value: number | string) => void) => {
    const handleItemPress = (item: number | string, index: number) => {
      onSelect(item);
      // Прокручиваем к выбранному элементу
      ref.current?.scrollTo({
        y: index * itemHeight,
        animated: true
      });
    };

    return (
      <View style={[styles.pickerContainer, { width }]}>
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerHighlight, { height: itemHeight }]} />
        </View>
        
        <ScrollView
          ref={ref}
          style={[styles.pickerScroll, { height: itemHeight * visibleItems }]}
          showsVerticalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          snapToInterval={itemHeight}
          decelerationRate="fast"
          contentContainerStyle={{ paddingTop: itemHeight * 2, paddingBottom: itemHeight * 2 }}
        >
          {items.map((item, index) => {
            const isSelected = item === selectedValue;
            return (
              <TouchableOpacity
                key={typeof item === 'string' ? item : item.toString()}
                style={[styles.pickerItem, { height: itemHeight }]}
                onPress={() => handleItemPress(item, index)}
                activeOpacity={0.7}
              >
                <ThemedText style={[
                  styles.pickerItemText,
                  isSelected && styles.pickerItemSelectedText
                ]}>
                  {item}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <ThemedText style={styles.cancelButtonText}>Отмена</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.title}>Выберите дату</ThemedText>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <ThemedText style={styles.saveButtonText}>Готово</ThemedText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickersContainer}>
            {renderPicker(daysInMonth, dayScrollRef, handleDayScroll, 80, selectedDay, (value) => setSelectedDay(value as number))}
            {renderPicker(months, monthScrollRef, handleMonthScroll, 120, months[selectedMonth - 1], (monthName) => {
              const monthIndex = months.indexOf(monthName as string) + 1;
              setSelectedMonth(monthIndex);
            })}
            {renderPicker(years, yearScrollRef, handleYearScroll, 100, selectedYear, (value) => setSelectedYear(value as number))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  pickersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  pickerContainer: {
    height: 250,
    position: 'relative',
  },
  pickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 1,
  },
  pickerHighlight: {
    backgroundColor: '#000',
    opacity: 0.1,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  pickerScroll: {
    overflow: 'hidden',
  },
  pickerItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  pickerItemSelectedText: {
    fontSize: 20,
    color: '#000',
    fontWeight: '600',
  },
});

export default DatePicker;
