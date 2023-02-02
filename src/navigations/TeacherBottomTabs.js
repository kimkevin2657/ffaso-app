import React from 'react';
import { Image } from 'react-native';
import MemberCenterListScreen from '../screens/member/MemberCenterListScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TeacherDrawerStack } from './TeacherDrawerStack';
import TeacherMyPageScreen from '../screens/teacher/TeacherMyPageScreen';
import TeacherSchedulesScreen from '../screens/teacher/TeacherSchedulesScreen';

import TeacherChatRoomScreen from '../screens/teacher/TeacherChatRoomScreen';
import TeacherBottomTabBar from '../components/Bar/TeacherBottomTabBar';
import TeacherCenterListScreen from '../screens/teacher/TeacherCenterListScreen';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ isFocus, focusImage, unFocusImage }) => {
  return (
    <Image
      source={isFocus ? focusImage : unFocusImage}
      style={{ width: 25, height: 25 }}
    />
  );
};

export const TeacherBottomTabs = () => {
  // const auth = useSelector((state) => state.auth)
  // const {user} = auth

  return (
    <Tab.Navigator
      tabBar={(props) => <TeacherBottomTabBar {...props} />}
      initialRouteName='TeacherMainTab'
      screenOptions={{
        tabBarActiveTintColor: '#8082FF',
        // tabBarLabelStyle: {fontSize: 12, lineHeight: 16, marginTop: 4},
        tabBarLabelStyle: { fontSize: 12, lineHeight: 16 },
        // headerShown: false,
        // tabBarActiveTintColor: '#8082FF',
        // tabBarLabelStyle: { fontSize: 12, lineHeight: 15 },
        // headerTitleAlign: 'center',
        // headerTitleStyle: {
        //   fontSize: 20,
        //   lineHeight: 24,
        //   color: '#000',
        //   fontWeight: 'bold',
        //   // fontFamily: 'NotoSansKR-Regular',
        // },
      }}
    >
      <Tab.Screen
        name='TeacherMainTab'
        component={TeacherDrawerStack}
        options={{
          headerShown: false,
          tabBarLabel: '홈',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              isFocus={focused}
              focusImage={require('../assets/icons/bottomTab/home_focus.png')}
              unFocusImage={require('../assets/icons/bottomTab/home_unFocus.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        // name='NearbyCenter'
        name='TeacherCenterList'
        component={TeacherCenterListScreen}
        options={{
          headerShown: false,
          tabBarLabel: '주변 센터',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              isFocus={focused}
              focusImage={require('../assets/icons/bottomTab/nearby_focus.png')}
              unFocusImage={require('../assets/icons/bottomTab/nearby_unFocus.png')}
            />
          ),
        }}
      />

      <Tab.Screen
        name='TeacherSchedule'
        component={TeacherSchedulesScreen}
        options={{
          title: '스케줄러',
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon
          //     isFocus={focused}
          //     focusImage={require('../icons/bottomTab/scheduler_focus.png')}
          //     unFocusImage={require('../icons/bottomTab/scheduler_unFocus.png')}
          //   />
          // ),
        }}
      />
      <Tab.Screen
        name='TeacherChatRoom'
        component={TeacherChatRoomScreen}
        options={{
          // headerShown: false,
          tabBarLabel: '빠톡',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              isFocus={focused}
              focusImage={require('../assets/icons/bottomTab/talk_focus.png')}
              unFocusImage={require('../assets/icons/bottomTab/talk_unFocus.png')}
            />
          ),
        }}
      />
      <Tab.Screen
        name='TeacherMyPage'
        component={TeacherMyPageScreen}
        options={{
          title: '마이페이지',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fbfbfb',
          },
          // headerShown: false,
          tabBarLabel: '마이페이지',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              isFocus={focused}
              focusImage={require('../assets/icons/bottomTab/myPage_focus.png')}
              unFocusImage={require('../assets/icons/bottomTab/myPage_unFocus.png')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
