import React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import RowContainer from './containers/RowContainer';
import Touchable from './buttons/Touchable';
import { NormalLabel } from './Label';
import { SCREEN_WIDTH } from '../constants/constants';

const StatusCheck = ({ status, onPress, id }) => {
  return (
    <RowContainer style={styles.rightWrapper}>
      <Touchable
        onPress={() => onPress(id, '취소')}
        style={{
          ...styles.attendStatusBtn,
          backgroundColor: status === '취소' ? '#888888' : '#fff',
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
        }}
      >
        <NormalLabel
          text={'취소'}
          style={{ color: status === '취소' ? '#fff' : '#555' }}
        />
      </Touchable>
      <Touchable
        onPress={() => onPress(id, '결석')}
        style={{
          ...styles.attendStatusBtn,
          backgroundColor: status === '결석' ? '#FF0000' : '#fff',
        }}
      >
        <NormalLabel
          text={'결석'}
          style={{ color: status === '결석' ? '#fff' : '#555' }}
        />
      </Touchable>
      <Touchable
        onPress={() => onPress(id, '출석')}
        style={{
          ...styles.attendStatusBtn,
          backgroundColor: status === '출석' ? '#8082FF' : '#fff',
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
        }}
      >
        <NormalLabel
          text={'출석'}
          style={{ color: status === '출석' ? '#fff' : '#555' }}
        />
      </Touchable>
    </RowContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  statusCountContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#e3e5e5',
    paddingVertical: 8,
  },
  statusCountWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userWrapper: {
    marginHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#e3e5e5',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 14,
  },
  leftWrapper: {},
  rightWrapper: {},
  attendStatusBtn: {
    paddingVertical: 6.5,
    paddingHorizontal: 8.5,

    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 20,
    shadowColor: 'rgba(167, 171, 201, 0.15)',
    shadowOpacity: 1,

    // box-shadow: 0px 0px 20px rgba(167, 171, 201, 0.15);

    elevation: 24,
  },
  modalBtn: {
    width: SCREEN_WIDTH / 2 - 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 10,
  },
  //3차 작업 12월
  scheduleInfoBox: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ECEEF5',
    borderRadius: 10,
    paddingVertical: 16,
    paddingLeft: 28,
    marginVertical: 16,
    marginHorizontal: 24,
  },
  allClickBox: {
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E5E5',
    justifyContent: 'space-between',
  },
});

export default StatusCheck;
