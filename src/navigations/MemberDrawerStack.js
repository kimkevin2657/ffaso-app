import React from 'react';
import MemberLeftDrawer from '../components/MemberLeftDrawer';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MemberHome from '../screens/member/MemberHome';

const Stack = createDrawerNavigator();

export const MemberDrawerStack = () => {
  // console.log('Drawer', props);
  return (
    <Stack.Navigator
      initialRouteName='MemberHome'
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

      drawerContent={(props) => <MemberLeftDrawer {...props} />}
    >
      <Stack.Screen
        name='MemberHome'
        component={MemberHome}
        options={{ headerShown: false }}
      />
      {/*<Stack.Screen*/}
      {/*  name='TeacherHome'*/}
      {/*  component={TeacherHome}*/}
      {/*  options={{ headerShown: false }}*/}
      {/*/>*/}
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
