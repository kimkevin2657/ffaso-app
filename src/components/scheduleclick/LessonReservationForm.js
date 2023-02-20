import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  Appearance,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import BirthPicker from '../date/BirthPicker';
import Touchable from '../buttons/Touchable';
import { NormalBoldLabel, NormalLabel } from '../Label';
import moment from 'moment';
import RowContainer from '../containers/RowContainer';
import TimePicker from '../date/TimePicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GradientButton from '../buttons/GradientButton';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import api from '../../api/api';
import CenterListModal from '../modal/CenterListModal';
import { SCREEN_WIDTH } from '../../constants/constants';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import ReservationTimeModal from '../modal/ReservationTimeModal';

const LessonReservationForm = ({ onReservation, coupon, gyms }) => {
  const navigation = useNavigation();
  const { token } = useSelector((state) => state.auth);

  const [userTickets, setUserTickets] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedGymName, setSelectedGymName] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectTrainer, setSelectTrainer] = useState(null);
  const [birthDate, setBirthDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(
    coupon?.type === '수강권 체험 쿠폰' ? coupon : null
  );
  const [modalOpen, setModalOpen] = useState({
    gym: false,
    lesson: false,
    ticket: false,
    teacher: false,
    teacherSchedule: false,
  });
  const [teacherSchedules, setTeacherSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedCoupon) {
      getLessonsAndTeachers(selectedCoupon.gym);
      setSelectedGym(selectedCoupon.gym);
      setSelectedGymName(selectedCoupon.gymName);
      setSelectedClass(selectedCoupon.lessonName);
    }
  }, [selectedCoupon]);

  const getLessonsAndTeachers = async (gymId) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    try {
      const { data } = await api.get(
        `lessons-and-teachers?gymId=${gymId}`,
        config
      );
      // console.log('lessons-and-teachers res', data);

      // setLessons(data.lessons);
      // setTeachers(data.teachers);

      let newTickets = [];
      data?.userTickets.forEach((ticket) => {
        if (ticket.totalCount > ticket.usedCount) {
          newTickets.push(ticket);
        }
      });
      setUserTickets(newTickets);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  const getTeacherSchedules = async (teacherId, date) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    try {
      const { data } = await axios.get(
        `https://www.ffasoapi.com/v2/teacher-schedules?teacherId=${teacherId}&date=${moment(
          date
        ).format('YYYY-MM-DD')}`,
        config
      );
      setTeacherSchedules(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  const onReservationCheck = () => {
    if (isLoading) {
      Alert.alert('예약 요청중 입니다.');
      return;
    }
    if (!selectedGym) {
      Alert.alert('센터를 선택해주세요.');
    }
    // else if (!selectedClass) {
    //   Alert.alert('강습을 선택해주세요.');
    // }
    else if (!selectedCoupon && !selectedTicket) {
      Alert.alert('사용할 수강권을 선택해주세요.');
    } else if (!selectTrainer) {
      Alert.alert('강사를 선택해주세요.');
    } else {
      let body = {
        gymId: selectedGym,
        receiver: selectTrainer?.id,
        lessonName: selectedClass,
        date: moment(birthDate).format('YYYY-MM-DD'),
        startTime: selectedSchedule?.startTime,
        endTime: selectedSchedule?.endTime,
        schedule: selectedSchedule?.id,
      };

      if (selectedCoupon) {
        body.userCouponId = selectedCoupon.id;
      } else {
        body.ticketId = selectedTicketId;
      }
      // console.log('body', body);
      onReservation(body, '강습');
      setIsLoading(true);
    }
  };

  return (
    <View style={{ paddingHorizontal: 24 }}>
      <View style={{ marginTop: 32 }}>
        <RowContainer style={styles.requestInner}>
          <NormalBoldLabel
            style={styles.requestTitle}
            text={'강습 예약 요청'}
          />
          <TouchableOpacity
            style={styles.couponBtn}
            onPress={() => {
              if (selectedCoupon) {
                setSelectedCoupon(null);
                setSelectTrainer(null);
              } else {
                navigation.navigate('ScheduleCoupons', {
                  type: '수강권 체험 쿠폰',
                  reservationType: '강습',
                  onComplete: (selectedCoupon) => {
                    // console.log('onComplete ', selectedCoupon);
                    setSelectedCoupon(selectedCoupon);
                    setSelectTrainer({
                      id: selectedCoupon?.teacher?.id,
                      koreanName: selectedCoupon.teacher?.koreanName,
                    });
                  },
                });
              }
            }}
          >
            <Text style={styles.couponBtnText}>
              {selectedCoupon ? '쿠폰사용 취소' : '쿠폰사용'}
            </Text>
          </TouchableOpacity>
        </RowContainer>

        {selectedCoupon && (
          <>
            <Text style={styles.choiceTitle}>쿠폰명</Text>
            <View style={styles.inputBox}>
              <NormalLabel
                text={selectedCoupon?.name}
                style={{
                  fontSize: 15,
                  color: '#000',
                }}
              />
            </View>
          </>
        )}
        <Text style={styles.choiceTitle}>센터 선택</Text>
        <CenterListModal
          containerStyle={styles.inputBox}
          list={gyms}
          selectedItem={selectedGymName}
          placeholder={'선택해주세요'}
          itemName={'name'}
          onPress={() => setModalOpen({ ...modalOpen, gym: true })}
          visible={modalOpen.gym}
          onRequestClose={() => setModalOpen({ ...modalOpen, gym: false })}
          onSelect={(obj) => {
            setSelectedGym(obj.id);
            setSelectedGymName(obj.name);
            setSelectedClass(null);
            setSelectedTicket(null);
            getLessonsAndTeachers(obj.id);
          }}
          disabled={gyms.length === 0}
          disableMsg={'예약가능한 센터 목록이 없습니다.'}
        />

        {!selectedCoupon && (
          <>
            <Text style={styles.choiceTitle}>수강권 선택</Text>
            <CenterListModal
              containerStyle={styles.inputBox}
              list={userTickets}
              selectedItem={selectedTicket?.name}
              placeholder={'선택해주세요'}
              itemName={'name'}
              onPress={() => setModalOpen({ ...modalOpen, ticket: true })}
              visible={modalOpen.ticket}
              onRequestClose={() =>
                setModalOpen({ ...modalOpen, ticket: false })
              }
              onSelect={(obj) => {
                setSelectedTicket(obj);
                setSelectedClass(obj.name);
                setSelectedTicketId(obj.id);
                setSelectTrainer({
                  id: obj?.teacherId,
                  koreanName: obj.teacherName,
                });
                if (obj.teacherImage !== '') {
                  setProfileImage(
                    'https://ffaso.s3.ap-northeast-2.amazonaws.com/static/' +
                      obj.teacherImage
                  );
                }
                if (birthDate) {
                  getTeacherSchedules(obj?.teacherId, birthDate);
                }
              }}
              disabled={!selectedGym || userTickets.length === 0}
              disableMsg={
                !selectedGym
                  ? '센터를 선택해주세요.'
                  : '해당하는 수강권이 없습니다.'
              }
            />
          </>
        )}

        {selectedTicket && (
          <NormalBoldLabel
            style={styles.counting}
            text={`${selectedTicket?.totalCount - selectedTicket?.usedCount}/${
              selectedTicket?.totalCount
            } 남은횟수/가입횟수`}
          />
        )}

        <Text style={styles.choiceTitle}>강사 선택</Text>
        <RowContainer style={styles.trainerInputInner}>
          <View style={styles.trainerImageInner}>
            {profileImage === null ? (
              <Image
                style={styles.trainerImage}
                source={require('../../assets/images/scheduleClick/userImage.png')}
              />
            ) : (
              <FastImage
                style={styles.trainerImage1}
                source={{ uri: profileImage }}
              />
            )}
          </View>
          <CenterListModal
            containerStyle={styles.inputBox}
            list={[]}
            // list={teachers}
            selectedItem={selectTrainer?.koreanName}
            placeholder={'선택해주세요'}
            itemName={'koreanName'}
            onPress={() => null}
            // onPress={() => setModalOpen({ ...modalOpen, teacher: true })}
            visible={false}
            // visible={modalOpen.teacher}
            onRequestClose={() =>
              setModalOpen({ ...modalOpen, teacher: false })
            }
            onSelect={(obj) => {
              setSelectTrainer(obj);
              setProfileImage(obj.profileImage);
            }}
            disabled={!selectedGym}
            disableMsg={'센터를 선택해주세요.'}
          />
        </RowContainer>

        <Text style={styles.choiceTitle}>가능한 일정</Text>
        <View style={styles.birthdayBox}>
          <BirthPicker
            isOpen={isDatePickerOpen}
            date={birthDate}
            onConfirm={(selectedDate) => {
              setIsDatePickerOpen(false);
              setBirthDate(selectedDate);
              setSelectedSchedule(null);
              if (selectTrainer?.id) {
                getTeacherSchedules(selectTrainer.id, selectedDate);
              }
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

          <NormalLabel style={styles.choiceTitle} text={'시간 선택'} />
          <ReservationTimeModal
            containerStyle={styles.inputBox}
            list={teacherSchedules}
            selectedItem={
              selectedSchedule
                ? `${selectedSchedule?.startTime?.slice(
                    0,
                    5
                  )}  ~  ${selectedSchedule?.endTime?.slice(0, 5)} 수업`
                : null
            }
            placeholder={'선택해주세요'}
            onPress={() =>
              setModalOpen({ ...modalOpen, teacherSchedule: true })
            }
            visible={modalOpen.teacherSchedule}
            onRequestClose={() =>
              setModalOpen({ ...modalOpen, teacherSchedule: false })
            }
            onSelect={(obj) => setSelectedSchedule(obj)}
            disabled={
              !selectedTicket || !birthDate || teacherSchedules.length === 0
            }
            disableMsg={
              !selectedTicket
                ? '수강권을 선택해주세요.'
                : !birthDate
                ? '날짜를 선택해주세요.'
                : '이 날 해당하는 일정이 없습니다.'
            }
          />
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <GradientButton style={styles.button} onPress={onReservationCheck}>
            <NormalBoldLabel
              text={'예약 요청'}
              style={{ color: '#fff', fontSize: 18, lineHeight: 22 }}
            />
          </GradientButton>
        </View>
      </View>
    </View>
  );
};

export default LessonReservationForm;

const styles = StyleSheet.create({
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
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    color: '#000',
  },
  couponBtn: {
    // width: 61,
    paddingVertical: 5,
    paddingHorizontal: 7,
    justifyContent: 'center',
    alignContent: 'center',
    // lineHeight: 28,
    borderRadius: 5,
    backgroundColor: '#8082FF',
  },
  couponBtnText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#fff',
    fontWeight: '700',
  },

  choiceTitle: {
    marginTop: 12,
    fontSize: 12,
    lineHeight: 16,
    color: '#555',
    fontWeight: 'bold',
  },

  inputBox: {
    // width: 156,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    minWidth: 156,
    flex: 1,
  },
  trainerPickerInput: {
    width: 170,
    height: 40,
    // justifyContent: 'space-between',
    alignItems: 'center',
    // color: '#aaa',
  },

  counting: {
    fontSize: 12,
    lineHeight: 16,
    color: '#555',
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 10,
  },

  trainerImageInner: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  trainerImage: {
    resizeMode: 'contain',
    width: 30,
  },

  trainerImage1: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  trainerInputInner: {
    marginTop: 5,
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
    width: SCREEN_WIDTH * 0.34,
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
