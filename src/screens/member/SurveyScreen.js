import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';
import Touchable from '../../components/buttons/Touchable';
import RowContainer from '../../components/containers/RowContainer';
import BottomGradientButton from '../../components/buttons/BottomGradientButton';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { resetNavigation, resetNestedNavigation } from '../../util';
import { CheckBoxItem } from '../../components/CheckBoxItem';
import api from '../../api/api';
import { useSelector } from 'react-redux';
import useInput from '../../hooks/useInput';
import { Container } from '../../components/containers/Container';

const SurveyScreen = ({ navigation, route }) => {
  const { token } = useSelector((state) => state.auth);
  const { gymId, userId } = route.params;
  const [topBoxStatus, setTopBoxStatus] = useState([]);
  const [bottomBoxStatus, setBottomBoxStatus] = useState([]);
  const [answer, onChangeAnswer] = useInput('');
  const [products, setProducts] = useState({
    memberships: [],
    lessonTickets: [],
  });

  useEffect(() => {
    getProducts();

    // navigation.setOptions({
    //   headerRight: () => (
    //     <Touchable onPress={() => null} style={{ padding: 4 }}>
    //       <FontAwesome5 name='info-circle' size={25} color={'#aaa'} />
    //     </Touchable>
    //   ),
    // });
  }, []);

  const getProducts = async () => {
    try {
      const { data } = await api.get(`products?gymId=${gymId}`);
      setProducts(data);
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  };

  const onSubmit = async () => {
    if (
      topBoxStatus.length === 0 &&
      bottomBoxStatus.length === 0 &&
      answer === ''
    ) {
      Alert.alert('', '선택 또는 의견을 작성해주세요.');
      return;
    }

    try {
      let body = {
        userProgram: topBoxStatus,
        lessonProgram: bottomBoxStatus,
        etcOpinion: answer,
        receiverId: userId,
        gym: gymId,
      };

      const { data } = await api.post('inquires/', body, {
        headers: { Authorization: `Token ${token}` },
      });
      let chatRoom = data;
      let alertTitle = '담당자와 채팅이 활성화되었습니다.';
      let alertContent = '추가 궁금하신 점은 실시간 채팅으로 문의 바랍니다 :)';

      if (data?.status === 203) {
        chatRoom = data.chat;
        alertTitle = '이미 채팅방이 존재합니다.';
        alertContent = '';
      }

      Alert.alert(alertTitle, alertContent, [
        {
          text: '확인',
          onPress: () => {
            resetNestedNavigation(navigation, 'MemberMain', 'MemberChatRoom');
            navigation.navigate('Chat', { chatRoom });
          },
          // onPress: () => resetNavigation(navigation, 'MemberMain'),
        },
      ]);
    } catch (err) {
      console.log('err', err);
      console.log('err.response', err.response);
    }
  };

  const onSelectCheck = (list, setList, name) => {
    let newBoxStatus = [...list];

    if (newBoxStatus.includes(name)) {
      newBoxStatus = newBoxStatus.filter((existName) => existName !== name);
      setList(newBoxStatus);
    } else {
      if (list.length >= 3) {
        Alert.alert('최대 3개까지 선택이 가능합니다.');
        return;
      }

      newBoxStatus.push(name);
      setList(newBoxStatus);
    }
  };

  return (
    <Container
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 25 }}
    >
      <SubTitle title={'관심 회원 프로그램'} />
      {Object.values(products.memberships)?.map((data, i) => (
        <CheckItem
          key={data.id.toString()}
          name={data.name}
          hasCheck={topBoxStatus.includes(data.name)}
          description={data?.description}
          onPress={() =>
            onSelectCheck(topBoxStatus, setTopBoxStatus, data.name)
          }
        />
      ))}
      <CheckItem
        name={'회원권만'}
        hasCheck={topBoxStatus.includes('회원권만')}
        description={null}
        onPress={() => onSelectCheck(topBoxStatus, setTopBoxStatus, '회원권만')}
      />

      <SubTitle title={'관심 강습 프로그램'} />
      {Object.values(products.lessonTickets)?.map((data, i) => (
        <CheckItem
          key={data.id.toString()}
          name={data.name}
          hasCheck={bottomBoxStatus.includes(data.name)}
          description={data?.description}
          onPress={() =>
            onSelectCheck(bottomBoxStatus, setBottomBoxStatus, data.name)
          }
        />
      ))}
      <CheckItem
        name={'강습만'}
        hasCheck={bottomBoxStatus.includes('강습만')}
        description={null}
        onPress={() =>
          onSelectCheck(bottomBoxStatus, setBottomBoxStatus, '강습만')
        }
      />

      <NormalBoldLabel
        style={{
          fontSize: 15,
          lineHeight: 19,
          color: '#555',
          marginTop: 27,
          paddingHorizontal: 24,
        }}
        text={` \u2022 기타 문의 사항이 있다면 자유롭게 적어주세요.`}
        // text={` \u2022 기타 문의 및 참고 사항이 있다면 자유롭게 적어주세요.`}
      />
      <TextInput
        value={answer}
        onChangeText={onChangeAnswer}
        style={styles.answerStyle}
        placeholder='내 답변'
        placeholderTextColor={'#AAA'}
      />
      <View style={{ marginTop: 20, paddingHorizontal: 38 }}>
        <NormalLabel
          style={{ color: '#8082FF', fontSize: 12, lineHeight: 16 }}
          text={
            '위 내용 작성하여 제출해주시면,\n작성해주신 내용을 토대로 체험 예약 진행을 도와드립니다.\n' +
            '각 프로그램 별로 최대 3개까지 선택이 가능합니다.\n감사합니다.'
          }
        />
      </View>

      <View style={{ flex: 1 }} />
      <BottomGradientButton style={styles.yesButton} onPress={onSubmit}>
        <NormalBoldLabel
          text={'제출'}
          style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}
        />
      </BottomGradientButton>
    </Container>
  );
};

export default SurveyScreen;

const CheckItem = ({ name, description, onPress, hasCheck }) => (
  <RowContainer style={styles.checkboxContainer}>
    <CheckBoxItem
      style={styles.checkbox}
      hasCheck={hasCheck}
      onPress={onPress}
    />
    <RowContainer style={{ marginTop: 8 }}>
      {description ? (
        <>
          <Text style={styles.boldText}>
            {name}
            <Text
              style={{ ...styles.boldText, color: '#000' }}
            >{` (Tooltip: ${description})`}</Text>
          </Text>
        </>
      ) : (
        <NormalBoldLabel style={styles.boldText} text={name} />
      )}
    </RowContainer>
  </RowContainer>
);

const SubTitle = ({ title }) => (
  <RowContainer style={styles.sectionStyle}>
    <NormalBoldLabel style={styles.boldTitle} text={title} />
    <Text style={styles.redStar}>*</Text>
  </RowContainer>
);
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbfbfb',
  },
  topContainer: {
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 25,
  },

  leftActionable: {
    width: 7,
    height: 14,
  },
  grayText: {
    color: 'gray',
    fontSize: 12,
    lineHeight: 20,
  },
  boldTitle: {
    fontSize: 18,
    lineHeight: 22,
    color: '#000',
    marginRight: 2,
  },
  boldText: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 20,
  },
  sectionStyle: {
    marginLeft: 24,
    marginTop: 28,
    marginBottom: 10,
  },
  redStar: {
    color: 'red',
    fontSize: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
  checkboxContainer: {
    marginLeft: 18.5,
    marginRight: 21,
    marginTop: 8.5,
  },
  answerStyle: {
    marginTop: 13,
    padding: 0,
    borderBottomWidth: 1,
    marginLeft: 42,
    marginRight: 24,
    paddingBottom: 5,
    borderBottomColor: '#E3E5E5',
    fontSize: 12,
    lineHeight: 16,
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 30,
  },
  cancelButton: {
    width: 155,
    height: 52,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    borderRadius: 10,
  },
  yesButton: {
    marginHorizontal: 24,
    marginTop: 33,
  },
});
