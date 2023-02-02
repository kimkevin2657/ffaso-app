import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {
  NormalBoldLabel,
  NormalBoldLabel12,
  NormalLabel,
} from '../../../components/Label';
import RowContainer from '../../../components/containers/RowContainer';
import Touchable from '../../../components/buttons/Touchable';
import ImagePicker from 'react-native-image-crop-picker';
import {
  isIos,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../../constants/constants';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../../redux/authSlice';
import HeaderBar from '../../../components/Bar/HeaderBar';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';

const MemberMyPageScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [textValue, setTextValue] = useState('');
  const [nameChange, setNameChange] = useState('');
  const [qrValue, setQrValue] = useState(user?.userNumber?.toString());
  const [profileImage, setprofileImage] = useState(user?.profileImage ?? null);
  const [qrZoomOpen, setQrZoomOpen] = useState(false);
  let base64Logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAA..';

  useEffect(() => {
    setNameChange(user?.koreanName);
    if (textValue === '') {
      setTextValue(user?.memo || '');
    }
    // return () => {
    //   setTextValue('');
    //   setNameChange('');
    // };
  }, [user]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Touchable onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <AntDesign
            name='left'
            size={22}
            color={'#555'}
            style={{ padding: 4, alignSelf: 'center' }}
          />
        </Touchable>
      ),
      headerRight: () => (
        <Touchable onPress={editProfile} style={{ padding: 4, marginRight: 8 }}>
          <NormalLabel
            style={{ color: '#555', fontSize: 12, lineHeight: 16 }}
            text={'프로필수정'}
          />
        </Touchable>
      ),
    });
  }, []);

  const onClickQRCode = useCallback(() => {
    setQrZoomOpen(true);
  }, []);

  const editProfile = useCallback(() => {
    let body = new FormData();
    let koreanName = '';
    setNameChange((prev) => {
      koreanName = prev;

      return prev;
    });

    if (koreanName === '') {
      Alert.alert('이름은 필수입니다.');
      return;
    }
    body.append('koreanName', koreanName);

    if (textValue !== '') {
      body.append('memo', textValue);
    }

    if (profileImage?.path) {
      body.append('profileImage', profileImage);
    }

    dispatch(updateUserInfo(body));
  }, [nameChange, textValue, profileImage]);

  const addImage = () => {
    ImagePicker.openPicker({
      width: 800,
      height: 800,
      mediaType: 'any',
      cropperToolbarTitle: '이미지 등록',
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 800,
      cropping: true,
    }).then((image) => {
      let imageType = `image/${
        image.path.split('.')[Platform.OS === 'ios' ? 1 : 2]
      }`;
      let newImage = {
        ...image,
        uri: image.path,
        name: `image_${new Date()}.${
          image.path.split('.')[Platform.OS === 'ios' ? 1 : 2] || 'jpg'
        }`,
        type: imageType,
      };
      setprofileImage(newImage);
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: SCREEN_HEIGHT * 0.13,
        backgroundColor: '#fbfbfb',
      }}
    >
      {qrZoomOpen && (
        <Modal
          visible={qrZoomOpen}
          onRequestClose={() => {
            setQrZoomOpen(false);
          }}
        >
          <TouchableWithoutFeedback onPress={() => setQrZoomOpen(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.modalQR}>
              <QRCode
                value={qrValue}
                logo={{ uri: base64Logo }}
                size={SCREEN_WIDTH - 96 - 50 - 24}
              />
            </View>
            <Touchable
              style={styles.closeButton}
              onPress={() => setQrZoomOpen(false)}
            >
              <NormalBoldLabel12
                text={'닫기'}
                style={{ color: '#000000', fontWeight: '400' }}
              />
            </Touchable>
          </View>
        </Modal>
      )}
      <View style={styles.container}>
        {profileImage ? (
          <Touchable onPress={addImage}>
            <View style={styles.profileElevationBox}>
              <Image
                source={{
                  uri: profileImage?.path ? profileImage?.path : profileImage,
                }}
                style={{
                  height: SCREEN_WIDTH * 0.54,
                  width: SCREEN_WIDTH - 48,
                  alignSelf: 'center',
                  borderRadius: 10,
                }}
              />
            </View>
          </Touchable>
        ) : (
          <Touchable onPress={addImage}>
            <View style={styles.topWhiteContainer}>
              <Image
                source={require('../../../assets/images/mypage/MyPagePofile.png')}
                style={{ width: 50, height: 57 }}
              />
            </View>
          </Touchable>
        )}

        <Touchable style={styles.qrStyle} onPress={onClickQRCode}>
          <QRCode
            value={qrValue}
            logo={{ uri: base64Logo }}
            // logoSize={30}
            size={SCREEN_WIDTH * 0.33}
          />
        </Touchable>

        <RowContainer style={styles.nameBox}>
          <View />
          <TextInput
            style={styles.boldText}
            value={nameChange}
            // value={nameChange !== '' ? nameChange : user?.koreanName}
            // autoFocus={true}
            onChangeText={(text) => setNameChange(text)}
            // onSubmitEditing={() => setNameChange(!nameChange)}
            placeholder='홍길동'
            textAlign='center'
          />
          <Image
            source={require('../../../assets/icons/mypage/grayPencil.png')}
            style={{ width: 20, height: 20 }}
          />
        </RowContainer>
        <View style={styles.belowName}>
          <View />
          <View style={{ height: 40, justifyContent: 'center' }}>
            <TextInput
              // ref={focusClicked}
              style={styles.inputStyle}
              value={textValue}
              onChangeText={(text) => setTextValue(text)}
              // onSubmitEditing={() => setFocusText(!focusText)}
              blurOnSubmit={true}
              multiline={true}
              placeholder='운동 목표 내용'
              textAlign='center'
              placeholderTextColor={'#555'}
              // pointerEvents="none"
            />
          </View>
          <Image
            source={require('../../../assets/icons/mypage/grayPencil.png')}
            style={{ width: 20, height: 20 }}
          />
        </View>

        <NormalBoldLabel text={'거래정보'} style={{ marginTop: 31 }} />

        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyPayment')}
            style={{ width: '100%' }}
          >
            <RowContainer style={styles.itemBox}>
              <RowContainer>
                <View style={{ width: 25 }}>
                  <Image
                    source={require('../../../assets/icons/mypage/card.png')}
                    style={{ width: 25, height: 20 }}
                  />
                </View>
                <Text style={styles.grayBold}>결제 및 환불 내역</Text>
              </RowContainer>

              <Text style={styles.lightgrayText}>결제/환불/사용 로그</Text>
            </RowContainer>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Coupons')}
            style={{ width: '100%' }}
          >
            <RowContainer style={styles.itemBox2}>
              <RowContainer>
                <View style={{ width: 25 }}>
                  <Image
                    source={require('../../../assets/icons/mypage/coupon.png')}
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <Text style={styles.grayBold}>쿠폰 & 프로모션</Text>
              </RowContainer>
              <Text style={styles.lightgrayText}>소유한 쿠폰/프로모션</Text>
            </RowContainer>
          </TouchableOpacity>
        </View>
        <View
          style={{
            alignItems: 'flex-start',
            marginTop: 20,
          }}
        >
          <NormalBoldLabel text={'설정'} />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('AccountSetting')}
          style={{ width: '100%' }}
        >
          <RowContainer style={styles.itemBox}>
            <RowContainer>
              <View style={{ width: 25 }}>
                <Image
                  source={require('../../../assets/icons/mypage/accounts.png')}
                  style={{ width: 25, height: 17 }}
                />
              </View>
              <Text style={styles.grayBold}>계정</Text>
            </RowContainer>

            <Text style={styles.lightgrayText}>개인정보 </Text>
          </RowContainer>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={{ width: '100%' }}
        >
          <RowContainer style={styles.itemBox2}>
            <RowContainer>
              <View style={{ width: 25 }}>
                <Image
                  source={require('../../../assets/icons/mypage/alarm.png')}
                  style={{ width: 20, height: 22 }}
                />
              </View>
              <Text style={styles.grayBold}>알림</Text>
            </RowContainer>

            <Text style={styles.lightgrayText}>알림 설정</Text>
          </RowContainer>
        </TouchableOpacity>

        <NormalBoldLabel text={'빠소'} style={{ marginTop: 21 }} />

        <TouchableOpacity
          onPress={() => Alert.alert('준비중입니다.')}
          style={{ width: '100%' }}
        >
          <RowContainer style={styles.itemBox}>
            <RowContainer>
              <View style={{ width: 25 }}>
                <Image
                  source={require('../../../assets/icons/mypage/accounts.png')}
                  style={{ width: 25, height: 17 }}
                />
              </View>
              {/*<Text style={styles.grayBold}>친구초대 (3 / 20)</Text>*/}
              <Text style={styles.grayBold}>친구초대</Text>
            </RowContainer>

            {/*<Text style={styles.lightgrayText}>*/}
            {/*  친구&가족 소개시 쿠폰 증정{'\n'} (20명 초대해서 3명 가입)*/}
            {/*</Text>*/}
          </RowContainer>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('준비중입니다.')}
          style={{ width: '100%' }}
        >
          <RowContainer style={styles.itemBox2}>
            <RowContainer>
              <View style={{ width: 25 }}>
                <Image
                  source={require('../../../assets/icons/mypage/pencil.png')}
                  style={{ width: 20, height: 20 }}
                />
              </View>
              <Text style={styles.grayBold}>앱 리뷰</Text>
            </RowContainer>

            {/*<Text style={styles.lightgrayText}>앱 리뷰 작성 시 쿠폰 증정</Text>*/}
          </RowContainer>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('CeoInfo')}>
          <RowContainer style={{ ...styles.itemBox, justifyContent: null }}>
            <Image
              source={require('../../../assets/icons/mypage/accounts.png')}
              style={{ width: 25, height: 17 }}
            />
            <Text style={styles.grayBold}>사업자정보</Text>
          </RowContainer>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileElevationBox: {
    elevation: 3,
    borderWidth: 1,
    borderColor: '#c4c4c4',
    borderRadius: 10,
  },
  itemBox2: {
    justifyContent: 'space-between',
    marginTop: 6,
    borderBottomWidth: 1,
    paddingBottom: 6,
    borderBottomColor: '#E3E5E5',
  },
  itemBox: {
    justifyContent: 'space-between',
    marginTop: 16,
    borderBottomWidth: 1,
    paddingBottom: 9,
    borderBottomColor: '#E3E5E5',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 27,
    backgroundColor: '#fbfbfb',
  },
  topWhiteContainer: {
    backgroundColor: '#fff',
    // justifyContent: 'center',
    paddingTop: 56,
    alignItems: 'center',
    borderRadius: 10,
    height: 200,
    elevation: 3,
  },
  emptyBox1: {
    // width: window_width * 0.9,
    // height: window_height * 0.3,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    elevation: 7,
    // marginBottom: 40,
  },
  qrStyle: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginTop: -65,
    // marginTop: 140,
    // padding: 4,
    // backgroundColor: '#fff',
    // elevation: 3,
    // borderColor: '',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: -(SCREEN_WIDTH * 0.36) / 2,
    borderWidth: 1,
    width: SCREEN_WIDTH * 0.36,
    height: SCREEN_WIDTH * 0.36,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActionable: {
    width: 7,
    height: 14,
    marginLeft: 24.5,
  },
  inputStyle: {
    margin: 0,
    padding: 0,
    marginTop: isIos ? -4 : 0,
    color: '#000',
  },
  inputText: {
    height: 38,
    lineHeight: 30,
  },
  grayText: {
    color: '#555',
    fontSize: 12,
    lineHeight: 16,
  },

  boldText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'black',
    padding: 0,
    margin: 0,
  },
  nameBox: {
    marginTop: 27,
    borderBottomWidth: 1,
    borderColor: '#c4c4c4',
    justifyContent: 'space-between',
    paddingBottom: 12,
    // width: '100%',
    // marginTop: 96,
  },
  belowName: {
    borderBottomWidth: 1.6,
    borderColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingBottom: 5,
    // marginTop: 5,
    width: '100%',
  },
  belowSection: {
    borderBottomWidth: 1.6,
    borderColor: 'lightgray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 5,
    marginTop: 5,
    width: 327,
    backgroundColor: 'yellow',
  },
  grayBold: {
    fontWeight: '600',
    color: '#555555',
    marginLeft: 10,
  },
  lightgrayText: {
    color: 'gray',
    fontSize: 12,
  },
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: -20,
    marginVertical: -20,
  },
  closeButton: {
    borderWidth: 1,
    borderColor: '#E3E5E5',
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 24,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 24,
    paddingHorizontal: 35,
    borderRadius: 10,
  },
  modalQR: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 25,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginHorizontal: -21,
    marginVertical: -21,
  },
});

export default MemberMyPageScreen;
