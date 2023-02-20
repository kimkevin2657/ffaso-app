import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import RowContainer from './containers/RowContainer';
import Touchable from './buttons/Touchable';
import { NormalBoldLabel, NormalLabel } from './Label';
import SpaceBetweenContainer from './containers/SpaceBetweenContainer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MySchedule = ({
  onUpdate,
  onDelete,
  isModalActive,
  type,
  startTime,
  endTime,
  lessonName,
  isLast,
  receiver, // obj
  item,
  status,
  setLocationX,
  setLocationY,
  setIsDropdownOpen,
  setSelectedContent,
}) => {
  return (
    <View style={[styles.container, status === '출석' && styles.attendEnd]}>
      <RowContainer style={{ flex: 1 }}>
        <View
          style={{
            ...styles.color,
            backgroundColor: type === '강습' ? '#94C62B' : '#81D1F8',
          }}
        />
        <View style={{ flex: 1 }}>
          <SpaceBetweenContainer style={{ flex: 1 }}>
            <RowContainer>
              <NormalBoldLabel
                text={`[${type}] ${lessonName ?? ''}`}
                style={{ marginRight: 7 }}
              />
              <NormalBoldLabel
                text={`${receiver?.department ?? ''}  ${receiver?.koreanName}`}
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  color: '#555',
                }}
              />
            </RowContainer>
            <Touchable
              onPress={(evt) => {
                setIsDropdownOpen(true);
                setSelectedContent(item);
                setLocationX(evt.nativeEvent.pageX);
                setLocationY(evt.nativeEvent.pageY);
              }}
            >
              <MaterialIcons name='more-vert' size={20} color={'#AAAAAA'} />
            </Touchable>
          </SpaceBetweenContainer>
          <NormalLabel
            text={item?.gymName}
            style={{
              fontSize: 12,
              lineHeight: 15,
              color: '#555',
              marginTop: 8.5,
            }}
          />
          <SpaceBetweenContainer>
            <NormalLabel
              text={`${startTime.substring(0, 5)} ~ ${endTime.substring(0, 5)}`}
              style={{
                fontSize: 12,
                lineHeight: 18,
                color: '#555',
                marginTop: 12,
              }}
            />
            {status === '출석' && (
              <View
                style={{
                  marginTop: 8,
                  backgroundColor: '#aaa',
                  borderRadius: 5,
                  paddingVertical: 3,
                  paddingHorizontal: 6,
                }}
              >
                <NormalLabel
                  style={{
                    ...styles.miniText,
                    color: '#fff',
                  }}
                  text={'출석완료'}
                />
              </View>
            )}
          </SpaceBetweenContainer>
        </View>
      </RowContainer>

      <View style={styles.rightContainer}>
        {isModalActive && (
          <View style={styles.modalContainer}>
            <Touchable onPress={onUpdate} style={styles.topModalBtn}>
              <NormalLabel
                text={'수정'}
                style={{
                  ...styles.miniText,
                  color: '#555',
                }}
              />
            </Touchable>
            <Touchable onPress={onDelete} style={styles.bottomModalBtn}>
              <NormalLabel
                text={'삭제'}
                style={{
                  ...styles.miniText,
                  color: '#FF0000',
                }}
              />
            </Touchable>
          </View>
        )}
        {/*<Touchable style={styles.updateBtn} onPress={() => onModalOpenPress()}>*/}
        {/*  <Entypo name='dots-three-vertical' size={22} color={'#aaa'} />*/}
        {/*</Touchable>*/}
      </View>
    </View>
  );
};

export default MySchedule;

const styles = StyleSheet.create({
  container: {
    borderColor: '#E3E5E5',
    paddingBottom: 17,
    marginTop: 18,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  attendEnd: {
    opacity: Platform.select({ android: 0.7, ios: 0.5 }),
  },
  color: {
    width: 7,
    height: '100%',
    // backgroundColor: '#94C62B',
    marginRight: 10,
  },
  rightContainer: {
    flexDirection: 'row',
  },
  miniText: {
    fontSize: 12,
    lineHeight: 18,
  },
  updateBtn: {
    padding: 4,
  },
  modalContainer: {
    // borderRadius: 10,
    // borderWidth: 1,
    height: 76,
    width: 86,
    marginRight: -6,
  },
  topModalBtn: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 9,
    height: 38,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1,

    elevation: 1,
  },
  bottomModalBtn: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // borderTopWidth: 1,
    // borderColor: '#e3e5e5',
    paddingTop: 9,
    paddingBottom: 10,
    height: 37,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1,

    elevation: 1,
  },
});
