import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';

const DATA = [
  { title: '사업자번호', content: '645-15-01978' },
  { title: '대표성함', content: '김남욱' },
  {
    title: '사업장소재지',
    content: '서울특별시 성동구 독서당로 175, 105동 204호',
  },
  { title: '통신 판매 신고 번호', content: '2022-서울상동-01407' },
  { title: '고객센터', content: '0507-1376-1537' },
  { title: '이메일', content: 'faso.namuk@gmail.com' },
];

const CeoInfoScreen = () => {
  return (
    <View style={styles.container}>
      <NormalBoldLabel
        text={'파이네스트 소프트(Finest Soft)'}
        style={styles.title}
      />
      {DATA.map((infoObj, idx) => (
        <Info key={idx} {...infoObj} />
      ))}
    </View>
  );
};

export default CeoInfoScreen;

const Info = ({ title, content }) => (
  <View style={styles.infoWrapper}>
    <NormalBoldLabel text={title} style={styles.infoTitle} />
    <NormalLabel text={content} style={styles.infoContent} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoWrapper: {
    borderBottomWidth: 1,
    borderColor: '#E3E5E5',
    paddingBottom: 6,
    marginTop: 13,
  },
  infoTitle: {
    color: '#555',
    fontWeight: '700',
  },
  infoContent: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
    color: '#aaa',
  },
});
