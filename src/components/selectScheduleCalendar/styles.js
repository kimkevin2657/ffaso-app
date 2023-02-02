import styled from 'styled-components/native';

export const CalendarContainer = styled.View`
  padding-top: 18px;
`;
export const CalendarRow = styled.View`
  border-top-width: 1px;
  border-color: #e3e5e5;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 5px;
`;
export const DatesContainer = styled.View`
  flex: 1;
  margin-bottom: 14px;
  height: ${(props) => props.height * 0.085};
  align-items: center;
  justify-content: center;
`;
export const DateCircle = styled.TouchableOpacity`
  width: 80%;
  aspect-ratio: 1;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  //background-color: rgba(167, 171, 201, 0.15);
  background-color: ${(props) =>
    props.isActive
      ? '#5EC762'
      : props.isNotActive
      ? '#FF5656'
      : 'rgba(167, 171, 201, 0.15)'};
`;

export const SelectText = styled.Text`
  color: #8082ff;
  font-weight: bold;
  font-size: 15px;
`;
export const DateContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 4px;
`;
export const Days = styled.Text`
  font-size: 12px;
  line-height: 24px;
  font-weight: bold;
  color: ${(props) =>
    props.isSunday ? '#FF0000' : props.isSaturday ? '#1027F3' : '#000'};
`;

export const DateNumber = styled.Text`
  font-weight: bold;
  font-size: 12px;
  color: ${(props) =>
    props.isFocused
      ? 'white'
      : props.notIncludeThisMonth && props.isSaturday
      ? '#CBD0FF'
      : props.isSaturday
      ? '#1027F3'
      : props.holiday && props.notIncludeThisMonth
      ? '#FFA2A2'
      : props.notIncludeThisMonth
      ? '#E3E5E5'
      : props.isToday
      ? '#fff'
      : props.isholiday
      ? '#FF0000'
      : '#555555'};
`;

export const PlanText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 10px;
  line-height: 15px;
`;
