import React, { useState } from 'react';

import { Image, StyleSheet, View } from 'react-native';
import Touchable from '../../buttons/Touchable';
import styled from 'styled-components/native';
import { NoneLabel, NormalBoldLabel, NormalLabel } from '../../Label';
import { TEACHER_SCHEDULE_TYPES } from '../../../constants/constants';
import { useSelector } from 'react-redux';
import SpaceBetweenContainer from '../../containers/SpaceBetweenContainer';
import CenterListModal from '../CenterListModal';
import RowContainer from '../../containers/RowContainer';
import BirthPicker from '../../date/BirthPicker';
import moment from 'moment';
import TimeSelect from '../../date/TimeSelect';

const ScheduleUpdate = ({ setOpenModal, selectedContent, onPress }) => {
  const { teacherGyms = [] } = useSelector((state) => state.teacherGym);
  const { user } = useSelector((state) => state.auth);
  const initialCenterIndex = teacherGyms.findIndex(
    (data) => data.gym === selectedContent.gym
  );

  const [selectedClass, setSelectedClass] = useState(selectedContent?.type); // 선택한 업무유형
  const [selectedStartTime, setSelectedStartTime] = useState(
    new Date(
      moment(
        selectedContent.startTime ? selectedContent.startTime : new Date(),
        'hh:mm:ss'
      )
    )
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    new Date(
      new Date(
        moment(
          selectedContent.endTime ? selectedContent.endTime : new Date(),
          'hh:mm:ss'
        )
      )
    )
  );
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(
    new Date(moment(selectedContent?.date))
  );
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectCenter, setSelectCenter] = useState(
    initialCenterIndex !== -1 ? teacherGyms[initialCenterIndex] : {}
  );
  const [isCenterModalOpen, setIsCenterModalOpen] = useState(false);

  return (
    <Container>
      <TopContainer>
        <NoneLabel
          text={'스케줄 수정'}
          style={{ fontSize: 18, fontWeight: 'bold' }}
        />
      </TopContainer>
      <CenterContainer>
        <NormalBoldLabel
          style={{ ...styles.choiceTitle, marginTop: 18 }}
          text={'센터 선택'}
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
            onSelect={(obj) => setSelectCenter(obj)}
            placeholder={selectedContent?.gymName}
          />
        </SpaceBetweenContainer>

        <NormalBoldLabel style={styles.choiceTitle} text={'강습 선택'} />
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
        {/*  */}
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
                source={require('../../../assets/images/scheduleClick/userImage.png')}
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
        {/*  */}
        {/*  */}
        {/*<NormalBoldLabel text={'가능한 일정'} style={styles.choiceTitle} />*/}
        {/*<View style={styles.birthdayBox}>*/}
        {/*  <BirthPicker*/}
        {/*    isOpen={isDatePickerOpen}*/}
        {/*    date={birthDate}*/}
        {/*    onConfirm={(selectedDate) => {*/}
        {/*      setIsDatePickerOpen(false);*/}
        {/*      setBirthDate(selectedDate);*/}
        {/*    }}*/}
        {/*    onCancel={() => setIsDatePickerOpen(false)}*/}
        {/*  />*/}

        {/*  <Touchable*/}
        {/*    onPress={() => setIsDatePickerOpen(true)}*/}
        {/*    style={styles.birthdayInputBox}*/}
        {/*  >*/}
        {/*    <View />*/}
        {/*    <NormalLabel*/}
        {/*      text={moment(birthDate).format('YYYY-MM-DD')}*/}
        {/*      style={styles.birthLabel}*/}
        {/*    />*/}

        {/*    <Image*/}
        {/*      style={{ width: 16, height: 18 }}*/}
        {/*      source={require('../../../assets/icons/date.png')}*/}
        {/*    />*/}
        {/*  </Touchable>*/}
        {/*</View>*/}
        {/*  */}
        {/*  */}
        <NormalBoldLabel style={styles.choiceTitle} text={'시간 선택'} />
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
            let params = {
              gym: selectCenter.gym,
              teacher: user?.id,
              type: selectedClass,
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
