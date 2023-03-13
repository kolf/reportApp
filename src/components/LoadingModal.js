import React from 'react';
import { StyleSheet, View, Modal, ActivityIndicator } from 'react-native';

export const LoadingModal = ({ loading = false, color, size, opacity = 0.4 }) => {
  return (
    <Modal
      transparent
      animationType={'none'}
      visible={loading}
      onRequestClose={() => null}
    >
      <View
        style={[
          styles.modalBackground,
          { backgroundColor: `rgba(0,0,0,${opacity})` }
        ]}
      >
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={loading} color={color} size={size} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    height: 160,
    width: 160,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  }
});


