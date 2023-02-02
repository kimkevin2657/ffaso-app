import React from 'react';

import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButtons = ({ style, color, value, status, onPress }) => {
  const isChecked = status === 'checked';
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ ...style, ...styles.container }}
    >
      <View style={styles.circle}>
        {isChecked && (
          <View style={{ ...styles.focus, backgroundColor: color }} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default RadioButtons;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#8082FF',
    marginRight: 6,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 2,
  },
  focus: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#8082FF',
  },
});
