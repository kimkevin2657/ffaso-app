import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { NormalBoldLabel } from '../../../components/Label';
import CenterDetailTop from '../../../components/nearbyCenter/CenterDetailTop';
import Touchable from '../../../components/buttons/Touchable';
import RowContainer from '../../../components/containers/RowContainer';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

const ShowAllReview = ({ navigation, route }) => {
  const { user } = useSelector((state) => state.auth);
  const { photoReviews, gym } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Touchable
          onPress={() => Alert.alert('준비중입니다.')}
          style={{ padding: 4 }}
        >
          <Text style={{ fontSize: 12, color: '#555' }}>리뷰운영정책</Text>
        </Touchable>
      ),
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <ScrollView>
        <CenterDetailTop
          selectedTabId={4}
          onPress={(selectedOptionId) => {
            // console.log(selectedOptionId)
            if (selectedOptionId === 1) {
              if (user?.type === '일반유저') {
                navigation.navigate('MemberCenterDetail', { gym });
              } else if (user?.type === '강사') {
                navigation.navigate('TeacherCenterDetail', { gym });
              }
            } else if (selectedOptionId === 2) {
              navigation.navigate('Price', { gym });
            } else if (selectedOptionId === 3) {
              navigation.navigate('Trainer', { gym });
            }
          }}
        />
      </ScrollView>

      <NormalBoldLabel
        text={`포토리뷰 ${photoReviews?.length}`}
        style={{ marginTop: 15, marginBottom: 12, marginLeft: 25 }}
      />
      <FlatList
        style={styles.imageContainer}
        data={photoReviews}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.id + index.toString()}
        numColumns={4}
        renderItem={({ item }) => (
          <Image style={styles.photoImage} source={{ uri: item?.image }} />
        )}
      />
    </ScrollView>
  );
};

export default ShowAllReview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  imageContainer: {
    paddingHorizontal: 22,
  },
  photoImage: {
    margin: 3,
    width: (width - 68) / 4,
    height: (width - 68) / 4,
    // borderWidth: 1,
    // height: window_height * 0.11,
    // width: window_height * 0.11,
  },
});
