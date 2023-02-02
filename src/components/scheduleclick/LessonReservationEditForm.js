import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ColumnView from '../ColumnView';
import BirthPicker from '../date/BirthPicker';
import Touchable from '../buttons/Touchable';
import { NormalBoldLabel, NormalLabel } from '../Label';
import moment from 'moment';
import RowContainer from '../containers/RowContainer';
import TimePicker from '../date/TimePicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../buttons/GradientButton';
import { NoneLabel } from '../Label';

const LessonReservationEditForm = ({ isVisible }) => {
  const [selectedClass, setSelectedClass] = useState();
  const [selectTrainer, setSelectTrainer] = useState();
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [birthDate, setBirthDate] = useState(new Date());
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  return (
    <View>
      <View style={{ marginTop: 15 }}>
        <View style={styles.requestInner}>
          <NormalBoldLabel
            style={styles.requestTitle}
            text={'강습 예약 수정'}
          />
          {/* <TouchableOpacity>
            <Text style={styles.requestButton}>쿠폰사용</Text>
          </TouchableOpacity> */}
        </View>
        <View style={{ paddingLeft: 24, paddingRight: 28 }}>
          <View style={styles.choiceInner}>
            <View style={{ marginTop: 6 }} />
            <Text style={styles.choiceTitle}>강습 선택</Text>
            <RowContainer style={styles.inputInner}>
              <View style={styles.inputBox}>
                <Picker
                  style={styles.trainerPickerInput}
                  selectedValue={selectedClass}
                  onValueChange={(itemValue) => setSelectedClass(itemValue)}
                >
                  <Picker.Item label='Personal Training' value='' />
                  <Picker.Item label='요가' value='1' />
                  <Picker.Item label='필라테스' value='2' />
                  <Picker.Item label='골프' value='3' />
                  <Picker.Item label='헬스' value='4' />
                </Picker>
              </View>
            </RowContainer>
          </View>

          <View style={styles.choiceInner}>
            <Text style={styles.choiceTitle}>강사 선택</Text>
            <View style={styles.trainerInputInner}>
              <View style={styles.trainerImageInner}>
                <Image
                  style={styles.trainerImage}
                  source={require('../../assets/images/scheduleClick/userImage.png')}
                />
              </View>
              <View style={styles.inputBox}>
                <Picker
                  style={styles.trainerPickerInput}
                  selectedValue={selectTrainer}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectTrainer(itemValue)
                  }
                >
                  <Picker.Item label='P.T 김남욱' value='' />
                  <Picker.Item label='P.T 김남웅' value='1' />
                  <Picker.Item label='P.T 김남울' value='2' />
                  <Picker.Item label='P.T 김남올' value='3' />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.choiceInner}>
            <Text style={styles.choiceTitle}>가능한 일정</Text>

            <View style={styles.birthdayBox}>
              <BirthPicker
                isOpen={isDatePickerOpen}
                date={birthDate}
                onConfirm={(selectedDate) => {
                  setIsDatePickerOpen(false);
                  setBirthDate(selectedDate);
                }}
                onCancel={() => setIsDatePickerOpen(false)}
              />

              <Touchable
                onPress={() => setIsDatePickerOpen(true)}
                style={styles.birthdayInputBox}
              >
                <View />
                <NormalLabel
                  text={moment(birthDate).format('YYYY-MM-DD')}
                  style={styles.birthLabel}
                />

                <Image
                  style={{ width: 16, height: 18 }}
                  source={require('../../assets/icons/date.png')}
                />
              </Touchable>
            </View>

            <NormalLabel style={styles.choiceTitle} text={'시간 선택'} />
            <RowContainer>
              <TimeSelect
                isPickerOpen={isStartTimePickerOpen}
                time={selectedStartTime}
                onPress={() => setIsStartTimePickerOpen(true)}
                onConfirm={(selectedTime) => {
                  setIsStartTimePickerOpen(false);
                  setSelectedStartTime(selectedTime);
                }}
                onCancel={() => setIsStartTimePickerOpen(false)}
              />
              <NormalBoldLabel
                text={'~'}
                style={{
                  marginHorizontal: 3.5,
                  fontSize: 12,
                  lineHeight: 16,
                  color: '#aaa',
                }}
              />
              <TimeSelect
                isPickerOpen={isEndTimePickerOpen}
                time={selectedEndTime}
                onPress={() => setIsEndTimePickerOpen(true)}
                onConfirm={(selectedTime) => {
                  setIsEndTimePickerOpen(false);
                  setSelectedEndTime(selectedTime);
                }}
                onCancel={() => setIsEndTimePickerOpen(false)}
              />
            </RowContainer>
          </View>
        </View>
      </View>
      <RowContainer
        style={{
          marginTop: 18,
          borderTopWidth: 1,
          borderTopColor: '#E3E5E5',
          justifyContent: 'flex-end',
        }}
      >
        <Touchable style={{ paddingVertical: 20 }} onPress={isVisible}>
          <NoneLabel text={'취소'} style={styles.modalCancelText} />
        </Touchable>
        <Touchable>
          <NoneLabel text={'수정'} style={styles.modalEditText} />
        </Touchable>
      </RowContainer>
    </View>
  );
};

export default LessonReservationEditForm;

const TimeSelect = ({ isPickerOpen, time, onPress, onConfirm, onCancel }) => {
  return (
    <View style={{ flex: 1 }}>
      <TimePicker
        isOpen={isPickerOpen}
        time={time}
        onConfirm={(selectedTime) => onConfirm(selectedTime)}
        onCancel={onCancel}
      />
      <Touchable onPress={onPress} style={styles.timePickerBtn}>
        <View />
        <NormalLabel
          text={moment(time).format('HH:mm')}
          style={{ fontSize: 12, lineHeight: 16, color: '#555' }}
        />
        <AntDesign name='down' size={16} color={'#e3e5e5'} />
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  modalCancelText: {
    color: '#000',
    fontSize: 15,
    lineHeight: 17,
    paddingRight: 17,
  },
  modalEditText: {
    color: '#8082FF',
    fontSize: 15,
    lineHeight: 17,
    fontWeight: 'bold',
    paddingRight: 28,
    paddingLeft: 10,
  },
  birthdayBox: {
    marginTop: 1,
  },
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
  birthdayInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    color: '#555',
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  requestInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomColor: '#E3E5E5',
    borderBottomWidth: 1,
  },
  requestTitle: {
    color: '#555555',
    fontSize: 18,
    lineHeight: 22,
    marginLeft: 24,
  },
  requestButton: {
    width: 61,
    height: 28,
    lineHeight: 28,
    textAlign: 'center',
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#8082FF',
    fontWeight: 'bold',
  },

  choiceInner: {},
  choiceTitle: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
    color: '#555',
    fontWeight: 'bold',
  },

  inputInner: {
    marginTop: 5,
    // justifyContent: 'space-between',
  },

  inputBox: {
    width: 156,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trainerPickerInput: {
    width: 156,
    height: 40,
    // justifyContent: 'space-between',
    alignItems: 'center',
  },

  counting: {
    fontSize: 12,
    lineHeight: 16,
    color: '#555',
    marginLeft: 21,
  },

  trainerImageInner: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  trainerImage: {
    resizeMode: 'contain',
    width: 20,
  },

  trainerInputInner: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },

  birthdayInput: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    width: 98.3,
    height: 40,
    marginRight: 11,
    alignItems: 'center',
    paddingLeft: 20,
  },
  pickerInput: {
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monthInput: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderColor: 'lightgray',
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayInput: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonInner: {
    marginTop: 28,
    alignItems: 'center',
    justifyContent: 'center',
    width: 131,
  },

  button: {
    borderRadius: 10,
    paddingVertical: 10,
    width: 131,
    marginTop: 29,
  },
  buttonText: {
    position: 'absolute',
    lineHeight: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
