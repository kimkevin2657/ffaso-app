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
            <NavigationContainer>
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
