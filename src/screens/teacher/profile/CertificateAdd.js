import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderBar from '../../../components/Bar/HeaderBar';
import ImagePicker from 'react-native-image-crop-picker';
import Touchable from '../../../components/buttons/Touchable';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../../../constants/constants';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import { resetNavigation } from '../../../util';
import GradientButton from '../../../components/buttons/GradientButton';
import { NoneLabel } from '../../../components/Label';
import { Container } from '../../../components/containers/Container';

export default function CertificateAdd({ navigation }) {
  const [typicalCheckBox, setTypicalCheckBox] = useState(false);
  // const [mainCertificate, setMainCertificate] = useState(false);
  const [selectImg, setSelectImg] = useState('');
  const [certificateTitle, setCertificateTitle] = useState('');

  const auth = useSelector((state) => state.auth);
  const { token } = auth;

  const addCertificate = () => {
    ImagePicker.openPicker({
      width: 800,
      height: 800,
      mediaType: 'photo',
      cropperToolbarTitle: '이미지 등록',
      compressImageMaxWidth: 800,
      compressImageMaxHeight: 800,
      cropping: true,
    }).then((image) => {
      console.log('image ', image);
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
      setSelectImg(newImage);
    });
  };

  const CheckBoxIcon = ({
    typicalCheckBox,
    normalCheckBox,
    focusImage,
    unFocusImage,
  }) => {
    return (
      <Image
        source={typicalCheckBox || normalCheckBox ? focusImage : unFocusImage}
        style={{ resizeMode: 'contain', width: 17, height: 17 }}
      />
    );
  };

  const SaveCertificate = async () => {
    if (!selectImg || selectImg === null) {
      Alert.alert('자격증은 필수 등록입니다.');
      return;
    }
    if (certificateTitle === '') {
      Alert.alert('자격증명을 입력해주세요.');
      return;
    }
    try {
      let body = new FormData();
      body.append('type', '자격증');
      body.append('name', certificateTitle);
      body.append('isMainCertificate', typicalCheckBox);
      body.append('image', selectImg);

      let { data } = await api.post('teacher-infos', body, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('data', data);
      resetNavigation(navigation, 'TeacherProfileEnroll');
    } catch (e) {
      Alert.alert('서버와의 연결에 실패하였습니다.');
      console.log('err', e);
      console.log('err.response', err.response);
    }
  };
  return (
    <View style={{ flex: 1, marginBottom: 25 }}>
      <Container style={{ flex: 1 }}>
        <HeaderBar style={{ lineHeight: 100 }} text='자격증/수상 추가' />

        <View style={{ padding: 25, backgroundColor: '##FBFBFB' }}>
          <Text style={styles.subTitle2}>자격증/수상 명</Text>

          <TextInput
            placeholder='예)생활체육지도자 1급'
            style={styles.inputText2}
            textAlign='center'
            placeholderTextColor={'#aaa'}
            value={certificateTitle}
            onChangeText={(text) => setCertificateTitle(text)}
          />

          <View style={styles.rowView}>
            <TouchableOpacity
              onPress={() => {
                setTypicalCheckBox((typicalCheckBox) => !typicalCheckBox);
              }}
            >
              <CheckBoxIcon
                typicalCheckBox={typicalCheckBox}
                focusImage={require('../../../assets/icons/TeacherProfileEnroll/check_focus.png')}
                unFocusImage={require('../../../assets/icons/TeacherProfileEnroll/check_unFocus.png')}
              />
            </TouchableOpacity>
            <Text style={{ paddingLeft: 6, fontWeight: 'bold', color: '#555' }}>
              대표 자격증/수상으로 선정
            </Text>
          </View>
          <Text style={styles.subTitle3}>증빙자료</Text>
          <Touchable onPress={() => addCertificate()}>
            {selectImg ? (
              <View style={styles.inputDateBox}>
                {/* <View style={styles.proofImgBox}> */}
                <Image
                  source={{ uri: selectImg.path }}
                  style={styles.proofImgBox}
                  resizeMode='contain'
                />
                {/* </View> */}
              </View>
            ) : (
              <View style={styles.inputDateBox}>
                <View style={styles.proofImgBox}>
                  <Image
                    source={require('../../../assets/images/AddCertificate/Vector.png')}
                    resizeMode='contain'
                  />
                </View>
              </View>
            )}
          </Touchable>
        </View>
      </Container>

      <GradientButton
        style={{ marginHorizontal: 24 }}
        onPress={() => SaveCertificate()}
      >
        <NoneLabel
          text={'저장'}
          style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}
        />
      </GradientButton>
    </View>
  );
}
const styles = StyleSheet.create({
  bottomBtn: {
    left: -15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 160,
  },
  proofImgBox: {
    width: SCREEN_WIDTH * 0.86,
    height: SCREEN_HEIGHT * 0.24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subTitle3: {
    marginTop: 26,
    lineHeight: 17,
    fontSize: 15,
    fontWeight: '700',
    color: 'black',
    right: 0,
  },
  rowView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  inputText2: {
    height: 40,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E3E5E5',
    backgroundColor: '#fff',
    color: '#000',
  },
  inputBox2: {
    borderWidth: 1,
    borderColor: '#E3E5E5',
    marginTop: 10,
    borderRadius: 10,
    color: 'black',
  },
  subTitle2: {
    // fontFamily: 'NanumGothic',
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 17,
    fontSize: 15,
  },
  inputDateBox: {
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: 'rgb(50,50,50)',
    // shadowOpacity: 0.1,
    // shadowRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#171717',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 12,
  },
});
