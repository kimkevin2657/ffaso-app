import React from 'react';
import { Image, StyleSheet } from 'react-native';
import Touchable from './buttons/Touchable';

const checkedIcon = require('../assets/icons/checkFocus.png');
const unCheckedIcon = require('../assets/icons/checkUnFocus.png');

export const CheckBoxItem = ({ onPress, hasCheck, style }) => {
  return (
    <Touchable onPress={onPress} style={[styles.checkbox, style]}>
      <Image
        style={styles.checkItem}
        source={hasCheck ? checkedIcon : unCheckedIcon}
      />
    </Touchable>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    marginLeft: 5,
    marginRight: 10,
    marginTop: 4,
  },
  checkItem: {
    width: 25,
    height: 25,
  },
});
