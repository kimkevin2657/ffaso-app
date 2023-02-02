import React, { useCallback, useState } from 'react';

import { Alert, StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { NormalBoldLabel, NormalBoldLabel12 } from '../../../components/Label';
import useInput from '../../../hooks/useInput';
import CenterListModal from '../../../components/modal/CenterListModal';
import api from '../../../api/api';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { BANKLIST } from '../../../constants/constants';
import { Container } from '../../../components/containers/Container';

const RefundScreen = ({ navigation }) => {
  const { token, user } = useSelector((state) => state.auth);
  //
  const [accountHolder, onChangeAccountHolder] = useInput('');
  const [bank, onChangeBank, setBank] = useInput('');
  const [accountNumber, onChangeAccountNumber] = useInput('');
  const [refundReason, onChangeRefundReason] = useInput('');
  //
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const getMemberProduct = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    try {
      const { data } = await api.get(`user-products?userId=${user.id}`, config);
      setProducts(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  const onClickNext = () => {
    if (
      selectedProduct === null ||
      accountHolder === '' ||
      bank === '' ||
      accountNumber === '' ||
      refundReason === ''
    ) {
      Alert.alert('입력정보를 확인해주세요');
      return;
    }
    navigation.navigate('RefundDetail', {
      selectedProduct,
      accountHolder,
      bank,
      accountNumber,
      refundReason,
    });
  };
  useFocusEffect(
    useCallback(() => {
      getMemberProduct();
    }, [])
  );

  return (
    <Container
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 26,
      }}
    >
      <TopContainer>
        <NormalBoldLabel12
          text={'회원권 or 수강권 선택'}
          style={{ color: '#555555' }}
        />
        <CenterListModal
          list={products}
          selectedItem={selectedProduct?.name}
          itemName={'name'}
          onPress={() => setIsModalOpen(true)}
          visible={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onSelect={(obj) => setSelectedProduct(obj)}
          placeholder={'P.T 120회권'}
          containerStyle={styles.selectBox}
        />
        {selectedProduct?.productType !== '회원권' && (
          <NormalBoldLabel12
            text={
              selectedProduct
                ? `${
                    selectedProduct?.totalCount - selectedProduct?.usedCount
                  }/${selectedProduct?.totalCount} (남은횟수/가입횟수)`
                : '0/30 (남은횟수/가입횟수)'
            }
            style={{ color: '#555555', marginTop: 10, textAlign: 'right' }}
          />
        )}
        <NormalBoldLabel
          text={'입금 계좌 정보'}
          style={{ marginTop: 14, marginBottom: 25 }}
        />
        {/**/}
        <NormalBoldLabel12 text={'예금주명'} style={{ color: '#555555' }} />
        <SelectBox
          onChangeText={onChangeAccountHolder}
          value={accountHolder}
          placeholder='예금주명'
        />
        <NormalBoldLabel12 text={'은행명'} style={{ color: '#555555' }} />
        <CenterListModal
          list={BANKLIST}
          selectedItem={bank.bank}
          itemName={'bank'}
          onPress={() => setIsBankModalOpen(true)}
          visible={isBankModalOpen}
          onRequestClose={() => setIsBankModalOpen(false)}
          onSelect={(obj) => setBank(obj)}
          placeholder={'은행명'}
          containerStyle={styles.selectBox}
        />
        <NormalBoldLabel12
          text={'계좌번호'}
          style={{ color: '#555555', marginTop: 5 }}
        />
        <SelectBox
          onChangeText={onChangeRefundReason}
          value={refundReason}
          placeholder='계좌번호'
        />
        <NormalBoldLabel12 text={'환불 사유'} style={{ color: '#555555' }} />
        <SelectBox
          onChangeText={onChangeAccountNumber}
          value={accountNumber}
          placeholder='환불사유를 입력해주세요.'
        />
        {/*  */}
      </TopContainer>

      <RowBox>
        <ButtonOpacity style={{ marginRight: 17, backgroundColor: '#AAAAAA' }}>
          <ButtonText>취소</ButtonText>
        </ButtonOpacity>
        <ButtonOpacity onPress={() => onClickNext()}>
          <LinearGradient
            colors={['#8082FF', '#81D1F8']}
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
            }}
          >
            <ButtonText>다음</ButtonText>
          </LinearGradient>
        </ButtonOpacity>
      </RowBox>
    </Container>
  );
};

export default RefundScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  selectBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#e3e5e5',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    height: 40,
    marginTop: 5,
  },
});

const TopContainer = styled.View``;
const ButtonText = styled.Text`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
`;
const ButtonOpacity = styled.TouchableOpacity`
  flex: 0.5;
  height: 52px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
`;
const RowBox = styled.View`
  flex-direction: row;
  align-items: center;
`;

const SelectBox = styled.TextInput`
  background: #ffffff;
  border: 1px solid #e3e5e5;
  border-radius: 10px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 11px;
  text-align: center;
`;
