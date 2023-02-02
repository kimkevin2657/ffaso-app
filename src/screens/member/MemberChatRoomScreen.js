import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, FlatList } from 'react-native';
import { NormalBoldLabel } from '../../components/Label';
import Touchable from '../../components/buttons/Touchable';
import ChatRoom from '../../components/ChatRoom';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SCREEN_HEIGHT } from '../../constants/constants';
import api from '../../api/api';
import { useSelector } from 'react-redux';

const MemberChatRoomScreen = ({ navigation }) => {
  const { token } = useSelector((state) => state.auth);
  const [chatRooms, setChatRooms] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      title: '빠톡',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <Touchable onPress={() => navigation.goBack()} style={{ padding: 4 }}>
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

  useEffect(() => {
    getChatRooms();

    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      getChatRooms();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const getChatRooms = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      };
      const { data } = await api.get('chat-rooms/?isMine=true', config);

      setChatRooms(data);
    } catch (e) {
      console.log(e);
      console.log(e.response);
      // Alert.alert('채팅방 목록', '서버와의 통신에 실패하였습니다.');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.subContainer}>
        {chatRooms.length > 0 ? (
          <View style={styles.alertInner}>
            <Text style={styles.alertText}>
              문의를 하신 회원님께서는 채팅이 활성화 됩니다.{'\n'}
              {'\n'}채팅이 활성화 된 이후에는 채팅을 통해 상담이 진행되며,{' '}
              궁금한 점은{'\n'}채팅을 통해 문의 해주시길 바랍니다.{'\n\n'}
              감사합니다 :)
            </Text>
          </View>
        ) : (
          <View style={styles.alertInner}>
            <Text style={styles.alertText}>
              문의를 하신 회원님께서는 채팅이 활성화 됩니다.{'\n'}
              문의를 원하시면{' '}
              <Text style={{ color: '#8082FF' }}>
                문의하고자 하는 센터 페이지에서 문의가 가능{'\n'}
              </Text>
              합니다.{'\n\n'}채팅이 활성화 된 이후에는 채팅을 통해 상담이
              진행됩니다.{'\n'}
              궁금한 점은 채팅을 통해 담당 문의 해주시길 바랍니다.{'\n\n'}
              감사합니다 :)
            </Text>
          </View>
        )}
      </View>

      {chatRooms.length > 0 ? (
        <FlatList
          contentContainerStyle={{
            paddingBottom: 88,
            paddingHorizontal: 24,
          }}
          data={chatRooms}
          renderItem={({ item, index }) => (
            <ChatRoom
              {...item}
              onPress={() => navigation.navigate('Chat', { chatRoom: item })}
            />
          )}
          keyExtractor={(item, index) => item.id + index.toString()}
        />
      ) : (
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/null/MemberChatRoomimg.png')}
            style={{
              width: 100,
              height: 87.7,
            }}
          />
          <NormalBoldLabel
            text={'활성화 된 채팅이 없습니다.'}
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              lineHeight: 24,
              marginTop: 34,
              color: '#AAAAAA',
            }}
          />
        </View>
      )}
    </View>
  );
};

export default MemberChatRoomScreen;

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    borderTopWidth: 1,
    borderColor: '#e3e5e5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  subContainer: {
    paddingHorizontal: 24,
  },
  wrapper: {
    // paddingHorizontal: 24,
    flex: 1,
    backgroundColor: '#fff',
  },
  titleInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },

  backActionable: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
  },

  plusActionable: {
    resizeMode: 'contain',
    width: 24,
    height: 30,
  },

  containerName: {
    fontSize: 20,
    lineHeight: 24,
  },

  alertInner: {
    marginTop: 21,
    marginBottom: 17,
  },
  alertText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#000',
  },
  inquiryBtn: {
    borderRadius: 10,
    paddingVertical: 10,
    width: 131,
    alignSelf: 'center',
    marginBottom: 14,
  },
  buttonInner: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 131,
    height: 40,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  buttonText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
