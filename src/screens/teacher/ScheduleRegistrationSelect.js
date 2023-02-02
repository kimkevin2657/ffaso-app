import React, { useState } from 'react';

import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import SelectScheduleCalendar from '../../components/selectScheduleCalendar';
import BottomGradientButton from '../../components/buttons/BottomGradientButton';
import {
  BoldLabel12,
  BoldLabel13,
  NormalBoldLabel,
  NormalLabel12,
} from '../../components/Label';
import RowContainer from '../../components/containers/RowContainer';
import { useSelector } from 'react-redux';
import apiv3 from '../../api/apiv3';
import { useToggle } from '../../hooks/useToggle';
import UnAvailableScheduleModal from '../../components/modal/v3/UnAvailableScheduleModal';
import HolidayModal from '../../components/modal/v3/HolidayModal';
import { resetNavigation } from '../../util';

const ScheduleRegistrationSelect = ({ route, navigation }) => {
  const { responseDates, body } = route.params;
  const { user } = useSelector((state) => state.auth);
  const [imPossibleDateInfo, setImPossibleDateInfo] = useState(null); // 해당 날짜에대한 일정 리스트
  const [openHolidayModal, setOpenHolidayModal] = useState(null); // 휴일 모달

  const [
    isOpenUnAvailableModal,
    toggleUnAvailableModal,
    setIsOpenUnAvailableModal,
  ] = useToggle(false);

  const onClickUnavailableDate = async (date) => {
    //달력 빨간색 클릭
    let params = {
      gymId: body?.gymId,
      teacherId: body?.teacherId,
      date,
    };
    try {
      const { data } = await apiv3.get('teacher-schedule-register', {
        params,
      });
      let propsData = {
        date,
        data: data?.schedules,
      };
      await setImPossibleDateInfo(propsData);
      setIsOpenUnAvailableModal(true);
    } catch (e) {
      if (e?.response.data.msg === '센터 휴관일입니다.') {
        setOpenHolidayModal(date);
      } else if (e?.response?.data?.msg) {
        alert(e.response.data.msg);
      }
    }
  };

  const onClickRegisterSchedule = async () => {
    let values = {
      gymId: body.gymId,
      teacherId: body.teacherId,
      possibleDates: responseDates.possibleDates,
      schedules: body.schedules.map((data) => ({
        startTime: data.startTime,
        endTime: data.endTime,
        lessonName: data.selectTicket.name,
      })),
    };
    try {
      const { data } = await apiv3.post('teacher-schedule-register', values);
      Alert.alert('스케줄 등록 완료');
      resetNavigation(navigation, 'TeacherMain');
    } catch (e) {
      if (e?.response?.data?.msg) {
        Alert.alert(e.response.data.msg);
      }
    }
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 20,
      }}
    >
      {openHolidayModal !== null && (
        <HolidayModal
          visible={openHolidayModal !== null}
          date={openHolidayModal}
          onRequestClose={() => {
            setOpenHolidayModal(null);
          }}
        />
      )}

      {isOpenUnAvailableModal && (
        <UnAvailableScheduleModal
          visible={isOpenUnAvailableModal}
          onRequestClose={() => {
            setIsOpenUnAvailableModal(false);
          }}
          imPossibleDateInfo={imPossibleDateInfo}
        />
      )}

      <SelectScheduleCalendar
        responseDates={responseDates}
        onClickUnavailableDate={onClickUnavailableDate}
      />
      <View style={styles.textBox}>
        <RowContainer style={{ justifyContent: 'center' }}>
          <View style={{ ...styles.circle, backgroundColor: '#5EC762' }} />
          <BoldLabel12
            text={'등록 가능'}
            style={{ color: '#5555', marginRight: 21 }}
          />
          <View style={{ ...styles.circle, backgroundColor: '#FF5656' }} />

          <BoldLabel12
            text={'등록 불가 날짜'}
            style={{ color: '#5555', marginRight: 6 }}
          />
          <NormalLabel12
            text={'(클릭 시 일정 확인)'}
            style={{ color: '#5555' }}
          />
        </RowContainer>
      </View>
      <View>
        <RowContainer style={{ justifyContent: 'center', marginBottom: 13 }}>
          <BoldLabel13
            text={'기간'}
            style={{ color: '#AAAAAA', marginRight: 6 }}
          />
          <BoldLabel13
            text={`${body?.startDate ?? ''} ~ ${body?.endDate ?? ''}`}
            style={{ color: '#555555' }}
          />
        </RowContainer>
        <BottomGradientButton
          style={{ flex: 1 }}
          outerStyle={{ paddingVertical: 0, height: 52, marginHorizontal: 24 }}
          onPress={onClickRegisterSchedule}
        >
          <NormalBoldLabel style={styles.bottomBtnText} text={'일정 등록'} />
        </BottomGradientButton>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbfbfb',
    flex: 1,
    paddingBottom: 24,
  },
  bottomBtnText: { fontSize: 20, color: '#fff', fontWeight: '700' },
  textBox: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: '#E3E5E5',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E5E5',
    marginBottom: 14,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 6,
  },
});

export default ScheduleRegistrationSelect;
