import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import ColumnView from '../../../components/ColumnView';
import NearbyCenterTop from '../../../components/nearbyCenter/NearbyCenterTop';
import RowContainer from '../../../components/containers/RowContainer';
import SubTitle, {
  SubTitleInfo,
} from '../../../components/nearbyCenter/MemberShipRes/SubTitle';
import { Picker } from '@react-native-picker/picker';
import GradientButton from '../../../components/buttons/GradientButton';
import BirthPicker from '../../../components/date/BirthPicker';
import Touchable from '../../../components/buttons/Touchable';
import { NormalBoldLabel, NormalLabel } from '../../../components/Label';
import moment from 'moment';
import api from '../../../api/api';
import apiv3 from "../../../api/apiv3";
import { commaNum, resetNavigation } from '../../../util';
import { useSelector } from 'react-redux';
import {
  DEAL_INFO,
  PRODUCT_INFO,
  SIGN_UP_INFO,
} from '../../../constants/paymentInfos';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { MONTHS } from '../../../constants/constants';
import CenterListModal from '../../../components/modal/CenterListModal';
import { authenticate } from './payple';

const OptionPaymentScreen = ({ navigation, route }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { gym } = route.params;
  const [oid, setOID] = useState('');

  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionMonth, setSelectedOptionMonth] = useState(0);
  const [optionDate, setOptionDate] = useState(new Date());
  const [isOptionDatePickerOpen, setIsOptionDatePickerOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('현금'); // or 'card'
  const [termInfoOpen, setTermInfoOpen] = useState({
    PRODUCT: false,
    DEAL: false,
    SIGNUP: false,
  });

  const [products, setProducts] = useState({});
  const [productDiscounts, setProductDiscounts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [modalOpen, setModalOpen] = useState({
    product: false,
    date: false,
  });
  const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: gym?.name,
    });
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  const onPayment = async (paymentMethod, hasCashReceipts, oid) => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      const endDate = new Date(optionDate.getTime());
      const availableEndDate = new Date(
        endDate.setMonth(optionDate.getMonth() + Number(selectedOptionMonth))
      );
      const newEndDate = moment(
        availableEndDate.setDate(availableEndDate.getDate() - 1)
      ).format('YYYY-MM-DD');

      const price = totalPrice;
      // !hasCashReceipts && selectedOption?.hasCashDiscount
      //   ? totalPrice * 0.9
      //   : totalPrice;

      const body = {
        option: selectedOption?.id,
        availableStartDate: moment(optionDate).format('YYYY-MM-DD'),
        availableEndDate: newEndDate,
        paymentCount: Number(selectedOptionMonth),
        type: paymentMethod, // 추후에 변경예상
        price,
        period: Number(selectedOptionMonth),
        userId: user?.id,
        oid: oid
      };
      if (selectedProductDetailId) {
        body.productDetail = selectedProductDetailId;
      }
      await api.post(`option-rental/`, body, config);
      Alert.alert('결제가 완료되었습니다.');
      resetNavigation(navigation, 'MemberMain');
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
      if (e.response?.data && e.response?.data?.msg) {
        Alert.alert(e.response?.data?.msg);
      }
    }
  };

  const onCheckIamPortPayment = async (imp_uid) => {
    try {
      const res = await api.post(`iamport-payments`, { imp_uid });
      // console.log('iamport-payments res', res);
      onPayment('카드', true);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  const onRegister = async () => {
    if (!selectedOption) {
      Alert.alert('옵션을 선택해주세요.');
    } else if (selectedOptionMonth === 0) {
      Alert.alert('등록 개월을 선택해주세요.');
    } else {
      console.log(" !!!!====== userId    ", user?.id, "     ", selectedOption?.id);
      var checkerdata = await apiv3.post('option-exist-checker', {optionId: selectedOption?.id, userId: user?.id}, {headers: {Authorization: `Token ${token}`,},});
      console.log(" !!!!!=======  checkerdata    ", checkerdata.data);
      if (checkerdata.data.result == 0){
          if (paymentMethod === '현금') {
            Alert.alert('현금영수증이 필요하신가요?', '', [
              {
                text: '아니오',
                onPress: () => onPayment('현금', false, ''),
              },
              { text: '예', onPress: () => onPayment('현금', true, '') },
            ]);
          } else if (paymentMethod === 'card') {
            console.log(" !!!==========  membership card payment    ", totalPrice);
            authenticate().then((authdata) => {
              console.log("!!!===== option authdata   ", authdata.data);
              const selectNoblesss = selectedOption;
              navigation.navigate('PayplePaymentScreen', {
                  paymentMethod,
                  totalPrice,
                  authdata,
                  gym,
                  selectNoblesss,
                  onComplete: (res) => {
                    console.log("!!!!!======== option Payple onComplete res    ", res);
                    if (res.status == true){
                      setOID(res.msg);
                      onPayment('카드', null, res.msg);
                    }else{
                      Alert.alert("결제에 실패하였습니다. ", res.msg);
                      navigation.goBack();
                    }
                  }
              })
            }).catch((err) => {
              console.log(" !!!====== membership authdata error     ", err);
            })
            // navigation.navigate('IamPortPayment', {
            //   paymentMethod,
            //   onComplete: (res) => {
            //     const { success, imp_uid, merchant_uid, error_msg } = res;
            //     if (success) {
            //       onCheckIamPortPayment(imp_uid);
            //       // onPayment('카드');
            //     } else {
            //       Alert.alert('결제에 실패하였습니다.', error_msg);
            //     }
            //   },
            // });
          }

        }
        else if (checkerdata.data.result === 2){
          Alert.alert("이미 결제 대기중인 옵션권이 존재합니다. 관리자에게 문의하세요");
        }else{
          Alert.alert("이미 옵션권이 존재합니다");
        }
    }
  };

  const onChangeTotalPrice = (selectedProduct, selectMonth) => {
    if (selectedProduct) {
      const selectedPrice = selectedProduct?.price;

      const totalPrice =
        selectedPrice || selectedPrice === 0
          ? selectedPrice * selectMonth
          : selectedProduct?.totalPrice;
      setTotalPrice(totalPrice);
    }
  };

  const getProducts = async () => {
    try {
      const { data } = await api.get(`products?gymId=${gym.id}`);
      setProducts(data);
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  };

  const getProductDiscounts = useCallback(async (productId) => {
    try {
      const { data } = await api.get(
        `product-discounts?productId=${productId}&type=옵션`
      );
      setProductDiscounts(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  }, []);

  const maximumDate = new Date();
  maximumDate.setDate(maximumDate.getDate() + 365); 

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fbfbfb' }}>
      <View>
        <NearbyCenterTop
          tabId={2}
          onTabPress={(selectedTabId) => {
            if (selectedTabId === 1) {
              navigation.navigate('MemberCenterDetail', { gym });
            } else if (selectedTabId === 3) {
              navigation.navigate('Trainer', { gym });
            } else if (selectedTabId === 4) {
              navigation.navigate('Review', { gym });
            }
          }}
        />
      </View>
      <View style={styles.container}>
        <SubTitle title={'옵션'} price={selectedOption?.price || 0} />
        <View style={styles.centerContianer}>
          <RowContainer>
            <ColumnView style={{ flex: 1 }}>
              <Text style={styles.textAlign1}>옵션 종목 선택</Text>
              <CenterListModal
                containerStyle={styles.inputBox}
                list={products?.options}
                selectedItem={selectedOption?.name}
                placeholder={'선택해주세요'}
                itemName={'name'}
                onPress={() => setModalOpen({ ...modalOpen, product: true })}
                visible={modalOpen.product}
                onRequestClose={() =>
                  setModalOpen({ ...modalOpen, product: false })
                }
                onSelect={(obj) => {
                  setSelectedOption(obj);
                  getProductDiscounts(obj.id);
                  setSelectedOptionMonth(0);
                  setTotalPrice(0);
                  // onChangeTotalPrice(obj, selectedOptionMonth);
                }}
              />
            </ColumnView>
            <ColumnView style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.textAlign1}>옵션 등록 개월 선택</Text>
              <CenterListModal
                containerStyle={styles.inputBox}
                list={productDiscounts.length > 0 ? productDiscounts : MONTHS}
                selectedItem={selectedOptionMonth + '개월'}
                placeholder={'선택해주세요'}
                itemName={'period'}
                onPress={() => setModalOpen({ ...modalOpen, date: true })}
                visible={modalOpen.date}
                onRequestClose={() =>
                  setModalOpen({ ...modalOpen, date: false })
                }
                onSelect={(obj) => {
                  if (productDiscounts.length > 0) {
                    setSelectedProductDetailId(obj.id);
                  }
                  setSelectedOptionMonth(obj.period);
                  onChangeTotalPrice(
                    productDiscounts.length > 0 ? obj : selectedOption,
                    obj.period
                  );
                }}
              />
            </ColumnView>
          </RowContainer>

          <ColumnView>
            <Text style={styles.textAlign2}>옵션 시작 날짜 선택</Text>
            <View style={styles.birthdayBox}>
              <BirthPicker
                isOpen={isOptionDatePickerOpen}
                date={optionDate}
                minimumDate={new Date()}
                maximumDate={maximumDate}
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
          </ColumnView>

          <Text
            style={{
              textAlign: 'right',
              fontSize: 18,
              lineHeight: 20,
              color: '#8082FF',
              fontWeight: 'bold',
              marginTop: 21,
              marginBottom: 37,
            }}
          >{`합계 금액 : ${commaNum(totalPrice)}원`}</Text>
        </View>

        <NormalBoldLabel text={'결제 유형 선택'} style={{ marginLeft: 24 }} />
        <RowContainer style={styles.paymentRowContainer}>
          <PaymentMethodBtn
            text={'현금'}
            isActive={paymentMethod === '현금'}
            icon={'현금'}
            onPress={() => setPaymentMethod('현금')}
            style={{ marginRight: 16 }}
          />
          <PaymentMethodBtn
            text={'카드'}
            isActive={paymentMethod === 'card'}
            icon={'카드'}
            onPress={() => setPaymentMethod('card')}
          />
        </RowContainer>

        <SubTitleInfo
          title={'상품고시 정보'}
          isOpen={termInfoOpen.PRODUCT}
          content={PRODUCT_INFO}
          onPress={() =>
            setTermInfoOpen((prev) => {
              return { ...prev, PRODUCT: !termInfoOpen.PRODUCT };
            })
          }
        />
        <SubTitleInfo
          title={'거래 정보'}
          isOpen={termInfoOpen.DEAL}
          content={DEAL_INFO}
          onPress={() =>
            setTermInfoOpen((prev) => {
              return { ...prev, DEAL: !termInfoOpen.DEAL };
            })
          }
        />
        <SubTitleInfo
          title={'회원 가입 약관'}
          isOpen={termInfoOpen.SIGNUP}
          content={SIGN_UP_INFO}
          onPress={() =>
            setTermInfoOpen((prev) => {
              return { ...prev, SIGNUP: !termInfoOpen.SIGNUP };
            })
          }
        />
      </View>
      {/* 선택 하단 container View */}
      <GradientButton
        onPress={onRegister}
        style={{
          marginBottom: 25,
          marginTop: 30,
          marginHorizontal: 24,
          height: 52,
          paddingVertical: 0,
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
          결제하기
        </Text>
      </GradientButton>
    </ScrollView>
  );
};

export default OptionPaymentScreen;

const PaymentMethodBtn = ({ text, icon, isActive, onPress, style }) => (
  <View style={{ flex: 1 }}>
    <Touchable
      onPress={onPress}
      style={{
        ...styles.paymentMethodBtn,
        borderColor: isActive ? '#8082FF' : '#e3e5e5',
        ...style,
      }}
    >
      {icon === '현금' ? (
        <FontAwesome5
          name={'coins'}
          size={16}
          color={isActive ? '#8082FF' : '#e3e5e5'}
        />
      ) : (
        <MaterialIcons
          name={'credit-card'}
          size={18}
          color={isActive ? '#8082FF' : '#e3e5e5'}
        />
      )}
      <NormalLabel
        text={text}
        style={{
          fontSize: 12,
          lineHeight: 16,
          fontWeight: '400',
          color: isActive ? '#8082FF' : '#aaa',
          marginLeft: 10,
        }}
      />
    </Touchable>
  </View>
);

const styles = StyleSheet.create({
  paymentRowContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#e3e5e5',
    marginHorizontal: 24,
    marginTop: 10,
  },
  paymentMethodBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    marginTop: 14,
    backgroundColor: '#fff',
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
  birthdayBox: {
    // marginTop: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  centerContianer: {
    flex: 1,
    marginHorizontal: 24,
    borderTopWidth: 1,
    borderColor: '#e3e5e5',
  },
  inputBox: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e5e5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  textAlign1: {
    marginTop: 13,
    marginBottom: 5,
    color: '#555555',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'bold',
  },
  textAlign2: {
    marginTop: 12,
    marginBottom: 5,
    fontSize: 12,
    color: '#555555',
  },
  trainerPickerInput: {
    width: 156,
    borderWidth: 1,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#000',
    // color: 'lightgray',
  },
  trainerPickerInput2: {
    width: 98.33,
    borderWidth: 1,
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'lightgray',
  },
  yearInput: {
    borderRadius: 10,
    width: 98.33,
    height: 40,
    padding: 'auto',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
