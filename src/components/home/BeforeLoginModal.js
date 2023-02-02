import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button,
} from 'react-native';
import Touchable from '../buttons/Touchable';
// import {SafeAreaView} from 'react-native-safe-area-context';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const BeforeLoginModal = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.alertTilte}>로그인 후 이용해주세요.</Text>
      <View style={styles.subTilteInner}>
        <Text style={styles.subTilte}>서비스를 이용하시기 위해</Text>
        <Text style={styles.subTilte}>로그인이 필요합니다.</Text>
      </View>
      <Touchable style={styles.buttonInner}>
        <Image
          style={styles.button}
          source={require('../../assets/images/beforelogin/button.png')}
        />
        <Text style={styles.buttonText}>로그인/회원가입</Text>
      </Touchable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FBFBFB',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: 300 }],
  },

  alertTilte: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },

  subTilteInner: {
    marginTop: 23,
    alignItems: 'center',
  },

  subTilte: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  buttonInner: {
    marginTop: 25,
    width: 180,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    resizeMode: 'contain',
    position: 'relative',
    width: '100%',
  },

  buttonText: {
    position: 'absolute',
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default BeforeLoginModal;
