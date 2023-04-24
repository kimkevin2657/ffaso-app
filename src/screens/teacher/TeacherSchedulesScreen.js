import React, { useCallback, useEffect } from 'react';
import { Text, Alert, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import TeacherCalendarCustom from '../../components/modal/TeacherCalendarCustom';
import { getTeacherSchedules } from '../../redux/scheduleSlice';
import { useFocusEffect } from '@react-navigation/native';

const today = moment(new Date()).format('YYYY-MM-DD');

const TeacherSchedulesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { schedules = [] } = useSelector((state) => state.schedule);
  const { teacherGyms = [] } = useSelector((state) => state.teacherGym);

  useFocusEffect(
    useCallback(() => {
      dispatch(getTeacherSchedules(today, user?.id));
    }, [])
  );

  useEffect(() => {
    navigation.setOptions({
      // title: '스케줄러',
      headerTitleAlign: 'center',
      headerStyle: {
        // backgroundColor: '#FBFBFB',
      },
      headerRight: () => (
        <TouchableOpacity
          style={{ padding: 4, marginRight: 16 }}
          onPress={() => {
            if(teacherGyms.length===0){
              Alert.alert('소속된 센터가 없습니다.');
              return;
            }
            navigation.navigate('ScheduleRegistration')
          }}
        >
          <Image
            style={styles.plusActionable}
            source={require('../../assets/images/Calendar/plus.png')}
          />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <TeacherCalendarCustom navigation={navigation} schedules={schedules} />
    </View>
  );
};

export default TeacherSchedulesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    resizeMode: 'contain',
    width: 24,
    height: 30,
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
