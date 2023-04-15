/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
// import type { Node } from 'react';
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
  StyleSheet,
  Platform,
  AppState,
  Linking
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import RootStack from './src/navigations/RootStack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './src/redux/store';
import Geolocation from 'react-native-geolocation-service';
import { QueryClient, QueryClientProvider } from 'react-query';
import codePush from 'react-native-code-push';

const queryClient = new QueryClient();

const App = () =>  {
  const isDarkMode = useColorScheme() === 'dark';

  const linking = {
    prefixes: ['ffaso://'],
    config: {
      initialRouteName: 'home',
      screens: {
        home: {
          path: 'MemberMainTab'
        },
        center: {
          path: 'MemberCenterList'
        }
      }
    }
  }

  useEffect(() => {
    // if (Platform.OS === 'ios') {
    //   Geolocation.requestAuthorization('whenInUse');
    // }
    // const unsubscribe = messaging().onMessage(async (remoteMessage) => {
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    // });
    // return unsubscribe;


  }, []);

  return (
    <>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer linking={linking}>
              <SafeAreaView style={styles.container}>
              <RootStack />
              </SafeAreaView>
            </NavigationContainer>
          </QueryClientProvider>
        </PersistGate>
      </Provider> 
    </>
  );
};

const codePushOptions = {
  updateDialog: {
	  title: '새로운 업데이트가 존재합니다.',
	  optionalUpdateMessage: '지금 업데이트하시겠습니까?',
	  optionalIgnoreButtonLabel: '나중에',
	  optionalInstallButtonLabel: '업데이트',
    mandatoryUpdateMessage:'필수 업데이트를 시작합니다.',
    mandatoryContinueButtonLabel: '업데이트'
  },
  //codepush token
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
  installMode: codePush.InstallMode.IMMEDIATE
}

export default codePush(codePushOptions)(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});