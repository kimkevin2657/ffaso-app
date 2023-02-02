import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Touchable from '../../components/buttons/Touchable';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';
import ColumnView from '../../components/ColumnView';
import RowContainer from '../../components/containers/RowContainer';
import LinearGradient from 'react-native-linear-gradient';
import TimePicker from '../../components/date/TimePicker';
import moment from 'moment';
import AntDesign from 'react-native-vector-icons/AntDesign';

import BirthPicker from '../../components/date/BirthPicker';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../api/api';
import {
  createTeacherSchedule,
  getTeacherSchedules,
  resetState,
} from '../../redux/scheduleSlice';
import SpaceBetweenContainer from '../../components/containers/SpaceBetweenContainer';
import CenterListModal from '../../components/modal/CenterListModal';
import { TEACHER_SCHEDULE_TYPES } from '../../constants/constants';

const today = moment(new Date()).format('YYYY-MM-DD');

const WorkTimeSetup = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { addSuccess } = useSelector((state) => state.schedule);
  const [selectedClass, setSelectedClass] = useState('업무'); // 선택한 업무유형
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectCenter, setSelectCenter] = useState({});
  const { teacherGyms = [] } = useSelector((state) => state.teacherGym);
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);

  useEffect(() => {
    if (addSuccess) {
      navigation.goBack();
      dispatch(resetState());
    }
  }, [addSuccess]);

  const onRegisterSchedule = async () => {
    if (!selectCenter?.id) {
      Alert.alert('센터를 선택해주세요');
      return;
    }
    console.log(selectCenter);
    if (
      moment(selectedStartTime).format('HH:mm') >=
      moment(selectedEndTime).format('HH:mm')
    ) {
      Alert.alert('종료시간 미만으로 시작시작을 입력해주세요');
      return;
    }

    try {
      if (selectedClass === '업무' || selectedClass === '휴일') {
        let params = {
          user: user?.id,
          date: moment(birthDate).format('YYYY-MM-DD'),
          status: selectedClass,
          gymId: selectCenter.gym,
        };
        if (selectedClass === '업무') {
          params.startTime = moment(selectedStartTime).format('HH:mm');
          params.endTime = moment(selectedEndTime).format('HH:mm');
        }
        await api.post(`teacher-status`, params);
        dispatch(getTeacherSchedules(today, user?.id));
        navigation.goBack();
      } else {
        let params = {
          gym: selectCenter.gym,
          teacher: user?.id,
          type: selectedClass,
          startTime: moment(selectedStartTime).format('HH:mm'),
          endTime: moment(selectedEndTime).format('HH:mm'),
          date: moment(birthDate).format('YYYY-MM-DD'),
        };
        dispatch(createTeacherSchedule(params));
      }
    } catch (err) {
      console.log('err', err);
      console.log('e.res', err.response);
      if (err.response?.data && err.response?.data?.msg) {
        Alert.alert(err.response?.data?.msg);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.requestInner}>
        <NormalBoldLabel style={styles.requestTitle} text={'스케줄 등록'} />
      </View>

      <View>
        <NormalBoldLabel text={'강사명'} style={styles.choiceTitle} />
        <RowContainer style={styles.trainerInputInner}>
          <View style={styles.trainerImageInner}>
            {user?.profileImage ? (
              <Image
                source={{ uri: user.profileImage }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            ) : (
              <Image
                style={styles.trainerImage}
                source={require('../../assets/images/scheduleClick/userImage.png')}
              />
            )}
          </View>

          <View style={styles.inputBox}>
            <NormalBoldLabel
              text={`${user?.type} ${user?.koreanName}`}
              style={{ color: '#555' }}
            />
          </View>
        </RowContainer>
      </View>
      <View>
        <NormalBoldLabel style={styles.choiceTitle} text={'센터'} />
        <SpaceBetweenContainer style={styles.inputInner}>
          <CenterListModal
            containerStyle={styles.centerInputBox}
            list={teacherGyms}
            selectedItem={selectCenter?.gymName}
            itemName={'gymName'}
            onPress={() => setIsCenterModalOpen(true)}
            visible={isCenterModalOpen}
            onRequestClose={() => setIsCenterModalOpen(false)}
            onSelect={(obj) => setSelectCenter(obj)}
            placeholder={'finesoft gym'}
          />
        </SpaceBetweenContainer>
      </View>

      <View>
        <NormalBoldLabel style={styles.choiceTitle} text={'스케줄 유형'} />
        <SpaceBetweenContainer style={styles.inputInner}>
          <CenterListModal
            containerStyle={styles.inputBox}
            list={TEACHER_SCHEDULE_TYPES}
            selectedItem={selectedClass}
            itemName={'name'}
            onPress={() => setIsModalOpen(true)}
            visible={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSelect={(obj) => setSelectedClass(obj.name)}
          />
        </SpaceBetweenContainer>
      </View>

      <RowContainer>
        <TimeSelect
          label={'스케줄 시작'}
          isPickerOpen={isStartTimePickerOpen}
          time={selectedStartTime}
          onPress={() => setIsStartTimePickerOpen(true)}
          onConfirm={(selectedTime) => {
            setIsStartTimePickerOpen(false);
            setSelectedStartTime(selectedTime);
          }}
          onCancel={() => setIsStartTimePickerOpen(false)}
        />
        <View style={{ width: 15 }} />
        <TimeSelect
          label={'스케줄 종료'}
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

      <View>
        <NormalBoldLabel text={'등록일'} style={styles.choiceTitle} />
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
      </View>
      <View style={{ flex: 1 }} />
      <RowContainer
        style={{
          marginTop: 34,
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={styles.btn2}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.btnText}>취소</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onRegisterSchedule} style={{ flex: 1 }}>
          <LinearGradient colors={['#8082FF', '#81D1F8']} style={[styles.btn3]}>
            <Text style={styles.btnText}>등록</Text>
          </LinearGradient>
        </TouchableOpacity>
      </RowContainer>
    </View>
  );
};

export default WorkTimeSetup;

const TimeSelect = ({
  label,
  isPickerOpen,
  time,
  onPress,
  onConfirm,
  onCancel,
}) => {
  return (
    <ColumnView style={{ flex: 1 }}>
      <NormalBoldLabel text={label} style={styles.choiceTitle} />
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
    </ColumnView>
  );
};
const styles = StyleSheet.create({
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
  birthdayBox: {
    marginTop: 1,
  },
  container: {
    padding: 24,
    backgroundColor: '#fbfbfb',
    flex: 1,
  },
  btnText: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '700',
    color: '#fff',
  },
  btn1: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: '#8082FF',
    flex: 1,
  },
  btn2: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 16,
    backgroundColor: '#AAA',
    flex: 1,
    marginHorizontal: 8.5,
  },
  btn3: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 16,
  },
  requestInner: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    paddingBottom: 8,
    borderBottomColor: '#E3E5E5',
    borderBottomWidth: 1,
  },
  requestTitle: {
    fontSize: 18,
    lineHeight: 22,
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

  choiceTitle: {
    marginTop: 13,
    fontSize: 12,
    lineHeight: 16,
    color: '#555',
  },
  inputInner: {
    marginTop: 5,
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
    marginTop: 5,
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
  centerInputBox: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  counting: {
    fontWeight: 'bold',
    color: '#555',
  },

  trainerImageInner: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#e3e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  trainerImage: {
    // resizeMode: 'contain',
    width: 22,
    height: 24,
  },

  trainerInputInner: {
    marginTop: 5,
  },

  trainerPickerInput: {
    width: 150,
    borderWidth: 1,
    height: 40,
    // justifyContent: 'space-between',
    alignItems: 'center',
    color: '#000',
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
    position: 'relative',
    resizeMode: 'contain',
    width: 131,
    height: 40,
  },
  buttonText: {
    position: 'absolute',
    lineHeight: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
