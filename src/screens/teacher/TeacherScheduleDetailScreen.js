import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Image,
  Modal,
  Alert,
  Text,
  ScrollView,
} from 'react-native';
import Touchable from '../../components/buttons/Touchable';
import moment from 'moment';
import {
  NormalBoldLabel,
  NoneLabel,
  BoldLabel15,
  BoldLabel18,
} from '../../components/Label';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants/constants';
import LessonReservationEditForm from '../../components/scheduleclick/LessonReservationEditForm';
import TeacherSchedule from '../../components/TeacherSchedule';
import DropdownModal from '../../components/dropdownModal';
import CenterModal from '../../components/modal/CenterModal';
import ScheduleDelete from '../../components/modal/scheduleModal/scheduleDelete';
import ScheduleUpdate from '../../components/modal/scheduleModal/scheduleUpdate';
import api from '../../api/api';
import { saveSchedules } from '../../redux/scheduleSlice';
import { useDispatch, useSelector } from 'react-redux';
import BottomGradientButton from '../../components/buttons/BottomGradientButton';
import RowContainer from '../../components/containers/RowContainer';
import ScheduleDeleteModal from '../../components/modal/v3/scheduleDeleteModal';

const TeacherScheduleDetailScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedDate, schedules = [] } = route.params;
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLessonEditOpen, setIsLessonEditOpen] = useState(false);
  const [isVisitReservation, setIsVistitReservation] = useState(false);
  const [schedulesList, setSchedulesList] = useState(schedules);

  //
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [locationX, setLocationX] = useState(null);
  const [locationY, setLocationY] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectText, setSelectText] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  //
  const onModalPress = (selectedText) => {
    if (selectedText === '삭제') {
      setDeleteModalOpen(true);
      // deleteSchedule(selectedContent?.id);
    } else if (selectedText === '수정') {
      setOpenModal(true);
    }
    setSelectText(selectedText);
  };
  //스케줄 삭제
  const deleteSchedule = async (contentId) => {
    try {
      const { data } = api.delete(`schedules?id=${contentId}`);
      setOpenModal(true);
      setSchedulesList((prev) =>
        prev.filter((data) => data !== selectedContent)
      );
      setDeleteModalOpen(false);
    } catch (e) {
      console.log(e);
      console.log(e.response);
      const { data } = e.response;
      if (!data.ok && data.msg) {
        Alert.alert('', data.msg);
      }
    }
  };
  //스케줄 변경

  const updateSchedule = async (body) => {
    if (body.startTime >= body.endTime) {
      Alert.alert('종료시간 미만으로 시작시작을 입력해주세요');
      return;
    }

    let isScheduleTypeChange = body?.type === '업무' || body?.type === '휴일';
    let params = {};

    if (isScheduleTypeChange) {
      params.user = user?.id;
      params.date = body?.date;
      params.status = body?.type;
      params.gymId = body?.gym;
      params.id = selectedContent?.id;
      if (body.type === '업무') {
        params.startTime = body?.startTime;
        params.endTime = body?.endTime;
      }
    }

    try {
      const { data } = isScheduleTypeChange
        ? await api.post(`teacher-status`, params)
        : await api.patch(`schedules/${selectedContent?.id}/`, body);

      // console.log(isScheduleTypeChange, data, params);

      let newData = [...schedulesList];
      let findIndex;

      //업무 및 휴일 제외
      if (!isScheduleTypeChange) {
        findIndex = schedulesList.findIndex(
          (data) => selectedContent.id === data?.id
        );

        if (findIndex !== -1) {
          newData[findIndex] = data;
          setSchedulesList(newData);
        }
      }
      //업무 및 휴일
      else {
        findIndex = schedulesList.findIndex(
          (data) => selectedContent.id === data?.id
        );
        if (findIndex !== -1) {
          newData[findIndex].date = params.date;
          newData[findIndex].endTime = params.endTime;
          newData[findIndex].startTime = params.startTime;
          newData[findIndex].type = params.status;
        }
        if (body.type === '업무') {
          newData[findIndex].startTime = params?.startTime;
          newData[findIndex].endTime = params?.endTime;
        }
      }
      if (findIndex !== -1) {
        // 리덕스에 담기 위한 소스
        let newDataList = {};
        newData.forEach((schedule) => {
          if (newDataList[schedule.date] === undefined) {
            newDataList[schedule.date] = [];
          }
          newDataList[schedule.date].push(schedule);
        });
        dispatch(saveSchedules(newDataList));
        //
      }
      setOpenModal(false);
    } catch (e) {
      console.log(e);
      console.log(e.response);
      const { data } = e.response;
      if (!data.ok && data.msg) {
        Alert.alert('', data.msg);
      }
    }
  };
  //
  useEffect(() => {
    navigation.setOptions({
      title: moment(selectedDate).format('YYYY년 M월 DD일'),

      headerRight: () => (
        // schedulesList.length === 0 &&
        <Touchable
          onPress={() => {
            navigation.navigate('ScheduleRegistration');
            // navigation.navigate('WorkTimeSetup')
          }}
        >
          <Image
            style={styles.plusActionable}
            source={require('../../assets/images/Calendar/plus.png')}
          />
        </Touchable>
      ),
    });
  }, []);

  const onNavigateRegisterSchedule = useCallback(() => {
    // navigation.navigate('WorkTimeSetup');
    navigation.navigate('ScheduleRegistration');
  }, []);

  const newData = {};
  schedulesList.map((data) => {
    if (!newData.hasOwnProperty(data.gymName)) {
      newData[data.gymName] = [];
    }
    if (data.gymName) {
      newData[data.gymName].push(data);
    }
  });

  return (
    <>
      {deleteModalOpen && (
        <ScheduleDeleteModal
          visible={deleteModalOpen}
          onRequestClose={() => {
            setDeleteModalOpen(false);
          }}
          onPress={() => {
            deleteSchedule(selectedContent?.id);
          }}
          text={`[수강]${
            selectedContent.lessonName
          } ${selectedContent.startTime.slice(
            0,
            5
          )} ~ ${selectedContent.endTime.slice(0, 5)}`}
        />
      )}
      <CenterModal
        visible={openModal}
        onRequestClose={() => setOpenModal(false)}
        transparent
      >
        {selectText === '삭제' ? (
          <ScheduleDelete
            selectedContent={selectedContent}
            setOpenModal={setOpenModal}
          />
        ) : (
          <ScheduleUpdate
            selectedContent={selectedContent}
            setOpenModal={setOpenModal}
            onPress={updateSchedule}
          />
        )}
      </CenterModal>
      <DropdownModal
        visible={
          isDropdownOpen
          // && selectedContent === id
        }
        x={locationX}
        y={locationY}
        // hasFollowing={user?.hasFollowing}
        onPress={(selectedText) => {
          onModalPress(selectedText);
          // console.log('selectedText', selectedText);
          setIsDropdownOpen(false);
        }}
        onClose={() => setIsDropdownOpen(false)}
      />

      {/* 삭제 모달 */}
      <Modal visible={isVisitReservation} transparent>
        <View style={styles.cancelModalCotainer}>
          <View style={styles.cancelModalFrame}>
            <View
              style={{ borderBottomColor: '#E3E5E5', borderBottomWidth: 1 }}
            >
              <NoneLabel text={'스케줄 삭제'} style={styles.cancelModalTitle} />
            </View>
            <View
              style={{
                borderBottomColor: '#E3E5E5',
                borderBottomWidth: 1,
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../assets/images/null/visitCancelImg.png')}
                resizeMode='contain'
                style={{
                  width: 66,
                  height: 66,
                  marginTop: 21,
                  marginBottom: 20,
                }}
              />
              <NoneLabel
                text={'스케줄이 정상적으로 삭제되었습니다.'}
                style={{
                  color: '#000000',
                  fontWeight: 'bold',
                  marginBottom: 29,
                }}
              />
            </View>
            <Touchable onPress={() => setIsVistitReservation(false)}>
              <NoneLabel text={'확인'} style={styles.cancelModalCheckBtn} />
            </Touchable>
          </View>
        </View>
      </Modal>

      <Modal visible={isLessonEditOpen} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              marginHorizontal: 17,
              backgroundColor: 'white',
              minWidth: SCREEN_WIDTH * 0.86,
              minHeight: SCREEN_HEIGHT * 0.55,
              borderRadius: 10,
            }}
          >
            <LessonReservationEditForm
              isVisible={() => setIsLessonEditOpen(false)}
            />
          </View>
        </View>
      </Modal>
      {schedulesList.length === 0 && (
        <View style={styles.center}>
          <Image
            source={require('../../assets/icons/scheduleNull.png')}
            style={styles.nullIcon}
          />
          <NormalBoldLabel
            text={'등록된 일정이 없습니다.'}
            style={styles.nullText}
          />
          <BottomGradientButton
            style={styles.bottomBtn}
            outerStyle={{ paddingVertical: 0, height: 52 }}
            onPress={onNavigateRegisterSchedule}
          >
            <NormalBoldLabel style={styles.bottomBtnText} text={'일정 등록'} />
          </BottomGradientButton>
        </View>
      )}
      {schedulesList.length > 0 && (
        <ScrollView style={styles.container}>
          {Object.values(newData).map((data, index) => (
            <View key={index}>
              <RowContainer
                style={{
                  justifyContent: 'center',
                  marginTop: 24,
                  marginBottom: 6,
                }}
              >
                <BoldLabel18
                  text={data[0].gymName}
                  style={{ color: '#8082FF' }}
                />
              </RowContainer>
              {data.map((item, index) => (
                <TeacherSchedule
                  {...item}
                  item={item}
                  onPress={() => {
                    navigation.navigate('ScheduleReservationUsers', {
                      scheduleId: item.id,
                      date: moment(selectedDate).format('YYYY년 M월 DD일'),
                      selectedSchedule: item,
                    });
                  }}
                  key={item.id}
                  isLast={index === schedulesList.length - 1}
                  onUpdate={() => setIsLessonEditOpen(true)}
                  onDelete={() => setIsVistitReservation(true)}
                  onModalOpenPress={() => setSelectedSchedule(index)}
                  isModalActive={selectedSchedule === index}
                  //
                  setLocationX={setLocationX}
                  setLocationY={setLocationY}
                  setIsDropdownOpen={setIsDropdownOpen}
                  setSelectedContent={setSelectedContent}
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
      {/*{schedulesList.length > 0 && (*/}
      {/*  <FlatList*/}
      {/*    style={styles.container}*/}
      {/*    data={schedulesList}*/}
      {/*    renderItem={({ item, index }) => (*/}
      {/*      <TeacherSchedule*/}
      {/*        {...item}*/}
      {/*        item={item}*/}
      {/*        onPress={() =>*/}
      {/*          navigation.navigate('ScheduleReservationUsers', {*/}
      {/*            scheduleId: item.id,*/}
      {/*          })*/}
      {/*        }*/}
      {/*        isLast={index === schedulesList.length - 1}*/}
      {/*        onUpdate={() => setIsLessonEditOpen(true)}*/}
      {/*        onDelete={() => setIsVistitReservation(true)}*/}
      {/*        onModalOpenPress={() => setSelectedSchedule(index)}*/}
      {/*        isModalActive={selectedSchedule === index}*/}
      {/*        //*/}
      {/*        setLocationX={setLocationX}*/}
      {/*        setLocationY={setLocationY}*/}
      {/*        setIsDropdownOpen={setIsDropdownOpen}*/}
      {/*        setSelectedContent={setSelectedContent}*/}
      {/*      />*/}
      {/*    )}*/}
      {/*    keyExtractor={(item, idx) => item.id + idx.toString()}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};

export default TeacherScheduleDetailScreen;

const styles = StyleSheet.create({
  plusActionable: {
    resizeMode: 'contain',
    width: 24,
    height: 30,
  },
  cancelModalCheckBtn: {
    paddingVertical: 20,
    color: '#8082FF',
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 28,
  },
  cancelModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    lineHeight: 22,
    paddingVertical: 14,
    marginLeft: 24,
  },
  cancelModalFrame: {
    marginHorizontal: 17,
    backgroundColor: 'white',
    minWidth: SCREEN_WIDTH * 0.86,
    minHeight: SCREEN_HEIGHT * 0.32,
    borderRadius: 10,
  },
  cancelModalCotainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fbfbfb',
    paddingLeft: 24,
    paddingRight: 32,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  nullIcon: {
    width: 120,
    height: 127,
  },
  nullText: {
    fontSize: 20,
    lineHeight: 24,
    marginTop: 25.57,
    color: '#aaa',
  },
  bottomBtn: {
    position: 'absolute',
    bottom: 25,
    width: SCREEN_WIDTH - 48,
  },
  bottomBtnText: { fontSize: 20, color: '#fff', fontWeight: '700' },
});
