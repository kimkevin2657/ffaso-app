import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const BottomGradientButton = ({
  children,
  onPress,
  style,
  disabled,
  outerStyle,
}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={['#8082FF', '#81D1F8']}
        style={[styles.btn, outerStyle]}
      >
        <View>{children}</View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default BottomGradientButton;

const styles = StyleSheet.create({
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 16,
  },
});
