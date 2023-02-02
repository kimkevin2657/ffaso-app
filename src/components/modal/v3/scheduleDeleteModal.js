import React from 'react';

import { Modal, StyleSheet, View, Image } from 'react-native';
import { BoldLabel18, NormalLabel12 } from '../../Label';
import Touchable from '../../buttons/Touchable';
import RowContainer from '../../containers/RowContainer';

const ScheduleDeleteModal = ({ onPress, visible, onRequestClose, text }) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalBackground} onPress={onRequestClose}>
        <View style={styles.scrollParentContainer}>
          <Image
            source={require('../../../assets/icons/checkMainColor.png')}
            style={styles.image}
          />
          <RowContainer style={{ marginTop: 23 }}>
            <BoldLabel18 text={'삭제 '} style={styles.mainColor} />
            <BoldLabel18
              text={'처리 하시겠습니까?'}
              style={styles.blackColor}
            />
          </RowContainer>
          <NormalLabel12
            text={text}
            style={{ ...styles.gray, marginTop: 16, marginBottom: 30 }}
          />
          <RowContainer>
            <Touchable
              style={{
                ...styles.button,
                backgroundColor: '#AAA',
                marginRight: 11,
              }}
              onPress={() => {
                onRequestClose();
              }}
            >
              <BoldLabel18 text={'취소'} />
            </Touchable>
            <Touchable style={styles.button} onPress={onPress}>
              <BoldLabel18 text={'삭제'} />
            </Touchable>
          </RowContainer>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
  },
  mainColor: {
    color: '#8082FF',
  },
  blackColor: {
    color: '#000',
  },
  gray: {
    color: '#AAAAAA',
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
    alignItems: 'center',
    paddingTop: 27,
    paddingBottom: 23,
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

export default ScheduleDeleteModal;
