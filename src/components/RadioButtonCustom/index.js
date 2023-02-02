import React from 'react';

import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButtonCustom = ({
  onValueChange,
  selectValue,
  radioList,
  labelStyle,
  style,
}) => {
  return (
    <View style={{ ...styles.container, ...style }}>
      {radioList?.map(({ value, label }) => (
        <View style={styles.radioBox}>
          <TouchableOpacity
            onPress={React.useCallback(() => {
              onValueChange(value);
            }, [])}
          >
            <View style={styles.circle}>
              {selectValue === value && <View style={styles.focus} />}
            </View>
          </TouchableOpacity>
          <Text style={{ ...styles.labels, ...labelStyle }}>{label}</Text>
        </View>
      ))}
    </View>
  );
};

export default React.memo(RadioButtonCustom);

const styles = StyleSheet.create({
  labels: {
    fontSize: 14,
    lineHeight: 19,
    color: '#0E0F0F',
  },
  container: {
    flexDirection: 'row',
  },
  radioBox: {
    flexDirection: 'row',
    alignItems: 'center',
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
