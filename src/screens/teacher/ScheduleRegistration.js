import React, { useCallback, useEffect, useState } from 'react';

import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import RowContainer from '../../components/containers/RowContainer';
import {
  BoldLabel12,
  BoldLabel13,
  NormalBoldLabel,
  NormalLabel12,
  NormalLabel13,
} from '../../components/Label';
import Feather from 'react-native-vector-icons/Feather';
import CenterListModal from '../../components/modal/CenterListModal';
import { useSelector } from 'react-redux';
import Touchable from '../../components/buttons/Touchable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import BirthPicker from '../../components/date/BirthPicker';
import dayjs from 'dayjs';
import BottomGradientButton from '../../components/buttons/BottomGradientButton';
import TimeSelect from '../../components/date/TimeSelect';
import api from '../../api/api';
import apiv3 from '../../api/apiv3';
import { operationHour } from '../../util';

const ScheduleRegistration = ({ navigation }) => {
  const Dates = ['월', '화', '수', '목', '금', '토', '일'];
  const { user } = useSelector((state) => state.auth);
  const { teacherGyms = [] } = useSelector((state) => state.teacherGym);

  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false); //센터 종류 모달
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false); //수가권 선택 모달
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(null); //일정시작일
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);

  const [selectCenter, setSelectCenter] = useState({}); //선택한 짐
  const [ticketList, setTicketList] = useState([]); //수강권 리스트
  const [selectTicket, setSelectTicket] = useState(null); // 선택한 수강권
  const [startDate, setStartDate] = useState(null); //일정시작날짜
  const [endDate, setEndDate] = useState(null); //일정 종료날짜
  const [selectDate, setSelectDate] = useState([]); //요일선택(월화수목금)
  const [selectedStartTime, setSelectedStartTime] = useState(null); //일정시작 시간
  const [schedules, setSchedules] = useState([]); //스케줄 리스트

  const isSelectGym = Object.keys(selectCenter).length === 0;

  const startHour = Math.min(
    operationHour(selectCenter?.weekdayStartTime),
    operationHour(selectCenter.weekendStartTime)
  );
  const endHour = Math.max(
    operationHour(selectCenter?.weekdayEndTime),
    operationHour(selectCenter?.weekendEndTime)
  );

  const onPressSelectDate = useCallback(
    (value) => {
      if (isSelectGym) {
        Alert.alert('센터를 선택해주세요');
        return;
      }
      if (startDate === null) {
        Alert.alert('일정 시작일을 선택하세요.');
        return;
      }
      if (endDate === null) {
        Alert.alert('일정 종료일을 선택하세요.');
        return;
      }
      if (selectDate.includes(value)) {
        setSelectDate((prev) => prev.filter((data) => data !== value));
      } else {
        setSelectDate([...selectDate, value]);
      }
    },
    [selectDate, startDate, endDate, isSelectGym]
  );

  const fetchTicketList = async () => {
    try {
      const { data } = await api.get(`products?gymId=${selectCenter.gym}`);
      const userDepartment = user?.department || '';
      const lessonTicketList = data?.lessonTickets.filter(
        (ticket) => ticket.department === userDepartment
      );

      setTicketList(lessonTicketList);
      if (lessonTicketList?.length < 1) {
        Alert.alert('등록 가능한 수강권이 없습니다. 관리자에게 문의하세요');
      }
    } catch (e) {
      if (e.response?.data && e.response?.data?.msg) {
        Alert.alert(e.response?.data?.msg);
      }
      console.log(e);
    }
  };

  const isExcludeAddSchedule = (
    centerStartTime,
    centerEndTime,
    startTime,
    endTime
  ) => {
    if (
      centerStartTime > startTime ||
      centerStartTime >= endTime ||
      centerEndTime <= startTime ||
      centerEndTime < endTime
    ) {
      Alert.alert(
        `[${selectTicket?.name} 수강 ${centerStartTime.slice(
          0,
          5
        )} ~ ${centerEndTime.slice(0, 5)}]`,
        `센터 운영 시간 이외에 일정을 추가할 수 없습니다.`
      );
      return true;
    } else {
      return false;
    }
  };

  const addScheduleList = () => {
    if (isSelectGym) {
      Alert.alert('센터를 선택해주세요');
      return;
    } else if (selectTicket === null) {
      Alert.alert('일정 유형을 선택하세요.');
      return;
    } else if (selectedStartTime === null) {
      Alert.alert('일정 시작 시간을 선택하세요.');
      return;
    }

    const startTime = dayjs(selectedStartTime).format('HH:mm');
    const endTime = dayjs(selectedStartTime)
      .add(selectTicket.time, 'm')
      .format('HH:mm');

    if (
      selectCenter?.weekendStartTime &&
      selectCenter?.weekendEndTime &&
      (selectDate.includes('토') || selectDate.includes('일'))
    ) {
      const { weekendStartTime, weekendEndTime } = selectCenter;
      if (
        isExcludeAddSchedule(
          weekendStartTime,
          weekendEndTime,
          startTime,
          endTime
        )
      ) {
        return;
      }
    } else if (selectCenter?.weekdayStartTime && selectCenter?.weekdayEndTime) {
      const { weekdayStartTime, weekdayEndTime } = selectCenter;
      if (
        isExcludeAddSchedule(
          weekdayStartTime,
          weekdayEndTime,
          startTime,
          endTime
        )
      ) {
        return;
      }
    }

    if (
      schedules?.some(
        (data) =>
          (startTime >= data.startTime && startTime < data.endTime) ||
          (endTime > data.startTime && endTime < data.endTime)
      )
    ) {
      Alert.alert('이미 등록된 일정이 있습니다.');
      return;
    }

    const newSchedule = {
      startTime,
      endTime,
      selectTicket,
    };

    const newSchedules = [...schedules, newSchedule].sort(
      (a, b) => b.startTime - a.startTime
    );

    setSchedules(newSchedules);
  };

  const onClickCreateSchedule = async () => {
    console.log("!!!!======= onClickCreateSchedule clicked       ");
    console.log("!!!!======= onClickCreateSchedule clicked      startdate ", startDate);
    console.log("!!!!======= onClickCreateSchedule clicked       ", endDate);
    console.log("!!!!======= onClickCreateSchedule clicked       ", schedules);
    console.log("!!!!======= onClickCreateSchedule clicked       ", selectDate);
    if (startDate > endDate) {
      Alert.alert('종료일을 시작일 이후로 입력해주세요');
    } else if (schedules.length <= 0) {
      Alert.alert('추가한 일정이 없습니다.');
    } else if (selectDate.length <= 0) {
      Alert.alert('선택한 요일이 없습니다');
    } else {
      const body = {
        gymId: selectCenter.gym,
        teacherId: user.id,
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: dayjs(endDate).format('YYYY-MM-DD'),
        days: selectDate,
        schedules,
      };
      console.log("!!!!======= onClickCreateSchedule clicked   body   ", body);
      try {
        const { data } = await apiv3.post('teacher-current-schedules', body);
        navigation.navigate('ScheduleRegistrationSelect', {
          responseDates: data,
          body,
        });
      } catch (e) {
        if (e?.response?.data?.msg) {
          console.log("!!!!=========== error msg   ", e.response.data.msg);
          alert("!!!=======  error msg   ", e.response.data.msg);
        }
      }
    }
  };
  useEffect(() => {
    if (Object.keys(selectCenter).length !== 0) {
      fetchTicketList();
    }
  }, [selectCenter]);

  useEffect(() => {
    if (teacherGyms.length > 0 && Object.keys(selectCenter).length === 0) {
      setSelectCenter(teacherGyms[0]);
    }
  }, []);

  const TipBox = ({ text }) => {
    return (
      <RowContainer style={styles.tipBox}>
        <Feather
          name='alert-circle'
          size={12}
          color={'#8082FF'}
          style={{ marginRight: 10, lineHeight: 18 }}
        />
        <NormalLabel12 text={text} style={styles.textColor} />
      </RowContainer>
    );
  };

  const today = new Date();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: 40,
      }}
    >
      <TipBox
        text={'Tip. 일정이 등록된 날짜에 여러개의 일정을 등록할 수 있습니다.'}
      />
      <View style={styles.centerBox}>
        <View style={{ position: 'relative' }}>
          <CenterListModal
            containerStyle={styles.pickerBox}
            list={teacherGyms}
            selectedItem={selectCenter?.gymName}
            itemName={'gymName'}
            onPress={() => setIsCenterModalOpen(true)}
            visible={isCenterModalOpen}
            onRequestClose={() => setIsCenterModalOpen(false)}
            onSelect={(obj) => setSelectCenter(obj)}
            placeholder={'finesoft gym'}
            selectStyle={{
              ...styles.centerName,
              color: selectCenter?.gymName ? '#8082FF' : '#aaa',
            }}
          />
          <Feather
            name='chevron-down'
            size={15}
            color={'#E3E5E5'}
            style={styles.arrowIcon}
          />
        </View>
        <RowContainer style={{ marginTop: 14 }}>
          <BoldLabel13 text={'평일'} style={styles.centerInfo} />
          <NormalLabel13
            text={
              selectCenter?.weekdayStartTime
                ? `${selectCenter?.weekdayStartTime.slice(
                    0,
                    5
                  )} ~ ${selectCenter?.weekdayEndTime.slice(0, 5)}`
                : ''
            }
            style={{ color: '#000' }}
          />
        </RowContainer>
        <RowContainer style={{ marginTop: 7 }}>
          <BoldLabel13 text={'주말 및 공휴일'} style={styles.centerInfo} />
          <NormalLabel13
            text={
              selectCenter?.weekendStartTime
                ? `${selectCenter?.weekendStartTime.slice(
                    0,
                    5
                  )} ~ ${selectCenter?.weekendEndTime.slice(0, 5)}`
                : ''
            }
            style={{ color: '#000' }}
          />
        </RowContainer>
      </View>
      <BoldLabel12
        text={'일정 유형'}
        style={{ ...styles.textColor, marginBottom: 5 }}
      />
      <CenterListModal
        containerStyle={styles.inputBox}
        list={ticketList}
        selectedItem={
          selectTicket?.name
            ? `[${selectTicket?.name} ${selectTicket?.time}분]`
            : ''
        }
        itemName={'name'}
        placeholder={'수강권을 선택하세요'}
        onPress={() => {
          if (isSelectGym) {
            alert('센터를 선택해주세요');
            return;
          }
          if (ticketList.length === 0) {
            alert('수강권이 존재하지않습니다');
            return;
          }
          setIsTicketModalOpen(true);
        }}
        visible={isTicketModalOpen}
        onRequestClose={() => setIsTicketModalOpen(false)}
        onSelect={(obj) => setSelectTicket(obj)}
      />
      <RowContainer style={{ marginVertical: 24 }}>
        <BoldLabel12
          text={'일정 시작 시간'}
          style={{ ...styles.textColor, flex: 0, marginRight: 12 }}
        />
        <TimeSelect
          placeholder={'시작 시간'}
          isPickerOpen={isStartTimePickerOpen}
          time={selectedStartTime}
          onPress={() => {
            if (isSelectGym) {
              alert('센터를 선택해주세요');
              return;
            }
            setIsStartTimePickerOpen(true);
          }}
          onConfirm={(selectedTime) => {
            setIsStartTimePickerOpen(false);
            setSelectedStartTime(selectedTime);
          }}
          onCancel={() => setIsStartTimePickerOpen(false)}
          minuteInterval={10}
          minimumDate={
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              startHour
            ) ?? undefined
          }
          maximumDate={
            new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
              endHour <= 0 ? 24 : endHour,
              60
            )
          }
        />
        {/*<CenterListModal*/}
        {/*  containerStyle={{*/}
        {/*    ...styles.inputBox,*/}
        {/*    marginLeft: 12,*/}
        {/*    marginRight: 10,*/}
        {/*  }}*/}
        {/*  list={TEACHER_SCHEDULE_TYPES}*/}
        {/*  selectedItem={selectTicket}*/}
        {/*  itemName={'name'}*/}
        {/*  onPress={() => setIsTicketModalOpen(true)}*/}
        {/*  visible={isTicketModalOpen}*/}
        {/*  onRequestClose={() => setIsTicketModalOpen(false)}*/}
        {/*  onSelect={(obj) => setSelectTicket(obj.name)}*/}
        {/*/>*/}
        <Touchable style={styles.scheduleAdd} onPress={addScheduleList}>
          <NormalLabel12 text={'추가'} style={{ fontWeight: '600' }} />
        </Touchable>
      </RowContainer>
      <TipBox
        text={'Tip. 진행할 일정을 시간별로 추가 후 하단의 일정을 클릭하세요.'}
      />
      {schedules.length > 0 && (
        <>
          <View style={styles.line} />
          <View style={styles.listView}>
            {schedules
              ?.sort((a, b) => a?.startTime > b?.startTime)
              ?.map((data, index) => {
                return (
                  <RowContainer
                    style={{ ...styles.listMenu, marginBottom: 8 }}
                    key={index}
                  >
                    <NormalLabel13
                      text={`${data.startTime} ~ ${data.endTime}`}
                      style={{ color: '#555555', marginRight: 12 }}
                    />
                    <BoldLabel13
                      text={`${data.selectTicket.name} (${data.selectTicket.time}분)`}
                      style={styles.textColor}
                    />
                    <Touchable
                      onPress={() => {
                        setSchedules((prev) =>
                          prev?.filter((list) => data !== list)
                        );
                      }}
                    >
                      <AntDesign name='close' size={18} color={'#FF0000'} />
                    </Touchable>
                  </RowContainer>
                );
              })}
          </View>
          <View style={styles.line} />
        </>
      )}
      <BoldLabel12
        text={'일정 시작일'}
        style={{ ...styles.textColor, marginTop: 24, marginBottom: 5 }}
      />
      <Touchable
        style={styles.listMenu}
        onPress={() => {
          if (isSelectGym) {
            alert('센터를 선택해주세요');
            return;
          }
          setIsDatePickerOpen('startDate');
        }}
      >
        <NormalLabel12
          text={
            startDate
              ? dayjs(startDate).format('YYYY-MM-DD')
              : '시작일을 선택하세요'
          }
          style={{ color: '#AAAAAA' }}
        />
      </Touchable>
      <BoldLabel12
        text={'일정 종료일'}
        style={{ ...styles.textColor, marginTop: 24, marginBottom: 5 }}
      />
      <Touchable
        style={styles.listMenu}
        onPress={() => {
          if (isSelectGym) {
            alert('센터를 선택해주세요');
            return;
          }

          setIsDatePickerOpen('endDate');
        }}
      >
        <NormalLabel12
          text={
            endDate
              ? dayjs(endDate).format('YYYY-MM-DD')
              : '종료일을 선택하세요'
          }
          style={{ color: '#AAAAAA' }}
        />
      </Touchable>
      <BoldLabel12
        text={'요일 선택'}
        style={{ ...styles.textColor, marginTop: 24, marginBottom: 5 }}
      />
      <RowContainer
        style={{ marginBottom: 73, justifyContent: 'space-between' }}
      >
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
      <BottomGradientButton
        style={{ flex: 1 }}
        outerStyle={{ paddingVertical: 0, height: 52 }}
        onPress={onClickCreateSchedule}
      >
        <NormalBoldLabel style={styles.bottomBtnText} text={'일정 확인'} />
      </BottomGradientButton>
      {isDatePickerOpen !== null && (
        <BirthPicker
          isOpen={
            isDatePickerOpen === 'startDate' || isDatePickerOpen === 'endDate'
          }
          date={
            isDatePickerOpen === 'startDate'
              ? startDate ?? new Date()
              : endDate ?? new Date()
          }
          onConfirm={(selectedDate) => {
            if (isDatePickerOpen === 'startDate') {
              setStartDate(selectedDate);
            } else {
              setEndDate(selectedDate);
            }
            setIsDatePickerOpen(null);
          }}
          onCancel={() => {
            setIsDatePickerOpen(null);
          }}
          minimumDate={new Date()}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    padding: 24,
  },
  tipBox: {
    backgroundColor: '#F6F6FF',
    borderRadius: 5,
    paddingVertical: 9,
    paddingRight: 13,
    paddingLeft: 10,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  textColor: {
    color: '#555',
    flex: 1,
  },
  pickerBox: {
    height: 45,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#E3E5E5',
  },
  centerBox: {
    background: '#FFFFFF',
    borderColor: '#ECEEF5',
    borderWidth: 2,
    borderRadius: 10,
    paddingBottom: 14,
    marginBottom: 24,
  },
  centerInfo: {
    color: '#AAAAAA',
    marginRight: 12,
    marginLeft: 17,
  },
  centerName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  arrowIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -7.5 }],
  },
  inputBox: {
    height: 40,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleAdd: {
    backgroundColor: '#8082FF',
    borderRadius: 5,
    width: 60,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  line: {
    height: 5,
    backgroundColor: '#E3E5E5',
    marginHorizontal: -24,
  },
  listView: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  listMenu: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E5E5',
    height: 40,
    paddingLeft: 14,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtnText: { fontSize: 20, color: '#fff', fontWeight: '700' },
  dateBtn: {
    width: 40,
    height: 39,
    borderRadius: 10,
    borderColor: '#E3E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    //       border: 1px solid #E3E5E5;
    // border-radius: 10px;
  },
  activeButton: {},
});

export default ScheduleRegistration;
