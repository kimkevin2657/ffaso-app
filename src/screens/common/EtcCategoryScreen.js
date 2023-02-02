import React, { useState } from 'react';
import { View, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import RowContainer from '../../components/containers/RowContainer';
import { NormalBoldLabel, NormalLabel } from '../../components/Label';
import { getGyms } from '../../redux/gymSlice';
import { useDispatch, useSelector } from 'react-redux';

const OTHER_DATA = [
  '볼링',
  '필라테스',
  '레슬링',
  // '등산',
  '클라이밍',
  '테니스',
  '배드민턴',
  '싸이클링',
  '스피닝',
  // '걷기',
  // '런닝',
  'G.X',
  '서핑',
  '축구',
  '농구',
  '실내 종목',
  '실외 종목',
];

const EtcCategoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [selectedItem, setSeletedItem] = useState(null);

  return (
    <View style={styles.container}>
      <FlatList
        data={OTHER_DATA}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.id + index.toString()}
        numColumns={2}
        renderItem={({ item, index }) => (
          <RowContainer style={styles.itemContainer} key={index}>
            <TouchableOpacity
              onPress={() => {
                // setSeletedItem(item);
                dispatch(getGyms(null, item));
                const navigationPath =
                  user?.type === '일반유저'
                    ? 'MemberCenterList'
                    : 'TeacherCenterList';
                navigation.navigate(navigationPath, { category: item });
              }}
              style={{
                backgroundColor: selectedItem === item ? '#8082FF' : '#fff',
                // width: 139,
                flex: 1,
                height: 33,
                borderRadius: 5,
                elevation: 1,
                marginHorizontal: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <NormalBoldLabel
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  color: selectedItem === item ? '#fff' : '#8082FF',
                }}
                text={item}
              />
            </TouchableOpacity>
          </RowContainer>
        )}
      />
    </View>
  );
};

export default EtcCategoryScreen;
// #8082FF

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    flex: 1,
    paddingTop: 36,
    backgroundColor: '#fbfbfb',
  },
  listContainer: {
    backgroundColor: '#fbfbfb',
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginTop: 12,
  },
});
