import React from 'react';
import {
  FlatList,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import ColumnView from '../../../components/ColumnView';
import { NormalBoldLabel } from '../../../components/Label';
import RowContainer from '../../../components/containers/RowContainer';
import { Container } from '../../../components/containers/Container';

const LIST_DATA = [
  {
    id: 1,
    center: '웰페리온 센터 (회원권)',
    grade: '6개월 플레티넘(헬스+수영)',
    date: '2021-03-08',
    price: '1,260,000',
  },
  {
    id: 2,
    center: '웰페리온 센터 (회원권)',
    grade: '6개월 플레티넘(헬스+수영)',
    date: '2021-03-08',
    price: '1,260,000',
  },
  {
    id: 3,
    center: '웰페리온 센터 (회원권)',
    grade: '6개월 플레티넘(헬스+수영)',
    date: '2021-03-08',
    price: '1,260,000',
  },
  {
    id: 4,
    center: '웰페리온 센터 (회원권)',
    grade: '6개월 플레티넘(헬스+수영)',
    date: '2021-03-08',
    price: '1,260,000',
  },
  {
    id: 5,
    center: '웰페리온 센터 (회원권)',
    grade: '6개월 플레티넘(헬스+수영)',
    date: '2021-03-08',
    price: '1,260,000',
  },
  {
    id: 6,
    center: '웰페리온 센터 (회원권)',
    grade: '6개월 플레티넘(헬스+수영)',
    date: '2021-03-08',
    price: '1,260,000',
  },
  {
    id: 7,
    center: '웰페리온 센터 (회원권)',
    grade: '6개월 플레티넘(헬스+수영)',
    date: '2021-03-08',
    price: '1,260,000',
  },
  {
    id: 8,
    center: '웰페리온 센터 (회원권)',
    grade: '6개월 플레티넘(헬스+수영)',
    date: '2021-03-08',
    price: '1,260,000',
  },
];

const PaySpecs = ({ navigation }) => {
  return (
    <ScrollView>
      <ColumnView style={styles.contentContainer}>
        <Text style={{ fontSize: 20, color: '#000', fontWeight: 'bold' }}>
          정산 예정 금액
        </Text>
        <RowContainer
          style={{ justifyContent: 'space-between', marginTop: 13 }}
        >
          <Text style={{ fontSize: 20, color: '#555', fontWeight: 'bold' }}>
            ₩{'0'}
          </Text>
          <ColumnView>
            <TouchableOpacity
              style={{
                borderRadius: 5,
                backgroundColor: '#8082ff',
                paddingVertical: 7.5,
                paddingHorizontal: 12,
              }}
              onPress={() => Alert.alert('기능 준비중입니다.')}
            >
              <NormalBoldLabel
                text={'출금하기'}
                style={{
                  fontSize: 12,
                  color: '#fff',
                }}
              />
            </TouchableOpacity>
          </ColumnView>
        </RowContainer>
        <Text
          style={{
            fontSize: 10,
            textAlign: 'right',
            color: '#8082FF',
            marginTop: 5,
          }}
        >
          &#183; 정해진 일정 외 출금 시 500원의 이체 수수료가 발생합니다.
        </Text>
        <RowContainer style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/mypage/coins.png')}
            style={{ marginVertical: 10, width: 20, height: 20 }}
          />
          <NormalBoldLabel
            text={'진행 내역 [ 매출액: 0 ]'}
            style={{ marginLeft: 10 }}
          />
        </RowContainer>

        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{ marginTop: 10 }}
          style={{ flex: 1 }}
          data={[]}
          renderItem={({ item, index }) => <PaymentHistory menu={item} />}
          keyExtractor={(item, idx) => item.id + idx.toString()}
        />

        <RowContainer style={styles.titleContainer}>
          <Image
            source={require('../../../assets/icons/mypage/coins.png')}
            style={{ marginVertical: 10, width: 20, height: 20 }}
          />
          <NormalBoldLabel text={'환불 내역'} style={{ marginLeft: 10 }} />
        </RowContainer>
        <FlatList
          nestedScrollEnabled
          contentContainerStyle={{ marginTop: 10 }}
          style={{ flex: 1 }}
          data={[]}
          renderItem={({ item, index }) => <PaymentHistory menu={item} />}
          keyExtractor={(item, idx) => item.id + idx.toString()}
        />
      </ColumnView>
    </ScrollView>
  );
};

export default PaySpecs;

const PaymentHistory = (menu) => {
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
        <Text style={{ fontSize: 10, color: '#aaa' }}>2021-03-08</Text>
        <Text style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
          김남욱 (24/30) 6회 진행
        </Text>
      </ColumnView>
      <ColumnView style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 12, color: '#555' }}>
          회당 금액(55%) : 32,092원
        </Text>
        <Text style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
          + $ 192,442
        </Text>
      </ColumnView>
    </RowContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E3E5E5',
    marginTop: 34,
  },
});
