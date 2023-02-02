import React, { Children, useState } from 'react';
import { View, Modal, Text, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GradientButton from '../buttons/GradientButton';

const ModalFrame = ({ visible, children }) => {
  return (
    <Modal visible={visible} transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: 13.5,
            paddingTop: 48,
            paddingBottom: 23,
            marginHorizontal: 24,
            // minWidth: '90%',
            // minHeight: '25%',
            borderRadius: 10,
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default ModalFrame;
