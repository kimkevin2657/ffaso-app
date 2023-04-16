import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {
  NoneLabel,
  NormalBoldLabel,
  NormalBoldLabel12,
  NormalLabel,
} from './Label';
import FamilyAddModal from './home/FamilyAddModal';
import GradientSearch from './Bar/GradientSearch';
import RowContainer from './containers/RowContainer';
import GradientButton from './buttons/GradientButton';
import ColumnView from '../components/ColumnView';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { renderAge } from '../util';
import api from '../api/api';
import { isIos, SCREEN_HEIGHT } from '../constants/constants';
import SpaceBetweenContainer from './containers/SpaceBetweenContainer';
import Touchable from './buttons/Touchable';

const MemberLeftDrawer = ({ navigation }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    getMyProducts();
  }, []);

  const getMyProducts = async () => {
    try {
      const { data } = await api.post(`user-payment-infos?userId=${user?.id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      let myProducts = [];
      Object.values(data).forEach((product) => {
        if (Array.isArray(product)) {
          product.forEach((pd) => myProducts.push(pd));
        }
      });
      myProducts.sort((a, b) => {
        return a.createdAt > b.createdAt ? -1 : 1;
      });
      setProducts(myProducts);
    } catch (err) {
      console.log('getMemberProducts err', err);
      console.log('getMemberProducts err', err.response);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: '#fff', flex: 1 }}>
      <FamilyAddModal visible={isVisible} onPress={() => setIsVisible(false)}>
        <GradientSearch style={{ marginTop: 28 }}>
          <RowContainer>
            <TextInput
              style={{
                flex: 1,
                lineHeight: 15,
                fontSize: 12,
              }}
            />
            <TouchableOpacity>
              <Image
                alt='gift'
                source={require('../assets/icons/home/searchIcon.png')}
                style={{ marginRight: 12, width: 23, height: 23 }}
              />
            </TouchableOpacity>
          </RowContainer>
        </GradientSearch>

        <GradientButton
          onPress={() => {
            setIsVisible(false);
            // Alert.alert('준비중입니다.');
          }}
        >
          <NormalBoldLabel text={'가족추가'} style={{ color: '#fff' }} />
        </GradientButton>
      </FamilyAddModal>
      <View style={styles.header}>
        <View style={styles.container}>
          <View style={styles.menuTopContainer}>
            <NormalBoldLabel style={styles.boldFont} text={user?.email} />
            <View style={styles.iconContainer}>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                }}
                onPress={() => {
                  Alert.alert('준비중입니다.');
                  // setVisible(true)
                }}
              >
                <Image
                  style={styles.familyAddImg}
                  source={require('../assets/icons/home/addFamily.png')}
                />
                <NormalLabel text={'가족추가'} style={styles.familyAdd} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.moveMyPage}
                onPress={() => navigation.navigate('AccountSetting')}
              >
                <Image
                  style={styles.myInfoImag}
                  source={require('../assets/icons/home/myInfo.png')}
                />
                <NormalLabel text={'계정설정'} style={styles.myInfoText} />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={[1]}
            renderItem={(item, index) => (
              <UserProfile
                onMoreBtnPress={() => {
                  navigation.navigate('MyPayment');
                  navigation.closeDrawer();
                }}
                profileImage={user?.profileImage}
                koreanName={user?.koreanName}
                englishName={user?.englishName}
                birth={
                  // '1987.07.22 (34년 1개월 22일)'
                  `${moment(user?.birth).format('YYYY.MM.DD')} (${renderAge(
                    user?.birth
                  )}세)`
                }
                products={products}
                // onPress={() => addProfileImg()}
              />
            )}
            keyExtractor={(item, index) => item.id + index.toString()}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default MemberLeftDrawer;

const UserProfile = ({
  profileImage,
  index,
  koreanName,
  englishName,
  birth,
  products,
  onMoreBtnPress,
}) => {
  return (
    <>
      <RowContainer style={{ marginTop: index === 0 ? 57 : 24 }}>
        {profileImage ? (
          <View style={styles.profileImgBox}>
            <Image source={{ uri: profileImage }} style={styles.profileImg} />
          </View>
        ) : (
          <View style={styles.profileImgBox}>
            <Image
              source={require('../assets/images/home/userImage.png')}
              style={{
                width: 50,
                height: 57,
              }}
              resizeMode='contain'
            />
          </View>
        )}
        <ColumnView style={{ marginLeft: 12 }}>
          <NormalBoldLabel
            text={`${koreanName} ${englishName ? `(${englishName})` : ''}`}
          />
          <NoneLabel text={birth} style={{ marginTop: 6 }} />
        </ColumnView>
      </RowContainer>

      <SpaceBetweenContainer style={styles.useInfo}>
        <NormalBoldLabel text={'이용정보'} />
        <Touchable onPress={onMoreBtnPress} style={styles.moreBtn}>
          <NormalBoldLabel
            text='더보기+'
            style={{ fontSize: 10, lineHeight: 15, color: '#aaa' }}
          />
        </Touchable>
      </SpaceBetweenContainer>
      <ScrollView nestedScrollEnabled={true} style={styles.productContainer}>
        {products.map((pd, i) => (
          <MyProduct {...pd} key={pd.id} />
        ))}
      </ScrollView>

      {/* 가장 하단 그림자용 */}
      <View style={{ height: 2 }} />
    </>
  );
};

const MyProduct = ({
  createdAt,
  membershipName,
  ticketName,
  availableStartDate,
  availableEndDate,
  gymName,
}) => (
  <ColumnView style={styles.useInfoDetailBox}>
    <NoneLabel
      text={`등록일 : ${moment(createdAt).format('YYYY-MM-DD')}`}
      style={{ fontSize: 10 }}
    />
    <NormalBoldLabel12
      text={`${gymName} (${
        membershipName || ticketName
      } - ${availableStartDate} ~ ${availableEndDate})`}
      style={{ color: '#555555', marginTop: 4 }}
    />
  </ColumnView>
);

const styles = StyleSheet.create({
  profileImg: {
    width: '100%',
    height: '100%',
    borderRadius: 46,
  },
  useInfoDetailBox: {
    paddingLeft: 10,
    paddingBottom: 14,
    paddingTop: 12,
    // borderColor: ' rgba(0, 0, 0, 0.15)',
    // elevation: 2,

    shadowColor: '#aaa',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    backgroundColor: '#fff',
    elevation: 2,
    marginTop: 6,
  },
  useInfo: {
    marginTop: 12,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.15)',
    marginBottom: 2,
  },
  moreBtn: {
    padding: 4,
  },
  profileStationTextRow: {
    flexWrap: 'wrap',
    width: 170,
    marginTop: 6,
  },
  profileImgBox: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderColor: '#E3E5E5',
    borderWidth: 1,
    backgroundColor: '#fff',
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  myInfoText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#555',
  },
  myInfoImag: { width: 27, height: 21, marginBottom: 5 },
  familyAddImg: { width: 21, height: 23, marginBottom: 3 },
  moveMyPage: { alignItems: 'center', marginLeft: 19 },
  familyAdd: { fontSize: 12, lineHeight: 16, color: '#555' },
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 28,
  },
  menuTopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  boldFont: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
  },
  header: {
    paddingTop: getStatusBarHeight(),
    marginBottom: 100,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  productContainer: {
    height: SCREEN_HEIGHT * 0.2,
  },
});
