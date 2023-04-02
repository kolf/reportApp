import React, {useMemo, useState, useEffect} from 'react';
import {StyleSheet, Dimensions} from 'react-native';
import {View, Text, Image, Card} from 'react-native-ui-lib';
import {Colors} from '../config';

const coverWidth = Dimensions.get('window').width - 24 * 2;
const coverHieght = coverWidth / 2;

export const CoverItem = ({date, cover, items}) => {
  return (
    <View>
      <View center padding-20>
        <Text>2020年02月20日</Text>
      </View>
      <View borderRadius={6} style={styles.content}>
        <Image
          style={{width: coverWidth, height: coverHieght}}
          assetName="fangchong1"
          assetGroup="images"
        />
        <View backgroundColor="#fff">
          <View padding-16 row>
            <View paddingR-16 flex>
              <Text text70>春季防虫有高招 飞天防治已凯旋</Text>
            </View>
            <Image
              aspectRatio={1}
              style={{width: 100, height: 100}}
              assetName="fangchong2"
              assetGroup="images"
            />
          </View>
          <View padding-16 row>
            <View paddingR-16 flex>
              <Text text70>春季防虫有高招 飞天防治已凯旋</Text>
            </View>
            <Image
              aspectRatio={1}
              style={{width: 100, height: 100}}
              assetName="fangchong2"
              assetGroup="images"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export const CoverList = ({children}) => {
  return (
    <View flex paddingH-24>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {},
  date: {},
  content: {
    borderRadius: 6,
    // overflow: 'hidden'
  },
});
