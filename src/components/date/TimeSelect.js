import React from 'react';

import { Text, View, StyleSheet } from 'react-native';
import TimePicker from './TimePicker';
import Touchable from '../buttons/Touchable';
import { NormalLabel } from '../Label';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

const TimeSelect = ({
  isPickerOpen,
  time,
  onPress,
  onConfirm,
  onCancel,
  minuteInterval,
  placeholder,
  minimumDate,
  maximumDate,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <TimePicker
        isOpen={isPickerOpen}
        time={time ?? new Date()}
        onConfirm={(selectedTime) => onConfirm(selectedTime)}
        onCancel={onCancel}
        minuteInterval={minuteInterval}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />
      <Touchable onPress={onPress} style={styles.timePickerBtn}>
        <View />
        <NormalLabel
          text={time ? moment(time).format('HH:mm') : placeholder ?? ''}
          style={{ fontSize: 12, lineHeight: 16, color: '#555' }}
        />
        <AntDesign name='down' size={16} color={'#e3e5e5'} />
      </Touchable>
    </View>
  );
};

export default TimeSelect;

const styles = StyleSheet.create({
  timePickerBtn: {
    paddingVertical: 12.5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
});
