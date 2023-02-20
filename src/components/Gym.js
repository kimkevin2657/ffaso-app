import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import RowContainer from './containers/RowContainer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NormalBoldLabel, NormalLabel } from './Label';
import { SCREEN_WIDTH } from '../constants/constants';
import FastImage from 'react-native-fast-image';
import SpaceBetweenContainer from './containers/SpaceBetweenContainer';
import { Container } from './containers/Container';

const Gym = (props) => {
  const { title } = props;

  return (
    <Container>
      <RowContainer style={{ marginVertical: 16 }}>
        <FastImage
          style={styles.logo}
          source={
            !props.logo
              ? require('../assets/images/NoCenter.png')
              : { uri: props.logo }
          }
        />

        <View style={styles.centerLocation}>
          <SpaceBetweenContainer style={{ alignItems: 'flex-start' }}>
            <RowContainer style={{ flex: 1 }}>
              <NormalBoldLabel
                text={title.length > 8 ? title.slice(0, 8) + '...' : title}
                style={styles.title}
                // numberOfLines={1}
                // ellipsizeMode={'tail'}
              />
            </RowContainer>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <AntDesign name='star' size={16} color={'#F2DA00'} />
                <NormalBoldLabel
                  style={{ fontSize: 12, lineHeight: 16, marginLeft: 3 }}
                  text={props.average?.toFixed(1)}
                />
                <NormalBoldLabel
                  style={{ fontSize: 10, lineHeight: 14, color: '#aaa' }}
                  text={` (${props.averageCount}개)`}
                />
              </View>
              <NormalBoldLabel
                style={{
                  fontSize: 10,
                  lineHeight: 15,
                  color: '#aaa',
                  textAlign: 'right',
                }}
                text={props.distance}
              />
            </View>
          </SpaceBetweenContainer>

          <View style={styles.bottomContainer}>
            <NormalLabel
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.lessonInfo}
              text={
                props.categoryList?.length > 0
                  ? '이용 종목 : ' +
                    props.categoryList
                      ?.map(
                        (category, i) =>
                          category +
                          (i !== props.categoryList.length - 1 ? ' | ' : '')
                      )
                      .join(' ')
                  : '이용 종목 : 정보가 없습니다.'
              }
            />
            <NormalLabel
              numberOfLines={1}
              ellipsizeMode={'tail'}
              style={styles.lessonInfo}
              text={
                props.lessonTags?.length > 0
                  ? '강습 : ' +
                    props.lessonTags
                      ?.map(
                        (lesson, i) =>
                          lesson +
                          (i !== props.lessonTags.length - 1 ? ' | ' : '')
                      )
                      .join(' ')
                  : '강습 : 정보가 없습니다.'
              }
            />
            {props.explanation && (
              <Text style={{ ...styles.info, fontWeight: 'bold' }}>
                {props.explanation ? `#설명 : ${props.explanation}` : null}
              </Text>
            )}
          </View>
        </View>
      </RowContainer>
    </Container>
  );
};

export default Gym;

const styles = StyleSheet.create({
  logo: {
    width: SCREEN_WIDTH * 0.223,
    height: SCREEN_WIDTH * 0.223,
  },
  container: {},
  centerLocation: {
    marginLeft: 13.25,
    flex: 1,
    height: '100%',
  },
  title: {
    marginRight: 8,
    lineHeight: 19,
    // width: 117 / SCREEN_WIDTH,
  },

  bottomContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1,
  },
  lessonInfo: {
    fontSize: 12,
    lineHeight: 18,
    color: '#555',
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
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 3,
    paddingBottom: 3,
    color: '#fff',
    borderRadius: 5,
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
