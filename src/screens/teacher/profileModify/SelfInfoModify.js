import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import RowContainer from '../../../components/containers/RowContainer';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import { resetNavigation } from '../../../util';
import { NormalBoldLabel } from '../../../components/Label';
import GradientButton from '../../../components/buttons/GradientButton';
import { SCREEN_WIDTH } from '../../../constants/constants';

const SelfInfoModify = ({ navigation, route }) => {
  const { content } = route.params;
  const [title, setTitle] = useState(content.title);
  const [hobby, setHobby] = useState(content.hobby);
  const [specialty, setSpecialty] = useState(content.specialty);
  const [wantedJob, setWantedJob] = useState(content.wantedJob);
  const [wantedRank, setWantedRank] = useState(content.wantedRank);
  const [description, setDescription] = useState('');

  const auth = useSelector((state) => state.auth);
  const { token } = auth;

  useEffect(() => {
    content.description && setDescription(content.description);
  }, []);

  const saveMyProfile = async () => {
    if (title === '') {
      Alert.alert('제목을 입력해주세요.');
      return;
    }
    if (hobby === '') {
      Alert.alert('취미를 입력해주세요.');
      return;
    }
    if (specialty === '') {
      Alert.alert('특기를 입력해주세요.');
      return;
    }
    if (wantedJob === '') {
      Alert.alert('원하는 직무를 입력해주세요.');
      return;
    }
    if (wantedRank === '') {
      Alert.alert('원하는 직급을 입력해주세요.');
      return;
    }
    if (description === '') {
      Alert.alert('자기소개서 상세를 입력해주세요.');
      return;
    }

    let body = {
      id: content.id,
      type: '자기소개서',
      title: title,
      hobby: hobby,
      specialty: specialty,
      wantedJob: wantedJob,
      wantedRank: wantedRank,
      description: description,
    };
    try {
      const data = await api.patch('teacher-infos', body, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('data', data);

      resetNavigation(navigation, 'TeacherProfileEnroll');
    } catch (e) {
      Alert.alert('서버와의 연결에 실패하였습니다.');
      console.log('e', e);
      console.log('e.response', e.response);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 24 }}>
          <View style={styles.titleInner}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                style={styles.backActionable}
                source={require('../../../assets/images/membershipprice/arrow.png')}
              />
            </TouchableOpacity>

            <View>
              <Text style={styles.containerName}>자기소개서 수정</Text>
            </View>
            <Text></Text>
          </View>

          <View style={{ marginTop: 33 }}>
            <Text style={styles.careerInput}>자기소개서 제목</Text>
            <TextInput
              placeholder={'예) 한다면 한다'}
              style={styles.inputBox}
              placeholderTextColor={'#AAA'}
              textAlign='center'
              value={title}
              onChangeText={(text) => setTitle(text)}
            />
          </View>

          <RowContainer
            style={{ marginTop: 17, justifyContent: 'space-between' }}
          >
            <View style={{ width: 156 }}>
              <Text style={styles.careerInput}>특기</Text>
              <TextInput
                style={styles.inputBox}
                textAlign='center'
                value={specialty}
                onChangeText={(text) => setSpecialty(text)}
              />
            </View>
            <View style={{ width: 156 }}>
              <Text style={styles.careerInput}>취미</Text>
              <TextInput
                style={styles.inputBox}
                textAlign='center'
                value={hobby}
                onChangeText={(text) => setHobby(text)}
              />
            </View>
          </RowContainer>

          <RowContainer
            style={{ marginTop: 17, justifyContent: 'space-between' }}
          >
            <View style={{ width: 156 }}>
              <Text style={styles.careerInput}>원하는 직무</Text>
              <TextInput
                placeholder={'예) 관리'}
                style={styles.inputBox}
                placeholderTextColor={'#aaa'}
                textAlign='center'
                value={wantedJob}
                onChangeText={(text) => setWantedJob(text)}
              />
            </View>
            <View style={{ width: 156 }}>
              <Text style={styles.careerInput}>원하는 직급</Text>
              <TextInput
                placeholder={'예) 팀장'}
                style={styles.inputBox}
                placeholderTextColor={'#aaa'}
                textAlign='center'
                value={wantedRank}
                onChangeText={(text) => setWantedRank(text)}
              />
            </View>
          </RowContainer>
          <View style={{ marginTop: 17 }}>
            <Text style={styles.careerInput}>자기 소개 (위 내용을 참고)</Text>
            <TextInput
              placeholder={'예) 직무 및 직급 경험을 연관 시켜 자기소개'}
              placeholderTextColor={'#aaa'}
              style={styles.inputBox}
              textAlign='center'
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
        </View>
      </ScrollView>
      <RowContainer
        style={{
          justifyContent: 'space-between',
          marginBottom: 25,
        }}
      >
        <GradientButton
          onPress={() => saveMyProfile()}
          style={styles.loginButton}
        >
          <NormalBoldLabel
            text={'저장'}
            style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}
          />
        </GradientButton>
      </RowContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    alignSelf: 'center',
    width: SCREEN_WIDTH - 46,
    paddingVertical: 16,
    marginHorizontal: 24,
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

export default SelfInfoModify;
