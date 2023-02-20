import React from 'react';
import {
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  View,
} from 'react-native';
import Touchable from '../buttons/Touchable';
import { NormalLabel } from '../Label';
import { SCREEN_HEIGHT } from '../../constants/constants';

const CenterListModal = ({
  containerStyle,
  list,
  selectedItem,
  placeholder,
  itemName,
  onPress,
  visible,
  onRequestClose,
  onSelect,
  textStyle,
  disabled,
  disableMsg,
  selectStyle,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (disabled) {
            if (disableMsg) {
              Alert.alert('', disableMsg);
            }
            return;
          }
          onPress();
        }}
        style={{ ...styles.container, ...containerStyle }}
      >
        <NormalLabel
          text={selectedItem ?? placeholder}
          style={{ color: selectedItem ? '#000' : '#aaa', ...selectStyle }}
        />
      </TouchableOpacity>
      {visible && (
        <Modal
          // animationType={'slide'}
          transparent={true}
          visible={visible}
          onRequestClose={onRequestClose}
        >
          <TouchableOpacity
            onPress={onRequestClose}
            style={styles.modalBackground}
          >
            <View style={styles.scrollParentContainer}>
              <ScrollView>
                {list.map((obj, i) => (
                  <Touchable
                    key={i}
                    style={styles.itemBtn}
                    onPress={() => {
                      onSelect(obj);
                      onRequestClose();
                    }}
                  >
                    <NormalLabel
                      text={obj[itemName]}
                      style={{
                        fontSize: 15,
                        color: '#000',
                        ...textStyle,
                      }}
                    />
                  </Touchable>
                ))}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </>
  );
};

export default CenterListModal;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  modalBackground: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    flex: 1,
    justifyContent: 'center',
  },
  scrollParentContainer: {
    justifyContent: 'center',
    // height: SCREEN_HEIGHT * 0.69,
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 10,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  itemBtn: {
    padding: 16,
    marginHorizontal: 8,
  },
});
