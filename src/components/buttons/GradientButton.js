import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Touchable from './Touchable';

const GradientButton = ({ children, onPress, outerStyle, style }) => {
  // outerStyle={{ marginTop: 16, marginBottom: 28 }}
  return (
    <Touchable style={outerStyle} onPress={onPress}>
      <LinearGradient
        colors={['#8082FF', '#81D1F8']}
        style={[styles.btn, style]}
      >
        <View>{children}</View>
      </LinearGradient>
    </Touchable>
  );
};

export default GradientButton;

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 16,
  },
});
