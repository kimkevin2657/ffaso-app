import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import RowContainer from '../../components/containers/RowContainer';
import {
  NormalBoldLabel,
  NormalBoldLabel12,
  NormalBoldLabel14,
  NormalLabel,
} from '../../components/Label';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Touchable from '../../components/buttons/Touchable';
import { LabelInput } from '../../components/input/Input';
import BottomGradientButton from '../../components/buttons/BottomGradientButton';
import { RadioButton } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';
import api from '../../api/api';
import { useSelector, useDispatch } from 'react-redux';
import { resetNavigation } from '../../util';
import { getGyms } from '../../redux/gymSlice';
import { Container } from '../../components/containers/Container';
import { SCREEN_WIDTH } from '../../constants/constants';
import RadioButtons from '../../components/RadioButtonCustom/RadioButton';
import { Wrapper } from '../../components/containers/Wrapper';

const MODAL_MAP = [
  { id: 1, title: '센터' },
  { id: 2, title: '서비스' },
  { id: 3, title: '강사' },
  { id: 4, title: '기타' },
  { id: 5, title: '컴플레인' },
];

const CenterReviewWriting = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [checked, setChecked] = React.useState('카테고리 선택');
  const [isVisible, setIsVisible] = useState(false);
  const [selectScore, setSelectScore] = useState(0);
  const [image, setImage] = useState('');

  const auth = useSelector((state) => state.auth);
  const { token } = auth;

  const { gym } = route?.params;

  useEffect(() => {
    navigation.setOptions({ title: `${gym?.name}` }, []);
  }, []);
  const addImg = () => {
    ImagePicker.openPicker({
      width: 600,
      height: 600,
      mediaType: 'any',
      cropperToolbarTitle: '이미지 등록',
      compressImageMaxWidth: 600,
      compressImageMaxHeight: 600,
    }).then((image) => {
      console.log('image', image);
      let imageType =
        //`image/${{jpg: 'jpeg', jpeg: 'jpeg', png: 'png'}[image.path.split('.')[1]]}`
        `image/${image.path.split('.')[Platform.OS === 'ios' ? 1 : 2]}`;

      let newImage = {
        ...image,
        uri: image.path,
        name: `image_${new Date()}.${
          image.path.split('.')[Platform.OS === 'ios' ? 1 : 2] || 'jpg'
        }`,
        type: imageType,
      };
      setImage(newImage);
    });
  };

  const onEnrollReview = async () => {
    if (text === '' || checked === '카테고리 선택') {
      Alert.alert('리뷰 항목들을 선택해주세요.');
      return;
    }

    if (selectScore === 0) {
      Alert.alert('사용자 평점을 선택해주세요.');
      return;
    }
    try {
      let body = new FormData();
      body.append('gym', gym.id);
      body.append('score', selectScore);
      body.append('category', checked);
      body.append('content', text);
      if (image) {
        body.append('image', image);
      }

      let { data } = await api.post('gym-reviews/', body, {
        headers: { Authorization: `Token ${token}` },
      });
      dispatch(getGyms(null, null));
      resetNavigation(navigation, 'MemberMain');
      navigation.navigate('Review', { gym });
      console.log('api res: ', data);
    } catch (err) {
      console.log('err', err);
      console.log('err.response', err.response);
    }
  };

  return (
    <Container>
      <Modal visible={isVisible} transparent>
        <Wrapper style={styles.transparentBox}>
          <View style={styles.modalContainer}>
            <NormalBoldLabel
              text={'리뷰 종목'}
              style={{ fontSize: 15, marginLeft: 24, marginVertical: 14 }}
            />
            <View style={styles.radioContainer}>
              {MODAL_MAP.map((menu, index) => (
                <RowContainer
                  key={menu?.id}
                  style={{
                    marginLeft: 25,
                    marginBottom: 25,
                  }}
                >
                  <RadioButtons
                    color='#8082FF'
                    value={index}
                    status={checked === menu.title ? 'checked' : 'unchecked'}
                    onPress={() => setChecked(menu.title)}
                  />
                  <NormalBoldLabel14 text={menu.title} />
                </RowContainer>
              ))}
            </View>
            <RowContainer
              style={{
                justifyContent: 'flex-end',
                alignContent: 'center',
                marginRight: 18,
                paddingVertical: 16.5,
              }}
            >
              <Touchable onPress={() => setIsVisible(false)}>
                <NormalBoldLabel text={'취소'} style={{ fontWeight: '400' }} />
              </Touchable>
              <Touchable
                onPress={() => {
                  if (checked === '' || checked === '카테고리 선택') {
                    Alert.alert('리뷰 종목을 선택해주세요.');
                    return;
                  }
                  setIsVisible(false);
                }}
              >
                <NormalBoldLabel
                  text={'선택'}
                  style={{ marginLeft: 27, color: '#8082FF' }}
                />
              </Touchable>
            </RowContainer>
          </View>
        </Wrapper>
      </Modal>

      <ScrollView>
        <RowContainer style={styles.topRowContainer}>
          <Touchable onPress={() => addImg()}>
            <Image
              style={styles.centerReviewImg}
              source={
                image === ''
                  ? require('../../assets/images/ceterReviewWritingImg.png')
                  : { uri: image.path }
              }
            />
          </Touchable>
          <View style={styles.scoreBox}>
            <NormalBoldLabel12 text={'사용자 평점'} style={styles.scoreText1} />
            <NormalLabel text={selectScore} style={styles.scoreText} />
            <RowContainer>
              {[1, 2, 3, 4, 5].map((score, index) => (
                <Touchable key={index} onPress={() => setSelectScore(score)}>
                  <AntDesign
                    key={index}
                    name={'star'}
                    size={20}
                    color={selectScore >= score ? '#F2DA00' : '#dadada'}
                    style={styles.stars}
                  />
                </Touchable>
              ))}
            </RowContainer>
          </View>
        </RowContainer>

        <View style={styles.middleContainer}>
          <NormalBoldLabel12 text={'리뷰 종목'} style={styles.scoreText1} />
          <Touchable
            style={styles.selectCategory}
            onPress={() => {
              setIsVisible(true);
            }}
          >
            <NormalBoldLabel
              text={checked}
              style={{
                ...styles.categoryText,
                color: checked === '카테고리 선택' ? '#AAA' : '#8082FF',
              }}
            />
          </Touchable>
          <NormalBoldLabel12 text={'리뷰 내용'} style={styles.scoreText2} />
          <LabelInput
            style={styles.input}
            onChangeText={(text) => {
              setText(text);
            }}
          />
          <RowContainer
            style={{
              marginTop: 60,
              flex: 1,
              marginBottom: 26,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.bottomBtn}
            >
              <NormalBoldLabel style={styles.bottomBtnText} text={'취소'} />
            </TouchableOpacity>
            <BottomGradientButton
              outerStyle={{ paddingVertical: 0, height: 52 }}
              style={{ flex: 1 }}
              onPress={onEnrollReview}
            >
              <NormalBoldLabel style={styles.bottomBtnText} text={'등록'} />
            </BottomGradientButton>
          </RowContainer>
        </View>
      </ScrollView>
    </Container>
  );
};

export default CenterReviewWriting;

const styles = StyleSheet.create({
  radioContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E3E5E5',
    paddingTop: 12,
  },
  modalContainer: {
    backgroundColor: 'white',
    width: SCREEN_WIDTH - 48,
    // minWidth: width * 0.866,
    borderRadius: 10,
  },
  transparentBox: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  bottomBtn: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    flex: 1,
    marginRight: 17,
    backgroundColor: '#aaa',
  },
  bottomBtnText: {
    // width: 155,
    borderRadius: 15,
    color: '#fff',
    fontSize: 20,
    lineHeight: 24,
  },
  topRowContainer: {
    justifyContent: 'space-between',
    // alignItems: 'flex-end',
    marginRight: 41,
    marginLeft: 37,
    paddingTop: 23,
  },
  centerReviewImg: {
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: '#E3E5E5',
    borderRadius: 20,
  },
  scoreBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: { fontSize: 48, lineHeight: 52, fontWeight: '800' },
  scoreText1: { color: '#555555', marginBottom: 10 },
  scoreText2: { color: '#555555', marginBottom: 5 },
  stars: { marginRight: 5, marginTop: 16, marginBottom: 5 },
  middleContainer: {
    marginHorizontal: 24,
    marginTop: 37,
  },
  selectCategory: {
    width: 156,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E5E5',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  categoryText: {
    textAlign: 'center',
  },
  input: {
    height: 300,
    paddingHorizontal: 19,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E3E5E5',
    color: '#000',
    backgroundColor: '#fff',
  },
});
