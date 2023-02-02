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
import api from '../../api/api';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Swiper from 'react-native-swiper';

const GymImage = styled(FastImage)`
  width: ${(props) => (props.hasImage ? '100%' : '50%')};
  align-self: center;
  height: ${SCREEN_WIDTH / 1.6163}px;
`;

const MemberCenterDetail = ({ navigation, route }) => {
  const { token } = useSelector((state) => state.auth);

  const [gym, setGym] = useState(route.params?.gym);
  const {
    name,
    score,
    category,
    lessonTags,
    weekdayStartTime,
    weekdayEndTime,
    weekendStartTime,
    weekendEndTime,
    holidays,
    facilityTags,
    gymImages = [],
  } = gym;

  useEffect(() => {
    const backAction = () => {
      navigation.navigate('MemberCenterList');
      // resetNavigation(navigation, 'MemberMain');
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const callEvent = () => {
    if (!gym?.gymPhoneNumber) {
      Alert.alert('', '연락처가 존재하지 않습니다.');
      return;
    }
    Linking.openURL(`tel://${gym?.gymPhoneNumber}`);
  };

  const onChangeLike = useCallback(async () => {
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    try {
      await api.post(
        `gyms/${gym?.id}/${gym?.hasLike ? 'deleteLike' : 'addLike'}/`,
        {},
        config
      );
      setGym(Object.assign({}, gym, { hasLike: !gym?.hasLike }));
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  }, [gym?.hasLike]);

  const onFindRoad = () => {
    const gym = route.params.gym;
    if (gym?.latitude && gym?.longitude) {
      // https://map.kakao.com/link/to/카카오판교오피스,37.402056,127.108212
      // https://map.naver.com/v5/directions/-/-/-/transit?c=14383341.2705030,4190580.9540321,15,0,0,0,dh

      navigation.navigate('FindRoad', {
        gymLatitude: gym.latitude,
        gymLongitude: gym.longitude,
      });
      // Linking.openURL(
      //   `https://map.kakao.com/link/to/${gym.name},${gym.latitude},${gym.longitude}`
      // );
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
    const isSameNowAtHolidays = holidays.filter((holiday) =>
      moment(holiday).isSame(moment().format('YYYY-MM-DD'))
    );
    const isAfterNowAtHolidays = holidays.filter((holiday) =>
      moment(holiday).isAfter(moment())
    );

    return isSameNowAtHolidays.length > 0 || isAfterNowAtHolidays.length > 0 ? (
      <Text style={styles.titleList}>
        추가 휴관일 :{' '}
        {isSameNowAtHolidays?.map((holiday) => holiday).join(', ')}
        {isSameNowAtHolidays.length > 0 ? ', ' : ''}
        {isAfterNowAtHolidays?.map((holiday) => holiday).join(', ')}
      </Text>
    ) : null;
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.backIconWrapper}>
          <Touchable
            onPress={() => navigation.navigate('MemberCenterList')}
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
            // console.log(selectedOptionId);
            if (selectedOptionId === 2) {
              navigation.navigate('Price', { gym });
            } else if (selectedOptionId === 3) {
              navigation.navigate('Trainer', { gym });
            } else if (selectedOptionId === 4) {
              navigation.navigate('Review', { gym });
            }
            // setSelectedTabId(selectedOptionId);
          }}
        />

        <View style={styles.centerContainer}>
          <View style={styles.centerInfo1}>
            <Text style={styles.centerName}>{name}</Text>
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
                // text={gym?.average.toFixed(1)}
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
              <NormalBoldLabel style={styles.centerTitle} text={'회원권'} />
            </RowContainer>
            <View style={styles.centerGrade}>
              <Text style={styles.titleList}>
                {category?.length > 0
                  ? category.map((tag) => '#' + tag).join(' ')
                  : '회원권 정보가 없습니다.'}
              </Text>
            </View>
          </View>

          <View style={styles.centerInfo3}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={styles.centerInfoIcon}
                source={require('../../assets/icons/NearbyCenterDetail/infoIcon.png')}
              />
              <NormalBoldLabel style={styles.centerTitle} text={'강습'} />
            </View>
            <View style={styles.centerGrade}>
              <Text style={styles.titleList}>
                {lessonTags?.length > 0
                  ? lessonTags.map((tag) => '#' + tag).join(' ')
                  : '강습 정보가 없습니다.'}
              </Text>
            </View>
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
                {`${weekdayStartTime?.substr(0, 5)} ~ ${weekdayEndTime?.substr(
                  0,
                  5
                )}`}
              </Text>
              <Text style={styles.titleList}>
                주말 :{' '}
                {`${weekendStartTime?.substr(0, 5)} ~ ${weekendEndTime?.substr(
                  0,
                  5
                )}`}
              </Text>

              {showRegularHolidays(
                gym?.regularHolidays.allWeeks,
                '매주 휴관일'
              )}
              {showRegularHolidays(
                gym?.regularHolidays.oneWeek,
                '첫째 주 휴관일'
              )}
              {showRegularHolidays(
                gym?.regularHolidays.twoWeek,
                '둘째 주 휴관일'
              )}
              {showRegularHolidays(
                gym?.regularHolidays.threeWeek,
                '셋째 주 휴관일'
              )}
              {showRegularHolidays(
                gym?.regularHolidays.fourWeek,
                '넷째 주 휴관일'
              )}

              {showPlusHolidays(holidays)}
            </View>
          </View>

          <View style={styles.centerInfo5}>
            <RowContainer>
              <Image
                style={{ width: 20, height: 15 }}
                source={require('../../assets/icons/NearbyCenterDetail/cup.png')}
              />
              <NormalBoldLabel style={styles.centerTitle} text={'편의정보'} />
            </RowContainer>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{
                flex: 1,
                // justifyContent: 'flex-start',
                marginTop: 10,
              }}
            >
              {facilityTags?.length > 0 ? (
                facilityTags?.map((tag, index) => (
                  // <ImageBackground
                  //   key={index}
                  //   style={styles.convenienceBox}
                  //   source={require('../../icons/NearbyCenterDetail/box.png')}
                  // >
                  // <View key={tag.id}>
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
                  // </ImageBackground>
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
          // height: 121,
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
        <TouchableOpacity onPress={onChangeLike}>
          <AntDesign
            name={gym?.hasLike ? 'heart' : 'hearto'}
            size={25}
            color={gym?.hasLike ? '#8082FF' : '#aaa'}
            style={{
              padding: 4,
              alignSelf: 'center',
            }}
          />
          <NormalLabel style={styles.bottomText} text={'좋아요'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onFindRoad}>
          <FontAwesome5
            name={'map-marker-alt'}
            size={25}
            color={'#aaa'}
            style={{ padding: 4, alignSelf: 'center' }}
          />
          <NormalLabel style={styles.bottomText} text={'길 찾기'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={callEvent}>
          <Ionicons
            name={'call-sharp'}
            size={28}
            color={'#AAAAAA'}
            style={{ padding: 4, alignSelf: 'center' }}
          />
          <NormalLabel style={styles.bottomText} text={'전화문의'} />
        </TouchableOpacity>
        <Touchable
          onPress={() =>
            navigation.navigate('Survey', { userId: gym?.user, gymId: gym?.id })
          }
        >
          <AntDesign
            name={'form'}
            size={25}
            color={'#AAAAAA'}
            style={{ padding: 4, alignSelf: 'center' }}
          />
          <NormalLabel style={styles.bottomText} text={'문의 Survey '} />
        </Touchable>
      </RowContainer>
    </View>
  );
};

export default MemberCenterDetail;

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
    flexDirection: 'row',
    alignItems: 'center',
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
});
