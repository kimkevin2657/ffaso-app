import React, { useEffect } from 'react';
import { Alert, BackHandler, Image, StyleSheet } from 'react-native';
import { Container } from '../../components/containers/Container';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MapViewDirections from 'react-native-maps-directions';
import { SCREEN_HEIGHT } from '../../constants/constants';

const BackBtn = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  top: 0;
  padding: 16px;
`;

const FindRoadScreen = ({ navigation, route }) => {
  const { gymLatitude, gymLongitude } = route.params;
  const { latitude = 35.145593, longitude = 129.1131945 } = useSelector(
    (state) => state.location
  );

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <Container>
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
        {!!gymLatitude && (
          <Marker
            coordinate={{
              latitude: gymLatitude,
              longitude: gymLongitude,
            }}
          >
            <Image
              source={require('../../assets/icons/gymPin.png')}
              style={styles.marker}
            />
          </Marker>
        )}

        {/*{console.log(latitude, longitude, gymLatitude, gymLongitude)}*/}
        {/*<MapViewDirections*/}
        {/*  language={'ko'}*/}
        {/*  region={'KR'}*/}
        {/*  // onStart={(props) => {*/}
        {/*  //   console.log('a', props);*/}
        {/*  // }}*/}
        {/*  origin={{ latitude, longitude }}*/}
        {/*  // destination={{ latitude: 37.771707, longitude: -122.4053769 }}*/}
        {/*  destination={{ latitude: gymLatitude, longitude: gymLongitude }}*/}
        {/*  apikey={'AIzaSyDtGfp6FblPmj1DX5T8mcI27RG3N8DNxPo'}*/}
        {/*  strokeWidth={3}*/}
        {/*  strokeColor='#8082FF'*/}
        {/*  timePrecision={'now'}*/}
        {/*  // optimizeWaypoints={true} // then, high Billing?*/}
        {/*  // waypoints={[]}*/}
        {/*  onReady={(e) => console.log('onReady res: ', e)}*/}
        {/*  onError={(e) => {*/}
        {/*    console.log('errorRes: ', e);*/}
        {/*    if (e.includes('ZERO_RESULTS')) {*/}
        {/*      Alert.alert('', '경로가 존재하지 않습니다.');*/}
        {/*      // Alert.alert('', '경로가 존재하지 않습니다.', [*/}
        {/*      //   { text: '확인', onPress: () => navigation.goBack() },*/}
        {/*      // ]);*/}
        {/*    }*/}
        {/*  }}*/}
        {/*/>*/}
      </MapView>
      <BackBtn onPress={() => navigation.goBack()}>
        <AntDesign name={'left'} size={26} color={'#000'} />
      </BackBtn>
    </Container>
  );
};

export default FindRoadScreen;

const styles = StyleSheet.create({
  mapContainer: {
    minHeight: SCREEN_HEIGHT,
    height: '100%',
  },
  marker: {
    width: 29,
    height: 45,
  },
});
