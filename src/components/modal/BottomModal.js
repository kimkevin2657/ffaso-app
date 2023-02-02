import React from 'react';
import { Modal, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SCREEN_HEIGHT } from '../../constants/constants';
import Touchable from '../buttons/Touchable';
import { NormalBoldLabel, NormalLabel } from '../Label';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SpaceBetweenContainer from '../containers/SpaceBetweenContainer';

function BottomModal({
  list,
  isModalOpen,
  onSelect,
  onClose,
  titleStyle,
  subTitleStyle,
}) {
  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={isModalOpen}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            height: SCREEN_HEIGHT * 0.27,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingHorizontal: 24,
          }}
        >
          {list.map((info, i) => (
            <Touchable
              key={i}
              style={[
                styles.wrapper,
                i !== list.length - 1 && styles.infoBottomLine,
              ]}
              onPress={() => onSelect(info, i)}
            >
              <SpaceBetweenContainer>
                <View>
                  <NormalBoldLabel text={info.title} style={titleStyle} />
                  {!!info.subTitle && (
                    <NormalLabel text={info.subTitle} style={subTitleStyle} />
                  )}
                </View>
                <AntDesign name='right' size={20} color={'#8082FF'} />
              </SpaceBetweenContainer>
            </Touchable>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export default BottomModal;

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 30,
  },
  infoBottomLine: {
    borderBottomWidth: 1,
    borderColor: '#e3e5e5',
  },
});
