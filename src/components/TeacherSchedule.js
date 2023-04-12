import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import RowContainer from './containers/RowContainer';
import Touchable from './buttons/Touchable';
import {
  BoldLabel12,
  NormalBoldLabel,
  NormalBoldLabel12,
  NormalLabel,
  NormalLabel12,
} from './Label';
import { TEACHER_TYPE_COLOR } from '../constants/constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DropdownModal from './dropdownModal';

const TeacherSchedule = ({
  onUpdate,
  onDelete,
  onModalOpenPress,
  isModalActive,
  type,
  startTime,
  endTime,
  lessonName,
  teacherDepartment,
  isLast,
  receiver, // obj
  item,
  //
  setLocationX,
  setLocationY,
  setIsDropdownOpen,
  setSelectedContent,
  onPress,
}) => {
  const statusType = [
    {
      title: '취소',
      color: '#888888',
      value: item?.userCounts?.cancel ?? 0,
    },
    {
      title: '결석',
      color: '#FF0000',
      value: item?.userCounts?.absent ?? 0,
    },
    {
      title: '출석',
      color: '#8082FF',
      value: item?.userCounts?.attend ?? 0,
    },
  ];
  return (
    <Touchable
      onPress={onPress}
      style={{
        ...styles.container,
        borderBottomWidth: 1,
        // borderBottomWidth: isLast ? 0 : 1,
      }}
    >
      <RowContainer style={{ flex: 1 }}>
        <View
          style={{
            ...styles.color,
            backgroundColor: TEACHER_TYPE_COLOR[type],
          }}
        />
        <View style={{ flex: 1 }}>
          <RowContainer
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <RowContainer>
              <NormalBoldLabel
                text={`${lessonName}`}
                style={{ marginRight: 22 }}
              />
              <BoldLabel12
                text={`정원 : ${item?.userCounts?.total ?? 0}명`}
                style={{ color: '#555' }}
              />
              {/*<NormalBoldLabel12*/}
              {/*  style={{ color: '#555' }}*/}
              {/*  text={`정원 : 1명`}*/}
              {/*/>*/}
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
          </RowContainer>
          {/*<NormalLabel*/}
          {/*  text={item?.gymName}*/}
          {/*  style={{*/}
          {/*    fontSize: 12,*/}
          {/*    lineHeight: 15,*/}
          {/*    color: '#555',*/}
          {/*    marginTop: 8.5,*/}
          {/*  }}*/}
          {/*/>*/}
          <RowContainer style={{ marginTop: 12 }}>
            <NormalLabel
              text={
                startTime
                  ? `${startTime?.substring(0, 5)} ~ ${endTime?.substring(
                      0,
                      5
                    )}`
                  : ''
              }
              style={{
                fontSize: 12,
                lineHeight: 18,
                color: '#555',
              }}
            />
            <RowContainer style={{ flex: 1, justifyContent: 'center' }}>
              {statusType.map((data, index) => (
                <React.Fragment key={index}>
                  {index === 1 && <View style={styles.division} />}
                  <NormalLabel12
                    text={`${data.title} `}
                    style={{ color: '#000' }}
                  />
                  <NormalLabel12
                    text={data.value}
                    style={{ color: data.color }}
                  />
                  <NormalLabel12 text={'명'} style={{ color: '#000' }} />
                  {index === 1 && <View style={styles.division} />}
                </React.Fragment>
              ))}
            </RowContainer>
          </RowContainer>
        </View>
      </RowContainer>

      <View style={styles.rightContainer}>
        {isModalActive && (
          <View style={styles.modalContainer}>
            <Touchable onPress={onUpdate} style={styles.topModalBtn}>
              <NormalLabel
                text={'수정'}
                style={{
                  fontSize: 12,
                  lineHeight: 18,
                  color: '#555',
                }}
              />
            </Touchable>
            <Touchable onPress={onDelete} style={styles.bottomModalBtn}>
              <NormalLabel
                text={'삭제'}
                style={{
                  fontSize: 12,
                  lineHeight: 18,
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
    </Touchable>
  );
};

export default TeacherSchedule;

const styles = StyleSheet.create({
  container: {
    borderColor: '#E3E5E5',
    paddingBottom: 17,
    marginTop: 18,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
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
  division: {
    backgroundColor: '#AAAAAA',
    height: 13,
    width: 1,
    marginHorizontal: 3,
  },
});
