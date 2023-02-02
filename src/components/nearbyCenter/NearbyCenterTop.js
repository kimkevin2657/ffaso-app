import React from 'react';
import { View, StyleSheet } from 'react-native';
import CenterDetailTop from './CenterDetailTop';

const NearbyCenterTop = ({ tabId, onTabPress }) => {
  return (
    <View>
      <CenterDetailTop
        selectedTabId={tabId}
        onPress={(selectedOptionId) => {
          if (tabId === selectedOptionId) {
            return;
          }
          onTabPress(selectedOptionId);
          // console.log(selectedOptionId)
          // if (selectedOptionId === 1) {
          //     navigation.goBack()
          // } else if (selectedOptionId === 2) {
          //     navigation.navigate('Price');
          // } else if (selectedOptionId === 3) {
          //     navigation.navigate('TrainerScreen');
          // } else if (selectedOptionId === 4) {
          //     navigation.navigate('ReviewsScreen');
          // }
          // setSelectedTabId(selectedOptionId);
        }}
      />
    </View>
  );
};

export default NearbyCenterTop;

const styles = StyleSheet.create({
  titleInner: {
    position: 'relative',
    paddingTop: 20,
  },

  backActionable: {
    resizeMode: 'contain',
    position: 'absolute',
    left: 28.5,
    width: 20,
    height: 20,
  },

  centerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },

  secondTabBtn: {
    // marginLeft: 41,
    paddingVertical: 10,
  },
  option: {
    fontSize: 12,
    lineHeight: 16,
    // width: 75,
    // textAlign: 'center',
    // fontWeight: 'bold',
    // paddingTop: 10,
    // paddingBottom: 10,
  },
});
