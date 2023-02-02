import React from 'react';
import DatePicker from 'react-native-date-picker';

const BirthPicker = ({
  isOpen,
  date,
  onConfirm,
  onCancel,
  minimumDate,
  maximumDate,
}) => {
  return (
    <DatePicker
      modal
      mode={'date'}
      locale={'ko'}
      title={null}
      confirmText={'확인'}
      cancelText={'취소'}
      open={isOpen}
      date={date}
      onConfirm={(selectedDate) => onConfirm(selectedDate)}
      onCancel={onCancel}
      minimumDate={minimumDate}
      maximumDate={maximumDate}
      // textColor={Appearance.getColorScheme() === 'light' ? 'black' : 'white'}
    />
  );
};

export default BirthPicker;
