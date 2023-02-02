import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import RowContainer from '../../../components/containers/RowContainer';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { NormalBoldLabel, NoneLabel } from '../../../components/Label';
import Touchable from '../../../components/buttons/Touchable';
import { NormalLabel } from '../../../components/Label';
import BirthPicker from '../../../components/date/BirthPicker';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import { resetNavigation } from '../../../util';
import GradientButton from '../../../components/buttons/GradientButton';

const AcademicsModify = ({ navigation, route }) => {
  const { content } = route.params;
  const [typicalCheckBox, setTypicalCheckBox] = useState(
    content.isMainEducation
  );
  const [normalCheckBox, setNormalCheckBox] = useState(
    content.isCurrentAttending
  );
  const [isDateEntrtyPickerOpen, setIsDateEntryPickerOpen] = useState(false);
  const [isDateExistPickerOpen, setIsDateExistPickerOpen] = useState(false);
  const [name, setName] = useState(content.name);
  const [degree, setDegree] = useState(content.degree);
  const [major, setMajor] = useState(content.major);
  const [entryDate, setEntryDate] = useState(new Date(content.entryDate));
  const [existDate, setExistDate] = useState(new Date());
  const [description, setDescription] = useState('');

  useEffect(() => {
    content.description && setDescription(content.description);
    content.existDate && setExistDate(new Date(content.existDate));
    normalCheckBox && setExistDate(new Date());
  }, [normalCheckBox]);

  const auth = useSelector((state) => state.auth);
  const { token } = auth;

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

  const SaveAcademic = async () => {
    let entry = moment(entryDate).format('YYYY-MM-DD');
    let exist = new Date();

    if (normalCheckBox === true) {
      exist = null;
    } else {
      exist = moment(existDate).format('YYYY-MM-DD');
      // console.log('날짜 확인', moment(entry).isBefore(exist));
      if (moment(entry).isBefore(exist)) {
      } else {
        Alert.alert('입학,졸업/수료일을 다시 확인 바랍니다.');
        return;
      }
    }

    if (name === '') {
      Alert.alert('학교 명은 필수입니다.');
      return;
    }
    if (degree === '') {
      Alert.alert('학위는 필수입니다.');
      return;
    }
    if (degree === '') {
      Alert.alert('전공명을 작성해 주세요.');
      return;
    }
    if (description === '') {
      Alert.alert('연구 분야 및 논문 설명을 작성해 주세요.');
      return;
    }
    let body = {
      id: content.id,
      type: '학력',
      name: name,
      isMainEducation: typicalCheckBox,
      degree: degree,
      major: major,
      entryDate: entry,
      existDate: exist,
      isCurrentAttending: normalCheckBox,
      description: description,
    };
    try {
      const { data } = await api.patch('teacher-infos', body, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('data', data);
      resetNavigation(navigation, 'TeacherProfileEnroll');
    } catch (e) {
      Alert.alert('서버와 연결에 실패하였습니다.');
      console.log('e', e);
      console.log('e.response', e.response);
    }
  };

  return (
    <View style={{ flex: 1, marginBottom: 25 }}>
      <ScrollView>
        <View style={{ paddingHorizontal: 24 }}>
          <View style={styles.titleInner}>
            <TouchableOpacity
              onPress={() => navigation.navigate('TeacherProfileEnroll')}
            >
              <Image
                style={styles.backActionable}
                source={require('../../../assets/images/membershipprice/arrow.png')}
              />
            </TouchableOpacity>

            <View>
              <Text style={styles.containerName}>학력수정</Text>
            </View>
            <Text></Text>
          </View>

          <View style={{ marginTop: 33 }}>
            <Text style={styles.careerInput}>학교</Text>
            <TextInput
              placeholder={'예) 경기대학교 대체의학대학원'}
              style={styles.inputBox}
              textAlign='center'
              placeholderTextColor={'#aaa'}
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={styles.checkInner}>
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
              대표 학력으로 선정
            </Text>
          </View>

          <RowContainer
            style={{ marginTop: 17, justifyContent: 'space-between' }}
          >
            <View style={{ width: 156 }}>
              <Text style={styles.careerInput}>학위</Text>
              <TextInput
                placeholder={'예) 석사, 학사'}
                style={styles.inputBox}
                textAlign='center'
                placeholderTextColor={'#aaa'}
                value={degree}
                onChangeText={(text) => setDegree(text)}
              />
            </View>
            <View style={{ width: 156 }}>
              <Text style={styles.careerInput}>전공</Text>
              <TextInput
                placeholder={'예) 스포츠재활치료'}
                textAlign='center'
                placeholderTextColor={'#aaa'}
                style={styles.inputBox}
                value={major}
                onChangeText={(text) => setMajor(text)}
              />
            </View>
          </RowContainer>

          <View style={{ marginTop: 17 }}>
            <Text style={styles.careerInput}>입학</Text>

            <View style={styles.birthdayBox}>
              <BirthPicker
                isOpen={isDateEntrtyPickerOpen}
                date={entryDate}
                onConfirm={(selectedDate) => {
                  setIsDateEntryPickerOpen(false);
                  setEntryDate(selectedDate);
                }}
                onCancel={() => setIsDateEntryPickerOpen(false)}
                // minimumDate={new Date()}
                maximumDate={new Date()}
              />

              <Touchable
                onPress={() => setIsDateEntryPickerOpen(true)}
                style={styles.birthdayInputBox}
              >
                <View />
                <NormalLabel
                  text={moment(entryDate).format('YYYY-MM-DD')}
                  style={styles.birthLabel}
                />

                <Image
                  style={{ width: 16, height: 18 }}
                  source={require('../../../assets/icons/date.png')}
                />
              </Touchable>
            </View>
          </View>

          <View style={{ marginTop: 17 }}>
            <Text style={styles.careerInput}>졸업/수료</Text>

            <View style={styles.birthdayBox}>
              <BirthPicker
                isOpen={isDateExistPickerOpen}
                date={existDate}
                onConfirm={(selectedDate) => {
                  setIsDateExistPickerOpen(false);
                  setExistDate(selectedDate);
                }}
                onCancel={() => setIsDateExistPickerOpen(false)}
              />

              <Touchable
                onPress={() => setIsDateExistPickerOpen(true)}
                style={styles.birthdayInputBox}
              >
                <View />
                <NormalLabel
                  text={moment(existDate).format('YYYY-MM-DD')}
                  style={styles.birthLabel}
                />

                <Image
                  style={{ width: 16, height: 18 }}
                  source={require('../../../assets/icons/date.png')}
                />
              </Touchable>
            </View>
          </View>

          <View style={styles.checkInner}>
            <TouchableOpacity
              onPress={() => {
                setNormalCheckBox((normalCheckBox) => !normalCheckBox);
              }}
            >
              <CheckBoxIcon
                normalCheckBox={normalCheckBox}
                focusImage={require('../../../assets/icons/TeacherProfileEnroll/check_focus.png')}
                unFocusImage={require('../../../assets/icons/TeacherProfileEnroll/check_unFocus.png')}
              />
            </TouchableOpacity>
            <Text style={{ paddingLeft: 6, fontWeight: 'bold', color: '#555' }}>
              재학 중
            </Text>
          </View>

          <View style={{ marginTop: 17 }}>
            <Text style={styles.careerInput}>연구 분야 및 논문 설명</Text>
            <TextInput
              placeholder={'예) P.T 및 프로그램 기획 / 팀 관리'}
              textAlign='center'
              placeholderTextColor={'#aaa'}
              style={styles.inputBox}
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
        </View>
      </ScrollView>
      <GradientButton
        style={{ marginHorizontal: 24 }}
        onPress={() => SaveAcademic()}
      >
        <NoneLabel
          text={'저장'}
          style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}
        />
      </GradientButton>
    </View>
  );
};

const styles = StyleSheet.create({
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
  birthdayBox: {
    marginTop: 1,
  },

  titleInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  backActionable: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },

  containerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  careerInput: {
    marginBottom: 5,
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },

  inputBox: {
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E3E5E5',
    backgroundColor: '#fff',
    color: '#000',
  },

  checkInner: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default AcademicsModify;
