import { Dimensions, Platform } from 'react-native';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const ORDER_LABELS = ['이용종목', '강습', '거리'];

export const MEMBER_SCHEDULE_COLOR = {
  방문: '#53C7FF',
  강습: '#91CD87',
};

export const TEACHER_TYPE_COLOR = {
  휴일: '#F8ACB1',
  수업: '#AE87CD',
  상담: '#4599EB',
  외근: '#A4A4A4',
  식사: '#FF993A',
  예약: '#86BB98',
  업무: '#F4BDF2',
};

export const isIos = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const PHONE_START_NUMBERS = [
  { id: 1, name: '010' },
  { id: 2, name: '011' },
  { id: 3, name: '016' },
];

export const TEACHER_SCHEDULE_TYPES = [
  // { id: 1, name: '업무' },
  { id: 2, name: '수업' },
  { id: 3, name: '휴일' },
  { id: 4, name: '식사' },
  { id: 5, name: '외근' },
  { id: 6, name: '상담' },
];

export const MONTHS = [
  { id: 1, period: 1 },
  { id: 2, period: 2 },
  { id: 3, period: 3 },
  { id: 4, period: 4 },
  { id: 5, period: 5 },
  { id: 6, period: 6 },
  { id: 7, period: 7 },
  { id: 8, period: 8 },
  { id: 9, period: 9 },
  { id: 10, period: 10 },
  { id: 11, period: 11 },
  { id: 12, period: 12 },
];

export const TICKET_COUNTS = [
  { id: 1, ticketCount: 1 },
  { id: 2, ticketCount: 2 },
  { id: 3, ticketCount: 3 },
  { id: 4, ticketCount: 4 },
  { id: 5, ticketCount: 5 },
  { id: 6, ticketCount: 6 },
  { id: 7, ticketCount: 7 },
  { id: 8, ticketCount: 8 },
  { id: 9, ticketCount: 9 },
  { id: 10, ticketCount: 10 },
  { id: 11, ticketCount: 20 },
  { id: 12, ticketCount: 30 },
  { id: 13, ticketCount: 40 },
  { id: 14, ticketCount: 50 },
  { id: 15, ticketCount: 100 },
];
export const BANKLIST = [
  { id: 1, bank: '국민은행' },
  { id: 2, bank: '우리은행' },
  { id: 3, bank: '기업은행' },
  { id: 4, bank: '농협은행' },
  { id: 5, bank: '신한은행' },
  { id: 6, bank: '하나은행' },
  { id: 7, bank: '한국씨티은행' },
  { id: 8, bank: 'SC제일은행' },
  { id: 9, bank: '카카오뱅크' },
  { id: 10, bank: '케이뱅크' },
  { id: 11, bank: '경남은행' },
  { id: 12, bank: '광주은행' },
  { id: 13, bank: '대구은행' },
  { id: 14, bank: '도이치은행' },
  { id: 15, bank: '부산은행' },
  { id: 16, bank: '산업은행' },
  { id: 17, bank: '새마을금고' },
  { id: 18, bank: '수협은행' },
  { id: 19, bank: '신협' },
  { id: 20, bank: '우체국' },
  { id: 21, bank: '저축은행' },
  { id: 22, bank: '전북은행' },
  { id: 23, bank: '제주은행' },
  { id: 24, bank: '중국건설은행' },
  { id: 25, bank: '중국공상은행' },
  { id: 26, bank: 'BOA(뱅크오브아메리카)' },
  { id: 27, bank: 'HSBC은행' },
  { id: 28, bank: 'JP모간체이스은행' },
];
