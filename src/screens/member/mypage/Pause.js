import React, { useState } from 'react';

import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';
import GradientButton from '../../../components/buttons/GradientButton';
import useInput from '../../../hooks/useInput';
import { NormalBoldLabel12, NormalLabel } from '../../../components/Label';
import BirthPicker from '../../../components/date/BirthPicker';
import Touchable from '../../../components/buttons/Touchable';
import moment from 'moment';
import { SCREEN_WIDTH } from '../../../constants/constants';
import CenterListModal from '../../../components/modal/CenterListModal';
import RowContainer from '../../../components/containers/RowContainer';
import { useFetch } from '../../../hooks/useFetch';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import api from '../../../api/api';
import { Container } from '../../../components/containers/Container';

const Pause = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);
  const [pauseDays, onChangeTextPauseDays] = useInput(1);
  const [reason, onChangeReasonText] = useInput('');
  const [optionDate, setOptionDate] = useState(new Date());
  const [isOptionDatePickerOpen, setIsOptionDatePickerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { payload, loading, error } = useFetch(
    `user-products?userId=${user.id}`
  );
  const remindDays = dayjs(selectedProduct?.availableEndDate).diff(
    dayjs(selectedProduct?.availableStartDate),
    'd'
  );

  const availableUseDays = dayjs(optionDate).diff(
    dayjs(selectedProduct?.availableStartDate),
    'd'
  );

  const onClickPause = async () => {
    if (selectedProduct?.length === 0 || selectedProduct === null) {
      Alert.alert('회원권 또는 수강권을 선택해주세요');
      return;
    }
    if (
      dayjs(optionDate).format('YYYY-MM-DD') <
        dayjs().add(1, 'day').format('YYYY-MM-DD') ||
      dayjs(optionDate).format('YYYY-MM-DD') >
        dayjs(selectedProduct?.availableEndDate).format('YYYY-MM-DD')
    ) {
      Alert.alert('정지 가능일을 확인해주세요');
      return;
    }
    if (parseInt(pauseDays) > 30 || parseInt(pauseDays) < 1) {
      Alert.alert('정지일은 1~30 사이로 입력해주세요');
      return;
    }
    if (
      !(
        Math.sign(availableUseDays) === 1 &&
        Math.sign(parseInt(pauseDays)) === 1 &&
        Math.sign(remindDays - availableUseDays) === 1
      )
    ) {
      Alert.alert('일시정지 값을 확인해주세요');
      return;
    }

    let body = {
      productId: selectedProduct?.userProductId,
      userId: user?.id,
      type: selectedProduct?.productType === '회원권' ? '회원권' : '수강권',
      pauseCount: parseInt(pauseDays),
      reason,
      gym: selectedProduct?.gymId,
      beforeStartDate: selectedProduct?.availableStartDate,
      beforeEndDate: selectedProduct?.availableEndDate,
      afterStartDate: dayjs(optionDate)
        .add(parseInt(pauseDays), 'day')
        .format('YYYY-MM-DD'),
      afterEndDate: dayjs(optionDate)
        .add(remindDays - availableUseDays + parseInt(pauseDays), 'day')
        .format('YYYY-MM-DD'),
      pauseDate: dayjs(optionDate).format('YYYY-MM-DD'),
    };
    console.log('body', body);

    try {
      const { data } = await api.post('product-pause', body);
      console.log('data', data);
      navigation.goBack();
      Alert.alert('일시정지를 완료하였습니다');
    } catch (e) {
      if (e.response?.data && e.response?.data?.msg) {
        Alert.alert(e.response?.data?.msg);
      }
    }
  };
  return (
    <Container
      style={styles.container}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 26,
      }}
    >
      <RootContainer>
        <View style={{ marginBottom: 92 }}>
          {/*  */}
          {/*  */}
          <CenterListModal
            list={payload}
            selectedItem={selectedProduct?.name}
            itemName={'name'}
            onPress={() => setIsModalOpen(true)}
            visible={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            onSelect={(obj) => {
              setSelectedProduct(obj);
            }}
            placeholder={'P.T (팀장, 1:1)120회권'}
            containerStyle={styles.selectBox}
          />
          {/*  */}
          {/* 정지 시작일 */}
          <NormalBoldLabel12
            text={'정지 시작일'}
            style={{ color: '#555555' }}
          />
          <View style={{ marginBottom: 5 }}>
            <BirthPicker
              isOpen={isOptionDatePickerOpen}
              date={optionDate}
              onConfirm={(selectedDate) => {
                setIsOptionDatePickerOpen(false);
                setOptionDate(selectedDate);
              }}
              onCancel={() => setIsOptionDatePickerOpen(false)}
            />

            <Touchable
              onPress={() => setIsOptionDatePickerOpen(true)}
              style={styles.birthdayInputBox}
            >
              <View />
              <NormalLabel
                text={moment(optionDate).format('YYYY-MM-DD')}
                style={styles.birthLabel}
              />

              <Image
                style={{ width: 16, height: 18 }}
                source={require('../../../assets/icons/date.png')}
              />
            </Touchable>
          </View>

          <NormalBoldLabel12
            text={
              selectedProduct
                ? `정지 가능일 : ${dayjs()
                    .add(1, 'day')
                    .format('YYYY-MM-DD')} ~ ${
                    selectedProduct?.availableEndDate
                  }`
                : '정지 가능일 : -'
            }
            style={{ color: '#AAAAAA', fontWeight: '400' }}
          />
          {/* 정지일*/}

          <NormalBoldLabel12
            text={'정지일'}
            style={{ color: '#555555', marginTop: 12 }}
          />
          <SelectBox
            keyboardType='numeric'
            maxLength={2}
            onChangeText={onChangeTextPauseDays}
            value={pauseDays.toString()}
            placeholder={'정지일수 입력'}
          />
          <NormalBoldLabel12
            text={'1~30일 사이에서 정지일을 설정할 수 있습니다.'}
            style={{ color: '#AAAAAA', fontWeight: '400' }}
          />
          <NormalBoldLabel12
            text={`총 ${remindDays}일`}
            style={styles.totalDays}
          />
          <View style={{ flexDirection: 'row' }}>
            <View style={{ ...styles.threeBox }}>
              <NormalBoldLabel12
                text={availableUseDays + '일'}
                style={styles.normal12}
              />
              <View style={{ ...styles.line, backgroundColor: '#287CCE' }} />
            </View>
            <View style={{ ...styles.threeBox }}>
              <NormalBoldLabel12
                text={`${pauseDays}일`}
                style={styles.normal12}
              />
              <View style={{ ...styles.line, backgroundColor: '#CE3030' }} />
            </View>
            <View style={{ ...styles.threeBox }}>
              <NormalBoldLabel12
                text={remindDays - availableUseDays + '일'}
                style={styles.normal12}
              />
              <View style={{ ...styles.line, backgroundColor: '#72AF87' }} />
            </View>
          </View>
          <View style={{ ...styles.borderBox }}>
            <RowContainer
              style={{ ...styles.rowBox, justifyContent: 'space-between' }}
            >
              <Text style={styles.title}>변경 전 기간</Text>
              <Text>
                {selectedProduct
                  ? `${selectedProduct?.availableStartDate} ~ ${selectedProduct?.availableEndDate}`
                  : ''}
              </Text>
            </RowContainer>
            <RowContainer
              style={{
                ...styles.hr,
              }}
            />

            <RowContainer
              style={{ ...styles.rowBox, justifyContent: 'space-between' }}
            >
              <Text style={{ color: '#287CCE', ...styles.title }}>
                사용가능 기간 A
              </Text>
              <Text>
                {selectedProduct
                  ? `${selectedProduct?.availableStartDate} ~ ${dayjs(
                      optionDate
                    )
                      .subtract(1, 'day')
                      .format('YYYY-MM-DD')}`
                  : '-'}
              </Text>
            </RowContainer>
            <RowContainer
              style={{ ...styles.rowBox, justifyContent: 'space-between' }}
            >
              <Text style={{ color: '#CE3030', ...styles.title }}>
                정지 기간
              </Text>
              <Text>
                {selectedProduct
                  ? `${dayjs(optionDate).format('YYYY-MM-DD')} ~ ${dayjs(
                      optionDate
                    )
                      .add(pauseDays - 1, 'day')
                      .format('YYYY-MM-DD')}`
                  : '-'}
              </Text>
              {/*<Text>2021-12-23 ~ 2023-04-22</Text>*/}
            </RowContainer>
            <RowContainer
              style={{ ...styles.rowBox, justifyContent: 'space-between' }}
            >
              <Text style={{ color: '#72AF87', ...styles.title }}>
                사용가능 기간 B
              </Text>
              <Text>
                {selectedProduct
                  ? `${dayjs(optionDate)
                      .add(parseInt(pauseDays), 'day')
                      .format('YYYY-MM-DD')} ~ ${dayjs(optionDate)
                      .add(
                        remindDays - availableUseDays + parseInt(pauseDays),
                        'day'
                      )
                      .format('YYYY-MM-DD')}`
                  : '-'}
              </Text>
            </RowContainer>
          </View>
          {/*  */}

          {/* 일시정지 사유*/}
          <NormalBoldLabel12
            text={'일시정지 사유'}
            style={{ color: '#555555', marginTop: 12 }}
          />
          <SelectBox
            onChangeText={onChangeReasonText}
            value={reason}
            placeholder={'일시정지 사유 입력'}
          />
          {/*    */}
        </View>

        <GradientButton
          onPress={onClickPause}
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
            일시정지
          </Text>
        </GradientButton>
      </RootContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontWeight: '700',
  },
  hr: {
    height: 1,
    backgroundColor: '#E3E5E5',
    marginTop: 15,
  },
  rowBox: {
    marginTop: 15,
  },
  borderBox: {
    marginTop: 13,
    background: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E3E5E5',
    borderRadius: 10,
    paddingBottom: 15,
    paddingHorizontal: 21,
  },
  line: {
    height: 3,
    width: '100%',
    marginTop: 3,
  },
  threeBox: {
    flex: 0.333333,
    justifyContent: 'center',
    alignItems: 'center',
  },
  normal12: {
    fontWeight: '400',
    color: '#555555',
  },
  totalDays: {
    color: '#555555',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  selectBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#e3e5e5',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    marginBottom: 15,
  },
  paymentMethodBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    width: (SCREEN_WIDTH - 55.5) / 2,
    marginTop: 14,
  },
  birthdayInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    color: '#555',
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
});
const RootContainer = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;
// const Container = styled.ScrollView`
//   padding-horizontal: 24px;
//   padding-top: 19px;
//   padding-bottom: 26px;
//   flex: 1;
//   flex-direction: column;
// `;
const SelectBox = styled.TextInput`
  background: #ffffff;
  border: 1px solid #e3e5e5;
  border-radius: 10px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  margin-bottom: 5px;
  text-align: center;
`;
export default Pause;
