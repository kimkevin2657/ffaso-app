import React from 'react';

import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { BoldLabel18, NormalBoldLabel, NormalLabel } from '../../Label';
import RowContainer from '../../containers/RowContainer';
import Touchable from '../../buttons/Touchable';
import { SCREEN_WIDTH } from '../../../constants/constants';

const AllUserStatusModal = ({
  isVisible,
  setIsVisible,
  onPress,
  type = '',
}) => {
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
    >
      <TouchableOpacity
        onPress={() => setIsVisible(false)}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 10,
            paddingHorizontal: 13,
            paddingTop: 27,
            paddingBottom: 23,
          }}
        >
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: '#CCD2E3',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 23,
              }}
            >
              <AntDesign
                name='check'
                size={20}
                color={'#fff'}
                style={{ padding: 4, alignSelf: 'center' }}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                lineHeight: 24,
                color: '#000',
                fontWeight: '700',
              }}
            >
              <Text style={{ color: '#8082ff' }}>{`전체 ${type}`} </Text>
              처리 하시겠습니까?
            </Text>
          </View>

          <RowContainer>
            <Touchable
              style={{
                ...styles.modalBtn,
                backgroundColor: '#aaa',
                marginRight: 11,
              }}
              onPress={() => setIsVisible(false)}
            >
              <NormalBoldLabel
                text={'취소'}
                style={{ fontSize: 18, lineHeight: 22, color: '#fff' }}
              />
            </Touchable>
            <Touchable
              style={{ ...styles.modalBtn, backgroundColor: '#8082FF' }}
              onPress={onPress}
            >
              <NormalBoldLabel
                text={'출석'}
                style={{ fontSize: 18, lineHeight: 22, color: '#fff' }}
              />
            </Touchable>
          </RowContainer>
        </View>
      </TouchableOpacity>
    </Modal>
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
  checkbox: {
    resizeMode: 'contain',
    width: 18,
    height: 18,
  },
});

export default AllUserStatusModal;
