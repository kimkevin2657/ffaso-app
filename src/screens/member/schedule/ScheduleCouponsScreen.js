import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { NormalBoldLabel } from '../../../components/Label';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import { Container } from '../../../components/containers/Container';
import { useFocusEffect } from '@react-navigation/native';
import Coupon from '../../../components/Coupon';

const ScheduleCouponsScreen = ({ navigation, route }) => {
  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;
  const { type, onComplete } = route.params;

  const [couponList, setCouponList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getCouponList();
    }, [])
  );

  const getCouponList = async () => {
    try {
      const { data } = await api.get(
        // `user-coupons?userId=${user.id}`
        // `user-coupons?userId=${user.id}&type=${type}`
        `user-coupons?userId=${'6b4dbcad-2175-40cc-88c9-257ec8efe404'}`
      );
      setCouponList(data);
      console.log(data);
      // console.log('getCouponList data', data);
    } catch (err) {
      console.log('getCouponList err', err.response);
    }
  };

  const onSelectCoupon = (coupon) => {
    if (coupon.currentCount >= coupon.availableCount) {
      Alert.alert('이미 모두 사용한 쿠폰입니다.');
      return;
    }
    onComplete(coupon);
    navigation.goBack();
  };

  return (
    <Container>
      <ScrollView style={{ backgroundColor: '#FBFBFB' }}>
        <View style={{ marginHorizontal: 24 }}>
          <View style={styles.titleStyle}>
            <NormalBoldLabel
              style={styles.boldTitle}
              text={'사용 가능한 쿠폰'}
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
                text={'등록된 정보가 없습니다.'}
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
              onPress={() => onSelectCoupon(coupon)}
            />
          ))}
        </View>
      </ScrollView>
    </Container>
  );
};

export default ScheduleCouponsScreen;

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
    marginTop: 30,
    paddingBottom: 10,
    alignItems: 'flex-start',
    borderBottomWidth: 1.6,
    borderBottomColor: 'lightgray',
  },
  couponBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1.6,
    borderBottomColor: 'lightgray',
    // borderTopColor: 'lightgray',
    // borderTopWidth: 1.6,
  },
  textBox: {
    marginTop: 10,
  },
  smallText: {
    fontSize: 12,
    paddingTop: 5,
    color: '#555555',
  },
});
