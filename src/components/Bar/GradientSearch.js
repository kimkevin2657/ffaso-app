import React from 'react';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientSearch = ({children, style}) => {
  return (
    <LinearGradient colors={['#8082FF', '#81D1F8']} style={[styles.btn, style]}>
      <View style={{backgroundColor: '#fff', flex: 1}}>{children}</View>
    </LinearGradient>
  );
};

export default GradientSearch;

const styles = StyleSheet.create({
  btn: {
    padding: 3,
    height: 40,
  },
});
