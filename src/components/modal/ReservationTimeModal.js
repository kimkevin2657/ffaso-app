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

const ReservationTimeModal = ({
  containerStyle,
  list,
  selectedItem,
  placeholder,
  onPress,
  visible,
  onRequestClose,
  onSelect,
  textStyle,
  disabled,
  disableMsg,
}) => {
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          if (disabled) {
            Alert.alert('', disableMsg);
            return;
          }
          onPress();
        }}
        style={{ ...styles.container, ...containerStyle }}
      >
        <NormalLabel
          text={selectedItem ?? placeholder}
          style={{ color: selectedItem ? '#000' : '#aaa' }}
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
                      text={`${obj.startTime.slice(0, 5)} ~ ${obj.endTime.slice(
                        0,
                        5
                      )} 수업`}
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

export default ReservationTimeModal;

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
