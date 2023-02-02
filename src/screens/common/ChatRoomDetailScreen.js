import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import moment from 'moment';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import api from '../../api/api';
import useInput from '../../hooks/useInput';
import { SCREEN_WIDTH } from '../../constants/constants';
import { BASE_CHAT_RUL } from '../../api/constants';
import Touchable from '../../components/buttons/Touchable';
import AntDesign from 'react-native-vector-icons/AntDesign';

const KeyboardAvoidingContainer = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: #fbfbfb;
`;
const Footer = styled.View`
  width: 100%;
  height: 50px;
  padding: 4.4px 16px ${(props) => props.bottomInset}px;
  margin-bottom: 17px;
`;
const InputBox = styled.View`
  width: 100%;
  height: 40px;
  border: 1px solid #e3e5e5;
  border-radius: 10px;
  padding-left: 14px;
  flex-direction: row;
  align-items: center;
  background-color: #fff;
`;

const FlexInput = styled.TextInput`
  flex: 1;
  font-size: 13px;
  line-height: 19px;
  color: #000;
  padding: 0px;
`;

const MessageContainer = styled.View`
  flex-direction: ${(props) => (props.me ? 'row-reverse' : 'row')};
  align-items: flex-end;
  margin-bottom: 12px;
`;
const MessageView = styled.View`
  background-color: ${(props) => (props.me ? '#CCCDFF' : '#fff')};
  border-color: ${(props) => (props.me ? '#CCCDFF' : '#fff')};
  border: ${(props) => (props.me ? 'none' : '1px solid #e3e5e5')};
  border-radius: 10px;
  padding: 8.5px 12px;
`;
const Message = styled.Text`
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => (props.me ? '#000' : '#000')};
`;
const MessageDate = styled.Text`
  font-size: 8px;
  line-height: 15px;
  color: #555;
  margin: 0 3px;
`;
const SendButton = styled.TouchableOpacity`
  width: 61px;
  height: 40px;
  background-color: #8082ff;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;
const SendButtonText = styled.Text`
  font-size: 12px;
  color: #fff;
  font-weight: bold;
`;

const List = styled(FlatList)`
  padding: 0 24px;
`;

let socket;

const ChatRoomDetailScreen = ({ navigation, route }) => {
  const { user, token } = useSelector((state) => state.auth);
  const { chatRoom } = route.params;

  const { bottom } = useSafeAreaInsets();
  const [messages, setMessages] = useState([]);
  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    navigation.setOptions({
      title: chatRoom?.receiver?.gymName || '빠소 센터',
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#fff',
      },
    });

    getChatMessages();
  }, []);

  useEffect(() => {
    socket = io(BASE_CHAT_RUL, {
      transports: ['websocket'],
      query: { roomId: chatRoom.id + '' },
    });

    socket.on('message', (newMessage) => {
      // console.log('newMessage', newMessage);
      setMessages((prevMessages) => {
        let newMessages = [newMessage, ...prevMessages];
        return newMessages;
      });
      // setMessages([newMessage, ...messages]);
    });

    return () => {
      socket.off();
    };
  }, []);

  const onSendMessage = async () => {
    if (text === '') {
      return;
    }
    let newMessage = {
      id: new Date(),
      text,
      createdAt: new Date(),
      user: {
        id: user?.id,
        name: user?.koreanName,
        profileImage: user?.profileImage || null,
      },
    };

    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      let params = { chat: chatRoom.id, text };
      await api.post(`chat-messages/`, params, config);
      socket.emit('chatMessage', newMessage);
    } catch (e) {
      console.log(e);
      console.log(e.response);
      // Alert.alert('채팅메시지 추가', '서버와 통신에 실패하였습니다.');
    }

    setText('');
    Keyboard.dismiss();
  };

  const getChatMessages = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };
      const { data } = await api.get(
        `chat-messages?chatId=${chatRoom.id}`,
        config
      );
      // console.log('msgs', data);
      setMessages(data);
    } catch (e) {
      console.log(e.response);
      // Alert.alert('채팅메시지 목록', '서버와 통신에 실패하였습니다.');
    }
  };

  const renderItem = ({ item }) => {
    return (
      <MessageContainer me={item.user.id === user?.id}>
        <MessageView
          me={item.user.id === user?.id}
          style={{ maxWidth: SCREEN_WIDTH - 48 - 25 }}
        >
          <Message>{item.text}</Message>
        </MessageView>
        <MessageDate>{moment(item.created_at).format('HH:mm')}</MessageDate>
      </MessageContainer>
    );
  };

  return (
    <KeyboardAvoidingContainer
      behavior='padding'
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -205}
    >
      {/*<StatusBar barStyle="light-content" />*/}

      <List
        inverted
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id + index.toString()}
      />
      <Footer bottomInset={bottom}>
        <InputBox>
          <FlexInput
            placeholder='메시지를 입력하세요.'
            placeholderTextColor='#ADADAD'
            autoCapitalize='none'
            autoCorrect={false}
            value={text}
            onChangeText={onChangeText}
            multiline
            // onSubmitEditing={onSendMessage}
          />
          <SendButton onPress={onSendMessage}>
            <SendButtonText>전송</SendButtonText>
          </SendButton>
        </InputBox>
      </Footer>
    </KeyboardAvoidingContainer>
  );
};

export default ChatRoomDetailScreen;
