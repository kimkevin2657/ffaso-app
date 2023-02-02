import { useNavigation } from '@react-navigation/core';
import React from 'react';
import Touchable from '../buttons/Touchable';
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native';
import { NormalBoldLabel } from '../Label';

const HeaderBar = ({ text, rightText, rightTextStyle, onPress }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.topContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          style={styles.backActionable}
          source={require('../../assets/images/membershipprice/arrow.png')}
          resizeMode='contain'
        />
      </TouchableOpacity>
      <NormalBoldLabel
        text={text}
        style={{
          fontSize: 20,
          lineHeight: 30,
        }}
      />
      <Touchable onPress={onPress}>
        <Text style={{ ...rightTextStyle }}>{rightText}</Text>
      </Touchable>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  backActionable: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    height: 54,
  },
  leftActionable: {
    width: 7,
    height: 14,
  },
});
