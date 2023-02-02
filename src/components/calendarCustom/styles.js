import styled from 'styled-components/native';

export const CalendarContainer = styled.View`
  //padding-vertical: 38px;
  padding-top: 18px;
  //padding-horizontal: 0px;
`;
export const CalendarRow = styled.View`
  border-top-width: 1px;
  border-color: #e3e5e5;
  flex-direction: row;
  justify-content: space-around;
  padding-top: 5px;
`;
export const DatesContainer = styled.TouchableOpacity`
  flex: 1;
  margin-bottom: 14px;
  height: ${(props) => `${props.height * 0.085}px`};
  //flex-direction: column;
  //justify-content: space-between;
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
  margin-left: ${(props) => (props.isToday ? 0 : '8px')};
  margin-bottom: 4px;
  /* background-color: red; */
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
  color: ${(props) =>
    props.notIncludeThisMonth && props.isSaturday
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
export const PlanBox = styled.View`
  width: 100%;
  background-color: ${(props) => props.backgrounds};
`;
export const PlanText = styled.Text`
  color: #ffffff;
  font-weight: bold;
  font-size: 10px;
  line-height: 15px;
`;
