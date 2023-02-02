import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RowContainer from '../../components/containers/RowContainer';
import GradientButton from '../../components/buttons/GradientButton';
import { NormalBoldLabel } from '../../components/Label';
import { resetNavigation } from '../../util';
import { SCREEN_WIDTH } from '../../constants/constants';

const SignupCompleted = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      // headerRight: () => (
      //   <Touchable
      //     onPress={() => navigation.navigate('MemberMain')}
      //     style={{ padding: 4 }}
      //   >
      //     <FontAwesome5 name='home' size={25} color={'#8082FF'} />
      //   </Touchable>
      // ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style={{ alignItems: 'flex-start' }}>
          {/*<RowContainer>*/}
          {/*  <Text style={styles.coloredBoldText}>빠</Text>*/}
          {/*  <Text style={styles.normalText}>르게</Text>*/}
          {/*</RowContainer>*/}
          {/*<RowContainer>*/}
          {/*  <Text style={styles.coloredBoldText}>소</Text>*/}
          {/*  <Text style={styles.normalText}>개해봅니다</Text>*/}
          {/*</RowContainer>*/}
          <Image
            source={require('../../assets/images/home/infoText.png')}
            style={styles.inforImage}
          />
        </View>
      </View>
      <Text style={styles.boldText}>
        회원가입이 성공적으로{'\n'}완료되었습니다.
      </Text>

      <Image
        style={styles.overlay}
        source={require('../../assets/images/signup/signUpCompleteBackground.png')}
      />
      <View style={{ flex: 1 }} />
      <GradientButton
        style={styles.loginButton}
        onPress={() => resetNavigation(navigation, 'Auth')}
      >
        <NormalBoldLabel
          text={'로그인하기'}
          style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}
        />
      </GradientButton>
      {/*<TouchableOpacity*/}
      {/*  style={styles.backgroundContainer}*/}
      {/*  onPress={() => navigation.navigate('TeacherHome')}>*/}
      {/*  <Image*/}
      {/*    style={styles.loginButton}*/}
      {/*    source={require('../../assets/images/login/loginButton.png')}*/}
      {/*  />*/}
      {/*</TouchableOpacity>*/}
    </View>
  );
};

export default SignupCompleted;

const styles = StyleSheet.create({
  inforImage: {
    width: SCREEN_WIDTH / 2.4,
    height: (SCREEN_WIDTH / 2.4) * 0.36,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'flex-start',
    // marginLeft: 105,
  },
  textContainer: {
    paddingTop: 68,
    alignItems: 'center',
    // marginTop: 30,
  },
  coloredBoldText: {
    color: '#8082ff',
    fontWeight: '800',
    fontSize: 36,
  },
  boldText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    lineHeight: 40,
    color: '#000',
    marginTop: 72,
  },
  normalText: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
  },
  backgroundContainer: {
    // position: 'absolute',
    // bottom: 0,
  },
  overlay: {
    height: 492,
    width: '100%',
    // resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    // resizeMode: 'stretch',
    // width: 410,
  },
  loginButton: {
    marginBottom: 26,
    marginHorizontal: 23,
    // marginLeft: 20,
  },
});
