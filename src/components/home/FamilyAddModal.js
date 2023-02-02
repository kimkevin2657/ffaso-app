import React, { Children, useState } from 'react';
import { View, Modal, Text, Button, TouchableOpacity } from 'react-native';

import GradientButton from '../buttons/GradientButton';
import Touchable from '../buttons/Touchable';

const FamilyAddModal = ({ visible, onPress, children }) => {
  return (
    <Modal visible={visible} transparent onRequestClose={onPress}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
        <View
          style={{
            marginHorizontal: 24,
            backgroundColor: '#fff',
            paddingHorizontal: 7,
            // minWidth: '90%',
            // minHeight: '70%',
            borderRadius: 10,
          }}
        >
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default FamilyAddModal;
