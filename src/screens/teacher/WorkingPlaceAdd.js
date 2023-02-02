import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../components/buttons/GradientButton';
import { NormalBoldLabel } from '../../components/Label';
import RowContainer from '../../components/containers/RowContainer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Touchable from '../../components/buttons/Touchable';
import { useNavigation } from '@react-navigation/native';
import BirthPicker from '../../components/date/BirthPicker';
import moment from 'moment';

import { NormalLabel } from '../../components/Label';

const WorkingPlaceAdd = () => {
  const navigation = useNavigation();
  const [companyName, setCompanyName] = useState('');
  const [teacher, setTeacher] = useState('');
  const [date, setDate] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const onSaveHandler = (e) => {
    e.preventDefault();
    Alert.alert('통신연결 필요');
  };

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={{ marginHorizontal: 24, flex: 1 }}>
      <NormalBoldLabel text={'근무지 명'} style={styles.title} />
      <TextInput
        style={styles.textInputText}
        placeholderTextColor='lightgray'
        placeholder='예)웰페리온'
        autoCorrect={false}
        value={companyName}
        textAlign='center'
        onChangeText={(text) => {
          setCompanyName(text);
        }}
      />

      <NormalBoldLabel text={'직급'} style={styles.title1} />
      <TextInput
        style={styles.textInputText}
        placeholderTextColor='lightgray'
        placeholder='예)필라테스 강사'
        autoCorrect={false}
        value={teacher}
        textAlign='center'
        onChangeText={(text) => {
          setTeacher(text);
        }}
      />
      <NormalBoldLabel text={'강습 시작일'} style={styles.title1} />
      <View style={styles.birthdayBox}>
        <BirthPicker
          isOpen={isDatePickerOpen}
          date={birthDate}
          onConfirm={(selectedDate) => {
            setIsDatePickerOpen(false);
            setBirthDate(selectedDate);
          }}
          onCancel={() => setIsDatePickerOpen(false)}
        />

        <Touchable
          onPress={() => setIsDatePickerOpen(true)}
          style={styles.birthdayInputBox}
        >
          <View />
          <NormalLabel
            text={moment(birthDate).format('YYYY-MM-DD')}
            style={styles.birthLabel}
          />

          <Image
            style={{ width: 16, height: 18 }}
            source={require('../../assets/icons/date.png')}
          />
        </Touchable>
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: 25,
        }}
      >
        <GradientButton
          style={{ marginBottom: 0, backgroundColor: 'blue' }}
          onPress={onSaveHandler}
        >
          <Text
            style={{
              fontSize: 20,
              color: '#fff',
              fontWeight: 'bold',
            }}
          >
            저장
          </Text>
        </GradientButton>
      </View>
    </SafeAreaView>
  );
};

export default WorkingPlaceAdd;

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
  title: { marginTop: 33, marginBottom: 5 },
  title1: { marginTop: 33, mariginBottom: 5 },
  textInputText: {
    fontSize: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E3E5E5',
    borderRadius: 10,
  },
});
