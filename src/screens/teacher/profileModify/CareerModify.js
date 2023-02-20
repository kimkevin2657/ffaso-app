import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import RowContainer from '../../../components/containers/RowContainer';
import BirthPicker from '../../../components/date/BirthPicker';
import moment from 'moment';
import { NormalBoldLabel, NoneLabel } from '../../../components/Label';
import Touchable from '../../../components/buttons/Touchable';
import { NormalLabel } from '../../../components/Label';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import { resetNavigation } from '../../../util';
import GradientButton from '../../../components/buttons/GradientButton';

const CareerModify = ({ navigation, route }) => {
  const { content } = route.params;

  const [typicalCheckBox, setTypicalCheckBox] = useState(content.isMainCareer);
  const [normalCheckBox, setNormalCheckBox] = useState(
    content.isCurrentWorking
  );
  const [birthDate, setBirthDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [name, setName] = useState(content.name);
  const [department, setDepartment] = useState(content.department);
  const [rank, setRank] = useState(content.rank);
  const [description, setDescription] = useState('');
  const [entryDate, setEntryDate] = useState(new Date(content.entryDate));
  const [existDate, setExistDate] = useState(new Date());
  const [isEntryPickerOpen, setIsEntryPickerOpen] = useState(false);
  const [isExistPickerOpen, setIsExistPickerOpen] = useState(false);
  const [careerId, setCareerId] = useState(content.id);

  const auth = useSelector((state) => state.auth);
  const { token } = auth;

  useEffect(() => {
    setDescription(content.description);
    if (content.existDate) {
      setExistDate(new Date(content.existDate));
    }
    if (content.description) {
      setDescription(content.description);
    }
  }, []);

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

  const SaveCareer = async () => {
    let entry = moment(entryDate).format('YYYY-MM-DD');
    let exist = new Date();

    if (normalCheckBox === true) {
      exist = null;
    } else {
      exist = moment(existDate).format('YYYY-MM-DD');
      // console.log('날짜 확인', moment(entry).isBefore(exist));
      if (moment(entry).isBefore(exist)) {
      } else {
        Alert.alert('입,퇴사 일을 다시 확인 해주세요.');
        return;
      }
    }

    if (name === '') {
      Alert.alert('회사명은 필수 입니다.');
      return;
    }
    if (department === '') {
      Alert.alert('부서명을 작성해 주세요.');
      return;
    }
    if (rank === '') {
      Alert.alert('직급을 작성해 주세요.');
      return;
    }

    if (description === '') {
      Alert.alert('업종 설명을 작성해 주세요.');
      return;
    }

    let body = {
      type: '경력',
      id: careerId,
      name: name,
      isMainCareer: typicalCheckBox,
      department: department,
      rank: rank,
      entryDate: entry,
      existDate: exist,
      isCurrentWorking: normalCheckBox,
      description: description,
    };

    try {
      const { data } = await api.patch('teacher-infos', body, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('data', data);
      resetNavigation(navigation, 'TeacherProfileEnroll');
    } catch (err) {
      Alert.alert('서버와의 연결에 실패하였습니다.');
      console.log('err', err);
      console.log('err', err.response);
    }
  };

  return (
    <View style={{ flex: 1, paddingBottom: 25, backgroundColor: '#fff' }}>
      <ScrollView
        style={{
          paddingHorizontal: 24,
        }}
      >
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
            <Text style={styles.containerName}>경력수정</Text>
          </View>
          <Text></Text>
        </View>
        <View style={{ marginTop: 33 }}>
          <Text style={styles.careerInput}>회사</Text>
          <TextInput
            placeholder={'예) 웰페리온'}
            style={styles.inputBox}
            textAlign='center'
            placeholderTextColor={'#aaa'}
            onChangeText={(text) => setName(text)}
            value={name}
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
            대표 경력으로 선정
          </Text>
        </View>
        <RowContainer
          style={{ marginTop: 17, justifyContent: 'space-between' }}
        >
          <View style={{ width: 156 }}>
            <Text style={styles.careerInput}>부서</Text>
            <TextInput
              placeholder={'예) P.T팀'}
              style={styles.inputBox}
              textAlign='center'
              placeholderTextColor={'#aaa'}
              onChangeText={(text) => setDepartment(text)}
              value={department}
            />
          </View>
          <View style={{ width: 156 }}>
            <Text style={styles.careerInput}>직급</Text>
            <TextInput
              placeholder={'예) 팀장'}
              style={styles.inputBox}
              textAlign='center'
              placeholderTextColor={'#aaa'}
              onChangeText={(text) => setRank(text)}
              value={rank}
            />
          </View>
        </RowContainer>
        <View style={{ marginTop: 17 }}>
          <Text style={styles.careerInput}>입사</Text>

          <View style={styles.birthdayBox}>
            <BirthPicker
              isOpen={isEntryPickerOpen}
              date={entryDate}
              onConfirm={(selectedDate) => {
                setIsEntryPickerOpen(false);
                setEntryDate(selectedDate);
              }}
              onCancel={() => setIsEntryPickerOpen(false)}
              maximumDate={new Date()}
            />

            <Touchable
              onPress={() => setIsEntryPickerOpen(true)}
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
          <Text style={styles.careerInput}>퇴사</Text>
          <View style={styles.birthdayBox}>
            <BirthPicker
              isOpen={isExistPickerOpen}
              date={existDate}
              onConfirm={(selectedDate) => {
                setIsExistPickerOpen(false);
                setExistDate(selectedDate);
              }}
              onCancel={() => setIsExistPickerOpen(false)}
            />

            <Touchable
              onPress={() => setIsExistPickerOpen(true)}
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
            재직 중
          </Text>
        </View>
        <View style={{ marginTop: 17 }}>
          <Text style={styles.careerInput}>업종 설명</Text>
          <TextInput
            placeholder={'예) P.T 및 프로그램 기획 / 팀 관리'}
            style={styles.inputBox}
            textAlign='center'
            placeholderTextColor={'#aaa'}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </ScrollView>

      <GradientButton
        style={{ marginHorizontal: 24 }}
        onPress={() => SaveCareer()}
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

  checkInner: {
    flexDirection: 'row',
    marginTop: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E3E5E5',
    backgroundColor: '#fff',
    textAlign: 'center',
    color: '#000',
    height: 40,
  },
});

export default CareerModify;
