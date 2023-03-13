import * as React from 'react';
import { StyleSheet } from "react-native";
import { TabController, View, Text } from 'react-native-ui-lib'
import { MapScreen } from './MapScreen';
import { IntelligentScreen } from './IntelligentScreen';
import { NewsScreen } from './NewsScreen';


export const HomeScreen = () => {
  return <TabController items={[{ label: '虫情测报' }, { label: '智能监测' }, { label: '防虫资讯' }]}>
    <TabController.TabBar enableShadows />
    <View flex>
      <TabController.TabPage index={0}>
        <MapScreen />
      </TabController.TabPage>
      <TabController.TabPage index={1} lazy>
        <IntelligentScreen />
      </TabController.TabPage>
      <TabController.TabPage index={2} lazy>
        <NewsScreen></NewsScreen>
      </TabController.TabPage>
    </View>
  </TabController>
};

const styles = StyleSheet.create({
  root: {

  },
});
