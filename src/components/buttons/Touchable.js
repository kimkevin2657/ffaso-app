import React from 'react';
import {TouchableOpacity, View} from 'react-native';

const Touchable = ({children, onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={style}>{children}</View>
    </TouchableOpacity>
  );
};

export default Touchable;
