import React from 'react';
import { Image, StyleSheet } from 'react-native';
import MemberCenterListScreen from '../screens/member/MemberCenterListScreen';
import MemberMyPageScreen from '../screens/member/mypage/MemberMyPageScreen';
import MemberSchedulesScreen from '../screens/member/schedule/MemberSchedulesScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MemberDrawerStack } from './MemberDrawerStack';
import MemberChatRoomScreen from '../screens/member/MemberChatRoomScreen';
import MemberBottomTabBar from '../components/Bar/MemberBottomTabBar';

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ isFocus, focusImage, unFocusImage }) => {
  return (
    <Image source={isFocus ? focusImage : unFocusImage} style={styles.icon} />
  );
};

export const MemberBottomTabs = () => {

  return (
    <Tab.Navigator
      tabBar={(props) => <MemberBottomTabBar {...props} />}
      initialRouteName='MemberMainTab'
      screenOptions={{
        tabBarActiveTintColor: '#8082FF',
        // tabBarLabelStyle: {fontSize: 12, lineHeight: 16, marginTop: 4},
        tabBarLabelStyle: { fontSize: 12, lineHeight: 16 },
      }}
    >
      <Tab.Screen
        name='MemberMainTab'
        component={MemberDrawerStack}
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
        name='MemberCenterList'
        component={MemberCenterListScreen}
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
        name='MemberSchedule'
        component={MemberSchedulesScreen}
        options={{
          // headerShown: false,
          title: '스케줄러',
          // headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name='MemberChatRoom'
        component={MemberChatRoomScreen}
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
        name='MyPage'
        component={MemberMyPageScreen}
        options={{
          title: '마이페이지',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#fbfbfb',
          },
          // // headerShown: false,
          // tabBarLabel: '마이페이지',
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon
          //     isFocus={focused}
          //     focusImage={require('../icons/bottomTab/myPage_focus.png')}
          //     unFocusImage={require('../icons/bottomTab/myPage_unFocus.png')}
          //   />
          // ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
  },
});
