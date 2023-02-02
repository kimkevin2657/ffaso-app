import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import ColumnView from '../../../components/ColumnView';
import { NormalBoldLabel, NormalLabel } from '../../../components/Label';
import RowContainer from '../../../components/containers/RowContainer';
import SpaceBetweenContainer from '../../../components/containers/SpaceBetweenContainer';
import Touchable from '../../../components/buttons/Touchable';
import { useSelector } from 'react-redux';
import api from '../../../api/api';
import moment from 'moment';
import { commaNum } from '../../../util';

const MyPaymentsScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.auth);
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    getPaymentsAndRefunds();
  }, []);

  const getProductName = useCallback(
    (productType, membershipName, ticketName, optionName) => {
      const PRODUCT_NAMES = {
        회원권: membershipName,
        수강권: ticketName,
        옵션: optionName,
      };

      return PRODUCT_NAMES[productType];
    },
    []
  );

  const getPaymentsAndRefunds = useCallback(async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    try {
      const { data } = await api.get('payments-and-refunds', config);
      if (Array.isArray(data?.payments)) {
        setPayments(data.payments);
      }
      if (Array.isArray(data?.refunds)) {
        setRefunds(data.refunds);
      }
    } catch (error) {
      console.log('error', error);
      console.log('error.res', error.response);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, marginBottom: 20 }}>
      <ColumnView style={styles.contentContainer}>
        <NormalBoldLabel
          style={{ fontSize: 18, lineHeight: 22 }}
          text={'내역'}
        />

        <SpaceBetweenContainer style={styles.titleContainer}>
          <RowContainer>
            <Image
              source={require('../../../assets/icons/mypage/coins.png')}
              style={{ width: 20, height: 20 }}
              // style={{marginVertical: 10}}
            />
            <NormalBoldLabel
              // text={'결제 내역 [ 매출액 : 3,960,000 ]'}
              text={'결제 내역'}
              style={{ marginLeft: 11, color: '#555' }}
            />
          </RowContainer>

          <RowContainer>
            <Touchable
              onPress={() => navigation.navigate('Pause')}
              style={styles.purpleBtn}
            >
              <NormalBoldLabel
                text={'일시정지'}
                style={{ fontSize: 12, color: '#fff' }}
              />
            </Touchable>
            <Touchable
              onPress={() => navigation.navigate('Assignment')}
              style={{ ...styles.purpleBtn, marginLeft: 5 }}
            >
              <NormalBoldLabel
                text={'양도'}
                style={{ fontSize: 12, color: '#fff' }}
              />
            </Touchable>
            <Touchable
              style={{ ...styles.purpleBtn, marginLeft: 5 }}
              onPress={() => {
                navigation.navigate('Refund');
              }}
            >
              <NormalBoldLabel
                text={'환불'}
                style={{ fontSize: 12, color: '#fff' }}
              />
            </Touchable>
          </RowContainer>
        </SpaceBetweenContainer>

        {payments.length > 0 ? (
          <FlatList
            style={{ flex: 1 }}
            data={payments}
            renderItem={({ item, index }) => (
              <PaymentHistory {...item} getProductName={getProductName} />
            )}
            keyExtractor={(item, idx) => item.id + idx.toString()}
          />
        ) : (
          <NormalLabel
            text={'결제 정보가 없습니다.'}
            style={{ flex: 1, marginTop: 8 }}
          />
        )}

        <RowContainer style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/mypage/coins.png')}
            style={{ marginVertical: 10, width: 20, height: 20 }}
          />
          <NormalBoldLabel
            text={'환불 내역'}
            style={{ marginLeft: 11, color: '#555' }}
          />
        </RowContainer>

        {refunds.length > 0 ? (
          <FlatList
            style={{ flex: 1 }}
            data={refunds}
            renderItem={({ item, index }) => (
              <RefundHistory {...item} getProductName={getProductName} />
            )}
            keyExtractor={(item, idx) => item.id + idx.toString()}
          />
        ) : (
          <NormalLabel
            text={'환불 정보가 없습니다.'}
            style={{ flex: 1, marginTop: 8 }}
          />
        )}
      </ColumnView>
    </SafeAreaView>
  );
};

export default MyPaymentsScreen;

const PaymentHistory = ({
  createdAt,
  productType,
  ticketName,
  membershipName,
  optionName,
  getProductName,
  price,
  gymName,
}) => {
  return (
    <RowContainer
      style={{
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 7,
        elevation: 7,
      }}
    >
      <ColumnView>
        <Text style={{ fontSize: 10, lineHeight: 15, color: '#aaa' }}>
          {moment(createdAt).format('YYYY-MM-DD')}
        </Text>
        <Text
          style={{ fontSize: 12, lineHeight: 15, color: '#555', marginTop: 4 }}
        >
          {`${gymName} (${productType})`}
        </Text>
      </ColumnView>
      <ColumnView style={{ alignItems: 'flex-end' }}>
        <NormalBoldLabel
          text={getProductName(
            productType,
            membershipName,
            ticketName,
            optionName
          )}
          style={{ fontSize: 12, lineHeight: 15, color: '#555' }}
        />
        <NormalBoldLabel
          text={`+ ₩${commaNum(price)}`}
          style={{ fontSize: 12, lineHeight: 15, color: '#555', marginTop: 4 }}
        />
      </ColumnView>
    </RowContainer>
  );
};

const RefundHistory = ({
  createdAt,
  type,
  refundPrice,
  gymName,
  membershipPayment,
  ticketPayment,
  optionPayment,
  getProductName,
}) => {
  return (
    <RowContainer
      style={{
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 7,
        elevation: 7,
      }}
    >
      <ColumnView>
        <Text style={{ fontSize: 10, lineHeight: 15, color: '#aaa' }}>
          {moment(createdAt).format('YYYY-MM-DD')}
        </Text>
        <Text
          style={{ fontSize: 12, lineHeight: 15, color: '#555', marginTop: 4 }}
        >
          {`${gymName} (${type})`}
        </Text>
      </ColumnView>
      <ColumnView style={{ alignItems: 'flex-end' }}>
        <NormalBoldLabel
          text={getProductName(
            type,
            membershipPayment?.name,
            ticketPayment?.name,
            optionPayment?.name
          )}
          style={{ fontSize: 12, lineHeight: 15, color: '#555' }}
        />
        <NormalBoldLabel
          text={`+ ₩${commaNum(refundPrice)}`}
          style={{ fontSize: 12, lineHeight: 15, color: '#555', marginTop: 4 }}
        />
      </ColumnView>
    </RowContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#FBFBFB',
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E3E5E5',
    marginTop: 28,
    paddingBottom: 10,
  },
  purpleBtn: {
    borderRadius: 5,
    backgroundColor: '#8082FF',
    paddingHorizontal: 8.5,
    paddingVertical: 5,
  },
});
