import React from 'react';
import {View} from 'react-native';

const SpaceBetweenContainer = ({children, style}) => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...style}}>
      {children}
    </View>
  );
};

export default SpaceBetweenContainer;
