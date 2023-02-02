import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { NormalBoldLabel, NormalLabel } from '../Label';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RadioButton } from 'react-native-paper';
import Postcode from '@actbase/react-daum-postcode';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Touchable from '../buttons/Touchable';
import RowContainer from '../containers/RowContainer';
import BirthPicker from '../date/BirthPicker';
import BottomGradientButton from '../buttons/BottomGradientButton';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { resetErrMsg, signOut, signUp } from '../../redux/authSlice';
import { resetNavigation } from '../../util';
import {
  isIos,
  PHONE_START_NUMBERS,
  SCREEN_WIDTH,
} from '../../constants/constants';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import api from '../../api/api';
import CenterListModal from '../modal/CenterListModal';
import RadioButtonCustom from '../RadioButtonCustom';

const { width } = Dimensions.get('window');

const ErrorMsg = styled.Text`
  color: red;
  text-align: right;
`;

let interval;

const SignupForm = ({ type }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user, errorMsg } = auth;

  const navigation = useNavigation();
  const [isVisible1, setIsVisible1] = useState(false);
  const [isVisible2, setIsVisible2] = useState(false);
  const [isModalOn, setModalOn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('010');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [code, setCode] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [hasSent, setHasSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // dispatch(signOut());
    if (errorMsg) {
      Alert.alert(
        '',
        errorMsg,
        [{ text: '확인', onPress: () => dispatch(resetErrMsg()) }],
        { cancelable: false }
      );
    } else if (user && user?.approveStatus !== '승인') {
      Alert.alert('', '승인 후 이용가능합니다.');
    } else if (user && user?.approveStatus === '승인') {
      dispatch(signOut());
      resetNavigation(navigation, 'SignUpCompleted');
    }
  }, [dispatch, user, errorMsg]);

  const onRegister = async (userData) => {
    // console.log('register userData', userData);
    if (!isVerify) {
      Alert.alert('휴대폰 인증을 완료해주세요.');
      return;
    }

    const {
      email,
      password,
      passwordCheck,
      koreanName,
      birth,
      gender,
      address,
    } = userData;

    if (
      email === '' ||
      passwordCheck === '' ||
      koreanName === '' ||
      birth === '' ||
      gender === '' ||
      address === ''
    ) {
      Alert.alert('양식을 모두 입력해주세요.');
      return;
    } else if (password.length < 8) {
      Alert.alert('8자리 이상의 비밀번호를 입력해주세요.');
      return;
    } else if (password !== passwordCheck) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    let newUser = Object.assign({}, userData);
    newUser.birth = moment(birth).format('YYYY-MM-DD');
    newUser.phoneNumber = phoneNumber + newUser.phoneNumber;
    // console.log(' newUser.phoneNumber:', newUser.phoneNumber);

    dispatch(signUp(newUser));
  };

  const getAddress = (data, setFieldValue) => {
    // console.log(data)
    let withBuildingName = data.address;
    setFieldValue('address', withBuildingName);
    setFieldValue('postcode', data.zonecode);

    if (data.buildingName !== '') {
      withBuildingName += `, (${data.buildingName})`;
      // setAddress(withBuildingName);
      //       setPostalCode(data.zonecode);
      setFieldValue('addressDetail', data.buildingName);
    }
  };

  const SignupFormSchema = Yup.object().shape({
    address: Yup.string().required('주소를 입력해주세요.'),
    birth: Yup.date().required('생년월일을 선택해주세요.'),
    email: Yup.string()
      .email('이메일 양식이 아닙니다.')
      .required('이메일을 입력해주세요.'),
    password: Yup.string()
      .required('8자리 이상 입력해주세요.')
      .min(8, '8자리 이상 입력해주세요.'),
    passwordCheck: Yup.string()
      .required('8자리 이상 입력해주세요.')
      .min(8, '8자리 이상 입력해주세요.'),
    koreanName: Yup.string().required('이름(국문)을 입력해주세요.'),
    englishName: Yup.string().required('이름(영문)을 입력해주세요.'),
  });

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

  const onSendVerifyCode = async (phoneStartNumber, phoneNumber) => {
    if (phoneNumber === '') {
      Alert.alert('전화번호를 입력해주세요. ');
      return;
    }

    try {
      const { data } = await api.get(
        `sms-send?scope=SIGN_UP&phoneNumber=${phoneStartNumber + phoneNumber}`
      );
      // console.log('res', data);
      setHasSent(true);
      countDown();
      Alert.alert('인증번호가 발송되었습니다.');
      setIsVerify(false);
    } catch (e) {
      console.log(e.response);
      const { data } = e.response;

      if (!data.ok && data.msg) {
        Alert.alert(data.msg);
      }
    }
  };

  const checkVerifyCode = async (phoneNumber) => {
    if (!hasSent) {
      Alert.alert('먼저 인증 요청을 보내주세요.');
      return;
    }
    if (remaining === 0) {
      Alert.alert(
        '인증시간이 초과되었습니다.\n' + '인증코드를 다시 발송해주세요.'
      );
      setRemaining(0);
      if (interval) {
        clearInterval(interval);
      }
      return;
    }

    try {
      const params = { code, phoneNumber };
      const { data } = await api.post(`sms-send`, params);
      // console.log('res data', data);
      if (data?.ok) {
        Alert.alert('', data.msg);
      }
      setIsVerify(true);
      // setRemaining(0);
      if (interval) {
        clearInterval(interval);
      }
    } catch (e) {
      console.log(e);
      console.log(e.response);
      const { data } = e.response;
      if (!data.ok && data.msg) {
        Alert.alert('', data.msg);
      }
    }
  };

  const countDown = () => {
    let time = 300;
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      time = time - 1;
      setRemaining(time);
      if (time <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };
  const radioValue = [
    { value: '여자', label: '여자' },
    { value: '남자', label: '남자' },
  ];
  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          passwordCheck: '',
          koreanName: '',
          englishName: '',
          birth: new Date(),
          gender: '',
          address: '',
          addressDetail: '',
          phoneNumber: '',
          postcode: '',
          type: type,
        }}
        validationSchema={SignupFormSchema}
        // validationOnMount={true}
        onSubmit={(values) => {
          console.log('? call x');
          // onRegister(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          values,
          handleSubmit,
          isValid,
          setFieldValue,
          errors,
          touched,
        }) => (
          <>
            <View>
              <View>
                <NormalBoldLabel text={'아이디'} />
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.textInputText}
                    placeholderTextColor='#aaa'
                    placeholder='id@ffaso.com'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    textAlign='center'
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                </View>
              </View>
              {!!errors.email && touched.email && (
                <ErrorMsg>{errors.email}</ErrorMsg>
              )}

              <NormalBoldLabel text={'비밀번호'} />
              <View style={styles.sectionStyle}>
                <View style={styles.inputField}>
                  <TextInput
                    style={styles.textInputText}
                    placeholderTextColor='#aaa'
                    placeholder='비밀번호를 입력해주세요.'
                    autoCapitalize='none'
                    textContentType='password'
                    autoCorrect={false}
                    textAlign='center'
                    // secureTextEntry={isVisible1 ? false : true}
                    secureTextEntry={!isVisible1}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  <TouchableOpacity
                    style={styles.touchEye}
                    onPress={() => setIsVisible1(!isVisible1)}
                  >
                    <Image
                      style={styles.imageStyle}
                      source={
                        isVisible1
                          ? require('../../assets/icons/eye.png')
                          : require('../../assets/icons/closedeye.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {!!errors.password && touched.password && (
                <ErrorMsg>{errors.password}</ErrorMsg>
              )}

              <View style={styles.pwCheckContainer}>
                <NormalBoldLabel text={'비밀번호 재확인'} />
                <View style={styles.sectionStyle}>
                  <View style={styles.inputField}>
                    <TextInput
                      style={styles.textInputText}
                      placeholderTextColor='#aaa'
                      placeholder='비밀번호를 다시 입력해주세요.'
                      textAlign='center'
                      autoCapitalize='none'
                      textContentType='password'
                      autoCorrect={false}
                      secureTextEntry={!isVisible2}
                      onChangeText={handleChange('passwordCheck')}
                      onBlur={() => {
                        // if (values.password !== values.passwordCheck) {
                        //   setIsPasswordMatch(false);
                        // } else {
                        //   setIsPasswordMatch(true);
                        // }
                      }}
                      value={values.passwordCheck}
                    />
                    <TouchableOpacity
                      style={styles.touchEye}
                      onPress={() => setIsVisible2(!isVisible2)}
                    >
                      <Image
                        style={styles.imageStyle}
                        source={
                          isVisible2
                            ? require('../../assets/icons/eye.png')
                            : require('../../assets/icons/closedeye.png')
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {values.password?.length > 0 &&
              values.passwordCheck?.length > 0 &&
              values.passwordCheck?.length < 8 ? (
                <ErrorMsg>8자리 이상 입력해주세요.</ErrorMsg>
              ) : values.password !== values.passwordCheck ? (
                <ErrorMsg>비밀번호가 일치하지 않습니다.</ErrorMsg>
              ) : null}
            </View>

            <View style={styles.nameBox}>
              <View style={{ marginRight: 15, flex: 1 }}>
                <NormalBoldLabel text={`이름(국문)`} />
                <View style={styles.nameinputField}>
                  <TextInput
                    style={styles.textInputText}
                    autoCapitalize='none'
                    textContentType='name'
                    textAlign='center'
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={handleChange('koreanName')}
                    onBlur={handleBlur('koreanName')}
                    value={values.name}
                  />
                </View>
                {!!errors.koreanName && touched.koreanName && (
                  <ErrorMsg style={{ textAlign: 'left' }}>
                    {errors.koreanName}
                  </ErrorMsg>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <NormalBoldLabel text={`이름(영문)`} />
                <View style={styles.nameinputField}>
                  <TextInput
                    style={styles.textInputText}
                    autoCapitalize='none'
                    textContentType='name'
                    textAlign='center'
                    autoCorrect={false}
                    secureTextEntry={false}
                    onChangeText={handleChange('englishName')}
                    onBlur={handleBlur('englishName')}
                    value={values.englishName}
                  />
                </View>
                {!!errors.englishName && touched.englishName && (
                  <ErrorMsg>{errors.englishName}</ErrorMsg>
                )}
              </View>
            </View>

            <View style={styles.birthdayBox}>
              <BirthPicker
                isOpen={isDatePickerOpen}
                date={values.birth}
                onConfirm={(selectedDate) => {
                  setIsDatePickerOpen(false);
                  // setBirthDate(selectedDate);
                  setFieldValue('birth', selectedDate);
                }}
                onCancel={() => setIsDatePickerOpen(false)}
              />
              <NormalBoldLabel text={'생년월일'} />
              <Touchable
                onPress={() => setIsDatePickerOpen(true)}
                style={styles.birthdayInputBox}
              >
                <View />
                <NormalLabel
                  text={moment(values.birth).format('YYYY-MM-DD')}
                  style={styles.birthLabel}
                />

                <Image
                  style={{ width: 16, height: 18 }}
                  source={require('../../assets/icons/date.png')}
                />
              </Touchable>
            </View>
            <View style={styles.genderContainer}>
              <NormalBoldLabel text={'성별'} style={{ marginBottom: 12 }} />
              <RadioButtonCustom
                radioList={radioValue}
                onValueChange={handleChange('gender')}
                selectValue={values.gender}
                labelStyle={{ marginRight: 42 }}
                style={{ marginBottom: 8 }}
              />

              {/*<NormalBoldLabel text={'성별'} />*/}
              {/*<View>*/}
              {/*  <RadioButton.Group*/}
              {/*    style={styles.genderBox}*/}
              {/*    onValueChange={handleChange('gender')}*/}
              {/*    value={values.gender}*/}
              {/*  >*/}
              {/*    <RowContainer>*/}
              {/*      <RowContainer style={styles.femaleBox}>*/}
              {/*        <RadioButton*/}
              {/*          value='여자'*/}
              {/*          color={'#8082FF'}*/}
              {/*          uncheckedColor={'#8082ff'}*/}
              {/*        />*/}
              {/*        <NormalLabel text={'여자'} style={styles.genderLabel} />*/}
              {/*      </RowContainer>*/}
              {/*      <RowContainer>*/}
              {/*        <RadioButton*/}
              {/*          value='남자'*/}
              {/*          color={'#8082FF'}*/}
              {/*          uncheckedColor={'#8082ff'}*/}
              {/*        />*/}
              {/*        <NormalLabel text={'남자'} style={styles.genderLabel} />*/}
              {/*      </RowContainer>*/}
              {/*    </RowContainer>*/}
              {/*  </RadioButton.Group>*/}
              {/*</View>*/}

              <View>
                <NormalBoldLabel text={'주소'} style={{ marginTop: 8 }} />
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <TextInput
                    style={styles.postalCode}
                    placeholder='우편번호'
                    placeholderTextColor={'#aaa'}
                    value={values.postcode}
                    editable={false}
                  />
                  <View>
                    <Modal visible={isModalOn}>
                      <Touchable
                        onPress={() => setModalOn(false)}
                        style={{
                          alignItems: 'flex-end',
                          padding: 4,
                          margin: 8,
                          marginTop: isIos ? 40 : 8,
                          marginRight: isIos ? 20 : 8,
                        }}
                      >
                        <AntDesign name='close' size={24} color={'#555'} />
                      </Touchable>
                      <Postcode
                        style={styles.postCodeStyle}
                        jsOptions={{ animation: true, hideMapBtn: true }}
                        onSelected={(data) => {
                          getAddress(data, setFieldValue);
                          setModalOn(false);
                        }}
                      />
                    </Modal>
                  </View>
                  <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => setModalOn(true)}
                  >
                    <NormalBoldLabel
                      style={styles.searchText}
                      text={'주소검색'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputField}>
                  <TextInput
                    style={styles.textInputText}
                    placeholderTextColor='#aaa'
                    placeholder='주소'
                    autoCorrect={false}
                    editable={false}
                    textAlign='center'
                    // onChangeText={handleChange('address', address)}
                    // onValueChange={handleChange('address')}
                    // onBlur={handleBlur('address')}
                    value={values.address}
                  />
                </View>
                <View style={[styles.inputField, { marginTop: -2 }]}>
                  <TextInput
                    style={styles.textInputText}
                    autoCapitalize='none'
                    // textContentType='addressDetail'
                    placeholderTextColor='#aaa'
                    placeholder='상세주소 입력'
                    autoCorrect={false}
                    onChangeText={handleChange('addressDetail')}
                    onBlur={handleBlur('addressDetail')}
                    value={values.addressDetail}
                    textAlign='center'
                  />
                </View>
              </View>
            </View>

            <NormalBoldLabel text={'전화번호'} />
            <RowContainer style={{ marginVertical: 8 }}>
              <CenterListModal
                containerStyle={styles.frontNumberBox}
                list={PHONE_START_NUMBERS}
                selectedItem={phoneNumber}
                itemName={'name'}
                onPress={() => setIsModalOpen(true)}
                visible={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                onSelect={(obj) => setPhoneNumber(obj.name)}
              />
              <TextInput
                style={styles.restNumberBox}
                keyboardType='number-pad'
                autoCorrect={false}
                onChangeText={(text) => {
                  const pattern = /^-?\d*\.?\d*$/;
                  if (pattern.test(text)) {
                    setFieldValue('phoneNumber', text);
                  }
                }}
                value={values.phoneNumber}
                maxLength={8}
                textAlign='center'
              />
            </RowContainer>
            <View>
              <View>
                <TouchableOpacity
                  style={styles.requestButton}
                  onPress={() =>
                    onSendVerifyCode(phoneNumber, values.phoneNumber)
                  }
                  // onPress={() => Alert.alert('인증번호가 요청되었습니다.')}
                >
                  <Text style={styles.searchText}>인증번호 요청</Text>
                </TouchableOpacity>
              </View>
              <RowContainer>
                <TextInput
                  value={code}
                  onChangeText={(text) => setCode(text)}
                  style={styles.postalCode}
                  placeholder='인증번호 입력'
                  maxLength={4}
                  keyboardType='number-pad'
                  textAlign='center'
                />
                <TouchableOpacity
                  style={styles.searchButton}
                  onPress={() =>
                    checkVerifyCode(phoneNumber + values.phoneNumber)
                  }
                >
                  <Text style={styles.searchText}>확인</Text>
                </TouchableOpacity>
              </RowContainer>
            </View>

            <BottomGradientButton
              // disabled={!isVerify}
              style={styles.registerBtn}
              onPress={() => onRegister(values)}
            >
              <NormalBoldLabel
                text={'가입완료'}
                style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}
              />
            </BottomGradientButton>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 38,
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  sectionStyle: {},
  touchEye: {
    position: 'absolute',
    right: 8,
    top: -10,
    padding: 4,
  },
  imageStyle: {
    height: 20,
    width: 20,
    marginTop: 15,
    tintColor: '#e3e5e5',
  },
  pwCheckContainer: {
    marginTop: 2,
  },
  genderContainer: {
    marginTop: 12,
  },
  genderBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputField: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 5,
    marginBottom: 10,
    height: 40,
  },
  nameinputField: {
    marginTop: 5,
    borderRadius: 10,
    borderColor: '#e3e5e5',
    backgroundColor: '#fff',
    marginBottom: 10,
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  nameBox: {
    flexDirection: 'row',
    paddingTop: 4,
  },
  textInputText: {
    fontSize: 12,
    color: '#000',
    width: '100%',
  },
  birthdayBox: {
    marginTop: 4,
  },
  birthdayInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    color: '#555',
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  birthLabel: {
    fontSize: 12,
    lineHeight: 16,
    color: '#555',
  },
  monthInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#e3e5e5',
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderLabel: {
    fontSize: 14,
    lineHeight: 19,
    color: '#0e0f0f',
  },
  femaleBox: {
    marginRight: 42,
    marginLeft: -6,
  },
  postalCode: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    textAlign: 'center',
    backgroundColor: '#fff',
    flex: 1,
    color: '#000',
    height: 40,
  },
  postCodeStyle: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 40,
    padding: 5,
    width: width - 48,
    marginHorizontal: 24,
    height: 400,
  },
  searchButton: {
    width: SCREEN_WIDTH * 0.282,
    height: 40,
    backgroundColor: '#8082ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },
  searchText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  frontNumberBox: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#e3e5e5',
    borderWidth: 1,
    marginRight: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.3,
  },
  restNumberBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 16,
    color: '#000',
    fontSize: 15,
    height: 40,
    flex: 0.7,
  },
  requestButton: {
    height: 40,
    backgroundColor: '#8082ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 8,
  },
  registerBtn: {
    marginTop: 31,
  },
});

export default SignupForm;
