import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CalendarCustom from '../../../components/calendarCustom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { getMemberSchedules } from '../../../redux/scheduleSlice';
import { useFocusEffect } from '@react-navigation/native';
import BottomModal from '../../../components/modal/BottomModal';

const today = moment(new Date()).format('YYYY-MM-DD');
const bottomModalList = [
  { title: '수강 예약 요청', subTitle: '' },
  {
    title: '방문 예약 요청',
    subTitle: '방문 예약 요청은 쿠폰사용 후 예약 가능합니다.',
  },
];

const MemberSchedulesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { schedules = [] } = useSelector((state) => state.schedule);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      dispatch(getMemberSchedules(today));
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      title: '스케줄러',
      headerTitleAlign: 'center',
      headerStyle: {
        // backgroundColor: '#FBFBFB',
      },
      headerRight: () => (
        <TouchableOpacity
          style={{ padding: 4 }}
          onPress={() => setIsBottomModalOpen(true)}
        >
          <Image
            style={styles.plusActionable}
            source={require('../../../assets/images/Calendar/plus.png')}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <CalendarCustom navigation={navigation} schedules={schedules} />
      {isBottomModalOpen && (
        <BottomModal
          list={bottomModalList}
          isModalOpen={isBottomModalOpen}
          onClose={() => setIsBottomModalOpen(false)}
          subTitleStyle={{
            marginTop: 6,
            color: '#aaa',
            fontSize: 12,
            lineHeight: 16,
          }}
          onSelect={(info, index) => {
            const reservationType = index === 0 ? '강습' : '방문';
            navigation.navigate('ScheduleRegister', { reservationType });
            setIsBottomModalOpen(false);
          }}
        />
      )}
    </View>
  );
};

export default MemberSchedulesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  scheduleTopInner: {
    borderBottomWidth: 1,
    borderColor: '#E3E5E5',
  },

  titleInner: {
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 21,
  },

  containerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  plusActionable: {
    // resizeMode: 'contain',
    width: 24,
    height: 24,
    marginRight: 20,
  },

  theme: {
    backgroundColor: '#ffffff',
    calendarBackground: '#ffffff',
    textSectionTitleColor: '#b6c1cd',
    textSectionTitleDisabledColor: '#d9e1e8',
    selectedDayBackgroundColor: '#00adf5',
    selectedDayTextColor: '#ffffff',
    todayTextColor: '#00adf5',
    dayTextColor: '#2d4150',
    textDisabledColor: '#d9e1e8',
    dotColor: '#00adf5',
    selectedDotColor: '#ffffff',
    arrowColor: 'orange',
    disabledArrowColor: '#d9e1e8',
    monthTextColor: 'blue',
    indicatorColor: 'blue',
    textDayFontFamily: 'monospace',
    textMonthFontFamily: 'monospace',
    textDayHeaderFontFamily: 'monospace',
    textDayFontWeight: '300',
    textMonthFontWeight: 'bold',
    textDayHeaderFontWeight: '300',
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16,
  },
});
