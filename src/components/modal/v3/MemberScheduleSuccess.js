import React from 'react';

import { Modal, StyleSheet, View } from 'react-native';
import { BoldLabel18 } from '../../Label';
import Touchable from '../../buttons/Touchable';

const MemberScheduleSuccess = ({ visible, onRequestClose, onPress }) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalBackground} onPress={onRequestClose}>
        <View style={styles.scrollParentContainer}>
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <BoldLabel18
              text={'수강일정이 등록 되었습니다.'}
              style={{ color: '#000' }}
            />
          </View>
          <Touchable style={styles.button} onPress={onPress}>
            <BoldLabel18 text={'일정 바로가기'} />
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
    flexDirection: 'column',
    justifyContent: 'center',
    marginHorizontal: 24,
    borderRadius: 10,
    height: 193,
    paddingHorizontal: 13,
    backgroundColor: '#fff',
    paddingBottom: 23,
  },

  button: {
    backgroundColor: '#8082FF',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: '100%',
    justifyContent: 'center',
  },
});

export default MemberScheduleSuccess;
