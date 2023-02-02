import React from 'react';

import { Modal, StyleSheet, Text, View } from 'react-native';
import { SCREEN_HEIGHT } from '../../../constants/constants';
import { BoldLabel16, BoldLabel18 } from '../../Label';
import Touchable from '../../buttons/Touchable';
import dayjs from 'dayjs';

const HolidayModal = ({ date, visible, onRequestClose }) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalBackground} onPress={onRequestClose}>
        <View style={styles.scrollParentContainer}>
          <BoldLabel16
            text={dayjs(date).format('YYYY년 MM월 DD일') ?? ''}
            style={styles.blackColor}
          />
          <BoldLabel16
            text={'센터 휴관일 입니다.'}
            style={{ ...styles.redColor, marginTop: 44, marginBottom: 51 }}
          />
          <Touchable
            style={styles.button}
            onPress={() => {
              onRequestClose();
            }}
          >
            <BoldLabel18 text={'확인'} />
          </Touchable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blackColor: {
    color: '#000',
  },
  redColor: {
    color: '#FF5656',
  },
  modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
  },
  scrollParentContainer: {
    justifyContent: 'center',
    marginHorizontal: 24,
    borderRadius: 10,
    maxHeight: SCREEN_HEIGHT * 0.4,
    alignItems: 'center',
    paddingVertical: 23,
    backgroundColor: '#fff',
  },

  button: {
    backgroundColor: '#8082FF',
    borderRadius: 10,
    width: 145,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
});

export default HolidayModal;
