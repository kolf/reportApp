import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Image, Text } from 'react-native-ui-lib'

export const Error = (isPage, ...props) => {
  return (
    <View style={isPage ? {
      backgroundColor: '#fff',
      flex: 1,
      justifyContent: 'flex-start',
      paddingTop: 100
    } : null} center  {...props}>
      <Image style={{ width: 214, height: 160 }} assetName="error" assetGroup="images" />
      <View paddingT-20><Text text70>服务器出错，请稍候再试</Text></View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {

  }
});
