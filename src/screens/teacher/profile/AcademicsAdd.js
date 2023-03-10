import React, { useState } from 'react';
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
import { SCREEN_WIDTH } from '../../../constants/constants';
import { Container } from '../../../components/containers/Container';

const AcademicsAdd = ({ navigation }) => {
  const [typicalCheckBox, setTypicalCheckBox] = useState(false);
  const [normalCheckBox, setNormalCheckBox] = useState(false);
  const [isDateEntrtyPickerOpen, setIsDateEntryPickerOpen] = useState(false);
  const [isDateExistPickerOpen, setIsDateExistPickerOpen] = useState(false);
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [major, setMajor] = useState('');
  const [entryDate, setEntryDate] = useState(new Date());
  const [existDate, setExistDate] = useState(new Date());
  const [description, setDescription] = useState('');

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
      // console.log('?????? ??????', moment(entry).isBefore(exist));
      if (moment(entry).isBefore(exist)) {
      } else {
        Alert.alert('??????,??????/???????????? ?????? ?????? ????????????.');
        return;
      }
    }

    if (name === '') {
      Alert.alert('?????? ?????? ???????????????.');
      return;
    }
    if (degree === '') {
      Alert.alert('????????? ???????????????.');
      return;
    }
    if (degree === '') {
      Alert.alert('???????????? ????????? ?????????.');
      return;
    }
    if (description === '') {
      Alert.alert('?????? ?????? ??? ?????? ????????? ????????? ?????????.');
      return;
    }
    let body = {
      type: '??????',
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
      const { data } = await api.post('teacher-infos', body, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('data', data);
      resetNavigation(navigation, 'TeacherProfileEnroll');
    } catch (e) {
      Alert.alert('????????? ????????? ?????????????????????.');
      console.log('e', e);
      console.log('e.response', e.response);
    }
  };

  return (
    <Container
      style={{ paddingHorizontal: 24 }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 25,
        justifyContent: 'space-between',
      }}
      isOnlyStatusBarHeight={true}
    >
      <View>
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
            <Text style={styles.containerName}>????????????</Text>
          </View>
          <Text></Text>
        </View>

        <View style={{ marginTop: 33 }}>
          <Text style={styles.careerInput}>??????</Text>
          <TextInput
            placeholder={'???) ??????????????? ?????????????????????'}
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
            ?????? ???????????? ??????
          </Text>
        </View>

        <RowContainer
          style={{ marginTop: 17, justifyContent: 'space-between' }}
        >
          <View style={{ width: SCREEN_WIDTH * 0.4 }}>
            <Text style={styles.careerInput}>??????</Text>
            <TextInput
              placeholder={'???) ??????, ??????'}
              style={styles.inputBox}
              textAlign='center'
              placeholderTextColor={'#aaa'}
              value={degree}
              onChangeText={(text) => setDegree(text)}
            />
          </View>
          <View style={{ width: SCREEN_WIDTH * 0.4 }}>
            <Text style={styles.careerInput}>??????</Text>
            <TextInput
              placeholder={'???) ?????????????????????'}
              textAlign='center'
              placeholderTextColor={'#aaa'}
              style={styles.inputBox}
              value={major}
              onChangeText={(text) => setMajor(text)}
            />
          </View>
        </RowContainer>

        <View style={{ marginTop: 17 }}>
          <Text style={styles.careerInput}>??????</Text>

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
          <Text style={styles.careerInput}>??????/??????</Text>

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
            ?????? ???
          </Text>
        </View>

        <View style={{ marginTop: 17 }}>
          <Text style={styles.careerInput}>?????? ?????? ??? ?????? ??????</Text>
          <TextInput
            placeholder={'???) P.T ??? ???????????? ?????? / ??? ??????'}
            textAlign='center'
            placeholderTextColor={'#aaa'}
            style={styles.inputBox}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </View>
      <GradientButton onPress={() => SaveAcademic()} style={{ marginTop: 39 }}>
        <NoneLabel
          text={'??????'}
          style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}
        />
      </GradientButton>
    </Container>
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
    height: 40,
  },

  checkInner: {
    flexDirection: 'row',
    marginTop: 8,
  },
});

export default AcademicsAdd;
