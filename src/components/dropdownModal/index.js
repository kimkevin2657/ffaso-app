import React from 'react';
import { Modal } from 'react-native';
import styled from 'styled-components/native';
import { NormalBoldLabel12 } from '../Label';

const ContainerBtn = styled.TouchableOpacity`
  flex: 1;
`;

const PopupContainer = styled.View`
  width: 86px;
  //border: 1px solid #3db8c0;
  border-radius: 10px;
  background-color: #fff;
  position: absolute;
  left: ${(props) => `${parseInt(props.left) - 93}px`};
  top: ${(props) => `${parseInt(props.top) - 14}px`};
`;

const PopupBtn = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  height: 38px;
  border-bottom-width: ${(props) => (props.hasBorder ? '1px' : '0px')};
  border-color: #e3e5e5;
`;

const dataList = [
  { id: 1, name: '수정' },
  { id: 2, name: `삭제` },
];

const DropdownModal = ({
  visible,
  isMine,
  onPress,
  onClose,
  x,
  y,
  hasFollowing,
  CONTENT_POPUP = dataList,
}) => {
  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <ContainerBtn onPress={onClose}>
        <PopupContainer
          left={x}
          top={y}
          style={{
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowRadius: 20,
            shadowColor: 'rgba(167, 171, 201, 0.15)',
            shadowOpacity: 1,
          }}
        >
          {CONTENT_POPUP.map((data, i) => (
            <PopupBtn
              key={i}
              onPress={() => onPress(data.name)}
              hasBorder={i !== CONTENT_POPUP.length - 1}
            >
              <NormalBoldLabel12
                text={data.name}
                style={{
                  color: data.name === '삭제' ? '#FF0000' : '#333',
                }}
              />
            </PopupBtn>
          ))}
        </PopupContainer>
      </ContainerBtn>
    </Modal>
  );
};

export default React.memo(DropdownModal);
