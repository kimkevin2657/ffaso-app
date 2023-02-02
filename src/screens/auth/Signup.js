import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';
import Touchable from '../../components/buttons/Touchable';
import GradientButton from '../../components/buttons/GradientButton';

const Signup = ({ navigation }) => {
  const [selectedType, setSelectedType] = React.useState(false);

  return (
    <View style={styles.container}>
      <CategoryBtn
        title={'회원'}
        boldSubTitle={'운동'}
        onPress={() => setSelectedType('일반유저')}
        image={
          selectedType === '일반유저'
            ? require('../../assets/images/signup/bellLit.png')
            : require('../../assets/images/signup/bellOff.png')
        }
        activeBorderColor={selectedType === '일반유저' ? '#6BB0F5' : '#aaa'}
      />
      <CategoryBtn
        title={'강사'}
        boldSubTitle={'강습'}
        onPress={() => setSelectedType('강사')}
        image={
          selectedType === '강사'
            ? require('../../assets/images/signup/bellLit.png')
            : require('../../assets/images/signup/bellOff.png')
        }
        activeBorderColor={selectedType === '강사' ? '#6BB0F5' : '#aaa'}
      />
      <CategoryBtn
        title={'기업'}
        boldSubTitle={'제품'}
        content={'플랫폼 2.0v'}
        onPress={() => Alert.alert('', '빠소 2.0v를 기대해주세요~!')}
        image={
          selectedType === '기업'
            ? require('../../assets/images/signup/bellLit.png')
            : require('../../assets/images/signup/bellOff.png')
        }
        activeBorderColor={selectedType === '기업' ? '#6BB0F5' : '#aaa'}
      />

      <View style={{ flex: 1 }} />
      <GradientButton
        onPress={() => {
          if (!selectedType) {
            Alert.alert('', '유형을 선택해주세요.');
            return;
          }
          navigation.navigate('Agreements', { type: selectedType });
        }}
      >
        <NormalBoldLabel
          text={'다음'}
          style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}
        />
      </GradientButton>
    </View>
  );
};

export default Signup;

const CategoryBtn = ({
  title,
  boldSubTitle,
  content,
  activeBorderColor,
  image,
  onPress,
}) => (
  <Touchable
    style={[styles.buttonBox, { borderColor: activeBorderColor }]}
    onPress={onPress}
  >
    <Image source={image} style={styles.bell} />
    <View>
      <NormalBoldLabel text={title} />
      <Text style={styles.categorySubTitle}>
        {`${title === '기업' ? '저희' : '주변'} `}
        <Text style={{ color: '#8082FF', fontWeight: 'bold' }}>
          {boldSubTitle}
        </Text>
        {`${title === '기업' ? '을 소개합니다' : '할 곳을 찾고 있으시나요?'}`}
      </Text>
      {!!content && (
        <NormalLabel
          text={content}
          style={{ fontSize: 10, lineHeight: 15, color: '#555' }}
        />
      )}
    </View>
  </Touchable>
);

const styles = StyleSheet.create({
  categorySubTitle: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 15,
    color: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
    paddingHorizontal: 24,
    paddingBottom: 25,
    paddingTop: 16,
  },
  buttonBox: {
    backgroundColor: '#fff',
    borderColor: '#aaa',
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 8,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 29,
    paddingLeft: 22,
    paddingBottom: 26,
  },
  bell: {
    width: 34,
    height: 34,
    marginRight: 10,
  },
});
