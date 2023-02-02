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
import RowContainer from '../../../components/containers/RowContainer';
import Touchable from '../../../components/buttons/Touchable';
import { useSelector, useDispatch } from 'react-redux';
import {
  isIos,
  PHONE_START_NUMBERS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../constants/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import { signOut, updateUserInfo, deleteUser } from '../../../redux/authSlice';
import { resetNavigation } from '../../../util';
import SpaceBetweenContainer from '../../../components/containers/SpaceBetweenContainer';
import CenterListModal from '../../../components/modal/CenterListModal';
import { Container } from '../../../components/containers/Container';

const MemberAccountSetting = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;

  const [isVisible1, setIsVisible1] = useState(false);
  const [isModalOn, setModalOn] = useState(false);

  const [prePhoneNumber, setPrePhoneNumber] = useState(
    user?.phoneNumber ? user?.phoneNumber.substr(0, 3) : '010'
  );
  const [name, setName] = useState(user?.koreanName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [postalCode, setPostalCode] = useState(user?.postcode ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [addressDetail, setAddressDetail] = useState(user?.addressDetail ?? '');
  const [phoneNumber, setPhoneNumber] = useState(
    user?.phoneNumber ? user?.phoneNumber.substr(3, 10) : ''
  );
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

            // navigation.navigate('Login');
          }}
          style={{ padding: 4 }}
        >
          <NormalBoldLabel style={styles.grayText} text={'로그아웃'} />
        </TouchableOpacity>
      ),
    });
  }, []);

  const editProfile = async () => {
    if (name === '') {
      Alert.alert('이름은 필수입니다.');
      return;
    } else if (addressDetail === '') {
      Alert.alert('상세주소를 입력해주세요.');
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
      return;
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
        paddingHorizontal: 25,
        paddingTop: 20,
      }}
    >
      <NormalBoldLabel style={styles.boldText} text={'이름'} />
      <View style={styles.inputField}>
        <TextInput
          style={styles.textInputText}
          placeholderTextColor='#AAA'
          placeholder='김남욱'
          autoCapitalize='none'
          onChangeText={(text) => setName(text)}
          value={name}
          textAlign='center'
        />
      </View>

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
          onChangeText={(text) => setPassword(text)}
          value={password}
          textAlign='center'
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

      <View style={{ marginTop: 10 }}>
        <NormalBoldLabel style={styles.boldText} text={'주소'} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            style={styles.postalCode}
            placeholder='우편번호'
            value={postalCode}
          />

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
                setAddress(data.address);
                setPostalCode(data.zonecode);
                setModalOn(false);
              }}
            />
          </Modal>

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
            placeholderTextColor='#AAA'
            placeholder='주소'
            autoCorrect={false}
            value={address}
          />
        </View>
        <View style={styles.inputField}>
          <TextInput
            style={styles.textInputText}
            placeholderTextColor='#AAA'
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
          keyboardType='numeric'
          autoCorrect={false}
          onChangeText={(text) => setPhoneNumber(text)}
          // keyboardType='phone-pad'
          maxLength={8}
          value={phoneNumber}
          textAlign='center'
        />
      </SpaceBetweenContainer>
      <RowContainer
        style={{
          justifyContent: 'space-between',
          marginBottom: 45,
          marginTop: SCREEN_HEIGHT * 0.15,
        }}
      >
        <TouchableOpacity style={styles.signOutBtn} onPress={onDeleteUser}>
          <Text style={styles.signOutBtnText}>계정탈퇴</Text>
        </TouchableOpacity>
        <Touchable onPress={editProfile}>
          <LinearGradient colors={['#8082FF', '#81D1F8']} style={styles.btn}>
            <Text style={styles.saveBtn}>저장</Text>
          </LinearGradient>
        </Touchable>
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
    fontSize: 12,
    lineHeight: 15,
    color: '#555',
  },
  boldText: {
    lineHeight: 20,
    fontSize: 15,
    marginBottom: 5,
  },

  inputField: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
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
    backgroundColor: '#fff',
    marginBottom: 10,
    flex: 1,
    textAlign: 'center',
    marginRight: 11,
    height: 40,
    color: '#000',
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
  pickerInput: {
    width: SCREEN_WIDTH * 0.265,
    height: 40,
    color: '#000',
  },
  restNumberBox: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 40,
    flex: 0.7,
    color: '#000',
    fontSize: 15,
  },
});

export default MemberAccountSetting;
