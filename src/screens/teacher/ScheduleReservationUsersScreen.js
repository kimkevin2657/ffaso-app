import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Modal,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  BoldLabel12,
  BoldLabel15,
  BoldLabel18,
  NormalBoldLabel,
  NormalLabel,
  NormalLabel12,
} from '../../components/Label';
import api from '../../api/api';
import RowContainer from '../../components/containers/RowContainer';
import Touchable from '../../components/buttons/Touchable';
import SpaceBetweenContainer from '../../components/containers/SpaceBetweenContainer';
import { nestingNavigateReplace, renderAge } from '../../util';
import { useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SCREEN_WIDTH } from '../../constants/constants';
import StatusCheck from '../../components/StatusCheck';
import AllUserStatusModal from '../../components/modal/v3/AllUserStatusModal';
import apiv3 from '../../api/apiv3';

const ScheduleReservationUsersScreen = ({ navigation, route }) => {
  const { token } = useSelector((state) => state.auth);
  const { scheduleId, date, selectedSchedule } = route.params;
  const [reservationUsers, setReservationUsers] = useState([]);
  const [cancelStatusCount, setCancelStatusCount] = useState(0);
  const [absentStatusCount, setAbsentStatusCount] = useState(0);
  const [attendStatusCount, setAttendStatusCount] = useState(0);
  const [selectedUserAndStatus, setSelectedUserAndStatus] = useState(null);
  const [isAttendModalOpen, setIsAttendModalOpen] = useState(false);

  const [selectUserList, setSelectedUserList] = useState([]); //체크박스
  const [isOpenAllSelectModal, setIsOpenAllSelectModal] = useState(false);
  const [allClickType, setAllClickType] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: date ?? '',
      headerLeft: () => (
        <Touchable
          onPress={() =>
            nestingNavigateReplace(navigation, 'TeacherMain', 'TeacherSchedule')
          }
        >
          <AntDesign
            name='left'
            size={22}
            color={'#555'}
            style={{ padding: 4, alignSelf: 'center' }}
          />
        </Touchable>
      ),
    });
  }, []);

  useEffect(() => {
    fetchReservationUsers();
  }, []);

  const fetchReservationUsers = useCallback(async () => {
    try {
      const { data } = await api.get(`schedules/${scheduleId}/`);
      let cancelCount = 0;
      let absentCount = 0;
      let attendCount = 0;
      setReservationUsers(data);

      data.forEach((user) => {
        if (user.status === '출석') {
          attendCount++;
        } else if (user.status === '결석') {
          absentCount++;
        } else if (user.status === '취소') {
          cancelCount++;
        }
      });
      setCancelStatusCount(cancelCount);
      setAbsentStatusCount(absentCount);
      setAttendStatusCount(attendCount);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  }, [scheduleId]);

  const onChangeUserAttendStatus = useCallback(async (id, status) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };
      const { data } = await api.patch(
        `reservations/${id}/`,
        { status },
        config
      );
      Alert.alert('', data?.msg);
      fetchReservationUsers();
      // let newReservationUsers = [...reservationUsers];
      // let user = newReservationUsers.find((user) => user.id === id);
      // user.status = status;
      // setReservationUsers(newReservationUsers);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  }, []);

  const onChangeSelectUserStatus = (type) => {
    setAllClickType(type);
    const userList = selectUserList.filter((data) => data.status !== '출석');

    if (
      reservationUsers?.length !== selectUserList?.length ||
      selectUserList.length === 0
    ) {
      Alert.alert('전체 유저를 선택해주세요');
      return;
    }
    if (selectUserList.length <= 0) {
      Alert.alert('유저를 선택해주세요');
      return;
    }

    if (userList.length <= 0) {
      Alert.alert('일정 변경가능한 유저가 존재하지않습니다');
      return;
    }
    setIsOpenAllSelectModal(true);
  };

  const onPressAllStatueChange = async () => {
    const userList = selectUserList.filter((data) => data.status !== '출석');

    const body = {
      ids: userList.map((data) => data.id),
      status: allClickType,
    };

    try {
      const { data } = await apiv3.post('reservation-update-status', body);
      if (data?.msg) {
        Alert.alert(data?.msg);
      }
      const newData = [...reservationUsers];
      newData.map((data, index) => {
        if (userList.includes(data)) {
          newData[index].status = allClickType;
        }
      });
      setReservationUsers(newData);
      setIsOpenAllSelectModal(false);
      setSelectedUserList([]);
    } catch (err) {
      console.log(err);
      if (err.response?.data && err.response?.data?.msg) {
        Alert.alert(err.response?.data?.msg);
      }
    }
  };

  const onPressAllClickToggle = () => {
    if (reservationUsers?.length === selectUserList?.length) {
      setSelectedUserList([]);
    } else {
      setSelectedUserList(reservationUsers);
    }
  };

  const onPressCheckBox = (item) => {
    if (item.status === '출석') {
      return;
    }
    if (selectUserList.includes(item)) {
      setSelectedUserList((prev) => prev.filter((data) => data !== item));
    } else {
      setSelectedUserList([...selectUserList, item]);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        // contentContainerStyle={styles.container}
        data={reservationUsers}
        renderItem={({ item }) => (
          <ReservedUser
            {...item}
            onPressCheckBox={() => {
              onPressCheckBox(item);
            }}
            isChecked={selectUserList.includes(item) && item.status !== '출석'}
            onChangeStatus={(id, status) => {
              // if (item.status === '출석') {
              //   Alert.alert('', '이미 출석상태라 수정할 수 없습니다. ');
              // } else
              if (status === '출석') {
                setIsAttendModalOpen(true);
                setSelectedUserAndStatus(item);
              } else {
                onChangeUserAttendStatus(id, status);
              }
            }}
          />
        )}
        keyExtractor={(item, idx) => item.id + idx.toString()}
        ListHeaderComponent={() => (
          <>
            <RowContainer style={styles.scheduleInfoBox}>
              <BoldLabel15
                text={selectedSchedule?.lessonName}
                style={{ color: '#000' }}
              />
              <BoldLabel12
                text={`정원 : ${selectedSchedule?.userCounts?.total ?? 0}명`}
                style={{ color: '#555', marginLeft: 8, marginRight: 26 }}
              />
              <NormalLabel12
                text={`${selectedSchedule?.startTime?.slice(
                  0,
                  5
                )} ~ ${selectedSchedule?.endTime?.slice(0, 5)}`}
                style={{ color: '#555' }}
              />

              <Text>{/*selectedSchedule*/}</Text>
            </RowContainer>
            <SpaceBetweenContainer style={styles.statusCountContainer}>
              <AttendStatusInfo text={'취소'} statusCount={cancelStatusCount} />
              <View
                style={{ width: 2, height: 14, backgroundColor: '#d9d9d9' }}
              />
              <AttendStatusInfo text={'결석'} statusCount={absentStatusCount} />
              <View
                style={{ width: 2, height: 14, backgroundColor: '#d9d9d9' }}
              />
              <AttendStatusInfo text={'출석'} statusCount={attendStatusCount} />
            </SpaceBetweenContainer>
            <RowContainer style={styles.allClickBox}>
              <RowContainer
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                }}
              >
                <RowContainer>
                  <Touchable onPress={onPressAllClickToggle}>
                    <Image
                      source={
                        reservationUsers?.length === selectUserList?.length &&
                        selectUserList.length !== 0
                          ? require('../../assets/icons/checkFocus.png')
                          : require('../../assets/icons/checkUnFocus.png')
                      }
                      style={styles.checkbox}
                    />
                  </Touchable>
                  <BoldLabel12
                    text={'전체선택'}
                    style={{ color: '#000', marginLeft: 16 }}
                  />
                </RowContainer>
                <StatusCheck
                  onPress={(id, type) => {
                    onChangeSelectUserStatus(type);
                  }}
                />
              </RowContainer>
            </RowContainer>
          </>
        )}
        // ListHeaderComponentStyle={() => null}
      />

      {isOpenAllSelectModal && (
        <AllUserStatusModal
          isVisible={isOpenAllSelectModal}
          setIsVisible={setIsOpenAllSelectModal}
          type={allClickType}
          onPress={onPressAllStatueChange}
        />
      )}
      <Modal
        transparent={true}
        visible={isAttendModalOpen}
        onRequestClose={() => setIsAttendModalOpen(false)}
      >
        <TouchableOpacity
          onPress={() => setIsAttendModalOpen(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              paddingHorizontal: 13,
              paddingTop: 27,
              paddingBottom: 23,
            }}
          >
            <View style={{ alignItems: 'center', marginBottom: 28 }}>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: '#CCD2E3',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 23,
                }}
              >
                <AntDesign
                  name='check'
                  size={20}
                  color={'#fff'}
                  style={{ padding: 4, alignSelf: 'center' }}
                />
              </View>
              <BoldLabel18
                text={`${selectedUserAndStatus?.userName} 회원을`}
                style={{ color: '#000' }}
              />
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 24,
                  color: '#000',
                  fontWeight: '700',
                }}
              >
                <Text style={{ color: '#8082ff' }}>출석 </Text>
                처리 하시겠습니까?
              </Text>
              <NormalLabel
                text={'출석 처리 후 수정이 되지 않습니다.'}
                style={{
                  color: '#aaa',
                  fontSize: 12,
                  lineHeight: 16,
                  marginTop: 16,
                }}
              />
            </View>

            <RowContainer>
              <Touchable
                style={{
                  ...styles.modalBtn,
                  backgroundColor: '#aaa',
                  marginRight: 11,
                }}
                onPress={() => setIsAttendModalOpen(false)}
              >
                <NormalBoldLabel
                  text={'취소'}
                  style={{ fontSize: 18, lineHeight: 22, color: '#fff' }}
                />
              </Touchable>
              <Touchable
                style={{ ...styles.modalBtn, backgroundColor: '#8082FF' }}
                onPress={() => {
                  onChangeUserAttendStatus(selectedUserAndStatus?.id, '출석');
                  setIsAttendModalOpen(false);
                }}
              >
                <NormalBoldLabel
                  text={'출석'}
                  style={{ fontSize: 18, lineHeight: 22, color: '#fff' }}
                />
              </Touchable>
            </RowContainer>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ScheduleReservationUsersScreen;

const ATTEND_STATUS_COLOR = {
  취소: '#888',
  결석: '#FF4D4D',
  출석: '#A6A8FF',
};

const AttendStatusInfo = ({ text, statusCount }) => (
  <View style={styles.statusCountWrapper}>
    <NormalLabel
      text={text}
      style={{ fontSize: 12, lineHeight: 16, color: '#555' }}
    />
    <NormalBoldLabel
      text={statusCount}
      style={{
        fontSize: 14,
        lineHeight: 21,
        color: ATTEND_STATUS_COLOR[text],
        marginTop: 8,
      }}
    />
  </View>
);

const ReservedUser = ({
  id,
  userImage,
  userName,
  userNumber,
  userBirth,
  status,
  onChangeStatus,
  isChecked,
  onPressCheckBox,
}) => (
  <SpaceBetweenContainer style={styles.userWrapper}>
    <RowContainer style={styles.leftWrapper}>
      <Touchable onPress={onPressCheckBox}>
        <Image
          source={
            isChecked
              ? require('../../assets/icons/checkFocus.png')
              : require('../../assets/icons/checkUnFocus.png')
          }
          style={{ ...styles.checkbox, marginRight: 16 }}
        />
      </Touchable>
      <Image
        style={styles.profileImage}
        source={
          !userImage
            ? require('../../assets/images/null/noProfileImage.png')
            : { uri: userImage }
        }
      />
      <View>
        <RowContainer style={{ marginBottom: 6 }}>
          <NormalBoldLabel text={userName} />
          <NormalLabel
            text={`(${renderAge(userBirth)})`}
            style={{ color: '#555' }}
          />
        </RowContainer>
        <NormalBoldLabel text={userNumber} style={{ color: '#555' }} />
      </View>
    </RowContainer>
    <StatusCheck onPress={onChangeStatus} id={id} status={status} />
  </SpaceBetweenContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  statusCountContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e3e5e5',
    paddingVertical: 8,
  },
  statusCountWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userWrapper: {
    marginHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#e3e5e5',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 14,
  },
  leftWrapper: {},
  rightWrapper: {},
  attendStatusBtn: {
    paddingVertical: 6.5,
    paddingHorizontal: 8.5,

    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 20,
    shadowColor: 'rgba(167, 171, 201, 0.15)',
    shadowOpacity: 1,

    // box-shadow: 0px 0px 20px rgba(167, 171, 201, 0.15);

    elevation: 24,
  },
  modalBtn: {
    width: SCREEN_WIDTH / 2 - 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
  },
  //3차 작업 12월
  scheduleInfoBox: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ECEEF5',
    borderRadius: 10,
    paddingVertical: 16,
    paddingLeft: 28,
    marginVertical: 16,
    marginHorizontal: 24,
  },
  allClickBox: {
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E5E5',
    justifyContent: 'space-between',
  },
  checkbox: {
    resizeMode: 'contain',
    width: 18,
    height: 18,
  },
});
