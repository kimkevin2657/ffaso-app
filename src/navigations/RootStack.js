import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { MemberBottomTabs } from './MemberBottomTabs';
import SignUpCompleted from '../screens/auth/SignupCompleted';
import MyPaymentsScreen from '../screens/member/payment/MyPaymentsScreen';
import PriceScreen from '../screens/centerDetail/Price/PriceScreen';
import TrainerScreen from '../screens/centerDetail/Trainer/TrainerScreen';
import ReviewsScreen from '../screens/centerDetail/Review/ReviewsScreen';
import MemberScheduleRegisterScreen from '../screens/member/schedule/MemberScheduleRegisterScreen';
import CouponListScreen from '../screens/member/mypage/CouponListScreen';
import MemberAccountSetting from '../screens/member/mypage/MemberAccountSetting';
import Notifications from '../screens/member/mypage/Notifications';
import SurveyScreen from '../screens/member/SurveyScreen';
import TeacherProfileEnroll from '../screens/teacher/profile/TeacherProfileEnroll';
import { TeacherBottomTabs } from './TeacherBottomTabs';
import SalesHistory from '../screens/teacher/myPage/SalesHistory';
import TeacherNotifications from '../screens/teacher/myPage/TeacherNotifications';
import CertificateAdd from '../screens/teacher/profile/CertificateAdd';
import CareerAdd from '../screens/teacher/profile/CareerAdd';
import AcademicsAdd from '../screens/teacher/profile/AcademicsAdd';
import SelfInfoAdd from '../screens/teacher/profile/SelfInfoAdd';
import PaySpecs from '../screens/teacher/myPage/PaySpecs';
import TeacherAccountSetting from '../screens/teacher/myPage/TeacherAccountSetting';
import { AuthStack } from './AuthStack';
import MembershipPaymentScreen from '../screens/member/payment/MembershipPaymentScreen';
import MemberCenterDetail from '../screens/centerDetail/MemberCenterDetail';
import WorkingPlaceAdd from '../screens/teacher/WorkingPlaceAdd';
import EtcCategoryScreen from '../screens/common/EtcCategoryScreen';
import WorkTimeSetup from '../screens/teacher/WorkTimeSetup';
import ShowAllReview from '../screens/centerDetail/Review/ShowAllReview';
import ChatRoomDetailScreen from '../screens/common/ChatRoomDetailScreen';
import Touchable from '../components/buttons/Touchable';
import ScheduleDetailScreen from '../screens/member/schedule/ScheduleDetailScreen';
import CenterReviewWriting from '../screens/teacher/CenterReviewWriting';
import AlertsScreen from '../screens/common/AlertsScreen';
import TeacherCenterDetail from '../screens/centerDetail/TeacherCenterDetail';
import TicketPaymentScreen from '../screens/member/payment/TicketPaymentScreen';
import OptionPaymentScreen from '../screens/member/payment/OptionPaymentScreen';
import TeacherScheduleDetailScreen from '../screens/teacher/TeacherScheduleDetailScreen';
// import IamPortPaymentScreen from '../screens/member/payment/IamPortPaymentScreen';
import PayplePaymentScreen from '../screens/member/payment/PayplePaymentScreen'
import FindRoadScreen from '../screens/common/FindRoadScreen';
import ScheduleCouponsScreen from '../screens/member/schedule/ScheduleCouponsScreen';
import AcademicsModify from '../screens/teacher/profileModify/AcademicsModify';
import CareerModify from '../screens/teacher/profileModify/CareerModify';
import CertificateModify from '../screens/teacher/profileModify/CertificateModify';
import SelfInfoModify from '../screens/teacher/profileModify/SelfInfoModify';
import AssignmentDetailScreen from '../screens/member/mypage/AssignmentDetailScreen';
import AssignmentScreen from '../screens/member/mypage/AssignmentScreen';
import RefundScreen from '../screens/member/mypage/RefundScreen';
import RefundDetailScreen from '../screens/member/mypage/RefundDetailScreen';
import Pause from '../screens/member/mypage/Pause';
import ScheduleReservationUsersScreen from '../screens/teacher/ScheduleReservationUsersScreen';
import CeoInfoScreen from '../screens/common/CeoInfoScreen';
import ScheduleRegistration from '../screens/teacher/ScheduleRegistration';
import ScheduleRegistrationSelect from '../screens/teacher/ScheduleRegistrationSelect';

const Stack = createNativeStackNavigator();

const RootStack = () => (
  <Stack.Navigator
    initialRouteName='Auth'
    screenOptions={({ navigation }) => ({
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 20,
        lineHeight: 24,
        color: '#000',
        fontWeight: 'bold',
        // fontFamily: 'NotoSansKR-Regular',
      },
      headerStyle: {
        shadowOffset: { height: 0, width: 0 },
        backgroundColor: '#FBFBFB',
      },
      headerLeft: () => (
        <Touchable onPress={() => navigation.goBack()}>
          <AntDesign
            name='left'
            size={22}
            color={'#555'}
            style={{ padding: 4, alignSelf: 'center' }}
          />
        </Touchable>
      ),
      headerBackTitleVisible: false,
    })}
  >
    <Stack.Screen
      name='MemberMain'
      component={MemberBottomTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='TeacherMain'
      component={TeacherBottomTabs}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='Auth'
      component={AuthStack}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='MyPayment'
      component={MyPaymentsScreen}
      options={{ title: '결제 및 환불 내역' }}
    />
    <Stack.Screen
      name='CertificateAdd'
      component={CertificateAdd}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='Price'
      component={PriceScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name='Review'
      component={ReviewsScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name='Trainer'
      component={TrainerScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name='Chat'
      component={ChatRoomDetailScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name='AccountSetting'
      component={MemberAccountSetting}
      options={{ title: '계정설정' }}
    />
    <Stack.Screen
      name='Coupons'
      component={CouponListScreen}
      options={{ title: '쿠폰&프로모션' }}
    />
    <Stack.Screen
      name='Notifications'
      component={Notifications}
      options={{ title: '알림' }}
    />
    <Stack.Screen
      name='Survey'
      component={SurveyScreen}
      options={{ title: '문의' }}
    />
    <Stack.Screen
      name='ScheduleCoupons'
      component={ScheduleCouponsScreen}
      options={{ title: '쿠폰&프로모션' }}
    />
    <Stack.Screen
      name='ScheduleDetail'
      component={ScheduleDetailScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name='TeacherScheduleDetail'
      component={TeacherScheduleDetailScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name='ScheduleReservationUsers'
      component={ScheduleReservationUsersScreen}
      options={{ title: '예약회원' }}
    />
    <Stack.Screen
      name='ScheduleRegister'
      component={MemberScheduleRegisterScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name={'Assignment'}
      component={AssignmentScreen}
      options={{ title: '양도' }}
    />
    <Stack.Screen
      name={'AssignmentDetail'}
      component={AssignmentDetailScreen}
      options={{ title: '양도' }}
    />
    <Stack.Screen
      name={'Refund'}
      component={RefundScreen}
      options={{ title: '환불' }}
    />
    <Stack.Screen
      name={'RefundDetail'}
      component={RefundDetailScreen}
      options={{ title: '환불' }}
    />
    <Stack.Screen
      name={'Pause'}
      component={Pause}
      options={{ title: '일시정지' }}
    />
    {/* ===============  =============== ==============강사 =============== =============== ===============*/}
    <Stack.Screen
      name='TeacherProfileEnroll'
      component={TeacherProfileEnroll}
      options={{ title: '프로필 등록' }}
    />
    <Stack.Screen
      name='CareerAdd'
      component={CareerAdd}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='AcademicsAdd'
      component={AcademicsAdd}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='SelfInfoAdd'
      component={SelfInfoAdd}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='SalesHistory'
      component={SalesHistory}
      options={{ title: '매출 내역' }}
    />
    <Stack.Screen
      name='TeacherNotifications'
      component={TeacherNotifications}
      options={{
        title: '알림',
      }}
    />
    <Stack.Screen
      name='PaySpecs'
      component={PaySpecs}
      options={{ title: '급여 명세서' }}
    />
    <Stack.Screen
      name='TeacherAccountSetting'
      component={TeacherAccountSetting}
      options={{ title: '계정설정' }}
    />
    <Stack.Screen
      name='SignUpCompleted'
      component={SignUpCompleted}
      options={{ title: '' }}
    />
    {/* <Stack.Screen
      name='IamPortPayment'
      component={IamPortPaymentScreen}
      options={{ headerShown: false }}
    /> */}
    <Stack.Screen
      name='PayplePaymentScreen'
      component={PayplePaymentScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='MembershipPayment'
      component={MembershipPaymentScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name='TicketPayment'
      component={TicketPaymentScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name='OptionPayment'
      component={OptionPaymentScreen}
      options={{ title: '' }}
    />
    <Stack.Screen
      name='FindRoad'
      component={FindRoadScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='MemberCenterDetail'
      component={MemberCenterDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='TeacherCenterDetail'
      component={TeacherCenterDetail}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='WorkingPlaceAdd'
      component={WorkingPlaceAdd}
      options={{ title: '근무지 추가' }}
    />
    <Stack.Screen
      name='TeacherOtherSportPage'
      component={EtcCategoryScreen}
      options={{ title: '기타종목' }}
    />
    <Stack.Screen
      name='WorkTimeSetup'
      component={WorkTimeSetup}
      options={{ title: '스케줄 등록' }}
    />
    <Stack.Screen
      name='ShowAll'
      component={ShowAllReview}
      options={{ title: '빠소센터' }}
    />
    <Stack.Screen
      name='CenterReviewWriting'
      component={CenterReviewWriting}
      options={{ title: '센터명' }}
    />
    <Stack.Screen
      name='Alerts'
      component={AlertsScreen}
      options={{ title: '알림' }}
    />
    <Stack.Screen
      name='AcademicsModify'
      component={AcademicsModify}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='CareerModify'
      component={CareerModify}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='CertificateModify'
      component={CertificateModify}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='SelfInfoModify'
      component={SelfInfoModify}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name='CeoInfo'
      component={CeoInfoScreen}
      options={{ title: '사업자정보' }}
    />
    {/*  12월 이후*/}
    <Stack.Screen
      name='ScheduleRegistration'
      component={ScheduleRegistration}
      options={{ title: '일정 등록' }}
    />
    <Stack.Screen
      name='ScheduleRegistrationSelect'
      component={ScheduleRegistrationSelect}
      options={{ title: '일정 선택' }}
    />
  </Stack.Navigator>
);
export default RootStack;
