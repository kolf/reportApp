import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Image, Text } from 'react-native-ui-lib'

export const Empty = (props) => {
  return (
    <View style={styles.root} center {...props}>
      <Image style={{ width: 160, height: 160 }} assetName="empty" assetGroup="images" />
      <View><Text text70>暂无数据</Text></View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {

  }
});
