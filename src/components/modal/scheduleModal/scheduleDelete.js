import React from 'react';

import { Text, Image } from 'react-native';
import Touchable from '../../buttons/Touchable';
import styled from 'styled-components/native';
import { NoneLabel, NormalBoldLabel, NormalBoldLabel12 } from '../../Label';
import { SCREEN_WIDTH } from '../../../constants/constants';

const ScheduleDelete = ({ setOpenModal }) => {
  return (
    <Container>
      <TopContainer>
        <NoneLabel
          text={'일정삭제'}
          style={{ fontSize: 18, fontWeight: 'bold' }}
        />
      </TopContainer>
      <CenterContainer>
        <CenterImage
          SCREEN_WIDTH={SCREEN_WIDTH}
          resizeMode='contain'
          source={require('../../../assets/images/scheduleModal/deleteSchedule.png')}
        />
        <NormalBoldLabel12
          text={'일정이 정상적으로 삭제 되었습니다'}
          style={{ color: '#000000', marginTop: 20 }}
        />
      </CenterContainer>
      <BottomContainer>
        <Touchable onPress={() => setOpenModal(false)}>
          <NormalBoldLabel
            text={'확인'}
            style={{ color: '#8082FF', textAlign: 'right' }}
          />
        </Touchable>
      </BottomContainer>
    </Container>
  );
};
const CenterImage = styled.Image`
  height: ${(props) => props.SCREEN_WIDTH * 0.21};
`;
const Container = styled.View``;
const TopContainer = styled.View`
  margin-horizontal: -24px;
  padding-horizontal: 24px;
  padding-bottom: 14px;
  margin-top: -10px;
  border-bottom-width: 1px;
  border-color: #e3e5e5;
`;
const CenterContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding-top: 21px;
  padding-bottom: 29px;
`;
const BottomContainer = styled.View`
  padding-top: 20px;
  border-top-width: 1px;
  border-color: #e3e5e5;
  margin-horizontal: -24px;
  padding-horizontal: 24px;
`;

export default ScheduleDelete;
