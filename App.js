/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from 'react';
import type { Node } from 'react';
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


const queryClient = new QueryClient();


const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  //   flex: 1,
  // };

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

  // const codePushSync = () => {
  //   codePush.sync(
  //     {
  //       updateDialog: {
  //         //업데이트 다이얼로그 설정
  //         title: '새로운 업데이트가 존재합니다.',
  //         optionalUpdateMessage: '지금 업데이트하시겠습니까?',
  //         optionalIgnoreButtonLabel: '나중에',
  //         optionalInstallButtonLabel: '업데이트',
  //       },
  //       checkFrequency: codePush.CheckFrequency.ON_APP_START,
  //       installMode: codePush.InstallMode.IMMEDIATE, //즉시 업데이트
  //     },
  //     codePushStatusDidChange
  //   );
  // };

  // const codePushStatusDidChange = (syncStatus) => {
  //   switch (syncStatus) {
  //     case codePush.SyncStatus.CHECKING_FOR_UPDATE: {
  //       console.log('Checking for update.');
  //       break;
  //     }
  //     case codePush.SyncStatus.DOWNLOADING_PACKAGE: {
  //       console.log('Downloading package.');
  //       break;
  //     }
  //     case codePush.SyncStatus.AWAITING_USER_ACTION: {
  //       console.log('Awaiting user action.');
  //       break;
  //     }
  //     case codePush.SyncStatus.INSTALLING_UPDATE: {
  //       console.log('Installing update.');
  //       break;
  //     }
  //     case codePush.SyncStatus.UP_TO_DATE: {
  //       console.log('App up to date.');
  //       break;
  //     }
  //     case codePush.SyncStatus.UPDATE_IGNORED: {
  //       console.log('Update cancelled by user.');
  //       break;
  //     }
  //     case codePush.SyncStatus.UPDATE_INSTALLED: {
  //       console.log('Update installed and will be applied on restart.');
  //       break;
  //     }
  //     case codePush.SyncStatus.UNKNOWN_ERROR: {
  //       console.log('An unknown error occurred.');
  //       break;
  //     }
  //   }
  // };

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

/*

<Provider store={store}>
        <PersistGate persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <SafeAreaView style={styles.container}>
              <RootStack />
              </SafeAreaView>
            </NavigationContainer>
          </QueryClientProvider>
        </PersistGate>
      </Provider> 

*/

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// LogBox.ignoreLogs(['Setting a timer']);
