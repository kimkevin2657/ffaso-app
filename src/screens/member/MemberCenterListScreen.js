import React, { useState, useEffect, useCallback } from 'react';
import {
  TextInput,
  View,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  Alert,
  FlatList,
  PermissionsAndroid,
  Linking,
  Platform,
} from 'react-native';
import Touchable from '../../components/buttons/Touchable';
import Gym from '../../components/Gym';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import RowContainer from '../../components/containers/RowContainer';
import TouchableNoFeedback from '../../components/buttons/TouchableNoFeedback';
import { NormalBoldLabel, NormalBoldLabel14 } from '../../components/Label';
import { useDispatch, useSelector } from 'react-redux';
import { getGyms } from '../../redux/gymSlice';
import {
  ORDER_LABELS,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
} from '../../constants/constants';
import { renderDistance } from '../../util';
import { ITEMUSED_DATA, ClASS_DATA } from '../../assets/data/REVIEW_MODAL_DATA';
import { RadioButton } from 'react-native-paper';
import { Container } from '../../components/containers/Container';
import CenterContainer from '../../components/containers/CenterContainer';
import Geolocation from 'react-native-geolocation-service';
import RadioButtonCustom from '../../components/RadioButtonCustom';
import RadioButtons from '../../components/RadioButtonCustom/RadioButton';
import { Wrapper } from '../../components/containers/Wrapper';

const MemberCenterListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const gym = useSelector((state) => state.gym);
  const { gyms = [] } = gym;
  const { latitude = 37.55594599999999, longitude = 126.972317 } = useSelector(
    (state) => state.location
  );
  const [searchKeyword, setSearchKeyword] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checked, setChecked] = useState(null);
  const [modalList, setModalList] = useState(ITEMUSED_DATA);
  const [selectedFilterLabel, setSelectedFilterLabel] = useState('');

  useEffect(() => {
    // return ()
    handleDeepLink();
  }, []);

  useEffect(() => {
    if (route.params?.keyword) {
      setSearchKeyword(route.params.keyword);
    }
    if (route.params?.category) {
      setChecked(route.params?.category);
      setSelectedFilterLabel('이용종목');
    }
  }, [route.params]);

  const handleDeepLink = () => {
    Linking.getInitialURL().then(res => { //앱이 실행되지 않은 상태에서 요청이 왔을 때
      console.log(" !!!====== MemberCenterListScreen  handleDeepLink getInitlaURL     ", res);
      console.log(" !!!====== MemberCenterListScreen  handleDeepLink getInitlaURL     ", res);
      console.log(" !!!====== MemberCenterListScreen  handleDeepLink getInitlaURL     ", res);
      // Alert.alert(" !!!====== MemberCenterListScreen  handleDeepLink getInitlaURL     ", JSON.stringify(res));
      // if(res == null || res == undefined || res == ""){
      //   return;
      // }else{
      //   var params = urlParamtersToJson(res);
      //   console.log(" !!!======  handleDeepLink     ", params);
      // }
    });
    Linking.addEventListener('url', (e) => {        // 앱이 실행되어있는 상태에서 요청이 왔을 때 처리하는 이벤트 등록
      console.log(" !!!====== MemberCenterListScreen  handleDeepLink addEventListener     ", e);
      console.log(" !!!====== MemberCenterListScreen  handleDeepLink getInitlaURL     ", e);
      console.log(" !!!====== MemberCenterListScreen  handleDeepLink getInitlaURL     ", e);
      // Alert.alert(" !!!====== MemberCenterListScreen  handleDeepLink getInitlaURL     ", JSON.stringify(e));
      // var params = urlParamtersToJson(e.url); 
      // if(e.url == null || e.url == undefined || e.url == ""){
      //   return;
      // }else{
      //   console.log(" !!!======  handleDeepLink     ", params);
      // }
    });
  }

  const sortGyms = (sortLabel) => {
    if (sortLabel === selectedFilterLabel) {
      setSelectedFilterLabel('');
      setChecked(null);
      dispatch(getGyms());
      return;
    }
    setSelectedFilterLabel(sortLabel);

    if (sortLabel === '거리') {
      getLocation((coords) => {
        if (coords?.latitude && coords?.longitude) {
          dispatch(
            getGyms(
              null,
              null,
              null,
              `${coords?.latitude},${coords?.longitude}`
            )
          );
        }
      });
    } else if (sortLabel === '이용종목') {
      setModalList(ITEMUSED_DATA);
      setIsModalOpen(true);
    } else {
      // 강습
      setModalList(ClASS_DATA);
      setIsModalOpen(true);
    }
  };

  const filterGyms = () => {
    if (searchKeyword === '') {
      // dispatch(resetGyms());
      dispatch(getGyms());
      return;
    }
    // dispatch(getGyms(searchKeyword, route.params?.selectedCategory));
    dispatch(getGyms(searchKeyword));
    // setGyms(gyms.filter((gym) => gym.title.includes(searchKeyword)));
    setSearchKeyword('');
  };

  const onChangeKeyword = useCallback((value) => {
    setSearchKeyword(value);
  }, []);

  const getLocation = (callback = () => {}) => {
    if (Platform.OS === 'ios') {
      getIosCurrentLocation(callback);
    } else {
      getAndroidCurrentLocation(callback);
    }
  };

  const openLocationSettings = () => {
    setTimeout(() => {
      Alert.alert('', '설정에서 위치를 허용해주세요.', [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => Linking.openSettings(),
        },
      ]);
    }, 700);
  };

  const getAndroidCurrentLocation = async (callback) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          (position) => {
            callback(position.coords);
          },
          (error) => {
            console.log(error);
            if (error.code === 5) {
              Alert.alert('다시 시도하여 확인을 눌러주세요.');
              // Toast.show({text: '다시 시도하여 확인을 눌러주세요', position: 'top', textStyle: {textAlign: 'center'}})
            } else if (error.code === 1) {
              openLocationSettings();
            } else {
              Alert.alert('위치를 끄고 다시 시도해 보세요.');
              // Toast.show({text: '위치를 끄고 다시 시도해 보세요.', position: 'top', textStyle: {textAlign: 'center'}})
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 7000 }
        );
      } else {
        openLocationSettings();
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getIosCurrentLocation = async (callback) => {
    Geolocation.getCurrentPosition(
      (position) => {
        callback(position.coords);
      },
      (error) => {
        console.log(error);
        if (error.code === 1) {
          openLocationSettings();
        } else if (error.code === 5) {
          Alert.alert('다시 시도하여 확인을 눌러주세요.');
          // Toast.show({text: '다시 시도하여 확인을 눌러주세요.', position: 'top', textStyle: {textAlign: 'center'}})
        } else {
          Alert.alert('위치를 끄고 다시 시도해 보세요.');
          // Toast.show({text: '위치를 불러오지 못했습니다.', position: 'top', textStyle: {textAlign: 'center'}})
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 7000 }
    );
  };

  return (
    <Wrapper style={styles.container}>
      <ModalRender
        sortLabel={selectedFilterLabel}
        visible={isModalOpen}
        checked={checked}
        canceled={() => {
          setIsModalOpen(false);
          setChecked(null);
          setSelectedFilterLabel('');
        }}
        selected={() => {
          if (checked === '') {
            Alert.alert(`${selectedFilterLabel}을 선택해주세요.`);
            return;
          }
          if (selectedFilterLabel === '이용종목') {
            dispatch(getGyms(null, checked));
          } else if (selectedFilterLabel === '강습') {
            dispatch(getGyms(null, null, checked));
          }
          setIsModalOpen(false);
        }}
      >
        {modalList.map((menu, index) => (
          <RowContainer
            key={index}
            style={{
              marginLeft: 25,
              marginBottom: 25,
              marginTop: index === 0 ? 12 : 0,
            }}
          >
            <RadioButtons
              color='#8082FF'
              value={index}
              status={checked === menu.title ? 'checked' : 'unchecked'}
              onPress={() => setChecked(menu.title)}
            />
            <NormalBoldLabel14 text={menu.title} />
          </RowContainer>
        ))}
      </ModalRender>

      <View style={{ height: SCREEN_HEIGHT * 0.32 }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapContainer}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {!!latitude && (
            <Marker
              coordinate={{
                latitude,
                longitude,
              }}
            >
              <Image
                source={require('../../assets/icons/memberPin.png')}
                style={styles.marker}
              />
            </Marker>
          )}
          {gyms.map(
            (gym) =>
              gym?.latitude && (
                <Touchable
                  key={gym.id}
                  onPress={() => {
                    if (user?.type === '일반유저') {
                      navigation.navigate('MemberCenterDetail', { gym });
                    } else if (user?.type === '강사') {
                      navigation.navigate('TeacherCenterDetail', { gym });
                    }
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: gym?.latitude,
                      longitude: gym?.longitude,
                    }}
                  >
                    <Image
                      source={require('../../assets/icons/gymPin.png')}
                      style={styles.marker}
                    />
                  </Marker>
                </Touchable>
              )
          )}
        </MapView>
      </View>
      <View style={{ paddingHorizontal: 24, position: 'absolute' }}>
        <RowContainer style={styles.searchContents}>
          <Image
            source={require('../../assets/images/home/searchBar.png')}
            style={styles.searchBarImage}
          />
          <TextInput
            value={searchKeyword}
            onChangeText={onChangeKeyword}
            style={styles.searchBar}
            placeholder='성동구 옥수동'
            placeholderTextColor='#aaa'
          />
          <TouchableNoFeedback style={styles.searchIcon} onPress={filterGyms}>
            <Image
              alt='searchIcon'
              source={require('../../assets/icons/home/searchIcon.png')}
              style={{ width: 23, height: 23 }}
            />
          </TouchableNoFeedback>
        </RowContainer>

        <RowContainer style={styles.filterContents}>
          {ORDER_LABELS.map((label, i) => (
            <Touchable
              key={i}
              style={{
                ...styles.filterList,
                borderColor: selectedFilterLabel === label ? '#8082FF' : '#aaa',
                backgroundColor:
                  selectedFilterLabel === label ? '#8082FF' : '#fff',
              }}
              onPress={() => sortGyms(label)}
            >
              <NormalBoldLabel
                text={
                  selectedFilterLabel === '이용종목' && i === 0 && checked
                    ? checked
                    : selectedFilterLabel === '강습' && i === 1 && checked
                    ? checked
                    : label
                }
                style={{
                  fontSize: 10,
                  lineHeight: null,
                  color: selectedFilterLabel === label ? '#fff' : '#555',
                }}
              />
            </Touchable>
          ))}
        </RowContainer>
      </View>

      {gyms.length > 0 && (
        <FlatList
          data={gyms}
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 24 }}
          renderItem={({ item, index }) => (
            <Center
              gym={item}
              onPress={() => {
                if (user?.type === '일반유저') {
                  navigation.navigate('MemberCenterDetail', { gym: item });
                } else if (user?.type === '강사') {
                  navigation.navigate('TeacherCenterDetail', { gym: item });
                }
              }}
              currentLatitude={latitude}
              currentLongitude={longitude}
              isLast={gyms.length - 1 === index}
            />
          )}
        />
      )}

      {gyms.length === 0 && (
        <CenterContainer
          style={{
            height: SCREEN_HEIGHT - 237 - 80,
            paddingBottom: 80, // 바텀탭 높이
          }}
        >
          <Image
            style={styles.noImage}
            source={require('../../assets/images/null/noCenter.png')}
          />
          <NormalBoldLabel
            text={'주변 센터가 없습니다.'}
            style={{
              fontSize: 20,
              lineHeight: 24,
              fontWeight: 'bold',
              color: '#aaa',
            }}
          />
        </CenterContainer>
      )}
    </Wrapper>
  );
};

export default MemberCenterListScreen;

const Center = ({
  gym,
  onPress,
  isLast,
  currentLatitude,
  currentLongitude,
}) => {
  return (
    <Touchable
      style={{
        borderBottomWidth: !isLast ? 1 : 0,
        borderColor: '#e3e5e5',
      }}
      onPress={onPress}
    >
      <Gym
        title={gym.name}
        average={gym.score}
        averageCount={gym.reviewCount}
        logo={gym.logo}
        categoryList={gym.category}
        lessonTags={gym.lessonTags}
        distance={
          !!gym?.latitude
            ? renderDistance(gym, currentLatitude, currentLongitude)
            : ' '
        }
      />
    </Touchable>
  );
};
const ModalRender = ({ visible, sortLabel, canceled, selected, children }) => (
  <Modal visible={visible} transparent>
    <Wrapper style={styles.transparentBox}>
      <View style={styles.modalCotainer}>
        <NormalBoldLabel
          text={sortLabel}
          style={{ fontSize: 15, marginLeft: 24, marginVertical: 15 }}
        />
        <ScrollView style={styles.radioContainer}>{children}</ScrollView>
        <RowContainer
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignContent: 'center',
            marginRight: 18,
          }}
        >
          <Touchable onPress={canceled}>
            <NormalBoldLabel text={'취소'} style={{ fontWeight: '400' }} />
          </Touchable>
          <Touchable onPress={selected}>
            <NormalBoldLabel
              text={'선택'}
              style={{ marginLeft: 27, color: '#8082FF' }}
            />
          </Touchable>
        </RowContainer>
      </View>
    </Wrapper>
  </Modal>
);

const styles = StyleSheet.create({
  radioContainer: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#E3E5E5',
    height: SCREEN_HEIGHT * 0.22,
  },
  modalCotainer: {
    backgroundColor: 'white',
    minWidth: SCREEN_WIDTH * 0.872,
    height: SCREEN_HEIGHT * 0.43,
    borderRadius: 10,
  },
  transparentBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FBFBFB',
  },
  searchContents: {
    marginTop: 16,
    width: '100%',
    height: 40,
  },
  mapContainer: {
    flex: 1,
  },
  searchBarImage: {
    position: 'relative',
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
  },

  searchBar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingLeft: 15,
    borderColor: 'transparent',
    color: '#000',
    fontSize: 12,
    lineHeight: 16,
  },

  searchIcon: {
    position: 'absolute',
    right: 11,
    padding: 4,
  },

  filterContents: {
    // justifyContent: 'space-between',
    justifyContent: 'space-evenly',
    marginTop: 5,
  },

  filterList: {
    width: 77.5,
    height: 25,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#aaaaaa',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  marker: {
    width: 29,
    height: 45,
  },

  noImage: {
    width: 100,
    height: 100,
    marginBottom: 18,
  },
});
