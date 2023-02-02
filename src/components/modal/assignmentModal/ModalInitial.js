import React, { useCallback, useState } from 'react';

import {
  Modal,
  Image,
  Dimensions,
  FlatList,
  View,
  Platform,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from 'react-native';
import styled from 'styled-components';
import Touchable from '../../buttons/Touchable';
import RowContainer from '../../containers/RowContainer';
import { NormalBoldLabel12 } from '../../Label';
import useInput from '../../../hooks/useInput';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import { Wrapper } from '../../containers/Wrapper';

const AssignMentModal = ({ modalVisible, setModalVisible, setSelectUser }) => {
  const [searchKeyword, onChangeSearchKeyword] = useInput('');
  const [searchUserList, setUserList] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const getUserList = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };

    try {
      const { data } = await api.get(
        `member-search?name=${searchKeyword}`,
        config
      );
      setUserList(data);

      console.log('data', data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  const renderItem = ({ item }) => (
    <Touchable
      onPress={async () => {
        await setSelectUser(item);
        setModalVisible(false);
      }}
    >
      {/*앱로고는 1번  */}
      <RowContainer style={{ marginBottom: 10, paddingHorizontal: 14 }}>
        {item?.profileImage ? (
          <Avatar source={{ uri: item?.profileImage }} />
        ) : (
          <AvatarBox>
            <Avatar
              resizeMode={'contain'}
              style={{ width: 20, height: 23, borderRadius: 0 }}
              source={require('../../../assets/images/home/userImage.png')}
            />
          </AvatarBox>
        )}

        <NormalBoldLabel12
          text={item?.koreanName}
          style={{ color: '#555555', marginRight: 21, marginLeft: 14 }}
        />
        <NormalBoldLabel12
          text={item?.email}
          style={{ fontWeight: 'normal', color: '#555555' }}
        />
      </RowContainer>
    </Touchable>
  );

  //
  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <Pressable
        onPress={(event) =>
          event.target === event.currentTarget && setModalVisible(false)
        }
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <Wrapper style={styles.container}>
          <FlatList
            ListHeaderComponent={
              <>
                <RowContainer style={{ height: 40 }}>
                  <SearchBarImage
                    source={require('../../../assets/images/home/searchBar.png')}
                  />
                </RowContainer>

                <SearchBar
                  placeholder='이름을 입력해주세요.'
                  placeholderTextColor={'#aaa'}
                  value={searchKeyword}
                  onChangeText={(text) => onChangeSearchKeyword(text)}
                  onBlur={getUserList}
                />
                <Touchable
                  style={{
                    alignItems: 'flex-end',
                    marginRight: 9,
                  }}
                  onPress={getUserList}
                >
                  <Image
                    alt='gift'
                    source={require('../../../assets/icons/home/searchIcon.png')}
                    resizeMode='contain'
                    style={{
                      position: 'relative',
                      top: -31,
                      width: 23,
                      height: 23,
                    }}
                  />
                </Touchable>
              </>
            }
            data={searchUserList}
            renderItem={renderItem}
            keyExtractor={(item) => item?.id}
          />
        </Wrapper>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
    backgroundColor: '#fff',
    marginHorizontal: 14,
    marginVertical: 24,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
});

const AvatarBox = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 60px;
  border-width: 1px;
  border-color: #e3e5e5;
  align-items: center;
  text-align: center;
  justify-content: center;
`;
const Avatar = styled.Image`
  background-color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 60px;
`;
const Container = styled.View``;
const SearchBarImage = styled.Image`
  position: relative;
  height: 100%;
  width: 100%;
`;
const SearchBar = styled.TextInput`
  position: absolute;
  height: 100%;
  width: 100%;
  padding-left: 15px;
  top: -10px;
  color: #555;
  font-size: 12px;
  font-weight: bold;
  padding-right: 40px;
`;

export default AssignMentModal;
