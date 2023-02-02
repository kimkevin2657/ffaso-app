import React from 'react';
import { Image, Text, View, StyleSheet, Dimensions } from 'react-native';
import Touchable from './buttons/Touchable';
import { NormalLabel } from './Label';

const { width } = Dimensions.get('window');

const RecommendContent = ({ name, image, onPress }) => {
  return (
    <Touchable onPress={onPress} style={styles.container}>
      <Image
        alt='추천컨텐츠 이미지'
        source={{ uri: image }}
        style={styles.recommendImage}
      />
      <NormalLabel text={name} style={styles.label} />
    </Touchable>
  );
};

export default RecommendContent;

const styles = StyleSheet.create({
  // recommendImageInner: {
  container: {
    marginTop: 14,
    marginRight: 14,
    width: width / 2,
    // position: 'relative',
    // width: 172,
    // height: 116,
    // borderRadius: 20,
    // overflow: 'hidden',
  },

  recommendImage: {
    // width: 172,
    width: width / 2,
    height: 116,
    borderRadius: 10,
    // position: 'absolute',
    // top: -50,
    // width: '100%',
    // resizeMode: 'cover',
  },
  label: {
    fontSize: 12,
    lineHeight: 15,
    color: '#555',
    marginTop: 9,
    marginLeft: 13,
  },
});
