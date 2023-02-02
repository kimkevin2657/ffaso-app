import React, { useCallback, useState } from 'react';
import styled from 'styled-components/native';
import { NormalBoldLabel12 } from '../../../components/Label';
import Touchable from '../../../components/buttons/Touchable';
import { Alert, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import AssignMentModal from '../../../components/modal/assignmentModal/ModalInitial';
import CenterListModal from '../../../components/modal/CenterListModal';

const AssignmentScreen = ({ navigation }) => {
  const { token, user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectUser, setSelectUser] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getMemberProduct = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
    };
    try {
      const { data } = await api.get(
        `member-products?userId=${user.id}`,
        config
      );
      console.log(data);
      setProducts(data);
    } catch (e) {
      console.log('e', e);
      console.log('e.res', e.response);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMemberProduct();
    }, [])
  );

  const onClickNext = () => {
    if (selectedProduct && selectUser.length !== 0) {
      navigation.navigate('AssignmentDetail', {
        selectedProduct,
        selectUser,
      });
    } else {
      Alert.alert('회원권 수강권 선택 및 회원을 선택해주세요');
    }
  };
  return (
    <Container>
      <AssignMentModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setSelectUser={setSelectUser}
      />

      <View>
        <NormalBoldLabel12
          text={'회원권 or 수강권 선택'}
          style={{ color: '#555555' }}
        />

        <CenterListModal
          list={products}
          selectedItem={selectedProduct?.name}
          itemName={'name'}
          onPress={() => setIsModalOpen(true)}
          visible={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onSelect={(obj) => setSelectedProduct(obj)}
          placeholder={'P.T 120회권'}
          containerStyle={styles.selectBox}
        />
        {selectedProduct?.type !== '회원권' && (
          <NormalBoldLabel12
            text={
              selectedProduct
                ? `${
                    selectedProduct?.totalCount - selectedProduct?.usedCount
                  }/${selectedProduct?.totalCount} (남은횟수/가입횟수)`
                : '0/30 (남은횟수/가입횟수)'
            }
            style={{ color: '#555555', marginTop: 10, textAlign: 'right' }}
          />
        )}
        <NormalBoldLabel12
          text={'양도 받을 회원'}
          style={{ color: '#555555', marginTop: 22 }}
        />
        <Touchable
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <SelectBox>
            <NormalBoldLabel12
              text={
                selectUser.length !== 0
                  ? selectUser?.koreanName
                  : '양도 받을 회원 검색'
              }
              style={{ color: '#AAAAAA', fontWeight: 'normal' }}
            />
          </SelectBox>
        </Touchable>
      </View>

      <RowBox>
        <ButtonOpacity
          style={{ marginRight: 17, backgroundColor: '#AAAAAA' }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ButtonText>취소</ButtonText>
        </ButtonOpacity>

        <ButtonOpacity onPress={onClickNext}>
          <LinearGradient
            colors={['#8082FF', '#81D1F8']}
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 15,
            }}
          >
            <ButtonText>다음</ButtonText>
          </LinearGradient>
        </ButtonOpacity>
      </RowBox>
    </Container>
  );
};

const styles = StyleSheet.create({
  selectBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#e3e5e5',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    height: 40,
    marginTop: 5,
  },
});

const ButtonText = styled.Text`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
`;
const ButtonOpacity = styled.TouchableOpacity`
  flex: 0.5;
  height: 52px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
`;
const RowBox = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
`;
const SelectBox = styled.View`
  background: #ffffff;
  border: 1px solid #e3e5e5;
  border-radius: 10px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
`;
export default AssignmentScreen;
