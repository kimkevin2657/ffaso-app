import React from 'react';
import styled from 'styled-components/native';
import { NormalBoldLabel12 } from '../../../components/Label';
import GradientButton from '../../../components/buttons/GradientButton';
import { Alert, Text, View } from 'react-native';
import dayjs from 'dayjs';
import { commaNum, resetNavigation } from '../../../util';
import { useSelector } from 'react-redux';
import api from '../../../api/api';

const RefundDetailScreen = ({ navigation, route: { params } }) => {
  const auth = useSelector((state) => state.auth);
  const { user, token } = auth;
  const { selectedProduct, accountHolder, bank, accountNumber, refundReason } =
    params;
  const isTicket = selectedProduct?.productType.includes('수강권');
  //--------------------------회원권 경우 계산--------------------------------------
  const totalAvailableDays = dayjs(selectedProduct?.availableEndDate).diff(
    dayjs(selectedProduct?.availableStartDate),
    'day'
  ); //총 사용일 수
  const remindAvailableDays = dayjs(selectedProduct?.availableEndDate).diff(
    dayjs(),
    'day'
  ); //남은 일수
  const oneDayPrice = parseInt(selectedProduct?.price / totalAvailableDays); //1일 금액
  //--------------------------회원권 경우 계산--------------------------------------

  //--------------------------수강권일 경우 계산--------------------------------------
  const oneCountPrice = parseInt(
    selectedProduct?.price / selectedProduct?.totalCount
  ); //일회당 가격
  //--------------------------수강권일 경우 계산--------------------------------------
  const onClickRefund = async () => {
    let body = {
      productId: selectedProduct?.id,
      type: isTicket ? '수강권' : '회원권',
      refundStartDate: dayjs().format('YYYY-MM-DD'),
      refundEndDate: selectedProduct?.availableEndDate,

      oneDayPrice: isTicket
        ? oneCountPrice
        : parseInt(selectedProduct.price / totalAvailableDays), //하루 가격 (회원군에서)

      usedPrice: isTicket
        ? oneCountPrice * selectedProduct?.usedCount
        : oneDayPrice * (totalAvailableDays - remindAvailableDays), //이용 금액

      refundPrice: isTicket
        ? oneCountPrice *
          (selectedProduct.totalCount - selectedProduct?.usedCount)
        : selectedProduct?.price -
          oneDayPrice * (totalAvailableDays - remindAvailableDays), //환불 금액
      bankName: bank?.bank,
      accountNumber: accountNumber,
      bankOwnerName: accountHolder,
      reason: refundReason,
      gym: selectedProduct?.gymId,
    };
    if (isTicket) {
      //수강권
      body.refundTicketCount =
        selectedProduct?.totalCount - selectedProduct?.usedCount;
    } else {
      //회원권
      body.refundDay = remindAvailableDays;
    }

    try {
      const data = await api.post('product-refunds/', body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        },
      });
      console.log('data', data);

      Alert.alert('환불을 완료하였습니다.');
      resetNavigation(navigation, 'MemberMain');
    } catch (err) {
      console.log('err', err);
      console.log('e.res', err.response);
      if (err.response?.data && err.response?.data?.msg) {
        Alert.alert(err.response?.data?.msg);
      }
    }
  };

  return (
    <Container contentContainerStyle={{ paddingBottom: 50 }}>
      <RootContainer>
        <View>
          <SelectBox>
            <SubTitle>{selectedProduct?.name}</SubTitle>
          </SelectBox>
          <NormalBoldLabel12
            text={isTicket ? '수강권 정보' : '회원권 정보'}
            style={{ color: '#555555', marginBottom: 5 }}
          />
          <InformationBox>
            <RowBox>
              <TitleLabel> {isTicket ? '등록 횟수' : '등록 기간'}</TitleLabel>
              <SubTitle>
                {isTicket
                  ? selectedProduct?.totalCount + ' 회'
                  : `${selectedProduct?.availableStartDate} ~ ${selectedProduct?.availableEndDate}`}
              </SubTitle>
            </RowBox>
            <RowBox>
              <TitleLabel> {isTicket ? '사용 횟수' : '사용 일'}</TitleLabel>
              <SubTitle>
                {isTicket
                  ? selectedProduct?.usedCount + ' 회'
                  : totalAvailableDays - remindAvailableDays + ' 일'}
              </SubTitle>
            </RowBox>
            {isTicket && (
              <RowBox>
                <TitleLabel>등록 기간</TitleLabel>
                <SubTitle>
                  {`${selectedProduct?.availableStartDate} ~ ${selectedProduct?.availableEndDate}`}
                </SubTitle>
              </RowBox>
            )}
            <HR />
            <RowBox>
              <TitleLabel>결제 유형</TitleLabel>
              <SubTitle>{selectedProduct?.type}</SubTitle>
            </RowBox>
            <RowBox>
              <TitleLabel>카드+현금+VAT</TitleLabel>
              <SubTitle> {commaNum(selectedProduct?.price)}원</SubTitle>
            </RowBox>
            {/*<RowBox>*/}
            {/*  <TitleLabel>사용 포인트</TitleLabel>*/}
            {/*  <SubTitle>0</SubTitle>*/}
            {/*</RowBox>*/}
            <HR />
            <RowBox>
              <TitleLabel>결제 금액</TitleLabel>
              <SubTitle>{commaNum(selectedProduct?.price)}원</SubTitle>
            </RowBox>
          </InformationBox>
          {/*  */}
          <NormalBoldLabel12
            text={'환불 정보'}
            style={{ color: '#555555', marginBottom: 5, marginTop: 35 }}
          />
          <InformationBox>
            <RowBox>
              <TitleLabel> 환불 기간</TitleLabel>
              <SubTitle>
                {`${dayjs().format('YYYY-MM-DD')} ~ ${
                  selectedProduct?.availableEndDate
                }`}
              </SubTitle>
            </RowBox>
            <RowBox>
              <TitleLabel> {isTicket ? '환불 횟수' : '환불 일'}</TitleLabel>
              <SubTitle>
                {isTicket
                  ? selectedProduct?.totalCount -
                    selectedProduct?.usedCount +
                    '회'
                  : remindAvailableDays + '일'}
              </SubTitle>
            </RowBox>
            <RowBox>
              <TitleLabel> {isTicket ? '1회 금액' : '1일 금액'}</TitleLabel>
              <SubTitle>
                {isTicket
                  ? commaNum(oneCountPrice) + ' 원'
                  : commaNum(
                      parseInt(selectedProduct?.price / totalAvailableDays)
                    ) + ' 원'}
              </SubTitle>
            </RowBox>
            <HR />
            <RowBox>
              <TitleLabel>이용 금액</TitleLabel>
              <SubTitle>
                {isTicket
                  ? commaNum(oneCountPrice * selectedProduct?.usedCount) + '원'
                  : commaNum(
                      oneDayPrice * (totalAvailableDays - remindAvailableDays)
                    ) + ' 원'}
              </SubTitle>
            </RowBox>
            {/*<RowBox>*/}
            {/*  <TitleLabel>추가공제 금액</TitleLabel>*/}
            {/*  <SubTitle>20,000원</SubTitle>*/}
            {/*</RowBox>*/}
            {/*<RowBox>*/}
            {/*  <TitleLabel>위약금(10%)</TitleLabel>*/}
            {/*  <SubTitle>0</SubTitle>*/}
            {/*</RowBox>*/}
            {/*<HR />*/}
            {/*<RowBox>*/}
            {/*  <TitleLabel>반환 포인트</TitleLabel>*/}
            {/*  <SubTitle>0</SubTitle>*/}
            {/*</RowBox>*/}
            <HR />
            <RowBox>
              <TitleLabel>환불 금액</TitleLabel>
              <NormalBoldLabel12
                text={
                  isTicket
                    ? commaNum(
                        oneCountPrice *
                          (selectedProduct?.totalCount -
                            selectedProduct?.usedCount)
                      ) + '원'
                    : commaNum(
                        selectedProduct?.price -
                          oneDayPrice *
                            (totalAvailableDays - remindAvailableDays)
                      ) + ' 원'
                }
                style={{ color: '#8082FF' }}
              />
            </RowBox>
          </InformationBox>
        </View>
        {/*  */}
        <View>
          <InfoText>환불정보를 확인 하신 후 환불를 진행해주세요.</InfoText>
          <GradientButton
            onPress={onClickRefund}
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
              환불
            </Text>
          </GradientButton>
        </View>
      </RootContainer>
    </Container>
  );
};
const HR = styled.View`
  background-color: #e3e5e5;
  height: 1px;
  margin-bottom: 15px;
`;
const RowBox = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;
const SubTitle = styled.Text`
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: #555555;
`;
const TitleLabel = styled(SubTitle)`
  font-weight: 700;
  width: 87px;
  margin-right: 24px;
`;
const InformationBox = styled.View`
  padding-horizontal: 19px;
  padding-top: 13px;
  background-color: #ffffff;
  border: 1px solid #e3e5e5;
  border-radius: 10px;
`;
const InfoText = styled.Text`
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  color: #8082ff;
  margin-bottom: 15px;
  text-align: center;
  margin-top: 40px;
`;
const SelectBox = styled.View`
  background: #ffffff;
  border: 1px solid #e3e5e5;
  border-radius: 10px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-bottom: 17px;
  text-align: center;
`;
const RootContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;
const Container = styled.ScrollView`
  padding-horizontal: 24px;
  padding-top: 19px;
  padding-bottom: 26px;
  flex: 1;
  flex-direction: column;
`;
export default RefundDetailScreen;
