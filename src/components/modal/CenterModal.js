import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const CenterModal = ({
  visible,
  transparent = false,
  onRequestClose,
  children,
  style,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      onRequestClose={onRequestClose}
    >
      <View style={styles.background}>
        <View style={{ ...styles.container, ...style }}>{children}</View>
      </View>
    </Modal>
  );
};

export default CenterModal;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingTop: 29,
    paddingBottom: 17,
    paddingHorizontal: 24,
  },
});
