import React from 'react';
import DatePicker from 'react-native-date-picker';

const TimePicker = ({
  isOpen,
  time,
  onConfirm,
  onCancel,
  minuteInterval = 1,
  maximumDate,
  minimumDate,
}) => {
  return (
    <DatePicker
      // theme={'white'} props only ios13+
      modal
      mode={'time'}
      locale={'ko'}
      title={null}
      confirmText={'확인'}
      cancelText={'취소'}
      open={isOpen}
      date={time}
      onConfirm={(selectedTime) => onConfirm(selectedTime)}
      onCancel={onCancel}
      minuteInterval={minuteInterval}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
    />
  );
};

export default TimePicker;
