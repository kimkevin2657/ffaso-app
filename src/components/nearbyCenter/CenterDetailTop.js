import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import GradientButton from '../buttons/GradientButton';
import { NormalBoldLabel } from '../Label';

const LIST = [
  {
    id: 1,
    title: '홈',
    path: 'MemberCenterDetail',
  },
  {
    id: 2,
    title: '요금',
    path: 'Price',
  },
  {
    id: 3,
    title: '강사',
    path: 'Trainer',
  },
  {
    id: 4,
    title: '리뷰',
    path: '',
  },
];

const CenterDetailTop = ({ selectedTabId, onPress }) => {
  return (
    <View style={styles.categoryList}>
      {LIST.map((data) =>
        selectedTabId === data.id ? (
          <GradientButton
            key={data.id}
            style={styles.category}
            onPress={() => {
              onPress(data.id);
              // console.log('data.id', data.id);
            }}
          >
            <NormalBoldLabel
              style={{ color: '#fff', fontSize: 12, lineHeight: 16 }}
              text={`${data.title} ${data.title === '리뷰' ? '' : ''}`}
            />
          </GradientButton>
        ) : (
          <TouchableOpacity
            key={data.id}
            style={[styles.category, { backgroundColor: 'white' }]}
            onPress={() => {
              // if (data.id === 2) {
              //   navigation.navigate('PriceScreen');
              // } else if (data.id === 3) {
              //   navigation.navigate('TrainerScreen');
              // } else if (data.id === 4) {
              //   navigation.navigate('ReviewsScreen');
              // }
              onPress(data.id);
              // console.log('data.id', data.id);
            }}
          >
            <NormalBoldLabel
              style={{ color: '#555', fontSize: 12, lineHeight: 16 }}
              text={`${data.title} ${data.title === '리뷰' ? '' : ''}`}
            />
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

export default CenterDetailTop;

const styles = StyleSheet.create({
  categoryList: {
    flexDirection: 'row',
    paddingTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e5e5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingLeft: 24,
  },

  category: {
    width: 75,
    height: 32,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E3E5E5',
    paddingVertical: 0,
    borderBottomWidth: 0,
  },

  optionList: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
  },
  option: {
    width: 75,
    textAlign: 'center',
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
  },
});
