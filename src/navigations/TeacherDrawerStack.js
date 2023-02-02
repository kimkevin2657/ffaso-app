import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TeacherHome from '../screens/teacher/TeacherHome';
import TeacherLeftDrawer from '../components/TeacherLeftDrawer';

const Stack = createDrawerNavigator();

export const TeacherDrawerStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='TeacherHome'
      drawerPosition='left'
      screenOptions={{
        drawerPosition: 'left',
        drawerHideStatusBarOnOpen: false,
        drawerStyle: {
          width: '90%',
          drawerInactiveBackgroundColor: 'rgba(0,0,0,0.6)',
        },
      }}
      //
      // defaultStatus="close"
      // screenOptions={{
      //   drawerPosition: 'left',
      //   // drawerType: 'front',
      // }}
      drawerContent={(props) => <TeacherLeftDrawer {...props} />}
    >
      <Stack.Screen
        name='TeacherHome'
        component={TeacherHome}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Signup"
        component={Signup}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Agreements"
        component={AgreementsScreen}
        options={{headerShown: false}}
      /> */}
    </Stack.Navigator>
  );
};
