import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import RowContainer from '../containers/RowContainer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NormalBoldLabel, NormalLabel } from '../Label';
import { SCREEN_WIDTH } from '../../constants/constants';
import FastImage from 'react-native-fast-image';

const Option = (props) => {
  return (
    <View style={styles.container}>
      <RowContainer>
        <View>
          <FastImage
            style={{
              width: SCREEN_WIDTH / 4.4776,
              height: SCREEN_WIDTH / 4.4776,
            }}
            source={{ uri: props.image }}
          />
        </View>

        <View style={styles.centerLocation}>
          <View style={styles.infoContainer}>
            <NormalBoldLabel text={props.title} style={styles.title} />
            {props.isNormalUser && (
              <TouchableOpacity
                style={styles.button}
                onPress={() => props.onRegister()}
              >
                <Text style={styles.registerBtnTxt}>등록</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.bottomContainer}>
            <NormalLabel style={styles.info} text={props.price} />
            <NormalLabel style={styles.info} text={props.availableCount} />
            <Text style={{ ...styles.info, fontWeight: 'bold' }}>
              #설명 : {props.explanation}
            </Text>
          </View>
        </View>
      </RowContainer>
    </View>
  );
};

export default Option;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 14,
    borderBottomColor: '#e3e5e5',
    borderBottomWidth: 1,
  },
  centerLocation: {
    marginLeft: 13.25,
    flex: 1,
    // position: 'absolute',
    // top: 0,
    // right: 0,
    // width: '70%',
  },
  infoContainer: {
    // position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  title: {
    marginRight: 8,
  },

  bottomContainer: {
    marginTop: 13,
  },
  info: {
    fontSize: 12,
    lineHeight: 18,
    color: '#555',
  },
  icon: {
    width: 20,
    resizeMode: 'contain',
    marginLeft: 8,
  },

  button: {
    backgroundColor: '#8082FF',
    paddingHorizontal: 8.5,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    position: 'absolute',
    right: 0,
  },
  registerBtnTxt: {
    color: '#fff',
    fontSize: 12,
  },
  trainerPage: {
    flexDirection: 'row',
  },

  trainerPageIcon: {
    resizeMode: 'contain',
    width: 20,
    marginRight: 5,
  },
});
