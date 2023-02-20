import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import LessonReservationForm from '../../../components/scheduleclick/LessonReservationForm';
import VisitReservationsForm from '../../../components/scheduleclick/VisitReservationsForm';
import api from '../../../api/api';
import { useDispatch, useSelector } from 'react-redux';
import { resetNavigation } from '../../../util';
import LessonReservationFormV3 from '../../../components/scheduleclick/v3/LessonReservationFormV3';

const MemberScheduleRegisterScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);
  const coupon = useState(route.params?.coupon ?? null);
  const { reservationType } = route.params;
  const [gyms, setGyms] = useState([]);
  // console.log('selectedCoupon', coupon);

  useEffect(() => {
    getGyms();
  }, []);

  const getGyms = useCallback(async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };
      const { data } = await api.get(`gyms/?isMine=true`, config);
      setGyms(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  }, []);

  //예약 등록 함수
  const onReservation = async (data, type) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    data.type = type;
    let body = data;
    let startTime = body.startTime.substring(0, 2);
    let endTime = body.endTime.substring(0, 2);
    let startTimeMinute = body.startTime.substring(3, 5);
    let endTimeMinute = body.endTime.substring(3, 5);

    if (parseInt(startTime) > parseInt(endTime)) {
      Alert.alert('강습시간을 확인해주세요.');
    } else if (
      parseInt(startTime) === parseInt(endTime) &&
      startTimeMinute > endTimeMinute
    ) {
      Alert.alert('강습시간을 확인해주세요.');
    } else if (body.receiver === undefined) {
      Alert.alert('센터에 등록된 강사를 선택해주세요.');
    } else if (body.lessonName === undefined) {
      Alert.alert('강습 혹은 이용 종목을 선택해주세요.');
    } else {
      try {
        await api.post('reservations', body, config);
        // console.log('onReservation success', data);
        Alert.alert('예약이 등록되었습니다.');
        resetNavigation(navigation, 'MemberMain');
        dispatch(getGyms());
      } catch (e) {
        console.log('e', e.data);
        console.log('e', e.response);

        if (e.response?.data?.msg) {
          const { msg } = e.response.data;
          Alert.alert(msg);
        }
      }
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <LessonReservationFormV3
        gyms={gyms}
        coupon={coupon}
        onReservation={(data, type) => onReservation(data, type)}
        isCouponType={reservationType !== '강습'}
      />
      {/*{reservationType === '강습' ? (*/}
      {/*  <LessonReservationForm*/}
      {/*    gyms={gyms}*/}
      {/*    coupon={coupon}*/}
      {/*    onReservation={(data, type) => onReservation(data, type)}*/}
      {/*  />*/}
      {/*) : (*/}
      {/*  <VisitReservationsForm*/}
      {/*    gyms={gyms}*/}
      {/*    coupon={coupon}*/}
      {/*    onReservation={(data, type) => onReservation(data, type)}*/}
      {/*  />*/}
      {/*)}*/}
    </ScrollView>
  );
};

export default MemberScheduleRegisterScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbfbfb',
    paddingBottom: 25,
  },
});
