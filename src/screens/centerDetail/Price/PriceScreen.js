import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import NearbyCenterTop from '../../../components/nearbyCenter/NearbyCenterTop';
import RowContainer from '../../../components/containers/RowContainer';
import { NormalBoldLabel } from '../../../components/Label';
import Touchable from '../../../components/buttons/Touchable';
import AntDesign from 'react-native-vector-icons/AntDesign';
import api from '../../../api/api';
import Membership from '../../../components/products/Membership';
import Option from '../../../components/products/Option';
import LessonTicket from '../../../components/products/LessonTicket';
import { commaNum, getRandomInt } from '../../../util';
import { useSelector } from 'react-redux';

const CATEGORY = {
  회원권: 'memberships',
  수강권: 'lessonTickets',
  옵션: 'options',
};

const PriceScreen = ({ navigation, route }) => {
  const { user } = useSelector((state) => state.auth);
  const [gym, setGym] = useState(route.params?.gym);
  const [products, setProducts] = useState({});
  const [selectedSecondTab, setSelectedSecondTab] = useState('회원권');

  useEffect(() => {
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

    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const { data } = await api.get(`products?gymId=${gym.id}`);
      setProducts(data);
    } catch (e) {
      console.log(e);
      console.log(e.response);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <NearbyCenterTop
        tabId={2}
        onTabPress={(selectedTabId) => {
          if (selectedTabId === 1) {
            if (user?.type === '일반유저') {
              navigation.navigate('MemberCenterDetail', { gym });
            } else if (user?.type === '강사') {
              navigation.navigate('TeacherCenterDetail', { gym });
            }
          } else if (selectedTabId === 3) {
            navigation.navigate('Trainer', { gym });
          } else if (selectedTabId === 4) {
            navigation.navigate('Review', { gym });
          }
        }}
      />
      <RowContainer style={styles.optionList}>
        {['회원권', '수강권', '옵션'].map((label, i) => (
          <TouchableOpacity
            key={i}
            style={styles.secondTabBtn}
            onPress={() => setSelectedSecondTab(label)}
          >
            <NormalBoldLabel
              text={label}
              style={{
                fontSize: 12,
                lineHeight: 16,
                color: selectedSecondTab === label ? '#8082FF' : '#555',
              }}
            />
          </TouchableOpacity>
        ))}
      </RowContainer>

      <View style={{ paddingHorizontal: 24 }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: '#e3e5e5',
            paddingLeft: 1,
            paddingTop: 17,
            paddingBottom: 11,
          }}
        >
          <NormalBoldLabel style={styles.membership} text={selectedSecondTab} />
        </View>

        <View>
          {products?.departments?.length === 0 ||
          Object.keys(products).length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Image
                source={require('../../../assets/images/null/priceAlertImage.png')}
                resizeMode='contain'
                style={{ width: 100, height: 100, marginTop: 138 }}
              />
              <NormalBoldLabel
                text={'등록된 정보가 없습니다.'}
                style={{
                  marginTop: 25,
                  color: '#aaa',
                  fontSize: 20,
                  lineHeight: 24,
                }}
              />
            </View>
          ) : (
            <></>
          )}
          {Object.keys(products).length > 0 &&
            products[CATEGORY[selectedSecondTab]].map((data) => {
              return (
                <View key={data.id}>
                  {CATEGORY[selectedSecondTab] === 'memberships' ? (
                    <Membership
                      title={data.name}
                      image={`https://ffaso.s3.ap-northeast-2.amazonaws.com/memberships/default.png`}
                      // image={`https://ffaso.s3.ap-northeast-2.amazonaws.com/memberships/image${getRandomInt(
                      //   1,
                      //   3
                      // )}.png`}
                      price={'월 금액 : ' + commaNum(data.price)}
                      categoryList={data?.categoryList}
                      explanation={data.description}
                      onRegister={() =>
                        navigation.navigate('MembershipPayment', { gym })
                      }
                      isNormalUser={user?.type === '일반유저'}
                    />
                  ) : CATEGORY[selectedSecondTab] === 'lessonTickets' ? (
                    <LessonTicket
                      title={data.name}
                      image={`https://ffaso.s3.ap-northeast-2.amazonaws.com/lessonTickets/default.png`}
                      // image={`https://ffaso.s3.ap-northeast-2.amazonaws.com/lessonTickets/image${getRandomInt(
                      //   1,
                      //   3
                      // )}.png`}
                      price={'회당 금액 : ' + commaNum(data.price)}
                      possiblePerson={data?.possiblePerson}
                      explanation={data.description}
                      onRegister={() =>
                        navigation.navigate('TicketPayment', { gym })
                      }
                      isNormalUser={user?.type === '일반유저'}
                    />
                  ) : (
                    <Option
                      title={data.name}
                      image={`https://ffaso.s3.ap-northeast-2.amazonaws.com/options/default.png`}
                      // image={`https://ffaso.s3.ap-northeast-2.amazonaws.com/options/image2.png`}
                      price={'월 금액 : ' + commaNum(data.price)}
                      availableCount={`이용 가능 락커 : (${
                        data?.totalCount - data?.currentUsedCount
                      }/${data?.totalCount})`}
                      explanation={data?.description}
                      onRegister={() =>
                        navigation.navigate('OptionPayment', { gym })
                      }
                      isNormalUser={user?.type === '일반유저'}
                    />
                  )}
                </View>
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
};

export default PriceScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fbfbfb',
  },
  membership: {
    fontSize: 18,
    lineHeight: 22,
  },
  optionList: {
    borderBottomWidth: 1,
    borderBottomColor: '#e3e5e5',
    backgroundColor: '#fff',
    justifyContent: 'space-evenly',
  },
  secondTabBtn: {
    paddingVertical: 10,
  },
});
