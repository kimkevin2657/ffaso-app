import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { SCREEN_WIDTH } from '../../../constants/constants';
import RowContainer from '../../containers/RowContainer';
import {
  BoldLabel13,
  BoldLabel15,
  NormalLabel12,
  NormalLabel13,
} from '../../Label';

const ProductInfo = ({ title, countText, useCountText, dateText, style }) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      <RowContainer style={styles.topDashBox}>
        <BoldLabel15
          text={title ?? ''}
          style={{ ...styles.mainColor, marginRight: 5 }}
        />
        {/*<NormalLabel12*/}
        {/*  text={'( 정원 : 1명 )'}*/}
        {/*  style={{ ...styles.grayColor }}*/}
        {/*/>*/}
      </RowContainer>
      <View style={{ paddingLeft: 17, paddingVertical: 14 }}>
        <RowContainer>
          <BoldLabel13
            text={'횟수'}
            style={{ ...styles.lightGrayColor, marginRight: 12 }}
          />
          <NormalLabel12 text={countText ?? ''} style={{ ...styles.black }} />
          <NormalLabel12
            text={useCountText ?? ''}
            style={{ ...styles.grayColor }}
          />
        </RowContainer>
        <RowContainer style={{ marginTop: 8 }}>
          <BoldLabel13
            text={'유효기간'}
            style={{ ...styles.lightGrayColor, marginRight: 12 }}
          />
          <NormalLabel12 text={dateText} style={{ ...styles.black }} />
        </RowContainer>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowRadius: 5,
    shadowColor: 'rgba(167, 171, 201, 0.15)',
    shadowOpacity: 1,
    elevation: 2,
  },
  mainColor: {
    color: '#8082FF',
  },
  grayColor: {
    color: '#555555',
  },
  lightGrayColor: {
    color: '#AAAAAA',
  },
  black: {
    color: '#000',
  },
  topDashBox: {
    borderBottomWidth: 1,
    borderColor: '#E3E5E5',
    paddingLeft: 17,
    paddingVertical: 11,
  },
});

export default ProductInfo;
