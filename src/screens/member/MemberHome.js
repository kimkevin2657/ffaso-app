import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import { NormalLabel } from '../../components/Label';
import RowContainer from '../../components/containers/RowContainer';
import Touchable from '../../components/buttons/Touchable';
import { CATEGORY_DATA } from '../../assets/data/CATEGORY_DATA';
import RecommendContent from '../../components/RecommendContent';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getGyms } from '../../redux/gymSlice';
import { useDispatch, useSelector } from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import api from '../../api/api';

import Octicons from 'react-native-vector-icons/Octicons';
import { updateLocation } from '../../redux/locationSlice';
import SpaceBetweenContainer from '../../components/containers/SpaceBetweenContainer';
import { Container } from '../../components/containers/Container';
import { SCREEN_WIDTH } from '../../constants/constants';

const { width, height } = Dimensions.get('window');

const MemberHome = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { top, bottom } = useSafeAreaInsets();

  // const [isGpsToggle, setIsGpsToggle] = useState(false);
  // const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [recommendContents, setRecommendContents] = useState([]);

  useEffect(() => {
    // dispatch(signOut());
    dispatch(getGyms());
    getCurrentPoint();
    getRecommendContents();
  }, []);

  const onSearchGym = () => {
    if (searchKeyword === '') {
      return;
    }
    dispatch(getGyms(searchKeyword));
    navigation.navigate('MemberCenterList', { keyword: searchKeyword });
  };

  const getCurrentPoint = async () => {
    let result;
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('always');
    }
    if (Platform.OS === 'android') {
      result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }
    let isGranted =
      Platform.OS === 'android'
        ? result === PermissionsAndroid.RESULTS.GRANTED
        : true;
    // let isGranted = true;

    if (isGranted) {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // console.log('getLat, lon', latitude, longitude);
          dispatch(updateLocation(latitude, longitude));
          // dispatch(getLocationAddress(longitude, latitude))
        },
        (error) => {
          console.log('position err', error);
          console.log('errCode', error.code);
          console.log('errMsg', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        }
      );
    }
  };

  const getRecommendContents = async () => {
    try {
      const { data } = await api.get('recommend-contents?type=일반');
      // console.log('recommendContents', data);
      setRecommendContents(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  return (
    <Container>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 50 }}
        style={[
          styles.container,
          // {backgroundColor: isModalOn ? 'lightgray' : 'none'},
        ]}
      >
        <View style={{ flex: 1 }}>
          <SpaceBetweenContainer style={{ paddingHorizontal: 24 }}>
            <Touchable onPress={() => navigation.openDrawer()}>
              <Image
                alt='menu'
                source={require('../../assets/icons/home/menu.png')}
                style={{ width: 25, height: 21 }}
              />
            </Touchable>

            <RowContainer>
              {/* <Image alt='menu' source={require('../../icons/home/logo.png')} /> */}

              {user ? (
                <>
                  <Touchable
                    onPress={() => navigation.navigate('Alerts')}
                    style={styles.signup}
                  >
                    <Octicons name='bell' size={25} color='#8082FF' />
                    {/* <NormalLabel
                      style={{ marginLeft: 5, color: '#8082ff' }}
                      text={'프로필등록'}
                    /> */}
                  </Touchable>
                </>
              ) : (
                <>
                  <Touchable
                    onPress={() => navigation.navigate('Login')}
                    style={styles.signup}
                  >
                    <NormalLabel
                      style={{ marginLeft: 5, color: '#8082ff' }}
                      text={'로그인'}
                    />
                  </Touchable>
                  <Text>{' |'}</Text>
                  <Touchable
                    onPress={() => navigation.navigate('Signup')}
                    style={styles.signup}
                  >
                    <NormalLabel
                      style={{ marginLeft: 5, color: '#8082ff' }}
                      text={'회원가입'}
                    />
                  </Touchable>
                </>
              )}
            </RowContainer>
          </SpaceBetweenContainer>

          <View style={styles.topContainer}>
            <Image
              source={require('../../assets/images/home/infoText.png')}
              style={styles.inforImage}
            />
            {/*<RowContainer style={styles.titleInner}>*/}
            {/*  <Text style={styles.firstTilte}>빠</Text>*/}
            {/*  <Text style={styles.scendTilte}>르게</Text>*/}
            {/*</RowContainer>*/}
            {/*<RowContainer>*/}
            {/*  <Text style={styles.firstTilte}>소</Text>*/}
            {/*  <Text style={styles.scendTilte}>개해봅니다</Text>*/}
            {/*</RowContainer>*/}
          </View>

          <View style={styles.searchContents}>
            <Image
              source={require('../../assets/images/home/searchBar.png')}
              style={styles.searchBarImage}
            />
            <TextInput
              style={styles.searchBar}
              placeholder='어떤 운동이 하고 싶은가요?'
              placeholderTextColor={'#aaa'}
              value={searchKeyword}
              onChangeText={(text) => setSearchKeyword(text)}
            />
            <Touchable style={styles.searchIconImage} onPress={onSearchGym}>
              <Image
                alt='searchIcon'
                source={require('../../assets/icons/home/searchIcon.png')}
                style={{ width: 23, height: 23 }}
              />
            </Touchable>
          </View>

          {/* 카테고리 첫번째 */}
          <View style={styles.categoryContents}>
            <FlatList
              columnWrapperStyle={{
                justifyContent: 'space-between',
                marginBottom: 17,
              }}
              scrollEnabled={false}
              nestedScrollEnabled
              data={CATEGORY_DATA}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item, index) => item.id + index.toString()}
              numColumns={4}
              renderItem={({ item }) => (
                <Touchable
                  key={item.id}
                  style={[
                    styles.category,
                    {
                      backgroundColor: 'white',
                      // backgroundColor:
                      //   selectedCategoryId === item.id ? '#8082FF' : 'white',
                    },
                  ]}
                  onPress={() => {
                    if (item.path === 'TeacherOtherSportPage') {
                      navigation.navigate('TeacherOtherSportPage');
                    }
                    if (item.path !== 'TeacherOtherSportPage') {
                      dispatch(getGyms(null, item.title));
                      navigation.navigate('MemberCenterList', {
                        category: item.title,
                      });
                    }
                  }}
                >
                  <Image
                    alt='카테고리 아이콘'
                    style={{ width: '100%', height: 46 }}
                    source={
                      item.unFocusIcon
                      // selectedCategoryId === item.id
                      //   ? item.focusIcon
                      //   : item.unFocusIcon
                    }
                    resizeMode={'contain'}
                  />
                  <Text
                    style={[
                      styles.categoryList,
                      {
                        // color: selectedCategoryId === item.id ? '#fff' : '#555',
                        color: '#555',
                        fontWeight: 'normal',
                        // selectedCategoryId === item.id ? 'bold' : 'normal',
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                </Touchable>
              )}
            />
          </View>

          <View style={styles.recommendContents}>
            <NormalLabel text={'추천컨텐츠'} style={styles.recommendTitle} />
            <ScrollView
              nestedScrollEnabled
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              // contentContainerStyle={{ paddingBottom: 0 }}
            >
              {recommendContents.map((content, i) => (
                <RecommendContent
                  {...content}
                  key={i.toString()}
                  onPress={() => Linking.openURL(content.url)}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default MemberHome;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbfbfb',
    // paddingHorizontal: 24,
    paddingVertical: 15,
    marginBottom: width * 0.01,
  },
  modalStyle: {
    width: 380,
    height: '100%',
    backgroundColor: '#FBFBFB',
  },
  inforImage: {
    width: SCREEN_WIDTH / 2.4,
    height: (SCREEN_WIDTH / 2.4) * 0.36,
    marginTop: 30,
    marginBottom: 30,
    resizeMode: 'contain',
  },
  topContainer: {
    // justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 3,
  },
  signup: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleInner: {
    marginTop: 16,
  },

  firstTilte: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8082ff',
  },

  scendTilte: {
    fontSize: 30,
    color: '#000',
    fontWeight: 'bold',
  },

  gpsContents: {
    // position: 'absolute',
    // right: 0,
  },

  gpsImage: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    resizeMode: 'cover',
  },

  giftButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    margin: 24,
    borderRadius: 24,
    overflow: 'hidden',
  },
  giftButtonColor: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'contain',
  },

  searchContents: {
    marginHorizontal: 24,
  },

  searchBarImage: {
    position: 'relative',
    width: '100%',
    height: 40,
    resizeMode: 'cover',
  },

  searchBar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingLeft: 15,
    // borderColor: 'transparent',
    color: '#555',
    fontSize: 12,
    fontWeight: 'bold',
    // flex: 1,
  },

  searchIconImage: {
    position: 'absolute',
    top: -34,
    right: 11,
    padding: 4,
  },

  categoryContents: {
    // alignItems: 'center',
    marginHorizontal: 24,
    marginTop: 16,
    paddingBottom: 8,
  },
  category: {
    // alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 2,
    // height: 66,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    // width: (width - 40) / 4 - 14,
    width: (SCREEN_WIDTH - 48 - 48) / 4,
    height: (SCREEN_WIDTH - 48 - 48) / 4,

    // padding: 7,
  },
  categoryList: {
    fontSize: 10,
    lineHeight: 15,
    marginTop: 5,
    textAlign: 'center',
  },

  recommendContents: {
    marginTop: 17,
    paddingTop: 16,
    paddingBottom: 18,
    paddingLeft: 24,
    backgroundColor: '#fff',
  },

  recommendTitle: {
    marginLeft: 4,
  },
});
