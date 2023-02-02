import React from 'react';
import {View} from 'react-native';

const ColumnView = ({children, style}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        ...style,
      }}>
      {children}
    </View>
  );
};

export default ColumnView;
