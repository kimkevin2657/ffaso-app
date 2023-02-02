import React from 'react';
import Touchable from './buttons/Touchable';
import RowContainer from './containers/RowContainer';
import { Image, View, StyleSheet } from 'react-native';
import { NormalBoldLabel, NormalLabel } from './Label';
import { renderAgo } from '../util';

const ChatRoom = ({ lastMessage, createdAt, onPress, receiver }) => {
  return (
    <Touchable onPress={onPress} style={styles.container}>
      <RowContainer>
        <Image
          style={{ width: 50, height: 50, marginRight: 10 }}
          source={{
            uri:
              receiver?.profileImage ||
              'https://ffaso.s3.ap-northeast-2.amazonaws.com/allCoaches/trainer.png',
          }}
        />
        <View style={{ flex: 1 }}>
          <View style={styles.centerName}>
            <RowContainer style={{ flex: 1 }}>
              <NormalBoldLabel
                style={{ flex: receiver?.type === '일반유저' ? 1 : 0 }}
                text={
                  receiver?.type === '일반유저'
                    ? `문의 회원 : ${receiver?.name}`
                    : receiver?.gymName
                }
              />
              {receiver?.type !== '일반유저' && (
                <NormalBoldLabel
                  style={{
                    marginLeft: 5,
                    fontSize: 10,
                    color: '#555',
                    flex: 1,
                  }}
                  text={`[상담관리자 : ${receiver?.name}]`}
                />
              )}
            </RowContainer>
            <NormalLabel style={styles.time} text={renderAgo(createdAt)} />
          </View>
          <NormalLabel
            numberOfLines={1}
            text={lastMessage}
            style={{
              marginRight: 20,
              fontSize: 14,
              lineHeight: 18,
              color: '#555',
              marginTop: 13,
            }}
          />
        </View>
      </RowContainer>
    </Touchable>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: '#e3e5e5',
  },
  time: {
    fontSize: 12,
    lineHeight: 15,
    color: '#aaa',
  },
  centerName: {
    // position:'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems:'center',
  },
});
