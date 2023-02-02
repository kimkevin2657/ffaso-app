import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import RowContainer from './containers/RowContainer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NormalBoldLabel, NormalLabel } from './Label';
import { SCREEN_WIDTH } from '../constants/constants';
import FastImage from 'react-native-fast-image';

const Trainer = (props) => {
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
          <RowContainer style={{ justifyContent: 'space-between' }}>
            <NormalBoldLabel text={props.name} style={styles.title} />
            {props.isNormalUser && (
              <RowContainer>
                <TouchableOpacity
                  style={{ ...styles.button, right: 48 }}
                  onPress={props.onInquiry}
                >
                  <Text style={styles.rightBtnText}>채팅</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={props.onRegister}
                >
                  <Text style={styles.rightBtnText}>예약</Text>
                </TouchableOpacity>
              </RowContainer>
            )}
          </RowContainer>

          <View style={styles.bottomContainer}>
            <NormalLabel style={styles.info} text={props.description} />
            <Text style={{ ...styles.info, fontWeight: 'bold' }}>
              {props.explanation ? `#설명 : ${props.explanation}` : null}
            </Text>
          </View>
        </View>
      </RowContainer>
    </View>
  );
};

export default Trainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 14,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#e3e5e5',
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
  rightBtnText: {
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
