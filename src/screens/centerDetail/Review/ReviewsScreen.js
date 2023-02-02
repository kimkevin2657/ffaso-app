import React, { useState, useEffect, Fragment } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  FlatList,
} from 'react-native';
import CenterDetailTop from '../../../components/nearbyCenter/CenterDetailTop';
import {
  NormalBoldLabel,
  NormalBoldLabel12,
  NormalLabel,
} from '../../../components/Label';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RowContainer from '../../../components/containers/RowContainer';
import Touchable from '../../../components/buttons/Touchable';
import api from '../../../api/api';
import { renderAgo } from '../../../util';
import { useSelector } from 'react-redux';
import moment from 'moment';
import SpaceBetweenContainer from '../../../components/containers/SpaceBetweenContainer';

const { width, height } = Dimensions.get('window');

const ReviewsScreen = ({ navigation, route }) => {
  const { user } = useSelector((state) => state.auth);

  const { gym } = route.params;
  const [optionSelected, setOptionSelected] = useState('센터');
  const [reviewDatas, setReviewDatas] = useState({});
  const [photoReviews, setPhotoReviews] = useState([]);
  const [gymScore, setGymScore] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  console.log('reviewDatas[optionSelected]', reviewDatas[optionSelected]);

  useEffect(() => {
    getReviewData();

    navigation.setOptions({
      title: gym?.name,
      headerLeft: () => (
        <Touchable
          onPress={() => {
            if (user?.type === '일반유저') {
              navigation.navigate('MemberCenterDetail', { gym });
            } else if (user?.type === '강사') {
              navigation.navigate('TeacherCenterDetail', { gym });
            }
          }}
          style={{ padding: 4 }}
        >
          <AntDesign
            name='left'
            size={22}
            color={'#555'}
            style={{ padding: 4, alignSelf: 'center' }}
          />
        </Touchable>
      ),
    });
  }, []);

  const getReviewData = async () => {
    try {
      let { data } = await api.get(`gym-reviews?gymId=${gym.id}`);
      console.log('reviewData :', data);
      setReviewCount(data.length);
      if (data.length > 0) {
        setGymScore(data[0].gymScore);
      }

      let newReviews = {};
      let newPhotoReviews = [];

      data.forEach((review) => {
        // let newActiveTab = optionSelected;

        if (review.image) {
          newPhotoReviews.push(review);
        }
        // if (review.category === newActiveTab) {
        // newReviews[newActiveTab].push(review);
        if (newReviews[review.category] === undefined) {
          newReviews[review.category] = [];
        }
        newReviews[review.category].push(review);
        // newReviews.센터.push(review)
        // }
      });

      setReviewDatas(newReviews);
      setPhotoReviews(newPhotoReviews);
    } catch (err) {
      console.log(err);
      console.log(err.response);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 32,
        }}
      >
        <NormalLabel
          text={gymScore.toFixed(1)}
          style={{ fontSize: 40, lineHeight: 44, fontWeight: '800' }}
        />
        <RowContainer>
          {[1, 2, 3, 4, 5].map((score, index) => (
            <AntDesign
              key={index}
              name={'star'}
              size={20}
              color={gymScore >= score ? '#F2DA00' : '#dadada'}
              // style={{padding: 4, alignSelf: 'center'}}
              style={{ marginRight: 2, marginTop: 16 }}
            />
          ))}
        </RowContainer>

        <NormalBoldLabel
          style={{ marginTop: 8.56, color: '#555' }}
          text={`${reviewCount}개`}
        />
      </View>

      <View style={{ marginHorizontal: 24, flex: 1 }}>
        <RowContainer style={styles.photoReview}>
          <NormalBoldLabel
            style={styles.reviewTitle}
            text={`포토리뷰 ${photoReviews?.length}`}
          />
          {photoReviews.length > 0 && (
            <Touchable
              onPress={() =>
                navigation.navigate('ShowAll', { photoReviews, gym })
              }
            >
              <NormalLabel
                style={{ fontSize: 12, lineHeight: 15, color: '#aaa' }}
                text={'전체보기'}
              />
            </Touchable>
          )}
        </RowContainer>

        {photoReviews?.length === 0 && (
          <NormalBoldLabel
            text={'등록된 포토리뷰가 없습니다.'}
            style={{
              color: '#aaa',
              fontSize: 12,
              lineHeight: 16,
              marginTop: 25,
            }}
          />
        )}
      </View>

      <RowContainer
        style={{
          marginTop: 14,
          paddingHorizontal: 22,
        }}
      >
        {photoReviews.map(
          (data, i) =>
            i < 4 && (
              <Fragment key={i}>
                {i < 3 ? (
                  <Image
                    style={styles.photoImage}
                    source={{ uri: data?.image }}
                  />
                ) : (
                  <Touchable
                    style={styles.fourPhotoImage}
                    onPress={() =>
                      navigation.navigate('ShowAll', { photoReviews, gym })
                    }
                  >
                    <ImageBackground
                      source={{ uri: data?.image }}
                      style={{
                        ...styles.photoImage,
                        margin: 0,
                      }}
                    >
                      <NormalBoldLabel
                        text={`+${photoReviews.length - 3}`}
                        style={styles.imageCount}
                      />
                    </ImageBackground>
                  </Touchable>
                )}
              </Fragment>
            )
        )}
      </RowContainer>

      <View style={{ marginTop: 15 }}>
        <SpaceBetweenContainer style={styles.reviewContainer}>
          <NormalBoldLabel
            text={`리뷰 ${
              reviewDatas[optionSelected]?.length === undefined
                ? ''
                : reviewDatas[optionSelected]?.length
            }`}
            // style={[styles.reviewTitle, {paddingLeft: 25, marginBottom: 14}]}/>
            style={styles.reviewTitle}
          />

          {/* 클라이언트님 프로세스 설명 파일에 강사는 리뷰작성 불가능이라고 되어있음 */}
          {user?.type === '일반유저' && (
            <Touchable
              style={styles.writingBtn}
              onPress={() =>
                navigation.navigate('CenterReviewWriting', { gym })
              }
            >
              <NormalBoldLabel12
                text={'리뷰작성'}
                style={styles.writingBtnTxt}
              />
            </Touchable>
          )}
        </SpaceBetweenContainer>
        <RowContainer style={styles.optionList}>
          {['센터', '서비스', '강사', '기타', '컴플레인'].map((label, i) => (
            <Touchable
              style={styles.bottomCategory}
              key={i.toString()}
              // id={data.reviewId}
              onPress={() => setOptionSelected(label)}
            >
              <NormalBoldLabel
                text={label}
                style={{
                  ...styles.option,
                  color: optionSelected === label ? '#8082FF' : '#555',
                }}
              />
            </Touchable>
          ))}
        </RowContainer>

        <FlatList
          data={reviewDatas[optionSelected]}
          style={{
            paddingBottom:
              reviewDatas[optionSelected] && reviewDatas[optionSelected]
                ? 24
                : 0,
          }}
          renderItem={({ item, index }) => (
            <BottomTabCenterView
              gymScore={item.score}
              createdAt={item.createdAt}
              userName={item.user_name}
              content={item.content}
              replies={item.replies}
            />
          )}
          keyExtractor={(item, index) => item.id + index.toString()}
        />
        {reviewDatas[optionSelected] === undefined && (
          <NormalBoldLabel
            text={'등록된 리뷰가 없습니다.'}
            style={{
              color: '#AAA',
              fontSize: 12,
              lineHeight: 16,
              marginTop: 25,
              fontWeight: '700',
              marginLeft: 25,
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default ReviewsScreen;

const BottomTabCenterView = ({
  gymScore,
  createdAt,
  userName,
  content,
  replies,
}) => {
  String.prototype.replaceAt = function (index, replacement) {
    return (
      this.substr(0, index) +
      replacement +
      this.substr(index + replacement.length)
    );
  };
  return (
    <View
      style={{
        marginTop: 24,
        borderBottomColor: '#e3e5e5',
        borderBottomWidth: 1,
        paddingBottom: 15,
        marginHorizontal: 24,
      }}
    >
      <NormalBoldLabel text={content} />
      <RowContainer style={{ marginTop: 10 }}>
        {[1, 2, 3, 4, 5].map((score, index) => (
          <AntDesign
            key={index}
            name={'star'}
            size={14}
            color={gymScore >= score ? '#F2DA00' : '#dadada'}
            style={{ marginRight: 2 }}
          />
        ))}
        <NormalBoldLabel
          text={gymScore.toFixed(1)}
          style={{
            marginLeft: 6,
            fontSize: 12,
            lineHeight: 16,
            color: '#555',
          }}
        />
      </RowContainer>
      <NormalLabel
        style={{
          marginTop: 24.56,
          color: '#555',
          fontSize: 12,
          lineHeight: 16,
        }}
        text={`${userName.replaceAt(1, '*')} | ${renderAgo(createdAt)}`}
      />
      {replies.length > 0 && <Reply {...replies[0]} />}
    </View>
  );
};

const Reply = ({ content, createdAt }) => (
  <View style={styles.replyContainer}>
    <SpaceBetweenContainer>
      <NormalBoldLabel text={'빠소센터'} />
      <NormalLabel
        text={moment(createdAt).format('YYYY-MM-DD | HH:mm')}
        style={{ color: '#aaa', fontSize: 12, lineHeight: 16 }}
      />
    </SpaceBetweenContainer>
    <NormalLabel text={content} style={{ marginTop: 20 }} />
  </View>
);

const styles = StyleSheet.create({
  replyContainer: {
    marginTop: 20,
    paddingTop: 14,
    backgroundColor: '#F7F7FF',
    paddingLeft: 15,
    paddingRight: 14,
    paddingBottom: 13,
  },
  reviewContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e3e5e5',
    paddingLeft: 25,
    alignItems: 'baseline',
  },
  container: {
    backgroundColor: '#fbfbfb',
  },
  titleInner: {
    position: 'relative',
    paddingTop: 20,
  },
  backActionable: {
    resizeMode: 'contain',
    position: 'absolute',
    left: 28.5,
    width: 20,
    height: 20,
  },
  centerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  centerGrade: {
    flexDirection: 'row',
  },
  grade: {
    resizeMode: 'contain',
    width: 13,
    height: 12,
    marginLeft: 2,
  },
  optionList: {
    borderBottomWidth: 1,
    borderBottomColor: '#e3e5e5',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingHorizontal: 46,
  },
  bottomCategory: {
    paddingVertical: 10,
    // marginLeft: 46,
  },
  option: {
    fontSize: 12,
    lineHeight: 16,
  },
  photoReview: {
    borderBottomWidth: 1,
    borderBottomColor: '#e3e5e5',
    paddingVertical: 11,
    justifyContent: 'space-between',
  },
  reviewTitle: {
    fontSize: 18,
    lineHeight: 22,
    marginBottom: 10,
  },
  photoReviewImg: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 14,
  },
  photoImage: {
    margin: 3,
    width: (width - 68) / 4,
    height: (width - 68) / 4,
  },
  fourPhotoImage: {
    margin: 3,
    width: (width - 68) / 4,
    height: (width - 68) / 4,
    flex: 1,
  },
  imageCount: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: (width - 68) / 4,
    height: (width - 68) / 4,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 20,
    lineHeight: 24,
  },
  writingBtn: {
    backgroundColor: '#8082FF',
    marginRight: 24,
    height: 24,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7.5,
  },
  writingBtnTxt: {
    fontSize: 12,
    color: '#fff',
  },
});
