import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import ColumnView from '../../../components/ColumnView';
import NearbyCenterTop from '../../../components/nearbyCenter/NearbyCenterTop';
import RowContainer from '../../../components/containers/RowContainer';
import SubTitle, {
  SubTitleInfo,
} from '../../../components/nearbyCenter/MemberShipRes/SubTitle';
import GradientButton from '../../../components/buttons/GradientButton';
import BirthPicker from '../../../components/date/BirthPicker';
import Touchable from '../../../components/buttons/Touchable';
import { NormalBoldLabel, NormalLabel } from '../../../components/Label';
import moment from 'moment';
import api from '../../../api/api';
import apiv3 from '../../../api/apiv3'
import { commaNum, resetNavigation } from '../../../util';
import { useSelector } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Container } from '../../../components/containers/Container';
import { TICKET_COUNTS } from '../../../constants/constants';
import {
  DEAL_INFO,
  PRODUCT_INFO,
  SIGN_UP_INFO,
} from '../../../constants/paymentInfos';
import CenterListModal from '../../../components/modal/CenterListModal';
import { authenticate } from './payple';

const TicketPaymentScreen = ({ navigation, route }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { gym } = route.params;
  const [oid, setOID] = useState('');

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketMonth, setSelectedTicketMonth] = useState(0);
  const [ticketDate, setTicketDate] = useState(new Date());
  const [isTicketDatePickerOpen, setIsTicketDatePickerOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('현금'); // or 'card'
  const [termInfoOpen, setTermInfoOpen] = useState({
    PRODUCT: false,
    DEAL: false,
    SIGNUP: false,
  });

  const [products, setProducts] = useState({});
  const [trainers, setTrainers] = useState({});
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [productDiscounts, setProductDiscounts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceDetail, setPriceDetail] = useState(0);
  const [modalOpen, setModalOpen] = useState({
    product: false,
    teacher: false,
    date: false,
  });
  const [isCash, setisCash] = useState(false);
  const [isCard, setisCard] = useState(false);
  const [isMaintenance, setisMaintenance] = useState(false);
  const [allmemberships, setallmemberships] = useState([]);

  const [selectedProductDetailId, setSelectedProductDetailId] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: gym?.name,
    });
  }, []);

  useEffect(() => {
    getProducts();
    getTeachers();
  }, []);

  const onPayment = async (paymentMethod, hasCashReceipts, oid) => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      const endDate = new Date(ticketDate.getTime());
      const availableEndDate = new Date(
        endDate.setMonth(ticketDate.getMonth() + Number(selectedTicketMonth))
      );
      const newEndDate = moment(
        availableEndDate.setDate(availableEndDate.getDate() - 1)
      ).format('YYYY-MM-DD');

      const price = totalPrice;
      // !hasCashReceipts && selectedTicket.hasCashDiscount
      //   ? totalPrice * 0.9
      //   : totalPrice;

      const body = {
        ticketName: selectedTicket?.name,
        gym: gym?.id,
        availableStartDate: moment(ticketDate).format('YYYY-MM-DD'),
        availableEndDate: newEndDate,
        totalCount: selectedTicketMonth,
        type: paymentMethod,
        price,
        userId: user?.id,
        manager: selectedTeacher?.id,
        ticketId: selectedTicket?.id,
        discount: 0,
        oid: oid
      };
      if (selectedProductDetailId) {
        body.productDetail = selectedProductDetailId;
      }
      // console.log('body', body);
      await api.post(`lessonTicket-payment/`, body, config);
      // console.log('res', res);
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
      console.log('iamport-payments res', res);
      onPayment('카드', true);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  const onRegister = async () => {
    if (!selectedTicket) {
      Alert.alert('수강권을 선택해주세요.');
    } else if (selectedTicketMonth === 0) {
      Alert.alert('횟수를 선택해주세요.');
    } else if (!selectedTeacher) {
      Alert.alert('강사를 선택해주세요.');
    } else {
      var checkerdata = await apiv3.post('lesson-exist-checker', {ticketId: selectedTicket?.id, userId: user?.id}, {headers: {Authorization: `Token ${token}`,},});
      console.log("!!!==== checkerdata   ", checkerdata.data);
      if (checkerdata.data.result === 0){
        if (paymentMethod === '현금') {
          Alert.alert('현금영수증이 필요하신가요?', '', [
            {
              text: '아니오',
              onPress: () => onPayment('현금', false, ''),
            },
            { text: '예', onPress: () => onPayment('현금', true, '') },
          ]);
        } else if (paymentMethod === "maintenance"){
          Alert.alert('관리비로 청구가 됩니다.', '', [
            {
              text: '아니오',
              onPress: () => onPayment('관리비', false, ''),
            },
            { text: '예', onPress: () => onPayment('관리비', false, '') },
          ]);
        } else if (paymentMethod === 'card') {
          authenticate().then((authdata) => {
            console.log("!!!===== membership authdata   ", authdata.data);
            const selectNoblesss = selectedTicket;
            navigation.navigate('PayplePaymentScreen', {
                paymentMethod,
                totalPrice,
                authdata,
                gym,
                selectNoblesss,
                onComplete: (res) => {
                  console.log("!!!!!======== membership Payple onComplete res    ", res);
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
      }else{
        Alert.alert("이미 수강권이 존재합니다");
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

      let priceDetail = commaNum(totalPrice) + '원';
      let priceDetailDiscount='';
      if(selectedProduct.discountPrice%10000 !=0) priceDetailDiscount= selectedProduct.discountPrice%10000 + priceDetailDiscount;
      if(selectedProduct.discountPrice>=10000) priceDetailDiscount= selectedProduct.discountPrice/10000+'만' + priceDetailDiscount;

      let listPrice=totalPrice;
      if(selectedProduct.type=="금액" && selectedProduct.discountPrice ){
        listPrice=listPrice + selectedProduct.discountPrice;
        priceDetail= commaNum(listPrice) + '원 \n( '+ priceDetailDiscount +'원 할인 '+priceDetail+' )';
      }
      else if(selectedProduct.type=="퍼센트" && selectedProduct.discountRate){
        listPrice=listPrice / (1 - (selectedProduct.discountRate/100));
        priceDetail= commaNum(listPrice) + '원 \n( '+selectedProduct.discountRate +'% 할인 '+priceDetail+' )';
      }
      setPriceDetail(priceDetail);

    }
  };

  const getProducts = async () => {
    try {
      const { data } = await api.get(`products?gymId=${gym.id}`);
      setProducts(data);
      setallmemberships(data?.lessonTickets);
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  };

  const getTeachers = async () => {
    try {
      const { data } = await api.get(`gym-teachers?gymId=${gym.id}`);
      // console.log('teachers', data);
      let newTrainers = {};
      data.forEach((teacher) => {
        if (
          !newTrainers.hasOwnProperty(teacher.department) &&
          teacher.department !== null
        ) {
          newTrainers[teacher.department] = [];
        }
        if (teacher.department) {
          newTrainers[teacher.department].push(teacher);
        }
      });
      // console.log('newTrainers', newTrainers);
      setTrainers(newTrainers);
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  };

  const getProductDiscounts = useCallback(async (productId) => {
    try {
      const { data } = await api.get(
        `product-discounts?productId=${productId}&type=수강권`
      );
      setProductDiscounts(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  }, []);

  const setpaymentmethods = (selectedval) => {
    console.log("!!!!====== selectedval.name    ", selectedval.name);
      for (let i = 0; i < allmemberships.length; i++){
          if (selectedval?.name === allmemberships[i].name){
            setisCash(allmemberships[i].iscash);
            setisCard(allmemberships[i].iscard);
            setisMaintenance(allmemberships[i].ismaintenance);
            // setisMaintenance(true);
          }
        }
        // console.log("!!!!!!========= iscash, iscard, ismaintenance    ", isCash, isCard, isMaintenance)
  }

  return (
    <Container style={styles.container}>
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
        <SubTitle title={'수강권'} price={selectedTicket?.price || 0} />
        <View style={styles.centerContianer}>
          <RowContainer>
            <ColumnView style={{ flex: 1 }}>
              <Text style={styles.textAlign1}>수강권 종목 선택</Text>
              <CenterListModal
                containerStyle={styles.inputBox}
                list={products?.lessonTickets}
                selectedItem={selectedTicket?.name}
                placeholder={'선택해주세요'}
                itemName={'name'}
                onPress={() => setModalOpen({ ...modalOpen, product: true })}
                visible={modalOpen.product}
                onRequestClose={() =>
                  setModalOpen({ ...modalOpen, product: false })
                }
                onSelect={(obj) => {
                  setSelectedTicket(obj);
                  getProductDiscounts(obj.id);
                  setSelectedTicketMonth(0);
                  setTotalPrice(0);
                  setPriceDetail('0');
                  setSelectedTeacher(null);
                  setpaymentmethods(obj);
                  // onChangeTotalPrice(obj, selectedTicketMonth);
                }}
              />
            </ColumnView>
            <ColumnView style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.textAlign1}>수강권 등록 횟수 선택</Text>
              <CenterListModal
                containerStyle={styles.inputBox}
                list={
                  productDiscounts.length > 0 ? productDiscounts : TICKET_COUNTS
                }
                selectedItem={selectedTicketMonth + '회'}
                placeholder={'선택해주세요'}
                itemName={'ticketCount'}
                onPress={() => setModalOpen({ ...modalOpen, date: true })}
                visible={modalOpen.date}
                onRequestClose={() =>
                  setModalOpen({ ...modalOpen, date: false })
                }
                onSelect={(obj) => {
                  if (productDiscounts.length > 0) {
                    setSelectedProductDetailId(obj.id);
                  }
                  setSelectedTicketMonth(obj.ticketCount);
                  onChangeTotalPrice(
                    productDiscounts.length > 0 ? obj : selectedTicket,
                    obj.ticketCount
                  );
                }}
              />
            </ColumnView>
          </RowContainer>

          <Text style={styles.textAlign1}>강사 선택</Text>
          <CenterListModal
            containerStyle={styles.inputBox}
            list={
              Object.keys(trainers).length > 0 &&
              selectedTicket &&
              trainers[selectedTicket.department]
                ? trainers[selectedTicket.department]
                : []
            }
            selectedItem={selectedTeacher?.koreanName}
            placeholder={'선택해주세요'}
            itemName={'koreanName'}
            onPress={() => setModalOpen({ ...modalOpen, teacher: true })}
            visible={modalOpen.teacher}
            onRequestClose={() =>
              setModalOpen({ ...modalOpen, teacher: false })
            }
            onSelect={(obj) => setSelectedTeacher(obj)}
            disabled={
              Object.keys(trainers).length === 0 ||
              !trainers[selectedTicket?.department]
            }
            disableMsg={
              !trainers[selectedTicket?.department]
                ? '수강권 카테고리에 해당하는 강사 목록이 없습니다.'
                : '강사 목록이 없습니다.'
            }
          />
          <View>
            <Text style={styles.textAlign2}>수강권 시작 날짜 선택</Text>
            <View style={styles.birthdayBox}>
              <BirthPicker
                isOpen={isTicketDatePickerOpen}
                date={ticketDate}
                minimumDate={new Date()}
                onConfirm={(selectedDate) => {
                  setIsTicketDatePickerOpen(false);
                  setTicketDate(selectedDate);
                }}
                onCancel={() => setIsTicketDatePickerOpen(false)}
              />

              <Touchable
                onPress={() => setIsTicketDatePickerOpen(true)}
                style={styles.birthdayInputBox}
              >
                <View />
                <NormalLabel
                  text={moment(ticketDate).format('YYYY-MM-DD')}
                  style={styles.birthLabel}
                />

                <Image
                  style={{ width: 16, height: 18 }}
                  source={require('../../../assets/icons/date.png')}
                />
              </Touchable>
            </View>
          </View>
        </View>

        <View style={[styles.centerContianer,{marginLeft:0}]}>
          <Text
            style={{
              textAlign: 'right',
              fontSize: 18,
              lineHeight: 20,
              color: '#8082FF',
              fontWeight: 'bold',
              marginTop: 21,
              marginBottom: 37
            }}
          >{`합계 금액 : ${priceDetail}`}</Text>
        </View>

        <NormalBoldLabel text={'결제 유형 선택'} style={{ marginLeft: 24 }} />
        <RowContainer style={styles.paymentRowContainer}>
        {isCash === true ?
          <PaymentMethodBtn
            text={'현금'}
            isActive={paymentMethod === '현금'}
            icon={'현금'}
            onPress={() => setPaymentMethod('현금')}
            style={{ marginRight: 10 }}
          />
          : null}
          {isCard === true ?
          <PaymentMethodBtn
            text={'카드'}
            isActive={paymentMethod === 'card'}
            icon={'카드'}
            onPress={() => setPaymentMethod('card')}
            style={{ marginRight: 10 }}
          />
          : null}
          {isMaintenance === true ?
          <PaymentMethodBtn
            text={'관리비 부과'}
            isActive={paymentMethod === 'maintenance'}
            icon={'현금'}
            onPress={() => setPaymentMethod('maintenance')}
            style={{ marginRight: 10 }}
          />
          : null}
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
    </Container>
  );
};

export default TicketPaymentScreen;

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
