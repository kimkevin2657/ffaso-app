import React, { useCallback, useEffect, useState } from 'react';

import {
  Alert,
  Image,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ProductInfo from '../../../components/scheduleclick/v3/ProductInfo';
import FastImage from 'react-native-fast-image';
import {
  BoldLabel12,
  BoldLabel13,
  BoldLabel14,
  BoldLabel15,
  NormalBoldLabel,
  NormalLabel12,
  NormalLabel13,
} from '../../../components/Label';
import RowContainer from '../../../components/containers/RowContainer';
import BottomGradientButton from '../../../components/buttons/BottomGradientButton';
import Touchable from '../../../components/buttons/Touchable';
import MemberScheduleSuccess from '../../../components/modal/v3/MemberScheduleSuccess';
import { resetNavigation } from '../../../util';
import api from '../../../api/api';
import apiv3 from '../../../api/apiv3';
import { useSelector } from 'react-redux';

const MemberSelectSchedule = ({ navigation, route }) => {
  const { token } = useSelector((state) => state.auth);

  const {
    selectedTicket,
    selectedCoupon,
    profileImage,
    selectedGymName,
    selectTrainer,
    dataList,
    schedules,
  } = route.params;

  const isCoupon = selectedCoupon;
  const availableCount = isCoupon
    ? selectedCoupon?.availableCount
    : selectedTicket?.totalCount - selectedTicket?.usedCount;

  const [schedulesDate, setSchedulesDate] = useState([]);
  const [selectSchedule, setSelectedSchedule] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: isCoupon ? '쿠폰 일정 선택' : '수강 일정 선택',
    });
  }, []);

  const onPressRegister = async () => {
    if (selectSchedule.length <= 0) {
      Alert.alert('일정을 선택해주세요');
      return;
    }
    let body = {
      gymId: dataList?.gymId,
      teacherId: dataList?.teacherId,
      schedules: selectSchedule?.map((data) => ({
        id: data.id,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonName: data.lessonName,
        date: data.date,
      })),
    };
    if (isCoupon) {
      body.type = '쿠폰';
      body.userCouponId = selectedCoupon?.id;
    } else {
      body.type = '강습';
      body.ticketId = selectedTicket?.id;
    }
    console.log(body);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };
      const { data } = await apiv3.post(
        'member-schedule-register',
        body,
        config
      );
      setVisibleModal(true);
    } catch (e) {
      console.log(e);
      console.log(e.response);
      const { data } = e.response;
      if (!data.ok && data.msg) {
        Alert.alert('', data.msg);
      }
    }
  };

  const onPressSelectSchedule = useCallback(
    (value) => {
      if (selectSchedule.includes(value)) {
        setSelectedSchedule((prev) => prev.filter((data) => data !== value));
      } else {
        if (availableCount <= selectSchedule.length) {
          Alert.alert('횟수를 초과하였습니다');
          return;
        }
        setSelectedSchedule([...selectSchedule, value]);
      }
    },
    [selectSchedule]
  );
  useEffect(() => {
    const parsingScheduleList = {};

    schedules.map((data) => {
      const date = data.day;
      if (!parsingScheduleList.hasOwnProperty(date) && data?.day) {
        parsingScheduleList[date] = [];
      }
      if (date) {
        parsingScheduleList[date].push(data);
      }
    });
    let newData = [];
    Object?.keys(parsingScheduleList)?.map((data, index) => {
      let parsingBody = {
        title: data,
        data: parsingScheduleList[data],
      };
      newData[index] = parsingBody;
    });
    setSchedulesDate(newData);
  }, [schedules]);

  const onCloseModal = () => {
    setVisibleModal(false);
    resetNavigation(navigation, 'MemberMain');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}
    >
      {visibleModal && (
        <MemberScheduleSuccess
          visible={visibleModal}
          onRequestClose={() => setVisibleModal(false)}
          onPress={onCloseModal}
        />
      )}
      {isCoupon ? (
        <ProductInfo
          title={selectedCoupon?.name}
          countText={`총 ${selectedCoupon?.availableCount}회 중 ${
            selectedCoupon?.availableCount - selectedCoupon?.currentCount
          }회 남음`}
          dateText={selectedCoupon?.expiryDate}
        />
      ) : (
        <ProductInfo
          title={dataList?.lessonName}
          countText={`총 ${selectedTicket?.totalCount}회 중 ${
            selectedTicket?.totalCount - selectedTicket?.usedCount
          }회 남음`}
          useCountText={`( ${selectedTicket?.usedCount}회 사용 )`}
          dateText={selectedTicket.expiryDate}
        />
      )}

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
          <RowContainer style={{ marginBottom: 12, marginTop: 3 }}>
            <BoldLabel14
              text={selectTrainer?.koreanName}
              style={{ color: '#000' }}
            />
            <NormalLabel12
              text={' 님의 수업 가능 일정'}
              style={{ color: '#000000' }}
            />
          </RowContainer>
          <RowContainer>
            <NormalLabel12
              text={'선택시간' ?? ''}
              style={{ color: '#555', marginRight: 9 }}
            />
            <BoldLabel12 text={dataList?.time} style={styles.mainColor} />
          </RowContainer>
        </View>
      </RowContainer>
      <View style={{ flex: 1 }} />
      <SectionList
        sections={schedulesDate}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => {
          const isAlreadySelect = selectSchedule.includes(item);
          return (
            <Touchable
              style={{
                borderColor: isAlreadySelect ? '#8082FF' : '#E3E5E5',
                ...styles.checkContainer,
              }}
              onPress={() => {
                onPressSelectSchedule(item);
              }}
            >
              <Image
                source={
                  isAlreadySelect
                    ? require('../../../assets/icons/squareCheck.png')
                    : require('../../../assets/icons/squareUnCheck.png')
                }
                style={{ width: 20, height: 20 }}
              />
              <BoldLabel13
                text={item?.date}
                style={{ color: '#555', marginRight: 12, marginLeft: 18 }}
              />
              <NormalLabel13
                text={`${item?.startTime?.slice(0, 5)} ~ ${item?.endTime?.slice(
                  0,
                  5
                )}`}
                style={{ color: '#555' }}
              />
            </Touchable>
          );
        }}
        renderSectionHeader={({ section }) => (
          <View style={styles.titleBox}>
            <BoldLabel15
              text={section?.title + '요일'}
              style={{ color: '#000' }}
            />
          </View>
        )}
      />
      <RowContainer style={styles.bottomBox}>
        <BoldLabel14 text={`${availableCount}회중 `} style={styles.grayColor} />
        <BoldLabel14 text={selectSchedule.length} style={styles.mainColor} />
        <BoldLabel14 text={'회 선택'} style={styles.grayColor} />
      </RowContainer>
      <BottomGradientButton
        outerStyle={{ paddingVertical: 0, height: 52 }}
        onPress={onPressRegister}
      >
        <NormalBoldLabel style={styles.bottomBtnText} text={'일정 등록'} />
      </BottomGradientButton>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 25,
    backgroundColor: '#FBFBFB',
  },
  bottomBox: {
    justifyContent: 'center',
    marginVertical: 14,
    elevation: 2,
    paddingTop: 14,
    marginHorizontal: -24,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 4,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 1,
  },
  bottomBtnText: { fontSize: 20, color: '#fff', fontWeight: '700' },

  trainerImageInner: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderRadius: 35,
    backgroundColor: '#fff',
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  trainerImage: {
    resizeMode: 'contain',
    width: 50,
  },

  trainerImage1: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
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

  checkContainer: {
    paddingLeft: 15,
    paddingVertical: 13,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleBox: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E5E5',
    marginBottom: 10,
    marginTop: 34,
  },
  mainColor: {
    color: '#8082FF',
  },
  grayColor: {
    color: '#555555',
  },
  lightGrayColor: {
    color: '#AAAAAA',
  },
  black: {
    color: '#000',
  },
});
export default MemberSelectSchedule;
