import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { NormalBoldLabel, NormalLabel } from './Label';
import RowContainer from './containers/RowContainer';

const Coupon = ({
  onPress,
  name,
  expiryDate,
  type,
  currentCount,
  availableCount,
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <RowContainer style={couponStyles.couponBox}>
        <Image
          source={require('../assets/images/mypage/coupon.png')}
          style={couponStyles.img}
        />
        <View style={couponStyles.flexWrap}>
          <NormalLabel text={'#' + type} style={couponStyles.type} />
          <NormalBoldLabel text={name} style={couponStyles.name} />
          <Text style={couponStyles.defaultText}>
            [총
            <Text
              style={couponStyles.boldText}
            >{` ${availableCount}회 중 ${currentCount}회 `}</Text>
            사용 ({availableCount - currentCount}회 수강 가능) ] |
            <Text style={couponStyles.boldText}>{` ${expiryDate} `}</Text>
            까지
          </Text>
        </View>
      </RowContainer>
    </TouchableOpacity>
  );
};

export default Coupon;

const couponStyles = StyleSheet.create({
  couponBox: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e5e5',
  },
  type: {
    fontSize: 11,
    lineHeight: 16,
    color: '#8082ff',
  },
  name: {
    marginTop: 5,
    marginBottom: 11,
  },
  defaultText: {
    fontSize: 11,
    lineHeight: 16,
    color: '#555',
  },
  boldText: {
    fontWeight: 'bold',
  },
  img: {
    marginRight: 16,
    width: 69,
    height: 45,
  },
  flexWrap: {
    flex: 1,
  },
});
