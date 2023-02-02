import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Text, Image, StyleSheet } from 'react-native';
import ColumnView from '../../../components/ColumnView';
import { NormalBoldLabel, NormalLabel } from '../../../components/Label';
import RowContainer from '../../../components/containers/RowContainer';
import { Container } from '../../../components/containers/Container';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import { commaNum } from '../../../util';
import moment from 'moment';

const SalesHistory = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [payments, setPayments] = useState([]);
  const [refunds, setRefunds] = useState([]);

  useEffect(() => {
    getPayments();
  }, []);

  const getPayments = useCallback(async () => {
    try {
      const { data } = await api.get(`teacher-payments?teacherId=${user?.id}`);
      setPayments(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  }, []);

  console.log('payment', payments);

  return (
    <Container style={styles.contentContainer}>
      <Text style={{ fontSize: 20, color: '#000', fontWeight: 'bold' }}>
        내역
      </Text>
      <RowContainer style={styles.titleContainer}>
        <Image
          source={require('../../../assets/icons/mypage/coins.png')}
          style={{ marginVertical: 10, width: 20, height: 20 }}
        />
        <NormalBoldLabel text={'결제 내역'} style={{ marginLeft: 10 }} />
      </RowContainer>

      {payments.length === 0 && (
        <NormalLabel style={styles.errMsg} text={'목록이 존재하지 않습니다.'} />
      )}
      <FlatList
        contentContainerStyle={{ marginTop: 10 }}
        style={{ flex: 1 }}
        data={payments}
        renderItem={({ item, index }) => <PaymentHistory {...item} />}
        keyExtractor={(item, idx) => item.id + idx.toString()}
      />

      <RowContainer style={styles.titleContainer}>
        <Image
          source={require('../../../assets/icons/mypage/coins.png')}
          style={{ marginVertical: 10, width: 20, height: 20 }}
        />
        <NormalBoldLabel text={'환불 내역'} style={{ marginLeft: 10 }} />
      </RowContainer>

      {refunds.length === 0 && (
        <NormalLabel style={styles.errMsg} text={'목록이 존재하지 않습니다.'} />
      )}
      <FlatList
        contentContainerStyle={{ marginTop: 10 }}
        style={{ flex: 1 }}
        data={refunds}
        renderItem={({ item, index }) => <PaymentHistory {...item} />}
        keyExtractor={(item, idx) => item.id + idx.toString()}
      />
    </Container>
  );
};

export default SalesHistory;

const PaymentHistory = ({ productType, name, gymName, price, createdAt }) => {
  return (
    <RowContainer
      style={{
        height: 60,
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        elevation: 7,
      }}
    >
      <ColumnView>
        <Text style={{ fontSize: 10, color: '#aaa' }}>
          {moment(createdAt).format('YYYY-MM-DD')}
        </Text>
        <Text style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
          {gymName} ({productType})
        </Text>
      </ColumnView>
      <ColumnView style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 12, color: '#555' }}>{name}</Text>
        <Text style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
          + $ {commaNum(price)}
        </Text>
      </ColumnView>
    </RowContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#fbfbfb',
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E3E5E5',
    marginTop: 24,
  },
  errMsg: {
    marginTop: 16,
  },
});
