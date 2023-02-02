import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import * as Yup from 'yup';
import RowContainer from '../../components/containers/RowContainer';
import GradientButton from '../../components/buttons/GradientButton';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { resetNavigation } from '../../util';
import { useDispatch, useSelector } from 'react-redux';
import {
  saveEditProfileSuccess,
  saveUserInfo,
  signIn,
  signOut,
  updateUserInfo,
} from '../../redux/authSlice';
import messaging from '@react-native-firebase/messaging';
import api from '../../api/api';
import { getTeacherGyms } from '../../redux/teacherGymSlice';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants/constants';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;

  const secondInput = useRef(null);
  const [isVisible1, setIsVisible1] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    // console.log('user approveStatus', user?.approveStatus);
    // dispatch(signOut());
    if (user && user?.approveStatus !== '승인') {
      Alert.alert('', '승인 후 이용가능합니다.');
    } else if (user && user.approveStatus === '승인') {
      updateFcmTokenAtUser();
      if (user.type === '강사') {
        dispatch(getTeacherGyms());
        resetNavigation(navigation, 'TeacherMain');
      } else if (user.type === '일반유저') {
        resetNavigation(navigation, 'MemberMain');
      } else if (user.type === '센터장' || user.type === '슈퍼관리자') {
        Alert.alert('', '사업자와 슈퍼관리자화면은 준비중입니다.');
      }
    }
  }, [dispatch, user, user?.approveStatus]);

  const updateFcmTokenAtUser = async () => {
    const fcmToken = await messaging().getToken();
    const config = {
      headers: {
        Authorization: `Token ${token}`,
      },
    };

    try {
      const res = await api.patch('profile', { fcmToken }, config);
      // console.log('updateToken res', res);
    } catch (err) {
      console.log('err', err);
      console.log('err.res', err.response);
      let msg = '서버와 통신에 실패하였습니다.';

      const { data } = err.response;
      if (!data.ok && data.msg) {
        msg = data.msg;
      }
      // Alert.alert('유저 토큰 업데이트', msg);
    }
  };

  const onLogin = useCallback(() => {
    if (email === '' || password === '') {
      Alert.alert('', '정보를 입력해주세요.');
      return;
    }
    dispatch(signIn({ email, password }));
  }, [email, password]);

  useEffect(() => {
    // navigation.setOptions({
    //   headerRight: () => (
    //     <Touchable
    //       onPress={() => navigation.navigate('MemberMain')}
    //       style={{ padding: 4 }}
    //     >
    //       <FontAwesome5 name='home' size={25} color={'#8082FF'} />
    //     </Touchable>
    //   ),
    // });
  }, []);
  return (
    <View style={styles.rootContainer}>
      <ScrollView style={styles.rootContainer}>
        <Image
          source={require('../../assets/images/home/infoText.png')}
          style={styles.infoImage}
          resizeMode={'contain'}
        />
        {/*<View style={styles.container}>*/}
        {/*  <RowContainer style={styles.textContainer}>*/}
        {/*    <Text style={styles.coloredBoldText}>빠</Text>*/}
        {/*    <Text style={styles.normalText}>르게</Text>*/}
        {/*  </RowContainer>*/}
        {/*  <RowContainer style={styles.bottomTextContainer}>*/}
        {/*    <Text style={styles.coloredBoldText}>소</Text>*/}
        {/*    <Text style={styles.normalText}>개해봅니다</Text>*/}
        {/*  </RowContainer>*/}
        {/*</View>*/}

        <View style={styles.inputBox}>
          <View style={styles.inputField}>
            <TextInput
              style={styles.textInputText}
              placeholderTextColor='#AAAAAA'
              placeholder='아이디'
              autoCapitalize='none'
              keyboardType='email-address'
              textContentType='emailAddress'
              blurOnSubmit={false}
              returnKeyType={'next'}
              onSubmitEditing={() => secondInput.current.focus()}
              // autoFocus={true}
              onChangeText={(text) => setEmail(text)}
              // onBlur={handleBlur('email')}
              value={email}
            />
          </View>
          <View>
            <View style={styles.inputField}>
              <TextInput
                ref={secondInput}
                style={styles.textInputText}
                placeholderTextColor='#AAAAAA'
                placeholder='비밀번호'
                autoCapitalize='none'
                textContentType='password'
                autoCorrect={false}
                secureTextEntry={!isVisible1}
                onChangeText={(text) => setPassword(text)}
                value={password}
              />
              <TouchableOpacity
                style={styles.touchEye}
                onPress={() => setIsVisible1(!isVisible1)}
              >
                <Ionicons
                  name={isVisible1 ? 'eye-outline' : 'ios-eye-off-outline'}
                  size={30}
                  color={'#8082FF'}
                  style={{ marginTop: 10 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <RowContainer style={styles.clickBox}>
          <TouchableOpacity onPress={() => navigation.navigate('FindId')}>
            <NormalLabel style={styles.blueText} text={'아이디 찾기'} />
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            // navigation.navigate('Auth', { screen: 'ResetPassword' })
            onPress={() => navigation.navigate('RePassword')}
          >
            <NormalLabel style={styles.blueText} text={'비밀번호 재설정'} />
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <NormalLabel style={styles.blueText} text={'회원가입'} />
          </TouchableOpacity>
        </RowContainer>

        <GradientButton onPress={onLogin} outerStyle={styles.loginButton}>
          <NormalBoldLabel
            text={'로그인'}
            style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}
          />
        </GradientButton>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  infoImage: {
    width: SCREEN_WIDTH * 0.48,
    alignSelf: 'center',
    height: 66,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 68,
    // paddingBottom: 25,
  },
  container: {
    alignItems: 'flex-start',
    // marginLeft: 105,
  },
  textContainer: {
    justifyContent: 'center',
    // marginTop: 30,
  },
  bottomTextContainer: {
    justifyContent: 'center',
  },
  coloredBoldText: {
    color: '#8082ff',
    fontWeight: 'bold',
    fontSize: 36,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#000',
  },
  normalText: {
    fontSize: 30,
    color: 'black',
    fontWeight: '800',
  },
  eyeIcon: {
    position: 'absolute',
  },
  sectionStyle: {
    flexDirection: 'row',
  },
  touchEye: {
    position: 'absolute',
    right: 15,
    paddingBottom: 5,
  },
  inputBox: {
    alignItems: 'center',
    marginTop: 68,
  },
  imageStyle: {
    height: 18.72,
    width: 28,
    marginTop: 15,
    tintColor: 'lightgray',
  },

  inputField: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#E3E5E5',
    marginBottom: 15,
    paddingLeft: 17,
    width: width - 48,
    // width: 327,
    height: 52,
    // backgroundColor: '#E3E5E5',
    // alignItems: 'flex-start',
  },
  textInputText: {
    fontSize: 15,
    flex: 1,
    color: '#000',
    // backgroundColor: 'red'
    // fontWeight: '800',
  },
  clickBox: {
    // paddingHorizontal: 33,
    justifyContent: 'center',
    marginBottom: 80,
    // justifyContent: 'space-between',
  },
  blueText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  loginButton: {
    alignSelf: 'center',
    width: width - 46,
    // marginTop: 80,
    // position: 'absolute',
    // left: 23,
    // bottom: 0,
    // paddingVertical: 16,
  },
  line: {
    width: 2,
    height: 14,
    backgroundColor: '#e3e5e5',
    marginHorizontal: 14,
  },
});

export default LoginScreen;
