import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NearbyCenterTop from '../../../components/nearbyCenter/NearbyCenterTop';
import RowContainer from '../../../components/containers/RowContainer';
import { NormalBoldLabel } from '../../../components/Label';
import Touchable from '../../../components/buttons/Touchable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import api from '../../../api/api';
import Trainer from '../../../components/Trainer';
import { useSelector } from 'react-redux';
import { resetNestedNavigation } from '../../../util';

const TrainerScreen = ({ navigation, route }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [gym, setGym] = useState(route.params?.gym);
  const [selectedSecondTab, setSelectedSecondTab] = useState('');
  const [trainers, setTrainers] = useState({});
  const [categories, setCategories] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      // const unsubscribe = API.subscribe(userId, user => setUser(user));
      getTeachers();
      getCategories();
      // return () => unsubscribe();
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      title: gym?.name,
      headerLeft: () => (
        <Touchable
          onPress={() => {
            if (user?.type === '일반유저') {
              navigation.navigate('MemberCenterDetail', { gym });
            } else if (user?.type === '강사') {
              navigation.navigate('TeacherCenterDetail', { gym });
            }
          }}
          style={{ padding: 4 }}
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

  const getCategories = async () => {
    try {
      const { data } = await api.get(`departments?gymId=${gym.id}`);
      setCategories(data);
      setSelectedSecondTab(data[0]?.name);
      // console.log('categories', data);
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  };

  const getTeachers = async () => {
    try {
      const { data } = await api.get(`gym-teachers?gymId=${gym.id}`);
      // console.log('teachers', data);
      let newTrainers = {};
      data.forEach((teacher) => {
        if (
          !newTrainers.hasOwnProperty(teacher.department) &&
          teacher.department !== null
        ) {
          newTrainers[teacher.department] = [];
        }
        if (teacher.department) {
          newTrainers[teacher.department].push(teacher);
        }
      });
      // console.log('newTrainers', newTrainers);
      setTrainers(newTrainers);
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  };

  const createChatRoom = useCallback(async (teacher) => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const { data } = await api.post(
        `chat-rooms/`,
        { user2: teacher?.id },
        config
      );
      let chatRoom = data;
      if (data?.status === 203) {
        chatRoom = data.chat;
      }
      resetNestedNavigation(navigation, 'MemberMain', 'MemberChatRoom');
      navigation.navigate('Chat', { chatRoom });
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
    // navigation.navigate('Survey', {
    //     gymId: gym?.id,
    //     userId: teacher.id,
    // })
  }, []);

  return (
    <ScrollView style={styles.container}>
      <NearbyCenterTop
        tabId={3}
        onTabPress={(selectedTabId) => {
          if (selectedTabId === 1) {
            if (user?.type === '일반유저') {
              navigation.navigate('MemberCenterDetail', { gym });
            } else if (user?.type === '강사') {
              navigation.navigate('TeacherCenterDetail', { gym });
            }
          } else if (selectedTabId === 2) {
            navigation.navigate('Price', { gym });
          } else if (selectedTabId === 4) {
            navigation.navigate('Review', { gym });
          }
        }}
      />
      <ScrollView
        style={styles.optionList}
        horizontal={true}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'space-around',
          paddingHorizontal: 20,
        }}
      >
        {/*{CENTER_OPTION_DATA[0].instructor.map((data, i) => (*/}
        {categories.map((data, i) => (
          <TouchableOpacity
            key={i}
            style={styles.secondTabBtn}
            onPress={() => {
              // setSelectedSecondTab(data.title);
              setSelectedSecondTab(data.name);
            }}
          >
            <NormalBoldLabel
              text={data.name}
              style={{
                fontSize: 12,
                // fontSize: 13,
                // lineHeight: 17,
                color: selectedSecondTab === data.name ? '#8082FF' : '#555',
              }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={{ paddingHorizontal: 24, flex: 1 }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#e3e5e5',
            paddingLeft: 1,
            paddingTop: 17,
            paddingBottom: 11,
          }}
        >
          <NormalBoldLabel style={styles.membership} text={selectedSecondTab} />
        </View>
        {Object.keys(trainers)?.length === 0 ||
        (Object.keys(trainers)?.length > 0 &&
          (!trainers[selectedSecondTab] ||
            trainers[selectedSecondTab]?.length === 0)) ? (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              backgroundColor: '#fbfbfb',
            }}
          >
            <Image
              source={require('../../../assets/images/null/priceAlertImage.png')}
              style={{ width: 83, height: 83, marginTop: 140 }}
            />
            <NormalBoldLabel
              text={'등록된 정보가 없습니다.'}
              style={{
                marginTop: 33,
                color: '#aaa',
                fontSize: 20,
                lineHeight: 24,
              }}
            />
          </View>
        ) : (
          <></>
        )}

        {/*{Object.keys(trainers).length > 0 &&*/}
        {/*  // trainers[CATEGORY[selectedSecondTab]]?.map((data) => (*/}

        {Object.keys(trainers)?.length > 0 &&
          trainers[selectedSecondTab]?.length > 0 &&
          Object.values(trainers[selectedSecondTab]).map((teacher) => (
            <Trainer
              key={teacher.id}
              name={teacher.koreanName}
              image={
                teacher.profileImage ||
                'https://ffaso.s3.ap-northeast-2.amazonaws.com/allCoaches/trainer.png'
              }
              // image={`https://ffaso.s3.ap-northeast-2.amazonaws.com/${
              //   CATEGORY[selectedSecondTab]
              // }/image${getRandomInt(1, 3)}.png`}
              description={teacher?.memo || `자기소개가 없습니다.`}
              onRegister={() =>
                navigation.navigate('ScheduleRegister', {
                  teacher,
                  reservationType: '강습',
                })
              }
              // onRegister={() => navigation.navigate('Payments', { gym })}
              onInquiry={() => createChatRoom(teacher)}
              isNormalUser={user?.type === '일반유저'}
            />
          ))}
      </View>
    </ScrollView>
  );
};

export default TrainerScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbfbfb',
  },
  membership: {
    fontSize: 18,
    lineHeight: 22,
  },
  optionList: {
    borderBottomWidth: 1,
    borderBottomColor: '#e3e5e5',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    // flex: 1,
  },
  secondTabBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    // flex: 1,
  },
});
