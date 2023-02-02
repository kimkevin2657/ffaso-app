import React from 'react';
import { Text } from 'react-native';

export const NoneLabel = ({ text, style }) => (
  <Text style={{ color: '#555', ...style }}>{text}</Text>
);

export const NormalLabel = ({
  text,
  style,
  numberOfLines = 0,
  ellipsizeMode,
}) => (
  <Text
    numberOfLines={numberOfLines}
    ellipsizeMode={ellipsizeMode}
    style={{ fontSize: 15, lineHeight: 19, color: '#000', ...style }}
  >
    {text}
  </Text>
);

export const NormalBoldLabel = ({
  text,
  style,
  numberOfLines,
  ellipsizeMode,
}) => (
  <Text
    numberOfLines={numberOfLines}
    ellipsizeMode={ellipsizeMode}
    style={{
      fontSize: 15,
      // lineHeight: 19,
      color: '#000',
      fontWeight: 'bold',
      ...style,
    }}
  >
    {text}
  </Text>
);

export const NormalBoldLabel12 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 12,
      lineHeight: 16,
      color: '#fff',
      fontWeight: 'bold',
      ...style,
    }}
  >
    {text}
  </Text>
);

export const NormalBoldLabel14 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 14,
      // lineHeight: 18,
      color: '#0E0F0F',
      // fontWeight: 'bold',
      ...style,
    }}
  >
    {text}
  </Text>
);
export const NormalLabel12 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 12,
      lineHeight: 18,
      color: '#fff',
      ...style,
    }}
  >
    {text}
  </Text>
);
export const NormalLabel13 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 12,
      lineHeight: 13 * 1.5,
      color: '#fff',
      ...style,
    }}
  >
    {text}
  </Text>
);
export const NormalLabel16 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 16,
      lineHeight: 16 * 1.5,
      color: '#fff',
      ...style,
    }}
  >
    {text}
  </Text>
);
export const BoldLabel13 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 13,
      lineHeight: 13 * 1.5,
      fontWeight: 'bold',
      color: '#fff',
      ...style,
    }}
  >
    {text}
  </Text>
);
export const BoldLabel12 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 12,
      lineHeight: 12 * 1.5,
      fontWeight: 'bold',
      color: '#fff',
      ...style,
    }}
  >
    {text}
  </Text>
);
export const BoldLabel14 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 14,
      lineHeight: 14 * 1.5,
      fontWeight: 'bold',
      color: '#fff',
      ...style,
    }}
  >
    {text}
  </Text>
);
export const BoldLabel15 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 15,
      lineHeight: 15 * 1.5,
      fontWeight: 'bold',
      color: '#fff',
      ...style,
    }}
  >
    {text}
  </Text>
);

export const BoldLabel16 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 16,
      lineHeight: 16 * 1.5,
      fontWeight: 'bold',
      color: '#fff',
      ...style,
    }}
  >
    {text}
  </Text>
);
export const BoldLabel18 = ({ text, style }) => (
  <Text
    style={{
      fontSize: 18,
      lineHeight: 18 * 1.5,
      fontWeight: 'bold',
      color: '#fff',
      ...style,
    }}
  >
    {text}
  </Text>
);
