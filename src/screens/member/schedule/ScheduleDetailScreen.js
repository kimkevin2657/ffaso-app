import React, { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, Image, Modal } from 'react-native';
import Touchable from '../../../components/buttons/Touchable';
import moment from 'moment';
import MySchedule from '../../../components/MySchedule';
import { NormalBoldLabel, NoneLabel } from '../../../components/Label';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../../constants/constants';
import LessonReservationEditForm from '../../../components/scheduleclick/LessonReservationEditForm';

const list = [{ type: '강습' }, { type: '방문' }];

const ScheduleDetailScreen = ({ navigation, route }) => {
  const { selectedDate, schedules = [] } = route.params;
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [isLessonEditOpen, setIsLessonEditOpen] = useState(false);
  const [isVisitReservation, setIsVistitReservation] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: moment(selectedDate).format('YYYY년 M월 DD일'),

      // headerRight: () =>
      //   schedules.length === 0 && (
      //     <Touchable onPress={() => navigation.navigate('ScheduleRegister')}>
      //       <Image
      //         style={styles.plusActionable}
      //         source={require('../../../assets/images/Calendar/plus.png')}
      //       />
      //     </Touchable>
      //   ),
    });
  }, []);

  return (
    <>
      {/* 삭제 모달 */}
      <Modal visible={isVisitReservation} transparent>
        <View style={styles.cancelModalCotainer}>
          <View style={styles.cancelModalFrame}>
            <View
              style={{ borderBottomColor: '#E3E5E5', borderBottomWidth: 1 }}
            >
              <NoneLabel
                text={'방문 예약 삭제'}
                style={styles.cancelModalTitle}
              />
            </View>
            <View
              style={{
                borderBottomColor: '#E3E5E5',
                borderBottomWidth: 1,
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../../assets/images/null/visitCancelImg.png')}
                resizeMode='contain'
                style={{
                  width: 66,
                  height: 66,
                  marginTop: 21,
                  marginBottom: 20,
                }}
              />
              <NoneLabel
                text={'예약이 정상적으로 삭제되었습니다.'}
                style={{
                  color: '#000000',
                  fontWeight: 'bold',
                  marginBottom: 29,
                }}
              />
            </View>
            <Touchable onPress={() => setIsVistitReservation(false)}>
              <NoneLabel text={'확인'} style={styles.cancelModalCheckBtn} />
            </Touchable>
          </View>
        </View>
      </Modal>

      <Modal visible={isLessonEditOpen} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              marginHorizontal: 17,
              backgroundColor: 'white',
              minWidth: SCREEN_WIDTH * 0.86,
              minHeight: SCREEN_HEIGHT * 0.55,
              borderRadius: 10,
            }}
          >
            <LessonReservationEditForm
              isVisible={() => setIsLessonEditOpen(false)}
            />
          </View>
        </View>
      </Modal>

      {schedules.length === 0 && (
        <View style={styles.center}>
          <Image
            source={require('../../../assets/icons/scheduleNull.png')}
            style={styles.nullIcon}
          />
          <NormalBoldLabel
            text={'등록된 일정이 없습니다.'}
            style={styles.nullText}
          />
        </View>
      )}
      {schedules.length > 0 && (
        <FlatList
          style={styles.container}
          data={schedules}
          renderItem={({ item, index }) => (
            <MySchedule
              {...item}
              item={item}
              isLast={index === list.length - 1}
              onUpdate={() => setIsLessonEditOpen(true)}
              onDelete={() => setIsVistitReservation(true)}
              onModalOpenPress={() => setSelectedSchedule(index)}
              isModalActive={selectedSchedule === index}
            />
          )}
          keyExtractor={(item, idx) => item.id + idx.toString()}
        />
      )}
    </>
  );
};

export default ScheduleDetailScreen;

const styles = StyleSheet.create({
  plusActionable: {
    resizeMode: 'contain',
    width: 24,
    height: 30,
  },
  cancelModalCheckBtn: {
    paddingVertical: 20,
    color: '#8082FF',
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: 28,
  },
  cancelModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    lineHeight: 22,
    paddingVertical: 14,
    marginLeft: 24,
  },
  cancelModalFrame: {
    marginHorizontal: 17,
    backgroundColor: 'white',
    minWidth: SCREEN_WIDTH * 0.86,
    minHeight: SCREEN_HEIGHT * 0.32,
    borderRadius: 10,
  },
  cancelModalCotainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fbfbfb',
    paddingLeft: 24,
    paddingRight: 32,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  nullIcon: {
    width: 120,
    height: 127,
  },
  nullText: {
    fontSize: 20,
    lineHeight: 24,
    marginTop: 25.57,
    color: '#aaa',
  },
});
