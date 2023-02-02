// import React from 'react';
// /* 아임포트 모듈을 불러옵니다. */
// import IMP from 'iamport-react-native';

// /* 로딩 컴포넌트를 불러옵니다. */
// import Loading from '../../../components/Loading';
// import { useSelector } from 'react-redux';
// import { BackHandler } from 'react-native';

// export function IamPortPaymentScreen({ navigation, route }) {
//   const { user } = useSelector((state) => state.auth);
//   const { totalPrice, paymentMethod = 'card' } = route.params;

//   React.useEffect(() => {
//     const backAction = () => {
//       navigation.goBack();
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction
//     );
//     return () => backHandler.remove();
//   }, []);

//   /* [필수입력] 결제 종료 후, 라우터를 변경하고 결과를 전달합니다. */
//   function callback(res) {
//     console.log('payment res', res);
//     route.params.onComplete(res);
//     navigation.goBack();
//   }

//   /* [필수입력] 결제에 필요한 데이터를 입력합니다. */
//   const data = {
//     // pg: `html5_inicis.MOIpetpo20`,
//     pg: `danal_tpay`,
//     // pg: `html5_inicis`,
//     pay_method: paymentMethod, // card: 신용카드, vbank: 가상계좌, trans: 실시간계좌이체
//     name: `빠소 결제`,
//     merchant_uid: `merchant_${user.id}_${new Date().getTime()}`,
//     // amount: `${totalPrice}`,
//     amount: 500,
//     buyer_name: `${user?.koreanName}`,
//     buyer_tel: `${user?.phoneNumber}`,
//     buyer_email: `${user?.email}`,
//     app_scheme: 'FFaso',
//     // app_scheme: 'FightMaster',
//     // buyer_addr: "서울시 강남구 신사동 661-16",
//     // buyer_postcode: "06018",
//     // paid_amount: 0 // 실제 결제승인된 금액이나 가상계좌 입금예정 금액
//   };

//   return (
//     <IMP.Payment
//       userCode={'imp95571093'}
//       // tierCode={'AAA'} // 티어 코드: agency 기능 사용자에 한함
//       loading={<Loading />} // 웹뷰 로딩 컴포넌트
//       data={data} // 결제 데이터
//       callback={callback} // 결제 종료 후 콜백
//     />
//   );
// }

// export default IamPortPaymentScreen;
