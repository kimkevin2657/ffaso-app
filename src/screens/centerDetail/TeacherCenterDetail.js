import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  BackHandler,
} from 'react-native';
import CenterDetailTop from '../../components/nearbyCenter/CenterDetailTop';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RowContainer from '../../components/containers/RowContainer';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';
import Touchable from '../../components/buttons/Touchable';
import { resetNavigation } from '../../util';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import { SCREEN_WIDTH } from '../../constants/constants';
import LinearGradient from 'react-native-linear-gradient';
import SpaceBetweenContainer from '../../components/containers/SpaceBetweenContainer';
import CenterModal from '../../components/modal/CenterModal';
import TimeSelect from '../../components/date/TimeSelect';
import moment from 'moment';
import { useSelector } from 'react-redux';
import api from '../../api/api';
import Swiper from 'react-native-swiper';
import CenterListModal from '../../components/modal/CenterListModal';

const GymImage = styled(FastImage)`
  width: ${(props) => (props.hasImage ? '100%' : '50%')};
  align-self: center;
  height: ${SCREEN_WIDTH / 1.6163}px;
`;

const TeacherCenterDetail = ({ navigation, route }) => {
  const { token } = useSelector((state) => state.auth);
  const gym = route.params?.gym;
  const {
    id,
    name,
    score,
    gymPhoneNumber,
    lessonTags,
    weekdayStartTime,
    weekdayEndTime,
    weekendStartTime,
    weekendEndTime,
    regularHolidays,
    holidays,
    teacherFacilityTags,
    latitude,
    longitude,
    jobOffers,
    teacherFeeDate,
    gymImages = [],
  } = gym;
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [wantedDepartment, setWantedDepartment] = useState('');
  const [isStartTimePickerOpen, setIsStartTimePickerOpen] = useState(false);
  const [isEndTimePickerOpen, setIsEndTimePickerOpen] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(new Date());
  const [selectedEndTime, setSelectedEndTime] = useState(new Date());
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const applyProfileAtCenter = useCallback(async () => {
    if (wantedDepartment === '') {
      Alert.alert('', '희망 강습 부서를 선택해주세요.');
      return;
    }

    const body = {
      gym: id,
      wantedDepartment,
      wantedStartTime: moment(selectedStartTime).format('HH:mm'),
      wantedEndTime: moment(selectedEndTime).format('HH:mm'),
    };

    try {
      const config = {
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };
      const { data } = await api.post('apply-teachers/', body, config);
      console.log('res', data);
      Alert.alert('프로필 신청이 완료되었습니다.');
    } catch (e) {
      console.log('err', e);
      console.log('err.res', e.response);
      if (e.response?.data?.msg) {
        Alert.alert(e.response?.data?.msg);
      }
    }

    setIsApplyModalOpen(false);
  }, [wantedDepartment, selectedStartTime, selectedEndTime]);

  const getDepartments = useCallback(async () => {
    try {
      const { data } = await api.get(`departments?gymId=${id}`);
      setDepartments(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  }, [id]);

  useEffect(() => {
    getDepartments();

    const backAction = () => {
      navigation.navigate('TeacherCenterList');
      // resetNavigation(navigation, 'TeacherMain');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const callEvent = () => {
    if (!gymPhoneNumber) {
      Alert.alert('', '연락처가 존재하지 않습니다.');
      return;
    }
    Linking.openURL(`tel://${gymPhoneNumber}`);
  };

  const onFindRoad = () => {
    if (latitude && longitude) {
      navigation.navigate('FindRoad', {
        gymLatitude: latitude,
        gymLongitude: longitude,
      });
    }
  };

  const showRegularHolidays = useCallback((list, title) => {
    return (
      list.length > 0 && (
        <Text style={styles.titleList}>
          {title} : {list.map((holiday) => holiday).join(', ')}
        </Text>
      )
    );
  }, []);

  const showPlusHolidays = useCallback((holidays) => {
    const isSameNowAtHolidays = holidays?.filter((holiday) =>
      moment(holiday).isSame(moment().format('YYYY-MM-DD'))
    );
    const isAfterNowAtHolidays = holidays?.filter((holiday) =>
      moment(holiday).isAfter(moment())
    );

    return isSameNowAtHolidays?.length > 0 ||
      isAfterNowAtHolidays?.length > 0 ? (
      <Text style={styles.titleList}>
        추가 휴관일 :{' '}
        {isSameNowAtHolidays?.map((holiday) => holiday).join(', ')}
        {isSameNowAtHolidays?.length > 0 ? ', ' : ''}
        {isAfterNowAtHolidays?.map((holiday) => holiday).join(', ')}
      </Text>
    ) : null;
  }, []);

  return (
    <View style={styles.container}>
      {isApplyModalOpen && (
        <CenterModal
          visible={isApplyModalOpen}
          onRequestClose={() => setIsApplyModalOpen(false)}
          transparent
        >
          <NormalBoldLabel
            text={'프로필신청을 위해\n아래 항목을 선택해주세요.'}
            style={{ textAlign: 'center', fontSize: 18, lineHeight: 27 }}
          />
          <NormalLabel
            style={{ ...styles.choiceTitle, marginTop: 43 }}
            text={'희망 강습 부서'}
          />
          <CenterListModal
            containerStyle={styles.inputBoxContainer}
            list={departments}
            selectedItem={wantedDepartment}
            itemName={'name'}
            onPress={() => setIsModalOpen(true)}
            visible={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSelect={(obj) => setWantedDepartment(obj.name)}
          />

          <NormalLabel style={styles.choiceTitle} text={'희망 강습 시간'} />
          <RowContainer>
            <TimeSelect
              isPickerOpen={isStartTimePickerOpen}
              time={selectedStartTime}
              onPress={() => setIsStartTimePickerOpen(true)}
              onConfirm={(selectedTime) => {
                setIsStartTimePickerOpen(false);
                setSelectedStartTime(selectedTime);
              }}
              onCancel={() => setIsStartTimePickerOpen(false)}
            />
            <NormalBoldLabel
              text={'~'}
              style={{
                marginHorizontal: 3.5,
                fontSize: 12,
                lineHeight: 16,
                color: '#aaa',
              }}
            />
            <TimeSelect
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
          <RowContainer
            style={{
              borderTopWidth: 1,
              marginTop: 45,
              borderColor: '#e3e5e5',
              paddingTop: 15,
              justifyContent: 'flex-end',
              marginHorizontal: -24,
              paddingRight: 24,
            }}
          >
            <Touchable
              style={{ padding: 4, marginRight: 27 }}
              onPress={() => setIsApplyModalOpen(false)}
            >
              <NormalLabel text={'취소'} />
            </Touchable>
            <Touchable style={{ padding: 4 }} onPress={applyProfileAtCenter}>
              <NormalBoldLabel text={'신청'} style={{ color: '#8082ff' }} />
            </Touchable>
          </RowContainer>
        </CenterModal>
      )}
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.backIconWrapper}>
          <Touchable
            onPress={() => navigation.navigate('TeacherCenterList')}
            style={styles.backIcon}
          >
            <AntDesign name='left' size={22} color={'#555'} />
          </Touchable>
        </View>
        {gymImages.length === 0 ? (
          <GymImage
            hasImage={gymImages.length > 0}
            source={require('../../assets/images/NoCenter.png')}
          />
        ) : (
          <Swiper
            style={{ height: SCREEN_WIDTH / 1.6163 }}
            // loop={false}
            dotStyle={{ backgroundColor: '#fff' }}
            activeDotStyle={{ backgroundColor: '#fff', width: 20 }}
            showsButtons={false}
          >
            {gymImages.map((e, i) => (
              <FastImage
                key={i}
                source={{
                  uri: e.image,
                  priority: FastImage.priority.high,
                }}
                style={{ width: '100%', height: SCREEN_WIDTH / 1.6163 }}
              />
            ))}
          </Swiper>
        )}

        <CenterDetailTop
          selectedTabId={1}
          onPress={(selectedOptionId) => {
            if (selectedOptionId === 2) {
              navigation.navigate('Price', { gym });
            } else if (selectedOptionId === 3) {
              navigation.navigate('Trainer', { gym });
            } else if (selectedOptionId === 4) {
              navigation.navigate('Review', { gym });
            }
          }}
        />

        <View style={styles.centerContainer}>
          <View style={styles.centerInfo1}>
            <SpaceBetweenContainer>
              <Text style={styles.centerName}>{name}</Text>
              <Touchable onPress={() => setIsApplyModalOpen(true)}>
                <LinearGradient
                  colors={['#8082FF', '#81D1F8']}
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 7.5,
                    paddingVertical: 3,
                  }}
                >
                  <NormalLabel
                    text={'프로필 신청'}
                    style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}
                  />
                </LinearGradient>
              </Touchable>
            </SpaceBetweenContainer>

            <RowContainer style={{ marginTop: 7 }}>
              {[1, 2, 3, 4, 5].map((e, index) => (
                <AntDesign
                  key={index}
                  name={'star'}
                  size={20}
                  color={score >= e ? '#F2DA00' : '#aaa'}
                  style={{ marginRight: 2 }}
                />
              ))}

              <NormalBoldLabel
                text={score.toFixed(1)}
                style={{
                  marginLeft: 4,
                  fontSize: 12,
                  lineHeight: 16,
                  color: '#555',
                }}
              />
            </RowContainer>
          </View>

          <View style={styles.centerInfo2}>
            <RowContainer>
              <Image
                style={styles.centerInfoIcon}
                source={require('../../assets/icons/NearbyCenterDetail/infoIcon.png')}
              />
              <NormalBoldLabel
                style={styles.centerTitle}
                text={'강습 부서별 구인인원 & 강습수수료(%)'}
              />
            </RowContainer>
            <RowContainer
              style={{
                marginTop: 4,
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              {jobOffers.length > 0 ? (
                jobOffers.map((tag) => (
                  <View key={tag.id} style={{ marginTop: 5 }}>
                    <NormalBoldLabel
                      style={styles.titleList}
                      text={tag.category}
                    />
                    <NormalLabel
                      style={{
                        ...styles.titleList,
                        fontWeight: '400',
                        marginLeft: 6,
                        marginTop: 2,
                      }}
                      text={`\u2022 구인인원 ${tag.peopleCount}명 | 수수료 ${tag.fee}%`}
                    />
                  </View>
                ))
              ) : (
                <NormalBoldLabel
                  style={styles.titleList}
                  text={'구인 정보가 없습니다.'}
                />
              )}
            </RowContainer>
          </View>

          <View style={styles.centerInfo3}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={styles.centerInfoIcon}
                source={require('../../assets/icons/NearbyCenterDetail/infoIcon.png')}
              />
              <NormalBoldLabel
                style={styles.centerTitle}
                text={'강습 수수료 지급일자'}
              />
            </View>
            <RowContainer style={styles.centerGrade}>
              <Text style={styles.titleList}>
                {!!teacherFeeDate
                  ? `\u2022 매 월 ${teacherFeeDate}`
                  : '수수료 정보가 없습니다.'}
              </Text>
            </RowContainer>
          </View>

          <View style={styles.centerInfo4}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{ width: 19, height: 19 }}
                source={require('../../assets/icons/NearbyCenterDetail/schedule.png')}
              />
              <NormalBoldLabel style={styles.centerTitle} text={'운영시간'} />
            </View>
            <View>
              <Text style={[styles.titleList, { paddingTop: 11 }]}>
                평일 :{' '}
                {weekdayStartTime
                  ? `${weekdayStartTime?.substr(
                      0,
                      5
                    )} ~ ${weekdayEndTime?.substr(0, 5)}`
                  : ''}
              </Text>
              <Text style={{ ...styles.titleList, marginBottom: 4 }}>
                주말 :{' '}
                {weekdayStartTime
                  ? `${weekendStartTime?.substr(
                      0,
                      5
                    )} ~ ${weekendEndTime?.substr(0, 5)}`
                  : ''}
              </Text>

              {showRegularHolidays(regularHolidays.allWeeks, '매주 휴관일')}
              {showRegularHolidays(regularHolidays.oneWeek, '첫째 주 휴관일')}
              {showRegularHolidays(regularHolidays.twoWeek, '둘째 주 휴관일')}
              {showRegularHolidays(regularHolidays.threeWeek, '셋째 주 휴관일')}
              {showRegularHolidays(regularHolidays.fourWeek, '넷째 주 휴관일')}

              {showPlusHolidays(holidays)}
            </View>
          </View>

          <View style={[styles.centerInfo5]}>
            <RowContainer>
              <Image
                style={{ width: 20, height: 15 }}
                source={require('../../assets/icons/NearbyCenterDetail/cup.png')}
              />
              <NormalBoldLabel
                style={styles.centerTitle}
                text={'강사 편의정보'}
              />
            </RowContainer>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{
                flex: 1,
                marginTop: 10,
              }}
            >
              {teacherFacilityTags?.length > 0 ? (
                teacherFacilityTags.map((tag, index) => (
                  <View key={index}>
                    <View style={styles.convenienceContainer}>
                      <NormalBoldLabel
                        style={styles.convenienceInfoList}
                        text={tag}
                      />
                    </View>
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        borderRightWidth: 7,
                        borderTopWidth: 7,
                        height: 7,
                        borderTopColor: 'white',
                        borderRightColor: 'transparent',
                      }}
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.titleList}>편의정보가 없습니다.</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <RowContainer
        style={{
          backgroundColor: '#fff',
          paddingTop: 18,
          paddingBottom: 14,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: 'rgba(167, 171, 201, 0.3)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 2,
          elevation: 2,
          // elevation: 5, // max값이 7임
          justifyContent: 'space-around',
        }}
      >
        <TouchableOpacity onPress={onFindRoad}>
          <FontAwesome5
            name={'map-marker-alt'}
            size={25}
            color={'#aaa'}
            style={{ padding: 4, alignSelf: 'center' }}
          />
          <NormalLabel style={styles.bottomText} text={'길 찾기'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => callEvent()}>
          <Ionicons
            name={'call-sharp'}
            size={28}
            color={'#AAAAAA'}
            style={{ padding: 4, alignSelf: 'center' }}
          />
          <NormalLabel style={styles.bottomText} text={'전화문의'} />
        </TouchableOpacity>
      </RowContainer>
    </View>
  );
};

export default TeacherCenterDetail;

const styles = StyleSheet.create({
  backIconWrapper: {
    zIndex: 2,
  },
  backIcon: {
    position: 'absolute',
    top: 6,
    left: 8,
    padding: 4,
  },
  inputBoxContainer: {
    height: 40,
    marginTop: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerStyle: {
    width: SCREEN_WIDTH - 96,
    height: 40,
  },

  centerContainer: { marginHorizontal: 32, flex: 1 },
  bottomText: { fontSize: 12, lineHeight: 16, marginTop: 4 },
  container: {
    backgroundColor: '#fbfbfb',
    flex: 1,
  },
  categoryList: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
  },
  category: {
    width: 75,
    height: 32,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C4C4C4',
  },

  centerInfo1: { marginTop: 25 },
  centerInfo2: { marginTop: 30 },
  centerInfo3: { marginTop: 23 },
  centerInfo4: { marginTop: 23 },
  centerInfo5: { marginTop: 21 },

  centerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },

  centerGrade: {
    marginTop: 9,
  },
  grade: {
    resizeMode: 'contain',
    width: 13,
    height: 12,
    marginLeft: 2,
  },

  centerInfoIcon: {
    width: 20,
    height: 20,
  },

  centerTitle: {
    marginLeft: 5,
    fontSize: 15,
    lineHeight: 19,
  },

  titleList: {
    fontSize: 12,
    lineHeight: 16,
    color: '#555555',
    fontWeight: 'bold',
  },

  convenienceInfo: {
    position: 'relative',

    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  convenienceBox: {
    width: 61,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  convenienceContainer: {
    backgroundColor: '#8082FF',
    marginRight: 7,
    paddingVertical: 4,
    paddingHorizontal: 19,
  },
  convenienceInfoList: {
    fontSize: 12,
    lineHeight: 16,
    color: '#fff',
    // alignItems: 'center',
    fontWeight: 'bold',
  },
  choiceTitle: {
    marginTop: 30,
    fontSize: 12,
    lineHeight: 16,
    color: '#555',
    fontWeight: 'bold',
  },
});
