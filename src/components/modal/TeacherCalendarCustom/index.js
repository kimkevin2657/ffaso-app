import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Dimensions } from 'react-native';
import {
  CalendarRow,
  DateContainer,
  DateNumber,
  DatesContainer,
  Days,
  SelectText,
  PlanBox,
  PlanText,
  TeacherCalendarContainer,
} from './styles';
import moment from 'moment';
import { SCREEN_WIDTH, TEACHER_TYPE_COLOR } from '../../../constants/constants';
import { NormalBoldLabel } from '../../Label';
import RowContainer from '../../containers/RowContainer';

const window_height = Dimensions.get('window').height;

let Dates = ['일', '월', '화', '수', '목', '금', '토'];

const TeacherCalendarCustom = ({ navigation, schedules }) => {
  // const CalendarCustom = ({ navigation }) => {
  const [selectDate, setSelectDate] = useState(new Date());
  const today = moment(selectDate);
  const firstWeek = today.clone().startOf('month').week();
  const lastWeek =
    today.clone().endOf('month').week() === 1
      ? 53
      : today.clone().endOf('month').week();

  const calendarArr = () => {
    let result: any[] = [];
    let week = firstWeek;
    for (week; week <= lastWeek; week++) {
      result = result.concat(
        <CalendarRow key={week}>
          {Array(7)
            .fill(0)
            .map((data, index) => {
              let day = today
                .clone()
                .startOf('year')
                .week(week)
                .startOf('week')
                .add(index, 'day'); //d로해도되지만 직관성
              // 현재 날짜 표시 소스
              if (
                !schedules[moment(day).format('YYYY-MM-DD')] &&
                moment().format('YYYYMMDD') === day.format('YYYYMMDD')
              ) {
                return (
                  <DatesContainer
                    // onPress={() => {
                    //   const selectedDate = moment(day).format('YYYY-MM-DD');
                    //   navigation.navigate('ScheduleDetail', {
                    //     selectedDate,
                    //     schedules:
                    //       schedules[selectedDate]?.length > 0
                    //         ? schedules[selectedDate]
                    //         : [],
                    //   });
                    // }}
                    key={index}
                    height={window_height}
                  >
                    <View
                      style={{
                        //수정해야함
                        // marginLeft: -12.5,
                        marginTop: -5,
                        backgroundColor: '#8082FF',
                        borderRadius: 50,
                        width: 25,
                        height: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <DateNumber isToday={true}>{day.format('D')}</DateNumber>
                    </View>
                  </DatesContainer>
                );
              } else if (day.format('MM') !== today.format('MM')) {
                return (
                  <DatesContainer
                    onPress={() => {
                      const selectedDate = moment(day).format('YYYY-MM-DD');
                      navigation.navigate('TeacherScheduleDetail', {
                        selectedDate,
                        schedules:
                          schedules[selectedDate]?.length > 0
                            ? schedules[selectedDate]
                            : [],
                      });
                    }}
                    key={index}
                    height={window_height}
                  >
                    <DateNumber
                      isToday={false}
                      notIncludeThisMonth={true}
                      holiday={index === 0}
                      isSaturday={index === 6}
                    >
                      {day.format('D')}
                    </DateNumber>
                    {/*<EmojiBox />*/}
                  </DatesContainer>
                );
              } else {
                return (
                  <DatesContainer
                    onPress={() => {
                      const selectedDate = moment(day).format('YYYY-MM-DD');
                      navigation.navigate('TeacherScheduleDetail', {
                        selectedDate,
                        schedules:
                          schedules[selectedDate]?.length > 0
                            ? schedules[selectedDate]
                            : [],
                      });
                    }}
                    key={index}
                    height={window_height}
                  >
                    <DateNumber
                      isToday={false}
                      isholiday={index === 0}
                      isSaturday={index === 6}
                    >
                      {day.format('D')}
                    </DateNumber>

                    {Object.keys(schedules).length > 0 &&
                      schedules[moment(day).format('YYYY-MM-DD')]?.length > 0 &&
                      schedules[moment(day).format('YYYY-MM-DD')]
                        .slice(0, 1)
                        .map((schedule, i) => {
                          if (i < 3) {
                            return (
                              <PlanBox
                                key={schedule.id}
                                backgrounds={TEACHER_TYPE_COLOR[schedule.type]}
                              >
                                <PlanText
                                  // style={{ width: SCREEN_WIDTH / 8.4 }}
                                  numberOfLines={1}
                                  ellipsizeMode={'tail'}
                                >
                                  {`  ${schedule.type}`}
                                  {/*{`${schedule.type} ${*/}
                                  {/*  schedule?.lessonName*/}
                                  {/*    ? schedule?.lessonName*/}
                                  {/*    : */}
                                  {/*      ''*/}
                                  {/*}`}*/}
                                </PlanText>
                              </PlanBox>
                            );
                          } else if (i === 3) {
                            return (
                              <RowContainer
                                style={{
                                  backgroundColor: '#eee',
                                  justifyContent: 'space-between',
                                  paddingLeft: 5,
                                }}
                              >
                                <NormalBoldLabel
                                  text={`\u2022 \u2022 \u2022`}
                                  style={{
                                    color: '#555',
                                    padding: 0,
                                    margin: 0,
                                    fontSize: 8,
                                    fontWeight: '400',
                                  }}
                                />
                                <NormalBoldLabel
                                  text={` +${
                                    schedules[moment(day).format('YYYY-MM-DD')]
                                      .length - 3
                                  }`}
                                  style={{
                                    color: '#555',
                                    padding: 0,
                                    margin: 0,
                                    fontSize: 10,
                                    fontWeight: '400',
                                  }}
                                />
                              </RowContainer>
                            );
                          }
                        })}
                  </DatesContainer>
                );
              }
            })}
        </CalendarRow>
      );
    }
    return result;
  };
  return (
    <TeacherCalendarContainer>
      {/*{console.log(*/}
      {/*    '11',*/}
      {/*    posts.filter((el: any) => moment(el.dateTime).format('20210820') === moment().format('20210820')).length*/}
      {/*)}*/}
      <View
        style={{
          marginBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity
          style={{ padding: 4 }}
          onPress={() => {
            setSelectDate(
              new Date(selectDate.setMonth(selectDate.getMonth() - 1))
            );
          }}
        >
          <Image
            source={require('../../../assets/images/Calendar/calendarLeft_arr.png')}
            resizeMode={'contain'}
            style={{ width: 7, height: 12 }}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* <Touchable onPress={() => setIsDatePickerOpen(true)}> */}
          <SelectText>
            {selectDate.getUTCFullYear() +
              '월 ' +
              parseInt(String(selectDate.getMonth() + 1)) +
              '월'}
          </SelectText>
          {/* </Touchable> */}
          {/* BirthPicker 년 월 일이 뜨며 월  */}
          {/* <View style={styles.birthdayBox}>
            <BirthPicker
              isOpen={isDatePickerOpen}
              date={selectDate}
              onConfirm={selectedDate => {
                selectDate(selectedDate);
                setIsDatePickerOpen(false);
              }}
              onCancel={() => setIsDatePickerOpen(false)}
            />
          </View> */}
          {/* <Image
            source={require('../../assets/images/Calendar/calendarDown.png')}
            resizeMode={'contain'}
            style={{width: 8, height: 5, marginLeft: 4}}
          /> */}
        </View>
        {/*<TouchableOpacity onPress={() => onChange()}>*/}
        {/*<Image*/}
        {/*  source={require('Images/isMore.png')}*/}
        {/*  resizeMode={'contain'}*/}
        {/*  style={{width: 24, height: 24}}*/}
        {/*/>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity
          style={{ padding: 4 }}
          onPress={() => {
            setSelectDate(
              new Date(selectDate.setMonth(selectDate.getMonth() + 1))
            );
          }}
        >
          <Image
            source={require('../../../assets/images/Calendar/calendarRight_arr.png')}
            resizeMode={'contain'}
            style={{ width: 7, height: 12 }}
          />
        </TouchableOpacity>
      </View>
      <DateContainer>
        {Dates.map((date, index) => (
          <Days key={index}>{date}</Days>
        ))}
      </DateContainer>
      <View>
        <View>{calendarArr()}</View>
      </View>
    </TeacherCalendarContainer>
  );
};
export default TeacherCalendarCustom;
