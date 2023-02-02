import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import RowContainer from '../../components/containers/RowContainer';
import ModalFrame from '../../components/home/ModalFrame';
import { useNavigation } from '@react-navigation/native';
import { NormalLabel, NormalBoldLabel } from '../../components/Label';
import BottomGradientButton from '../../components/buttons/BottomGradientButton';
import api from '../../api/api';
import CenterListModal from '../../components/modal/CenterListModal';
import { PHONE_START_NUMBERS } from '../../constants/constants';

let interval;

const FindIdScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [firstPhoneNumber, setFirstPhoneNumber] = useState('010');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [isVerify, setIsVerify] = useState(null);
  const [findId, setFindId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const countDown = () => {
    let time = 300;
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      time = time - 1;
      setRemaining(time);
      if (interval <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const onRequestVerifyCode = async () => {
    if (id === '') {
      Alert.alert('이름을 입력해주세요.');
      return;
    }
    if (phoneNumber.length < 8) {
      Alert.alert('전화번호를 확인해주세요.');
      return;
    }
    try {
      const { data } = await api.get(
        `sms-send?scope=FIND_ID&name=${id}&phoneNumber=${
          firstPhoneNumber + phoneNumber
        }`
      );
      console.log('data', data);
      Alert.alert(data?.msg);
      countDown();
      setIsVerify(false);
      Keyboard.dismiss();
    } catch (e) {
      // Alert.alert('서버와의 연결에 실패하였습니다.');

      let { data } = e.response;
      console.log('e', e);
      console.log('e.response', e.response);
      Alert.alert(data?.msg);
    }
  };

  const checkVerifyCode = async () => {
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
      let params = { code, phoneNumber: firstPhoneNumber + phoneNumber };
      const { data } = await api.post('sms-send', params);
      console.log('data', data);
      setIsVerify(true);
      Keyboard.dismiss();
      Alert.alert(data?.msg);
      if (interval) {
        clearInterval(interval);
      }
    } catch (e) {
      let { data } = e.response;
      console.log('e', e);
      console.log('e.response', e.response);
      if (!data.ok && data.msg) {
        Alert.alert(data?.msg);
      }
    }
  };

  const onFindId = async () => {
    if (id === '') {
      Alert.alert('이름을 입력해주세요.');
      return;
    }
    if (phoneNumber.length < 8) {
      Alert.alert('전화번호를 확인해주세요.');
      return;
    }
    if (!isVerify) {
      Alert.alert('휴대폰 인증이 필요합니다.');
      return;
    }

    let body = { koreanName: id, phoneNumber: firstPhoneNumber + phoneNumber };
    try {
      const { data } = await api.post('users/findId/', body);
      console.log('data', data?.data);
      setFindId(data?.data);
      setVisible(true);
    } catch (e) {
      console.log('e', e);
      console.log('e.response', e.response);
    }
  };

  return (
    <View style={styles.rootContainer}>
      <GoLoginModal visible={visible} id={findId} />
      <NormalLabel
        style={styles.content}
        text={
          '아이디찾기를 위해서\n가입 시 등록하신 아이디와 휴대폰 번호를 통해 인증이 필요합니다.'
        }
      />
      <NormalBoldLabel text={'이름'} style={styles.title} />
      <View style={styles.idTextInputContainer}>
        <TextInput
          value={id}
          onChangeText={(text) => setId(text)}
          placeholder={'김빠소'}
          placeholderTextColor={'#aaa'}
          autoCapitalize='none'
          style={styles.idText}
        />
      </View>
      <NormalBoldLabel text={'전화번호'} style={styles.title} />
      <RowContainer>
        <CenterListModal
          containerStyle={styles.pickerBox}
          list={PHONE_START_NUMBERS}
          selectedItem={firstPhoneNumber}
          itemName={'name'}
          onPress={() => setIsModalOpen(true)}
          visible={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onSelect={(obj) => setFirstPhoneNumber(obj.name)}
        />
        <TextInput
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          style={styles.phoneText}
          keyboardType='numeric'
          autoCorrect={false}
          textAlign='center'
        />
      </RowContainer>
      <TouchableOpacity
        style={styles.btn1}
        onPress={() => onRequestVerifyCode()}
      >
        <NormalBoldLabel style={styles.numRequest} text={'인증번호 요청'} />
      </TouchableOpacity>

      <RowContainer>
        <View
          style={[styles.idTextInputContainer, { marginBottom: 0, flex: 1 }]}
        >
          <TextInput
            value={code}
            onChangeText={(text) => setCode(text)}
            placeholder={'인증번호 입력'}
            placeholderTextColor={'#aaa'}
            style={styles.idText}
            textAlign='center'
          />
        </View>
        <TouchableOpacity style={styles.btn2} onPress={() => checkVerifyCode()}>
          <NormalBoldLabel style={styles.numRequest} text={'확인'} />
        </TouchableOpacity>
      </RowContainer>
      {/*<Text style={styles.alertText}>인증번호가 일치하지 않습니다.</Text>*/}

      <View style={{ flex: 1 }} />
      <RowContainer
        style={{
          // height: window_height * 0.38,
          flex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.bottomBtn, { backgroundColor: '#aaa' }]}
        >
          <NormalBoldLabel style={styles.bottomBtnText} text={'취소'} />
        </TouchableOpacity>
        <View style={{ width: 17 }} />

        <BottomGradientButton
          style={{ flex: 1 }}
          outerStyle={{ paddingVertical: 0, height: 52 }}
          onPress={() => {
            onFindId();
            // visible === false ? setVisible(true) : setVisible(false);
          }}
        >
          <NormalBoldLabel style={styles.bottomBtnText} text={'확인'} />
        </BottomGradientButton>
      </RowContainer>
    </View>
  );
};

export default FindIdScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#fbfbfb',
  },
  content: {
    marginTop: 29,
    marginBottom: 25,
    fontSize: 15,
    lineHeight: 17,
    color: '#555',
  },
  title: {
    fontSize: 15,
    lineHeight: 19,
    marginBottom: 5,
  },
  phoneText: {
    borderColor: '#E3E5E5',
    backgroundColor: '#fff',
    height: 40,
    flex: 0.7,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    color: '#000',
  },
  pickerBox: {
    borderWidth: 1,
    borderRadius: 10,
    width: 79,
    flex: 0.3,
    height: 40,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#E3E5E5',
    marginRight: 7,
  },
  idTextInputContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E5E5',
    backgroundColor: '#fff',
    marginBottom: 11,
    height: 40,
    // flex: 1,
    // paddingVertical: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#000',
  },
  btn1: {
    backgroundColor: '#8082FF',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  btn2: {
    backgroundColor: '#8082FF',
    height: 40,
    paddingHorizontal: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    // marginVertical: 8,
    // width: 106,
  },
  allowNum: {
    borderColor: '#E3E5E5',
    backgroundColor: '#fff',
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 7,
  },
  numRequest: { color: '#fff', fontSize: 18, lineHeight: 22 },
  alertText: { color: 'red', fontSize: 10, marginLeft: 10 },
  saveBtn: {
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 15,
    color: '#fff',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: 'bold',
  },
  bottomBtn: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    flex: 1,
  },
  bottomBtnText: {
    // width: 155,
    borderRadius: 15,
    color: '#fff',
    fontSize: 20,
    lineHeight: 24,
  },
});

const GoLoginModal = ({ visible, id }) => {
  const navigation = useNavigation();

  return (
    <ModalFrame visible={visible}>
      {/*<ColumnView style={modalStyle.contentPosition}>*/}
      <Text style={modalStyle.topText}>
        회원님의 가입시{'\n'}아이디는{' '}
        <Text style={{ color: '#8082FF' }}>{id}</Text> 입니다.
      </Text>
      {/*<Text style={modalStyle.content}>등록된 이메일로</Text>*/}
      {/*<Text style={modalStyle.content}>*/}
      {/*  임시 비밀번호가 전송되었습니다.*/}
      {/*</Text>*/}
      <TouchableOpacity
        style={modalStyle.modalbtn}
        onPress={() => navigation.navigate('Login')}
      >
        <NormalBoldLabel
          style={modalStyle.modalText}
          text={'로그인 하러 가기'}
        />
      </TouchableOpacity>
      {/*</ColumnView>*/}
    </ModalFrame>
  );
};

const modalStyle = StyleSheet.create({
  contentPosition: {
    flex: 1,
    // justifyContent: 'center'
    // justifyContent: 'space-around'
  },
  modalbtn: {
    marginTop: 34,
    backgroundColor: '#8082FF',
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // marginHorizontal: 14,
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 22,
  },
  topText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#000',
    textAlign: 'center',
  },
});
