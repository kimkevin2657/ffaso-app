import React, { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';
import styled from 'styled-components/native';
import { NormalBoldLabel12 } from '../../../components/Label';
import GradientButton from '../../../components/buttons/GradientButton';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import api from '../../../api/api';
import { resetNavigation } from '../../../util';

const AssignmentDetailScreen = ({ route, navigation }) => {
  const selectedProduct = route?.params?.selectedProduct;
  const selectUser = route?.params?.selectUser;
  const isMembership = selectedProduct?.type === '회원권';
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (selectedProduct === undefined || selectUser === undefined) {
      navigation.goBack();
    }
  }, []);

  const toDay = dayjs(dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD HH:mm:ss.SSS');
  const productCreatedAt = dayjs(
    selectedProduct?.createdAt,
    'YYYY-MM-DD HH:mm:ss.SSS'
  );
  const productExpiryDate = dayjs(
    selectedProduct?.expiryDate,
    'YYYY-MM-DD HH:mm:ss.SSS'
  );
  const assignmentList = [
    {
      title: '양도 회원명',
      value: user?.koreanName + ' (' + user?.userNumber + ')',
    },
    {
      title: '사용 횟수',
      value: selectedProduct?.usedCount,
    },
    {
      title: '등록 기간',
      value: selectedProduct?.createdAt + ' ~ ' + selectedProduct?.expiryDate,
    },
    {
      title: '사용일',
      value: toDay.diff(productCreatedAt, 'day'),
    },
  ];
  const acquisitionList = [
    {
      title: '양수 회원명',
      value: selectUser?.koreanName + ' (' + selectUser?.userNumber + ')',
    },
    {
      title: '양수 횟수',
      value: selectedProduct?.totalCount - selectedProduct?.usedCount,
    },
    {
      title: '양수 기간',
      value: dayjs().format('YYYY-MM-DD') + ' ~ ' + selectedProduct?.expiryDate,
    },
    {
      title: '양수일',
      value: productExpiryDate.diff(toDay, 'day'),
    },
  ];

  const onAssignment = async () => {
    let body = {
      paymentId: isMembership
        ? selectedProduct?.membershipPayment
        : selectedProduct?.lessonTicketPayment,
      productId: selectedProduct?.id,
      sender: user?.id,
      receiver: selectUser?.id,
      productType: isMembership ? '회원권' : '수강권',
    };

    try {
      let { data } = await api.post('assignments/', body, {
        headers: { Authorization: `Token ${token}` },
      });
      console.log('', data);
      Alert.alert(data?.msg);
      resetNavigation(navigation, 'MemberMain');
    } catch (err) {
      console.log(err);
      console.log('err', err.response);
    }
  };
  return (
    <Container>
      <View>
        <SelectBox>
          <NormalBoldLabel12
            text={selectedProduct?.name}
            style={{ color: '#AAAAAA', fontWeight: 'normal' }}
          />
        </SelectBox>
        <NormalBoldLabel12
          text={'양도 정보'}
          style={{ color: '#555555', marginTop: 17, marginBottom: 5 }}
        />
        <AssignmentBox>
          {assignmentList.map(
            (assignment, index) =>
              !(isMembership && index === 1) && (
                <RowBox key={index}>
                  <NormalBoldLabel12
                    text={assignment.title}
                    style={{
                      color: '#555555',
                      marginRight: 24,
                      width: 65,
                    }}
                  />
                  <NormalBoldLabel12
                    text={assignment?.value}
                    style={{ color: '#555555', fontWeight: 'normal' }}
                  />
                </RowBox>
              )
          )}
        </AssignmentBox>
        <NormalBoldLabel12
          text={'양수 정보'}
          style={{ color: '#555555', marginTop: 30, marginBottom: 5 }}
        />
        <AssignmentBox>
          {acquisitionList.map(
            (assignment, index) =>
              !(isMembership && index === 1) && (
                <RowBox key={index}>
                  <NormalBoldLabel12
                    text={assignment.title}
                    style={{ color: '#555555', marginRight: 24, width: 65 }}
                  />
                  <NormalBoldLabel12
                    text={assignment?.value}
                    style={{ color: '#555555', fontWeight: 'normal' }}
                  />
                </RowBox>
              )
          )}
        </AssignmentBox>
      </View>
      <View>
        <InfoText>
          양도 및 양수 정보를 확인 하신 후 양도를 진행해주세요.
        </InfoText>
        <GradientButton
          onPress={onAssignment}
          style={{
            height: 55,
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 24,
            }}
          >
            양도
          </Text>
        </GradientButton>
      </View>
    </Container>
  );
};
const InfoText = styled.Text`
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  color: #8082ff;
  margin-bottom: 15px;
  text-align: center;
`;
const RowBox = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;
const AssignmentBox = styled.View`
  background-color: #ffffff;
  border: 1px solid #e3e5e5;
  border-radius: 10px;
  padding-horizontal: 19px;
  padding-top: 15px;
`;
const Container = styled.View`
  padding-horizontal: 24px;
  padding-vertical: 19px;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;
const SelectBox = styled.View`
  background: #ffffff;
  border: 1px solid #e3e5e5;
  border-radius: 10px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
`;
export default AssignmentDetailScreen;
