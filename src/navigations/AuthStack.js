import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { MemberDrawerStack } from './MemberDrawerStack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TeacherBottomTabs } from './TeacherBottomTabs';
import LoginScreen from '../screens/auth/LoginScreen';
import Signup from '../screens/auth/Signup';
import AgreementsScreen from '../screens/auth/AgreementsScreen';
import UserSignupScreen from '../screens/auth/UserSignupScreen';
import SignupCompleted from '../screens/auth/SignupCompleted';
import ResetPassword from '../screens/auth/ResetPassword';
import FindIdScreen from '../screens/auth/FindIdScreen';
import Touchable from '../components/buttons/Touchable';

const Auth = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Auth.Navigator
      initialRouteName='Login'
      screenOptions={({ navigation }) => ({
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 20,
          lineHeight: 24,
          color: '#000',
          fontWeight: 'bold',
          // fontFamily: 'NotoSansKR-Regular',
        },
        headerStyle: {
          shadowOffset: { height: 0, width: 0 },
          backgroundColor: '#FBFBFB',
        },
        headerLeft: () => (
          <Touchable onPress={() => navigation.goBack()}>
            <AntDesign
              name='left'
              size={22}
              color={'#555'}
              style={{ padding: 4, alignSelf: 'center' }}
            />
          </Touchable>
        ),
        headerBackTitleVisible: false,
      })}
    >
      <Auth.Screen
        name='Login'
        component={LoginScreen}
        options={{ headerShown: false }}
        // options={{title: ''}}
      />
      <Auth.Screen
        name='SignUp'
        component={Signup}
        options={{ title: '회원가입' }}
      />
      <Auth.Screen
        name='Agreements'
        component={AgreementsScreen}
        options={{ title: '회원가입' }}
      />
      <Auth.Screen
        name='FindId'
        component={FindIdScreen}
        options={{ title: '아이디찾기' }}
      />
      <Auth.Screen
        name='RePassword'
        component={ResetPassword}
        options={{ title: '비밀번호 재설정' }}
      />
      <Auth.Screen
        name='UserSignupScreen'
        component={UserSignupScreen}
        options={{ title: '회원가입' }}
      />
      <Auth.Screen
        name='SignupCompleted'
        component={SignupCompleted}
        options={{ title: '회원가입' }}
      />
    </Auth.Navigator>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 25,
    height: 25,
  },
});
