import React, { useState } from 'react';

import { View, TouchableOpacity, Image, Dimensions } from 'react-native';

import {
  CalendarContainer,
  CalendarRow,
  DateCircle,
  DateContainer,
  DateNumber,
  DatesContainer,
  Days,
  SelectText,
} from './styles';
import dayjs from 'dayjs';

const SelectScheduleCalendar = ({ responseDates, onClickUnavailableDate }) => {
  const acceptDates = responseDates?.possibleDates;
  const notAcceptDates = responseDates?.imPossibleDates;

  const Dates = ['일', '월', '화', '수', '목', '금', '토'];
  const window_height = Dimensions.get('window').height;

  let weekOfYear = require('dayjs/plugin/weekOfYear');
  dayjs.extend(weekOfYear);
  const [selectDate, setSelectDate] = useState(new Date());
  const today = dayjs(selectDate);
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
              let days = today
                .clone()
                .startOf('year')
                .week(week)
                .startOf('week')
                .add(index, 'day');
              if (days.format('MM') !== today.format('MM')) {
                return (
                  <DatesContainer key={index} height={window_height}>
                    <DateCircle>
                      <DateNumber
                        color={'#CACCD6'}
                        isToday={false}
                        notIncludeThisMonth={true}
                        holiday={index === 0}
                        isSaturday={index === 6}
                      >
                        {days.format('D')}
                      </DateNumber>
                    </DateCircle>
                  </DatesContainer>
                );
              } else {
                const isActive = acceptDates.includes(
                  days.format('YYYY-MM-DD')
                );
                const isNotActive = notAcceptDates.includes(
                  days.format('YYYY-MM-DD')
                );
                const isFocused = isActive || isNotActive;
                return (
                  <DatesContainer key={index} height={window_height}>
                    <DateCircle
                      isActive={isActive}
                      isNotActive={isNotActive}
                      onPress={() => {
                        if (isNotActive) {
                          onClickUnavailableDate(days.format('YYYY-MM-DD'));
                        }
                      }}
                    >
                      <DateNumber
                        color={'#000000'}
                        isToday={false}
                        isholiday={index === 0}
                        isSaturday={index === 6}
                        isFocused={isFocused}
                      >
                        {days.format('D')}
                      </DateNumber>
                    </DateCircle>
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
    <CalendarContainer>
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
            source={require('../../assets/images/Calendar/calendarLeft_arr.png')}
            resizeMode={'contain'}
            style={{ width: 7, height: 12 }}
          />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <SelectText>
            {selectDate.getUTCFullYear() +
              '월 ' +
              parseInt(String(selectDate.getMonth() + 1)) +
              '월'}
          </SelectText>
        </View>

        <TouchableOpacity
          style={{ padding: 4 }}
          onPress={() => {
            setSelectDate(
              new Date(selectDate.setMonth(selectDate.getMonth() + 1))
            );
          }}
        >
          <Image
            source={require('../../assets/images/Calendar/calendarRight_arr.png')}
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
    </CalendarContainer>
  );
};

export default SelectScheduleCalendar;
