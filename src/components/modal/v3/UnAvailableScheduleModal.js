import React from 'react';

import { Modal, ScrollView, StyleSheet, View } from 'react-native';
import { SCREEN_HEIGHT } from '../../../constants/constants';
import {
  BoldLabel14,
  BoldLabel16,
  BoldLabel18,
  NormalBoldLabel14,
} from '../../Label';
import RowContainer from '../../containers/RowContainer';
import Touchable from '../../buttons/Touchable';
import dayjs from 'dayjs';

const UnAvailableScheduleModal = ({
  visible,
  onRequestClose,
  imPossibleDateInfo,
}) => {
  return (
    <Modal transparent={true} visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalBackground} onPress={onRequestClose}>
        <View style={styles.scrollParentContainer}>
          <BoldLabel16
            text={
              dayjs(imPossibleDateInfo.date).format('YYYY년 MM월 DD일') ?? ''
            }
            style={{ ...styles.blackColor, marginBottom: 15 }}
          />
          <ScrollView>
            {imPossibleDateInfo?.data?.map((data, index) => (
              <RowContainer key={index} style={{ marginBottom: 6 }}>
                <BoldLabel14
                  text={`${
                    data?.lessonName ? `[수강] ${data?.lessonName}` : data?.type
                  }`}
                  style={{ color: '#555' }}
                />
                <NormalBoldLabel14
                  text={`${data?.startTime.slice(0, 5)} ~ ${data?.endTime.slice(
                    0,
                    5
                  )}`}
                  style={{ marginLeft: 5, ...styles.grayColor }}
                />
              </RowContainer>
            ))}
          </ScrollView>
          <BoldLabel14
            text={'중복된 일정은 제외됩니다.'}
            style={{ ...styles.redColor, marginBottom: 17, marginTop: 15 }}
          />
          <Touchable style={styles.button} onPress={onRequestClose}>
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
  grayColor: { color: '#555555' },
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
  itemBtn: {
    padding: 16,
    marginHorizontal: 8,
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
  container: {
    alignItems: 'center',
  },
});

export default UnAvailableScheduleModal;
