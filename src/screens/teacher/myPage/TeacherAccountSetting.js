import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { NormalBoldLabel } from '../../../components/Label';
import Postcode from '@actbase/react-daum-postcode';
import { Picker } from '@react-native-picker/picker';
import RowContainer from '../../../components/containers/RowContainer';
import GradientButton from '../../../components/buttons/GradientButton';
import { useSelector, useDispatch } from 'react-redux';
import { deleteUser, signOut, updateUserInfo } from '../../../redux/authSlice';
import { resetNavigation } from '../../../util';
import {
  isIos,
  PHONE_START_NUMBERS,
  SCREEN_WIDTH,
} from '../../../constants/constants';
import Touchable from '../../../components/buttons/Touchable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SpaceBetweenContainer from '../../../components/containers/SpaceBetweenContainer';
import CenterListModal from '../../../components/modal/CenterListModal';
import { Container } from '../../../components/containers/Container';

const TeacherAccountSetting = ({ navigation }) => {
  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;

  const dispatch = useDispatch();

  const [isVisible1, setIsVisible1] = useState(false);
  const [isModalOn, setModalOn] = useState(false);

  const [prePhoneNumber, setPrePhoneNumber] = useState(
    user?.phoneNumber.substr(0, 3)
  );
  const [name, setName] = useState(user?.koreanName);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState('');
  const [postalCode, setPostalCode] = useState(user?.postcode);
  const [address, setAddress] = useState(user?.address);
  const [addressDetail, setAddressDetail] = useState(user?.addressDetail);
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phoneNumber.substr(3, 10)
  );
  const [bankOwnerName, setBankOwnerName] = useState(user?.bankOwnerName);
  const [bankName, setBankName] = useState(user?.bankName);
  const [accountNumber, setAccountNnumber] = useState(user?.accountNumber);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            dispatch(signOut());
            Alert.alert('', '로그아웃 되었습니다.');
            setTimeout(() => {
              resetNavigation(navigation, 'Auth');
            }, 500);
          }}
          style={{ padding: 4 }}
        >
          <NormalBoldLabel style={styles.grayText} text={'로그아웃'} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const getAddress = (data) => {
    let withBuildingName = data.address;

    if (data.buildingName !== '') {
      withBuildingName += `, (${data.buildingName})`;
      setAddress(withBuildingName);
      setPostalCode(data.zonecode);
    } else {
      setAddress(data.address);
      setPostalCode(data.zonecode);
    }
  };

  const editProfile = () => {
    if (name === '') {
      Alert.alert('이름은 필수입니다.');
      return;
    }

    let body = new FormData();
    if (name !== user?.koreanName) {
      body.append('koreanName', name);
    }

    if (email !== user?.email) {
      body.append('email', email);
    }

    if (password !== '' && password.length < 8) {
      Alert.alert('비밀번호는 최소 8자리 이상이어야 합니다.');
    } else if (password !== '') {
      body.append('password', password);
    }

    if (postalCode !== user?.postcode) {
      body.append('postcode', postalCode);
    }

    if (address !== user?.address) {
      body.append('address', address);
    }

    if (addressDetail !== user?.addressDetail) {
      body.append('addressDetail', addressDetail);
    }

    if (phoneNumber.length < 8) {
      Alert.alert('전화번호는 8자리입니다.');
    } else if (prePhoneNumber !== user?.phoneNumber.substr(0, 3)) {
      body.append('phoneNumber', prePhoneNumber + phoneNumber);
    } else if (phoneNumber !== user?.phoneNumber.substr(3, 10)) {
      body.append('phoneNumber', prePhoneNumber + phoneNumber);
    }

    if (bankOwnerName !== user?.bankOwnerName) {
      body.append('bankOwnerName', bankOwnerName);
    }

    if (bankName !== user?.bankName) {
      body.append('bankName', bankName);
    }

    if (accountNumber !== user?.accountNumber) {
      body.append('accountNumber', accountNumber);
    }

    // console.log('body', body);

    if (password !== '' && password.length < 8) {
      Alert.alert('비밀번호는 최소 8자리 이상이어야 합니다.');
    } else if (phoneNumber.length < 8) {
      Alert.alert('전화번호는 8자리입니다.');
    } else if (body._parts.length === 0) {
      Alert.alert('계정정보가 전부 동일합니다.');
    } else {
      dispatch(updateUserInfo(body));
      navigation.goBack();
    }
  };

  const naviGoback = () => {
    if (password !== '' && password.length < 8) {
      return;
    }
    if (name === '') {
      return;
    }
    if (phoneNumber.length < 8) {
      return;
    }
    navigation.goBack();
  };

  const onDeleteUser = () => {
    Alert.alert('계정 탈퇴하시겠습니까?', '', [
      {
        text: '취소',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => {
          dispatch(deleteUser(user?.id, token));

          Alert.alert('계정탈퇴 되었습니다.');
          setTimeout(() => {
            resetNavigation(navigation, 'Auth');
          }, 500);
        },
      },
    ]);
  };

  return (
    <Container
      style={{
        paddingHorizontal: 24,
        paddingTop: 20,
      }}
    >
      {/*<ScrollView*/}
      {/*  contentContainerStyle={{ paddingBottom: 25 }}*/}
      {/*  style={{*/}
      {/*    flex: 1,*/}
      {/*    paddingHorizontal: 24,*/}
      {/*    paddingTop: 20,*/}
      {/*    backgroundColor: '#FBFBFB',*/}
      {/*  }}*/}
      {/*>*/}
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
              getAddress(data);
              setModalOn(false);
            }}
          />
        </Modal>
      </View>
      <View>
        <NormalBoldLabel style={styles.boldText} text={'이름'} />
        <View style={styles.inputField}>
          <TextInput
            style={styles.textInputText}
            placeholderTextColor='#AAA'
            placeholder='김남욱'
            autoCapitalize='none'
            //   keyboardType="email-address"
            //   textContentType="emailAddress"
            onChangeText={(text) => setName(text)}
            // autoFocus={true}
            value={name}
            textAlign='center'
          />
        </View>
      </View>
      <View>
        <NormalBoldLabel style={styles.boldText} text={'이메일'} />
        <View style={styles.inputField}>
          <TextInput
            style={styles.textInputText}
            placeholderTextColor='#AAA'
            placeholder='love4langhe@naver.com'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            // autoFocus={true}
            onChangeText={(text) => setEmail(text)}
            value={email}
            textAlign='center'
            autoComplete='email'
          />
        </View>
      </View>
      <View>
        <NormalBoldLabel style={styles.boldText} text={'비밀번호'} />

        <View style={styles.inputField}>
          <TextInput
            style={styles.textInputText}
            placeholderTextColor='#aaa'
            placeholder='변경할 비밀번호를 입력해주세요.'
            autoCapitalize='none'
            textContentType='password'
            autoCorrect={false}
            secureTextEntry={!isVisible1}
            textAlign='center'
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity
            style={styles.touchEye}
            onPress={() => setIsVisible1(!isVisible1)}
          >
            <Image
              style={styles.imageStyle}
              source={
                isVisible1
                  ? require('../../../assets/icons/eye.png')
                  : require('../../../assets/icons/closedeye.png')
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ marginTop: 10 }}>
        <NormalBoldLabel style={styles.boldText} text={'주소'} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            style={styles.postalCode}
            placeholder='우편번호'
            value={postalCode}
            textAlign='center'
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setModalOn(true)}
          >
            <Text style={styles.searchText}>주소검색</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputField}>
          <TextInput
            style={styles.textInputText}
            placeholderTextColor='#aaa'
            placeholder='주소'
            autoCorrect={false}
            value={address}
            textAlign='center'
          />
        </View>
        <View style={styles.inputField}>
          <TextInput
            style={styles.textInputText}
            placeholderTextColor='#aaa'
            placeholder='상세주소 입력'
            autoCorrect={false}
            onChangeText={(text) => setAddressDetail(text)}
            value={addressDetail}
            textAlign='center'
          />
        </View>
      </View>

      <NormalBoldLabel style={styles.boldText} text={'전화번호'} />
      <SpaceBetweenContainer style={{ marginBottom: 8 }}>
        <CenterListModal
          containerStyle={styles.frontNumberBox}
          list={PHONE_START_NUMBERS}
          selectedItem={prePhoneNumber}
          itemName={'name'}
          onPress={() => setIsModalOpen(true)}
          visible={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onSelect={(obj) => setPrePhoneNumber(obj.name)}
        />
        <TextInput
          style={styles.restNumberBox}
          autoCorrect={false}
          onChangeText={(text) => setPhoneNumber(text)}
          keyboardType='phone-pad'
          maxLength={8}
          value={phoneNumber}
          textAlign='center'
        />
      </SpaceBetweenContainer>
      <View>
        <NormalBoldLabel
          style={styles.boldText}
          text={'입금 계좌 정보(예금주명)'}
        />
        <View style={styles.inputField}>
          <TextInput
            style={styles.textInputText}
            placeholderTextColor='#AAA'
            placeholder='김남욱'
            autoCapitalize='none'
            // autoFocus={true}
            textAlign='center'
            onChangeText={(text) => setBankOwnerName(text)}
            value={bankOwnerName}
          />
        </View>
      </View>
      <View>
        <NormalBoldLabel
          style={styles.boldText}
          text={'입금 계좌 정보(은행명)'}
        />
        <View style={styles.inputField}>
          <TextInput
            style={styles.textInputText}
            placeholderTextColor='#AAA'
            placeholder='국민은행'
            autoCapitalize='none'
            // autoFocus={true}
            textAlign='center'
            onChangeText={(text) => setBankName(text)}
            value={bankName}
          />
        </View>
      </View>
      <View>
        <NormalBoldLabel
          style={styles.boldText}
          text={'입금 계좌 정보(계좌번호)'}
        />
        <View style={styles.inputField}>
          <TextInput
            style={styles.textInputText}
            placeholderTextColor='#AAA'
            placeholder='31242399-01-38431'
            autoCapitalize='none'
            keyboardType='numeric'
            // autoFocus={false}
            onChangeText={(text) => setAccountNnumber(text)}
            value={accountNumber}
            textAlign='center'
          />
        </View>
      </View>
      <RowContainer
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginVertical: 25,
        }}
      >
        <TouchableOpacity style={styles.signOutBtn} onPress={onDeleteUser}>
          <Text style={styles.signOutBtnText}>계정탈퇴</Text>
        </TouchableOpacity>
        <GradientButton
          style={styles.btn}
          onPress={() => {
            editProfile();
          }}
        >
          <Text style={styles.saveBtn}>저장</Text>
        </GradientButton>
      </RowContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    // width: 155,
    width: SCREEN_WIDTH * 0.42,
    height: 52,
    paddingVertical: 0,
  },
  postCodeStyle: {
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 40,
    // marginLeft: 30,
    padding: 5,
    // width: 350,
    width: SCREEN_WIDTH - 48,
    marginHorizontal: 24,
    height: 400,
  },
  saveBtn: {
    width: SCREEN_WIDTH * 0.42,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 15,
    color: '#fff',
    fontSize: 20,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  signOutBtn: {
    width: SCREEN_WIDTH * 0.42,
    height: 52,
    backgroundColor: '#AAA',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    alignItems: 'center',
  },
  leftActionable: {
    width: 7,
    height: 14,
    marginLeft: 24.5,
  },
  grayText: {
    color: 'gray',
    fontSize: 12,
    lineHeight: 20,
  },
  boldText: {
    lineHeight: 20,
    fontSize: 15,
    marginBottom: 5,
  },
  idpwBox: {},
  inputField: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    height: 40,
  },
  textInputText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#000',
  },
  sectionStyle: {
    flexDirection: 'row',
  },
  touchEye: {
    position: 'absolute',
    right: 8,
    top: -10,
    padding: 4,
  },
  eyeIcon: {
    position: 'absolute',
  },
  imageStyle: {
    height: 20,
    width: 20,
    marginTop: 15,
    tintColor: 'lightgray',
  },
  postalCode: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    color: '#000',
    marginBottom: 10,
    flex: 1,
    marginRight: 11,
    height: 40,
    textAlign: 'center',
  },

  searchButton: {
    width: 106,
    height: 40,
    backgroundColor: '#8082ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  searchText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  frontNumberBox: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#e3e5e5',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    flex: 0.3,
  },
  restNumberBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 40,
    color: '#000',
    flex: 0.7,
    fontSize: 15,
  },
  pickerInput: {
    width: SCREEN_WIDTH * 0.265,
    height: 40,
    color: '#000',
  },
});

export default TeacherAccountSetting;
