import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NormalBoldLabel, NormalLabel } from '../../../components/Label';
import SwitchToggle from 'react-native-switch-toggle';
import { Container } from '../../../components/containers/Container';
import { getAlertsSetting } from '../../../api/alertsSetting';
import api from '../../../api/api';
import { useSelector } from 'react-redux';

// only member
const Notifications = () => {
  const { token } = useSelector((state) => state.auth);
  const [alertsSetting, setAlertsSetting] = useState(null);
  const [isChatApproved, setIsChatApproved] = useState(true);
  const [isNoticeApproved, setIsNoticeApproved] = useState(true);
  const [isLessonApproved, setIsLessonApproved] = useState(true);
  const [isCouponApproved, setIsCouponApproved] = useState(true);
  const [isPaymentApproved, setIsPaymentApproved] = useState(true);

  useEffect(() => {
    fetchAlertsSetting();
  }, []);

  const fetchAlertsSetting = async () => {
    try {
      const { data } = await getAlertsSetting(token);
      // console.log('data', data);
      if (data?.length > 0) {
        const setting = data[0];
        setAlertsSetting(setting);

        setIsChatApproved(setting.isChatApproved);
        setIsNoticeApproved(setting.isNoticeApproved);
        setIsLessonApproved(setting.isLessonApproved);
      }
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  const onChangeAlertSetting = async (body) => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      await api.patch(`alerts-setting/${alertsSetting?.id}/`, body, config);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleStyle}>
        <NormalBoldLabel style={styles.boldTitle} text={'빠소 알림'} />
      </View>
      <View style={styles.boxStyle}>
        <View style={{ marginTop: 10, paddingBottom: 20 }}>
          <NormalBoldLabel text={'채팅 알림'} />
        </View>
        <SwitchToggle
          switchOn={isChatApproved}
          onPress={() => {
            setIsChatApproved(!isChatApproved);
            onChangeAlertSetting({ isChatApproved: !isChatApproved });
          }}
          circleColorOff='#EFEFEF'
          circleColorOn='#8082FF'
          backgroundColorOn='#D6D7FC'
          backgroundColorOff='#CBCBCB'
          containerStyle={styles.switchContainer}
          circleStyle={styles.switchCircle}
        />
      </View>
      <View style={styles.boxStyle}>
        <View style={{ marginTop: 10 }}>
          <NormalBoldLabel text={'빠소 소식 알림'} />
          <Text style={styles.subContent}>
            공지사항 및 이벤트 소식을 받아보세요.
          </Text>
        </View>
        <SwitchToggle
          switchOn={isNoticeApproved}
          onPress={() => {
            setIsNoticeApproved(!isNoticeApproved);
            onChangeAlertSetting({ isNoticeApproved: !isNoticeApproved });
          }}
          circleColorOff='#EFEFEF'
          circleColorOn='#8082FF'
          backgroundColorOn='#D6D7FC'
          backgroundColorOff='#CBCBCB'
          containerStyle={styles.switchContainer}
          circleStyle={styles.switchCircle}
        />
      </View>

      <View style={styles.titleStyle}>
        <NormalBoldLabel style={styles.boldTitle} text={'거래내역 알림'} />
      </View>
      <View style={styles.boxStyle}>
        <View style={{ marginTop: 10 }}>
          <NormalBoldLabel text={'결제 및 환불 내역'} />
          <Text style={styles.subContent}>
            결제 및 환불 내역을 받아 보세요.
          </Text>
        </View>
        <SwitchToggle
          switchOn={isPaymentApproved}
          onPress={() => {
            setIsPaymentApproved(!isPaymentApproved);
            onChangeAlertSetting({ isPaymentApproved: !isPaymentApproved });
          }}
          circleColorOff='#EFEFEF'
          circleColorOn='#8082FF'
          backgroundColorOn='#D6D7FC'
          backgroundColorOff='#CBCBCB'
          containerStyle={styles.switchContainer}
          circleStyle={styles.switchCircle}
        />
      </View>
      <View style={styles.boxStyle}>
        <View style={{ marginTop: 10 }}>
          <NormalBoldLabel text={'쿠폰&프로모션 알림'} />
          <Text style={styles.subContent}>
            주변 센터 쿠폰&프로모션 정보를 받아보세요.
          </Text>
        </View>
        <SwitchToggle
          switchOn={isCouponApproved}
          onPress={() => {
            setIsCouponApproved(!isCouponApproved);
            onChangeAlertSetting({ isCouponApproved: !isCouponApproved });
          }}
          circleColorOff='#EFEFEF'
          circleColorOn='#8082FF'
          backgroundColorOn='#D6D7FC'
          backgroundColorOff='#CBCBCB'
          containerStyle={styles.switchContainer}
          circleStyle={styles.switchCircle}
        />
      </View>
      <View style={styles.titleStyle}>
        <NormalBoldLabel style={styles.boldTitle} text={'센터 알림'} />
      </View>
      {/*<View style={styles.boxStyle}>*/}
      {/*  <View style={{ marginTop: 10 }}>*/}
      {/*    <NormalBoldLabel text={'회원 활동 알림'} />*/}
      {/*    <Text style={styles.subContent}>*/}
      {/*      회원님의 센터 활동에 대한 알림을 받아보세요.*/}
      {/*    </Text>*/}
      {/*  </View>*/}
      {/*  <SwitchToggle*/}
      {/*    switchOn={isSwitchOn3}*/}
      {/*    onPress={() => setSwitchOn3(!isSwitchOn3)}*/}
      {/*    circleColorOff='#EFEFEF'*/}
      {/*    circleColorOn='#8082FF'*/}
      {/*    backgroundColorOn='#D6D7FC'*/}
      {/*    backgroundColorOff='#CBCBCB'*/}
      {/*    containerStyle={styles.switchContainer}*/}
      {/*    circleStyle={styles.switchCircle}*/}
      {/*  />*/}
      {/*</View>*/}
      <View style={styles.boxStyle}>
        <View style={{ marginTop: 10 }}>
          <NormalBoldLabel text={'강습 일정 알림'} />
          <Text style={styles.subContent}>강습 정보를 받아보세요.</Text>
        </View>
        <SwitchToggle
          switchOn={isLessonApproved}
          onPress={() => {
            setIsLessonApproved(!isLessonApproved);
            onChangeAlertSetting({ isLessonApproved: !isLessonApproved });
          }}
          circleColorOff='#EFEFEF'
          circleColorOn='#8082FF'
          backgroundColorOn='#D6D7FC'
          backgroundColorOff='#CBCBCB'
          containerStyle={styles.switchContainer}
          circleStyle={styles.switchCircle}
        />
      </View>

      <NormalLabel
        style={{
          color: '#8082FF',
          fontSize: 12,
          lineHeight: 16,
          marginTop: 83,
          marginBottom: 44,
        }}
        text={
          '• 회원님의 계정, 법적 고지, 보안 및 개인정보 보호 문제, 고객 지원 요청 관련 메세지 필요시 전화나 ' +
          '다른 방법을 통해 빠소 에서 연락을 드릴 수 있습니다.'
        }
      />
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#fbfbfb',
  },
  subContent: { marginVertical: 5, fontSize: 12, color: '#AAA' },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
    alignItems: 'center',
  },
  leftActionable: {
    width: 7,
    height: 14,
    marginLeft: 24.5,
  },
  boldTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    lineHeight: 20,
  },
  titleStyle: {
    marginTop: 20,
    paddingBottom: 15,
    alignItems: 'flex-start',
  },
  boxStyle: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e5e5',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchContainer: {
    width: 34,
    height: 14,
    borderRadius: 25,
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 20,
  },
});
