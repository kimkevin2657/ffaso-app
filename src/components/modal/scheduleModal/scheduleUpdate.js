import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import Touchable from '../../buttons/Touchable';
import styled from 'styled-components/native';
import { NoneLabel, NormalBoldLabel } from '../../Label';
import { useSelector } from 'react-redux';
import SpaceBetweenContainer from '../../containers/SpaceBetweenContainer';
import CenterListModal from '../CenterListModal';
import RowContainer from '../../containers/RowContainer';
import moment from 'moment';
import TimeSelect from '../../date/TimeSelect';
import api from '../../../api/api';

const ScheduleUpdate = ({ setOpenModal, selectedContent, onPress }) => {
  const { teacherGyms = [] } = useSelector((state) => state.teacherGym);
  const { user } = useSelector((state) => state.auth);
  const initialCenterIndex = teacherGyms.findIndex(
    (data) => data.gym === selectedContent.gym
  );
  const [ticketList, setTicketList] = useState([]); //수강권 리스트

  const classTime = !selectedContent
    ? 0
    : moment(selectedContent?.date + ' ' + selectedContent?.endTime).diff(
        moment(selectedContent?.date + ' ' + selectedContent?.startTime)
      ) / 60000;
  const [selectedClass, setSelectedClass] = useState(
    !selectedContent
      ? null
      : {
          name: selectedContent?.lessonName,
          time: classTime,
        }
  ); // 선택한 업무유형

  const [selectedStartTime, setSelectedStartTime] = useState(
    new Date(
      moment(
        selectedContent.startTime ? selectedContent.startTime : new Date(),
        'HH:mm:ss'
      )
    )
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    new Date(
      moment(
        selectedContent.endTime ? selectedContent.endTime : new Date(),
        'HH:mm:ss'
      )
    )
  );
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(
    new Date(moment(selectedContent?.date))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectCenter, setSelectCenter] = useState(
    initialCenterIndex !== -1 ? teacherGyms[initialCenterIndex] : {}
  );
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);
  const isSelectGym = Object.keys(selectCenter).length === 0;

  useEffect(() => {
    if (Object.keys(selectCenter).length !== 0) {
      fetchTicketList();
    }
  }, [selectCenter]);

  const fetchTicketList = async () => {
    try {
      const { data } = await api.get(`products?gymId=${selectCenter.gym}`);
      const userDepartment = user?.department || '';
      const lessonTicketList = data?.lessonTickets.filter(
        (ticket) => ticket.department === userDepartment
      );

      setTicketList(lessonTicketList);
      if (lessonTicketList?.length <= 0) {
        Alert.alert('등록 가능한 수강권이 없습니다. 관리자에게 문의하세요');
      }
    } catch (e) {
      if (e.response?.data && e.response?.data?.msg) {
        Alert.alert(e.response?.data?.msg);
      }
      console.log(e);
    }
  };

  return (
    <Container>
      <TopContainer>
        <NoneLabel
          text={'일정 수정'}
          style={{ fontSize: 18, fontWeight: 'bold' }}
        />
      </TopContainer>
      <CenterContainer>
        <NormalBoldLabel
          style={{ ...styles.choiceTitle, marginTop: 18 }}
          text={'센터'}
        />
        <SpaceBetweenContainer style={styles.inputInner}>
          <CenterListModal
            containerStyle={styles.centerInputBox}
            list={teacherGyms}
            selectedItem={selectCenter?.gymName}
            itemName={'gymName'}
            onPress={() => setIsCenterModalOpen(true)}
            visible={isCenterModalOpen}
            onRequestClose={() => setIsCenterModalOpen(false)}
            onSelect={(obj) => {
              setSelectCenter(obj);
              setSelectedClass(null);
            }}
            placeholder={selectedContent?.gymName}
            selectStyle={{
              ...styles.centerName,
              color: selectCenter?.gymName ? '#8082FF' : '#aaa',
            }}
            disabled
          />
        </SpaceBetweenContainer>

        <NormalBoldLabel style={styles.choiceTitle} text={'일정 유형'} />
        <SpaceBetweenContainer style={styles.inputInner}>
          <CenterListModal
            containerStyle={styles.inputBox}
            list={ticketList}
            selectedItem={`[${selectedClass?.name} ${selectedClass?.time}분]`}
            itemName={'name'}
            onPress={() => {
              if (isSelectGym) {
                alert('센터를 선택해주세요');
                return;
              }
              if (ticketList.length === 0) {
                alert('수강권이 존재하지않습니다');
                return;
              }
              setIsModalOpen(true);
            }}
            visible={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSelect={(obj) => {
              setSelectedClass(obj);
              if (obj) {
                setSelectedEndTime(
                  new Date(
                    selectedStartTime.getTime() + (obj?.time ?? 0) * 60000
                  )
                );
              }
            }}
          />
        </SpaceBetweenContainer>

        <NormalBoldLabel style={styles.choiceTitle} text={'일정 시간'} />
        <RowContainer>
          <TimeSelect
            label={'일정 시작'}
            isPickerOpen={isStartTimePickerOpen}
            time={selectedStartTime}
            onPress={() => setIsStartTimePickerOpen(true)}
            onConfirm={(selectedTime) => {
              setIsStartTimePickerOpen(false);
              setSelectedStartTime(selectedTime);
              if (selectedClass) {
                setSelectedEndTime(
                  new Date(
                    selectedTime.getTime() + (selectedClass?.time ?? 0) * 60000
                  )
                );
              }
            }}
            onCancel={() => setIsStartTimePickerOpen(false)}
            minuteInterval={10}
          />
          {/*<View style={{ width: 15 }} />*/}
          {/*<TimeSelect*/}
          {/*  label={'일정 종료'}*/}
          {/*  isPickerOpen={isEndTimePickerOpen}*/}
          {/*  time={selectedEndTime}*/}
          {/*  onPress={() => setIsEndTimePickerOpen(true)}*/}
          {/*  onConfirm={(selectedTime) => {*/}
          {/*    setIsEndTimePickerOpen(false);*/}
          {/*    setSelectedEndTime(selectedTime);*/}
          {/*  }}*/}
          {/*  onCancel={() => setIsEndTimePickerOpen(false)}*/}
          {/*  minuteInterval={10}*/}
          {/*/>*/}
        </RowContainer>
      </CenterContainer>
      <BottomContainer>
        <Touchable onPress={() => setOpenModal(false)}>
          <NormalBoldLabel
            text={'취소'}
            style={{ color: '#000000', marginRight: 27, fontWeight: '400' }}
          />
        </Touchable>
        <Touchable
          onPress={() => {
            if (!selectCenter) {
              Alert.alert('센터를 선택해주세요');
              return;
            }
            if (!selectedClass) {
              Alert.alert('일정 유형을 선택해주세요');
              return;
            }

            if (selectedStartTime >= selectedEndTime) {
              Alert.alert(
                '일정 종료 시간을 일정 시작 시각 이후로 입력해주세요'
              );
              return;
            }

            let params = {
              id: selectedContent.id,
              gymId: selectCenter.gym,
              teacherId: user?.id,
              lessonName: selectedClass.name,
              startTime: moment(selectedStartTime).format('HH:mm'),
              endTime: moment(selectedEndTime).format('HH:mm'),
              date: moment(birthDate).format('YYYY-MM-DD'),
            };

            onPress(params);
          }}
        >
          <NormalBoldLabel text={'수정'} style={{ color: '#8082FF' }} />
        </Touchable>
      </BottomContainer>
    </Container>
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
    marginTop: 12,
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
    flex: 1,
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
  centerName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

const Container = styled.View``;
const TopContainer = styled.View`
  margin-horizontal: -24px;
  padding-horizontal: 24px;
  padding-bottom: 14px;
  margin-top: -10px;
  border-bottom-width: 1px;
  border-color: #e3e5e5;
`;
const CenterContainer = styled.View`
  padding-bottom: 28px;
`;
const BottomContainer = styled.View`
  padding-top: 20px;
  border-top-width: 1px;
  border-color: #e3e5e5;
  margin-horizontal: -24px;
  padding-horizontal: 24px;
  flex-direction: row;
  justify-content: flex-end;
`;
export default ScheduleUpdate;
