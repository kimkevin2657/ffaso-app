import React from 'react';
import { View } from 'react-native';

const RowContainer = ({ children, style }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', ...style }}>
      {children}
    </View>
  );
};

export default RowContainer;
