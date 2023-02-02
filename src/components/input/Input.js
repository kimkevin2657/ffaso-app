import React from 'react';
import { TextInput } from 'react-native';

export const LabelInput = ({
  value,
  onChangeText,
  secureTextEntry = false,
  placeholder,
  style,
  keyboardType = 'default',
  maxLength,
  textContentType,
}) => {
  return (
    <>
      <TextInput
        style={style}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={'#a5a5a5'}
        keyboardType={keyboardType}
        maxLength={maxLength}
        textContentType={textContentType}
        autoCapitalize={'none'}
        multiline
        textAlignVertical='top'
      />
    </>
  );
};
