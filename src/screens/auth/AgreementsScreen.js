import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import RowContainer from '../../components/containers/RowContainer';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';
import {
  AGREEMENT1,
  AGREEMENT2,
  AGREEMENT3,
  AGREEMENT4,
  AGREEMENT5,
  AGREEMENT6,
} from '../../constants/agreements';
import BottomGradientButton from '../../components/buttons/BottomGradientButton';
import { CheckBoxItem } from '../../components/CheckBoxItem';
import apiv3 from '../../api/apiv3';

const window_width = Dimensions.get('window').width;
const window_height = Dimensions.get('window').height;

const AgreementsScreen = ({ navigation, route }) => {
  const type = route.params.type;
  const [agreement1, setAgreement1] = useState(false);
  const [agreement2, setAgreement2] = useState(false);
  const [agreement3, setAgreement3] = useState(false);
  const [agreement4, setAgreement4] = useState(false);
  const [agreement5, setAgreement5] = useState(false);
  const [agreement6, setAgreement6] = useState(false);
  const [superadminBank, setSuberadminbank] = useState(AGREEMENT5);

  useEffect(() => {
    // navigation.setOptions({
    //   // headerLeft: () => (
    //   //   <Touchable style={{padding: 4}} onPress={() => navigation.goBack()}>
    //   //     <Image
    //   //       source={require('../../assets/images/membershipprice/arrow.png')}
    //   //       resizeMode="contain"
    //   //       style={{width: 7, height: 14}}
    //   //     />
    //   //   </Touchable>
    //   // ),
    //   headerRight: () => (
    //     <Touchable
    //       onPress={() => navigation.navigate('MemberMain')}
    //       style={{ padding: 4 }}
    //     >
    //       <FontAwesome5 name='home' size={25} color={'#8082FF'} />
    //     </Touchable>
    //   ),
    // });
    // let agreement5Account=AGREEMENT5;
    // console.log(agreement5Account)
    const getSuperadminBank = async () => {
      const { data } = await apiv3.post('superadminbank ', {
        query: true,
        userId: "5018228f-9e58-40c4-a2e8-f499d2880277"
      });
      setSuberadminbank(
        superadminBank
        .replace(/은행명 :.*/g,'은행명 : '+ data.result.bankName)
        .replace(/계좌번호 :.*/g,'계좌번호 : '+data.result.accountNumber)
      );
    }
    getSuperadminBank();
  }, []);

  
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* <View style={styles.container}> */}
      {/*<SignupTop />*/}
      <View style={{ flex: 1 }}>
        {/*<SignupTop />*/}
        <View style={styles.topBox}>
          <CheckBoxItem
            hasCheck={
              agreement1 &&
              agreement2 &&
              agreement3 &&
              agreement4 &&
              agreement5 &&
              agreement6
            }
            onPress={() => {
              if (agreement1) {
                setAgreement1(false);
                setAgreement2(false);
                setAgreement3(false);
                setAgreement4(false);
                setAgreement5(false);
                setAgreement6(false);
              } else {
                setAgreement1(true);
                setAgreement2(true);
                setAgreement3(true);
                setAgreement4(true);
                setAgreement5(true);
                setAgreement6(true);
              }
            }}
          />
          <Text
            style={{
              marginTop: 7,
              fontSize: 15,
              lineHeight: 19,
              color: '#000',
              fontWeight: 'bold',
              marginBottom: 20,
              flex: 1,
            }}
          >
            빠소 이용약관, 개인정보 수집 및 이용, 위치정보 이용약관, 회원 결제
            시 필요 약관, 환불 진행 및 정산 프로세스,
            {/*<Text style={styles.smallText}>(선택)</Text>,*/} 프로모션 정보
            수신<Text style={styles.smallText}>(선택)</Text>에 모두 동의합니다.
          </Text>
        </View>

        <Agreement
          agreement={agreement1}
          label={'빠소회원 이용약관 동의'}
          content={AGREEMENT1}
          onPress={() => setAgreement1(!agreement1)}
        />
        <Agreement
          agreement={agreement2}
          label={'개인정보 수집 및 이용 동의'}
          content={AGREEMENT2}
          onPress={() => setAgreement2(!agreement2)}
        />
        <Agreement
          agreement={agreement3}
          label={'위치정보 이용약관 동의'}
          content={AGREEMENT3}
          onPress={() => setAgreement3(!agreement3)}
        />
        <Agreement
          agreement={agreement4}
          label={'회원 결제 시 필요 약관 동의'}
          content={AGREEMENT4}
          onPress={() => setAgreement4(!agreement4)}
        />
        <Agreement
          agreement={agreement5}
          label={'환불 진행 및 정산 프로세스 동의'}
          content={superadminBank}
          onPress={() => setAgreement5(!agreement5)}
        />
        <Agreement
          agreement={agreement6}
          label={'프로모션 정보 수신 동의'}
          subLabel={'선택'}
          content={AGREEMENT6}
          onPress={() => setAgreement6(!agreement6)}
        />

        <View style={{ flex: 1 }} />
        <BottomGradientButton
          style={styles.yesButton}
          onPress={() => {
            if (
              agreement1 &&
              agreement2 &&
              agreement3 &&
              agreement4 &&
              agreement5
            ) {
              navigation.navigate('UserSignupScreen', { type });
            } else {
              Alert.alert('동의하기를 선택해 주세요.');
            }
          }}
        >
          <NormalBoldLabel
            text={'확인'}
            style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}
          />
        </BottomGradientButton>
      </View>
    </ScrollView>
  );
};

const Agreement = ({ agreement, label, subLabel, onPress, content }) => {
  return (
    <View style={styles.secondBox}>
      <RowContainer style={styles.checkAndText}>
        <View>
          <CheckBoxItem hasCheck={agreement} onPress={onPress} />
        </View>
        <View style={styles.textBox}>
          <Text style={styles.category}>
            {label}
            <Text style={styles.blueText}> ({subLabel ?? '필수'})</Text>
          </Text>
        </View>
      </RowContainer>
      <View style={styles.agreementText}>
        <ScrollView nestedScrollEnabled={true}>
          <NormalLabel text={content} style={styles.agreementContent} />
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    paddingHorizontal: 24,
    paddingTop: 16,
    // width: window_width,
    // height: window_height,
    // width: 375,
    // height: 767,
    // alignItems: 'center',
  },

  topBox: {
    // marginTop: 10,
    flexDirection: 'row',
    // justifyContent: 'center',
    // left: -25,
  },
  checkbox: {
    marginLeft: 5,
    marginRight: 10,
    marginTop: 4,
  },
  checkItem: {
    width: 24,
    height: 24,
  },
  textBox: {
    // marginLeft: 10,
  },
  category: {
    fontSize: 15,
    lineHeight: 19,
    color: '#555',
    fontWeight: 'bold',
    marginTop: 4,
  },
  smallText: {
    fontSize: 12,
  },
  smallText2: {
    fontSize: 12,
    marginBottom: 25,
  },
  blueText: {
    fontSize: 12,
    // lineHeight: 16,
    color: '#8082FF',
    fontWeight: 'bold',
  },
  input: {
    textAlignVertical: 'top',
  },
  checkAndText: {
    // flexDirection: 'row',
    // alignItems: 'center',
  },
  secondBox: {
    marginTop: 10,
    justifyContent: 'center',
  },
  agreementText: {
    // width: 325,
    fontSize: 10,
    lineHeight: 16,
    height: 70,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#aaa',
    color: '#aaa',
    marginTop: 10,
    paddingRight: 7,
  },
  agreementContent: {
    color: '#aaa',
    fontSize: 10,
    paddingHorizontal: 14,
  },

  buttonBox: {
    flex: 1,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    // marginTop: 30,
  },
  yesButton: {
    //marginTop: 110,
    marginTop: window_height * 0.03,
    // width: 155,
    // flex: 1,
    // height: 52,
    // backgroundColor: '#6BB0F5',
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderRadius: 10,
  },
});

export default AgreementsScreen;
