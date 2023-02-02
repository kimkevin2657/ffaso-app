import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';
import RowContainer from '../../components/containers/RowContainer';
import Touchable from '../../components/buttons/Touchable';
import { isIos, SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants/constants';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderBar from '../../components/Bar/HeaderBar';

import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../redux/authSlice';
import AntDesign from 'react-native-vector-icons/AntDesign';

const TeacherMyPageScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [textValue, setTextValue] = useState('');
  const [nameChange, setNameChange] = useState('');
  const [profileImg, setProfileImg] = useState(user?.profileImage ?? null);

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

  const editProfile = () => {
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
    if (profileImg?.path) {
      body.append('profileImage', profileImg);
    }
    dispatch(updateUserInfo(body));
  };

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
      console.log('image image', image);
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
      setProfileImg(newImage);
    });
  };

  return (
    <ScrollView style={styles.container}>
      {/*<HeaderBar*/}
      {/*  text={'마이페이지'}*/}
      {/*  rightText={'프로필수정'}*/}
      {/*  onPress={editProfile}*/}
      {/*  rightTextStyle={{ color: '#555', fontSize: 12, lineHeight: 16 }}*/}
      {/*/>*/}
      <View
        style={{
          marginHorizontal: 24,
          marginBottom: SCREEN_HEIGHT * 0.13,
        }}
      >
        <View style={{ justifyContent: 'center', marginTop: 5 }}>
          {/* <ImageBackground
            source={require('../../assets/images/mypage/MyPagePofile.png')}
            resizeMode={'contain'}
            style={styles.emptyBox1}
          > */}

          {profileImg ? (
            <Touchable onPress={() => addImage()}>
              <View style={styles.profileElevationBox}>
                <Image
                  source={{
                    uri: profileImg?.path
                      ? profileImg?.path
                      : user?.profileImage,
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
            <Touchable onPress={() => addImage()}>
              <View style={styles.topWhiteContainer}>
                <Image
                  source={require('../../assets/images/mypage/MyPagePofile.png')}
                  style={{
                    width: 50,
                    height: 57,
                    marginTop: 56,
                  }}
                />
              </View>
            </Touchable>
          )}

          {/*    : require('../../assets/images/mypage/MyPagePofile.png') */}

          {/*<View style={styles.qrStyle}>*/}
          {/*  <QRCode value={qrValue} logo={{ uri: base64Logo }} size={135} />*/}
          {/*</View>*/}

          <View style={styles.nameBox}>
            <Text></Text>

            <RowContainer>
              <TextInput
                style={styles.boldText}
                value={nameChange}
                // autoFocus={true}
                onChangeText={(text) => setNameChange(text)}
                // onSubmitEditing={() => setNameChange(!nameChange)}
                placeholder='홍길동'
                textAlign='center'
              />
              {/*<Image*/}
              {/*  source={require('../../assets/icons/mypage/level.png')}*/}
              {/*  style={{ marginLeft: 8 }}*/}
              {/*/>*/}
            </RowContainer>

            {/* <Text style={styles.boldText}>
            김남욱{'  '}
            <Image source={require('../../icons/mypage/level.png')} />
          </Text> */}

            <Image
              source={require('../../assets/icons/mypage/grayPencil.png')}
              style={{ width: 20, height: 20 }}
            />
          </View>
          <View style={styles.belowName}>
            <Text></Text>
            {/* <Text>본인의 신조 or 회원에게 하고 싶은 말</Text> */}
            <View style={{ height: 40, justifyContent: 'center' }}>
              <TextInput
                // ref={focusClicked}
                style={styles.inputStyle}
                value={textValue}
                onChangeText={(text) => setTextValue(text)}
                // onSubmitEditing={() => setFocusText(!focusText)}
                blurOnSubmit={true}
                multiline={true}
                placeholder='본인의 신조 or 회원에게 하고 싶은 말'
                textAlign='center'
                placeholderTextColor={'#555'}
                // pointerEvents="none"
              />
            </View>

            <Image
              source={require('../../assets/icons/mypage/grayPencil.png')}
              style={{ width: 20, height: 20 }}
            />
          </View>
        </View>
        <NormalBoldLabel text={'급여정보'} style={{ marginTop: 31 }} />
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SalesHistory')}
            style={styles.itemBox}
          >
            <RowContainer
              style={{
                justifyContent: 'space-between',
                marginTop: 16,
              }}
            >
              <RowContainer>
                <View style={{ width: 25 }}>
                  <Image
                    source={require('../../assets/icons/mypage/card.png')}
                    style={{ width: 25, height: 20 }}
                  />
                </View>
                <Text style={styles.grayBold}>매출 내역</Text>
              </RowContainer>

              <Text style={styles.lightgrayText}>총 매출 내역(실시간)</Text>
            </RowContainer>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PaySpecs')}
            style={styles.itemBox}
          >
            <RowContainer style={styles.itemBoxIndexOther}>
              <RowContainer>
                <View style={{ width: 25 }}>
                  <Image
                    source={require('../../assets/icons/mypage/coupon.png')}
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <Text style={styles.grayBold}>급여 명세서</Text>
              </RowContainer>

              <Text style={styles.lightgrayText}>급여 내역(실시간)</Text>
            </RowContainer>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('준비중입니다.')}
            style={styles.itemBox}
          >
            <RowContainer style={styles.itemBoxIndexOther}>
              <RowContainer>
                <View style={{ width: 25 }}>
                  <Image
                    source={require('../../assets/icons/mypage/coupon.png')}
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <Text style={styles.grayBold}>
                  {user?.bankName && user?.bankOwnerName
                    ? `${user.bankName}(예금주 : ${user?.bankOwnerName})`
                    : '은행 정보가 없습니다.'}
                </Text>
              </RowContainer>

              <Text style={styles.lightgrayText}>
                {user?.accountNumber ?? ''}
              </Text>
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
          onPress={() => navigation.navigate('TeacherAccountSetting')}
          style={styles.itemBox}
        >
          <RowContainer
            style={{
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            <RowContainer>
              <View style={{ width: 25 }}>
                <Image
                  source={require('../../assets/icons/mypage/accounts.png')}
                  style={{ width: 25, height: 17 }}
                />
              </View>
              <Text style={styles.grayBold}>계정</Text>
            </RowContainer>

            <Text style={styles.lightgrayText}>개인정보 </Text>
          </RowContainer>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('TeacherNotifications')}
          style={styles.itemBox}
        >
          <RowContainer style={styles.itemBoxIndexOther}>
            <RowContainer>
              <View style={{ width: 25 }}>
                <Image
                  source={require('../../assets/icons/mypage/alarm.png')}
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
          style={{
            width: '100%',
            borderBottomWidth: 1,
            paddingBottom: 6,
            borderBottomColor: '#E3E5E5',
          }}
        >
          <RowContainer
            style={{
              justifyContent: 'space-between',
              marginTop: 16,
            }}
          >
            <RowContainer>
              <View style={{ width: 25 }}>
                <Image
                  source={require('../../assets/icons/mypage/accounts.png')}
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
          style={{
            width: '100%',
            borderBottomWidth: 1,
            paddingBottom: 8,
            borderBottomColor: '#E3E5E5',
          }}
        >
          <RowContainer style={styles.itemBoxIndexOther}>
            <RowContainer>
              <View style={{ width: 25 }}>
                <Image
                  source={require('../../assets/icons/mypage/pencil.png')}
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
              source={require('../../assets/icons/mypage/accounts.png')}
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
  itemBoxIndexOther: {
    justifyContent: 'space-between',
    marginTop: 6,
  },
  itemBox: {
    width: '100%',
    borderBottomWidth: 1,
    paddingBottom: 11,
    borderBottomColor: '#E3E5E5',
  },
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  topWhiteContainer: {
    // justifyContent: 'center',
    backgroundColor: '#fff',

    alignItems: 'center',
    borderRadius: 10,
    height: 200,
    minWidth: 327,
    elevation: 3,
  },
  topWhiteContainer2: {
    backgroundColor: '#fff',
    // justifyContent: 'center',
    borderRadius: 10,

    alignItems: 'center',
    elevation: 3,
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
    color: 'gray',
    fontSize: 12,
    lineHeight: 20,
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
    // marginTop: 130, padding: 4, backgroundColor: '#fff', elevation: 3
    alignSelf: 'center',
    marginTop: -69,
    borderWidth: 1,
    width: 163,
    padding: 13.5,
  },
  boldText: {
    fontSize: 18,
    fontWeight: '800',
    color: 'black',
    padding: 0,
    margin: 0,
  },
  nameBox: {
    flexDirection: 'row',
    borderBottomWidth: 1.6,
    borderColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 29,
    paddingBottom: 12,
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
});

export default TeacherMyPageScreen;
