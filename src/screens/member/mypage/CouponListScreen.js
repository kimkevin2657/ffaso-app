import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { NormalBoldLabel } from '../../../components/Label';
import ColumnView from '../../../components/ColumnView';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import { Container } from '../../../components/containers/Container';
import { useFocusEffect } from '@react-navigation/native';
import Coupon from '../../../components/Coupon';

const CouponListScreen = ({ navigation, route }) => {
  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;
  const reservationType = route.params?.reservationType;

  const [couponList, setCouponList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getCouponList();
    }, [])
  );

  const getCouponList = async () => {
    try {
      const { data } = await api.get(`user-coupons?userId=${user.id}`);
      setCouponList(data);
      console.log('getCouponList data', data);
    } catch (err) {
      console.log('getCouponList err', err.response);
    }
  };

  const useCoupon = async (coupon) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    try {
      const { data } = await api.post(
        `user-coupons/${coupon.id}/use/`,
        '',
        config
      );
      // console.log('uesCoupon data', data);
      Alert.alert('', data.msg);
      getCouponList();
    } catch (err) {
      console.log('useCoupon err ', err);
      console.log('useCoupon err.response', err.response);
      if (err.response?.data) {
        const { data } = err.response;
        Alert.alert('', data.msg);
      }
    }
  };

  return (
    <Container>
      <ScrollView style={{ backgroundColor: '#FBFBFB' }}>
        <View style={{ marginHorizontal: 24 }}>
          <View style={styles.titleStyle}>
            <NormalBoldLabel
              style={styles.boldTitle}
              text={'?????? ????????? ??????'}
            />
          </View>

          {couponList.length === 0 && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FBFBFB',
              }}
            >
              <Image
                source={require('../../../assets/images/null/priceAlertImage.png')}
                resizeMode='contain'
                style={{ height: 100, width: 100, marginTop: 138 }}
              />
              <NormalBoldLabel
                text={'????????? ????????? ????????????.'}
                style={{
                  marginTop: 25,
                  color: '#aaa',
                  fontSize: 20,
                  lineHeight: 24,
                }}
              />
            </View>
          )}
          {couponList.map((coupon, index) => (
            <Coupon
              {...coupon}
              key={coupon.id.toString()}
              styles={styles}
              onPress={() => {
                if (coupon.currentCount >= coupon.availableCount) {
                  Alert.alert('?????? ?????? ????????? ???????????????.');
                } else if (coupon.type !== '????????????' && !!reservationType) {
                  navigation.navigate('ScheduleRegister', {
                    coupon,
                    reservationType,
                  });
                }
              }}
            />
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

export default CouponListScreen;

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 30,
    alignItems: 'center',
  },
  leftActionable: {
    marginLeft: 14.5,
    padding: 10,
  },
  topMenu: {
    flexDirection: 'row',
    marginTop: 20,
    borderBottomWidth: 1.6,
    borderColor: 'lightgray',
    paddingBottom: 10,
  },
  boldTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: 'black',
    lineHeight: 30,
  },
  titleStyle: {
    marginTop: 24,
    paddingBottom: 10,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e5e5',
  },
});
