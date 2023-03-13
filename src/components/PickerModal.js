import React from 'react';
import {StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {View, Text} from 'react-native-ui-lib';

export const PickerModal = ({show, options, onPress}) => {
  return (
    <Modal
      transparent
      animationType={'none'}
      visible={show}
      onRequestClose={() => null}>
      <View
        style={[styles.modalBackground, {backgroundColor: `rgba(0,0,0,0.4)`}]}>
        <View style={styles.list}>
          {options.map(ot => (
            <TouchableOpacity key={ot.value} onPress={() => onPress(ot.value)}>
              <View center style={styles.item}>
                <Text>{ot.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    width: 300,
    backgroundColor: '#fff',
    marginTop: -1,
    overflow: 'hidden',
  },
  item: {
    height: 50,
    alignItems: 'center',
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
    marginTop: -1,
    marginHorizontal: 12,
  },
});
