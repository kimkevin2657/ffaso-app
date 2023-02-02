import React from 'react';
import {SafeAreaView} from 'react-native';

const WhiteSafeAreaView = ({children, style}) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff', ...style}}>
      {children}
    </SafeAreaView>
  );
};

export default WhiteSafeAreaView;
