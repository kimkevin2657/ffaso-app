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
  Platform,
  Linking,
  PermissionsAndroid,
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
import RadioButtons from '../../components/RadioButtonCustom/RadioButton';
import { Wrapper } from '../../components/containers/Wrapper';

const TeacherCenterListScreen = ({ navigation, route }) => {
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
    if (route.params?.keyword) {
      setSearchKeyword(route.params.keyword);
    }
    if (route.params?.category) {
      setChecked(route.params?.category);
      setSelectedFilterLabel('????????????');
    }
  }, [route.params]);

  const sortGyms = (sortLabel) => {
    // console.log(sortLabel);
    if (sortLabel === selectedFilterLabel) {
      setSelectedFilterLabel('');
      setChecked(null);
      // dispatch(resetGyms());
      dispatch(getGyms());
      return;
    }
    setSelectedFilterLabel(sortLabel);

    if (sortLabel === '??????') {
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
      // newGyms.sort((gym1, gym2) => {
      //   return gym1.distance > gym2.distance ? 1 : -1;
      // });
    } else if (sortLabel === '????????????') {
      setModalList(ITEMUSED_DATA);
      setIsModalOpen(true);
    } else {
      // ??????
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

  const getLocation = (callback = () => {}) => {
    if (Platform.OS === 'ios') {
      getIosCurrentLocation(callback);
    } else {
      getAndroidCurrentLocation(callback);
    }
  };

  const openLocationSettings = () => {
    setTimeout(() => {
      Alert.alert('', '???????????? ????????? ??????????????????.', [
        {
          text: '??????',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: '??????',
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
              Alert.alert('?????? ???????????? ????????? ???????????????.');
              // Toast.show({text: '?????? ???????????? ????????? ???????????????', position: 'top', textStyle: {textAlign: 'center'}})
            } else if (error.code === 1) {
              openLocationSettings();
            } else {
              Alert.alert('????????? ?????? ?????? ????????? ?????????.');
              // Toast.show({text: '????????? ?????? ?????? ????????? ?????????.', position: 'top', textStyle: {textAlign: 'center'}})
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
          Alert.alert('?????? ???????????? ????????? ???????????????.');
          // Toast.show({text: '?????? ???????????? ????????? ???????????????.', position: 'top', textStyle: {textAlign: 'center'}})
        } else {
          Alert.alert('????????? ?????? ?????? ????????? ?????????.');
          // Toast.show({text: '????????? ???????????? ???????????????.', position: 'top', textStyle: {textAlign: 'center'}})
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 7000 }
    );
  };

  const onChangeKeyword = useCallback((value) => {
    setSearchKeyword(value);
  }, []);

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
            Alert.alert(`${selectedFilterLabel}??? ??????????????????.`);
            return;
          }
          // console.log(searchSelected) // ???????????? or ??????
          if (selectedFilterLabel === '????????????') {
            dispatch(getGyms(null, checked));
          } else if (selectedFilterLabel === '??????') {
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
            (gym, i) =>
              gym?.latitude && (
                <Touchable
                  key={i}
                  onPress={() => {
                    if (user?.type === '????????????') {
                      navigation.navigate('MemberCenterDetail', { gym });
                    } else if (user?.type === '??????') {
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
            placeholder='????????? ?????????'
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
                  selectedFilterLabel === '????????????' && i === 0 && checked
                    ? checked
                    : selectedFilterLabel === '??????' && i === 1 && checked
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
                if (user?.type === '????????????') {
                  navigation.navigate('MemberCenterDetail', { gym: item });
                } else if (user?.type === '??????') {
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
            paddingBottom: 80, // ????????? ??????
          }}
        >
          <Image
            style={styles.noImage}
            source={require('../../assets/images/null/noCenter.png')}
          />
          <NormalBoldLabel
            text={'?????? ????????? ????????????.'}
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

export default TeacherCenterListScreen;

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
            <NormalBoldLabel text={'??????'} style={{ fontWeight: '400' }} />
          </Touchable>
          <Touchable onPress={selected}>
            <NormalBoldLabel
              text={'??????'}
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
