import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import Touchable from '../../buttons/Touchable';
import {
  BoldLabel12,
  BoldLabel14,
  NormalBoldLabel,
  NormalLabel,
  NormalLabel12,
} from '../../Label';
import moment from 'moment';
import RowContainer from '../../containers/RowContainer';
import GradientButton from '../../buttons/GradientButton';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import api from '../../../api/api';
import CenterListModal from '../../modal/CenterListModal';
import { SCREEN_WIDTH } from '../../../constants/constants';
import { useNavigation } from '@react-navigation/native';
import TimeSelect from '../../date/TimeSelect';
import ProductInfo from './ProductInfo';
import apiv3 from '../../../api/apiv3';

const LessonReservationFormV3 = ({
  onReservation,
  coupon,
  gyms,
  isCouponType,
}) => {
  const navigation = useNavigation();
  const Dates = ['월', '화', '수', '목', '금', '토', '일'];

  const { token } = useSelector((state) => state.auth);

  const [userTickets, setUserTickets] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [selectedGymName, setSelectedGymName] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectTrainer, setSelectTrainer] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(
    coupon?.type === '수강권 체험 쿠폰' ? coupon : null
  );
  const [selectDate, setSelectDate] = useState([]); //요일선택(월화수목금)
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false); //가능한 시간대 선택
  const [selectedStartTime, setSelectedStartTime] = useState(); //가능한 시간대 값

  const [modalOpen, setModalOpen] = useState({
    gym: false,
    lesson: false,
    ticket: false,
    teacher: false,
    teacherSchedule: false,
  });

  useEffect(() => {
    if (isCouponType) {
      navigation.navigate('ScheduleCoupons', {
        type: '수강권 체험 쿠폰',
        reservationType: '강습',
        onComplete: async (selectedCoupon) => {
          await setProfileImage(selectedCoupon?.teacher?.profileImage);
          setSelectedCoupon(selectedCoupon);
          setSelectTrainer({
            id: selectedCoupon?.teacher?.id,
            koreanName: selectedCoupon.teacher?.koreanName,
          });
        },
      });
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: selectedCoupon ? '쿠폰 예약 요청' : '수강 예약 요청',
      headerRight: () => (
        <TouchableOpacity
          style={styles.couponBtn}
          onPress={() => {
            if (selectedCoupon) {
              setProfileImage(null);
              setSelectedCoupon(null);
              setSelectTrainer(null);
            } else {
              setProfileImage(null);
              navigation.navigate('ScheduleCoupons', {
                type: '수강권 체험 쿠폰',
                reservationType: '강습',
                onComplete: async (selectedCoupon) => {
                  await setProfileImage(selectedCoupon?.teacher?.profileImage);
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
      ),
    });
  }, [selectedCoupon]);

  useEffect(() => {
    if (selectedCoupon) {
      getLessonsAndTeachers(selectedCoupon.gym);
      setSelectedGym(selectedCoupon.gym);
      setSelectedGymName(selectedCoupon.gymName);
    }
  }, [selectedCoupon]);

  const onPressSelectDate = useCallback(
    (value) => {
      if (selectDate.includes(value)) {
        setSelectDate((prev) => prev.filter((data) => data !== value));
      } else {
        setSelectDate([...selectDate, value]);
      }
    },
    [selectDate]
  );

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

  const onReservationCheck = async () => {
    if (!selectedGym) {
      Alert.alert('센터를 선택해주세요');
      return;
    }
    if (!selectTrainer) {
      Alert.alert('강사를 선택해주세요');
      return;
    }
    if (selectDate.length === 0) {
      Alert.alert('요일을 선택해주세요');
      return;
    }

    let body = {
      gymId: selectedGym,
      teacherId: selectTrainer?.id,
      time: moment(selectedStartTime).format('HH:mm'),
      maxTime: moment(selectedStartTime).add(60, 'minutes').format('HH:mm'),
      days: selectDate,
      lessonName: selectedCoupon
        ? selectedCoupon.lessonName
        : selectedTicket?.name,
    };

    if (!body.lessonName) {
      Alert.alert('수강권을 선택해주세요');
      return;
    }
    try {
      const { data } = await apiv3.post('teacher-exist-schedules', body);
      console.log(data);
      if (data.length <= 0) {
        Alert.alert('일정이 존재하지않습니다');
        return;
      }
      navigation.navigate('MemberSelectSchedule', {
        selectedTicket: selectedTicket ?? null,
        selectedCoupon: selectedCoupon ?? null,
        profileImage,
        selectedGymName,
        selectTrainer,
        dataList: body,
        schedules: data,
      });
    } catch (e) {
      console.log(e.response);
      const { data } = e.response;

      if (!data.ok && data.msg) {
        Alert.alert(data.msg);
      }
    }
    // else {
    //   let body = {
    //     gymId: '',
    //     selectedCoupon,
    //     selectedTicket,
    //     selectTrainer,
    //     selectDate,
    //     selectedStartTime,
    //   };
    //   console.log(body);
    //   navigation.navigate('MemberTicketSelectSchedule');
    // }

    return;
  };

  return (
    <View
      style={{
        paddingHorizontal: 24,
        paddingTop: 8,
        flexGrow: 1,
      }}
    >
      {!selectedCoupon ? (
        <>
          {/*수강 예약 요청일 경우*/}
          <Text style={styles.choiceTitle}>센터 선택</Text>
          <CenterListModal
            containerStyle={styles.inputBox}
            list={gyms}
            selectedItem={selectedGymName}
            placeholder={'선택해주세요'}
            itemName={'name'}
            onPress={() => {
              setModalOpen({ ...modalOpen, gym: true });
            }}
            visible={modalOpen.gym}
            onRequestClose={() => setModalOpen({ ...modalOpen, gym: false })}
            onSelect={(obj) => {
              setSelectedGym(obj.id);
              setSelectedGymName(obj.name);
              setSelectedTicket(null);
              getLessonsAndTeachers(obj.id);
            }}
            disabled={gyms.length === 0}
            disableMsg={'예약가능한 센터 목록이 없습니다.'}
          />

          <Text style={styles.choiceTitle}>수강권 선택</Text>
          <CenterListModal
            containerStyle={styles.inputBox}
            list={userTickets}
            selectedItem={selectedTicket?.name}
            placeholder={'선택해주세요'}
            itemName={'name'}
            onPress={() => setModalOpen({ ...modalOpen, ticket: true })}
            visible={modalOpen.ticket}
            onRequestClose={() => setModalOpen({ ...modalOpen, ticket: false })}
            onSelect={(obj) => {
              setSelectedTicket(obj);
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
            }}
            disabled={!selectedGym || userTickets.length === 0}
            disableMsg={
              !selectedGym
                ? '센터를 선택해주세요.'
                : '해당하는 수강권이 없습니다.'
            }
          />
          {selectedTicket && (
            <RowContainer style={{ justifyContent: 'flex-end' }}>
              <BoldLabel12
                text={`${selectedTicket?.totalCount}회 중 `}
                style={{ color: '#555' }}
              />
              <BoldLabel12
                text={`${
                  selectedTicket?.totalCount - selectedTicket?.usedCount
                }회 `}
                style={{ color: '#8082FF' }}
              />
              <BoldLabel12 text={`남음`} style={{ color: '#555' }} />
            </RowContainer>
          )}

          <Text style={styles.choiceTitle}>강사 선택</Text>
          <RowContainer style={styles.trainerInputInner}>
            <View style={styles.trainerImageInner}>
              {profileImage ? (
                <Image
                  style={styles.trainerImage1}
                  source={{ uri: profileImage }}
                />
              ) : (
                <Image
                  style={styles.trainerImage}
                  source={require('../../../assets/images/scheduleClick/userImage.png')}
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
        </>
      ) : (
        <>
          {selectedCoupon && (
            <>
              <ProductInfo
                title={selectedCoupon?.name}
                countText={`총 ${selectedCoupon?.availableCount}회 중 ${
                  selectedCoupon?.availableCount - selectedCoupon?.currentCount
                }회 남음`}
                useCountText={`( ${selectedCoupon?.currentCount}회 사용 )`}
                dateText={selectedCoupon?.expiryDate}
              />
              <RowContainer style={{ marginTop: 24 }}>
                <View style={styles.trainerImageInner}>
                  {profileImage === null ? (
                    <Image
                      style={styles.trainerImage}
                      source={require('../../../assets/images/scheduleClick/userImage.png')}
                    />
                  ) : (
                    <FastImage
                      style={styles.trainerImage1}
                      source={{ uri: profileImage }}
                    />
                  )}
                </View>
                <View>
                  <NormalLabel12
                    text={selectedGymName ?? ''}
                    style={{ color: '#555' }}
                  />
                  <BoldLabel14
                    text={selectTrainer?.koreanName}
                    style={{ color: '#000', marginTop: 3 }}
                  />
                </View>
              </RowContainer>
            </>
          )}
        </>
      )}
      {/**/}
      {/**/}
      {/**/}
      {/**/}
      {/**/}
      <BoldLabel12
        text={'요일 선택'}
        style={{ ...styles.textColor, marginBottom: 5 }}
      />
      <RowContainer style={{ justifyContent: 'space-between' }}>
        {Dates.map((date, index) => {
          const isNotSelected = !selectDate.includes(date);
          return (
            <Touchable
              onPress={() => {
                onPressSelectDate(date);
              }}
              key={index}
              style={{
                ...styles.dateBtn,
                borderWidth: isNotSelected ? 1 : 0,
                backgroundColor: isNotSelected ? '#fff' : '#8082FF',
              }}
            >
              <NormalLabel12
                text={date}
                style={{
                  color: isNotSelected ? '#555555' : '#FFFFFF',
                  fontWeight: isNotSelected ? '400' : '700',
                }}
              />
            </Touchable>
          );
        })}
      </RowContainer>
      <RowContainer style={{ marginTop: 26 }}>
        <NormalLabel
          style={{ ...styles.choiceTitle, marginRight: 17, marginTop: 0 }}
          text={'가능한 시간대 선택'}
        />
        <TimeSelect
          isPickerOpen={isStartTimePickerOpen}
          time={selectedStartTime}
          onPress={(selectedStartTime, selectedTime) => {
            setSelectedStartTime(new Date(Date.parse("1991-01-01T09:00:00.417-15:00")));
            setIsStartTimePickerOpen(true)
          }}
          onConfirm={(selectedTime) => {
            setIsStartTimePickerOpen(false);
            setSelectedStartTime(selectedTime);
          }}
          onCancel={() => setIsStartTimePickerOpen(false)}
          minuteInterval={10}
        />
      </RowContainer>
      <View style={{ flexGrow: 1 }} />
      <RowContainer>
        <GradientButton style={styles.button} onPress={onReservationCheck}>
          <NormalBoldLabel
            text={'수강 일정 확인'}
            style={{ color: '#fff', fontSize: 20, lineHeight: 30 }}
          />
        </GradientButton>
      </RowContainer>
    </View>
  );
};

export default LessonReservationFormV3;

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
    maxHeight: 40,
    minHeight: 40,
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

  button: {
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 29,
    width: SCREEN_WIDTH - 48,
    height: 52,
  },
  dateBtn: {
    width: 40,
    height: 39,
    borderRadius: 10,
    borderColor: '#E3E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});