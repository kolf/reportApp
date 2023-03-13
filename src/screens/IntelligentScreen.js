import * as React from 'react';
import { StyleSheet } from "react-native";
import { View, Text } from 'react-native-ui-lib'
import { MapPanel } from '../components'
import { useBugTotal } from '../hooks/useData'


export const IntelligentScreen = () => {
  const { data: bugTotalData } = useBugTotal()
  const [map, setMap] = React.useState({
    latitude: 39.745602,
    longitude: 116.760897,
    scale: 16,
    enablezoom: true,
    showSatellite: false,
  })

  const memoData = React.useMemo(() => {
    return [{
      title: '智能检测',
      list: [{
        name: '设备总数',
        unit: '个',
        value: 0
      }, {
        name: '在线数量',
        unit: '个',
        value: 0
      }, {
        name: '执行数量',
        unit: '个',
        value: 0
      }]
    }, {
      title: '今日设备识别虫害',
      list: [{
        name: '非目标虫害',
        unit: '只',
        value: 0
      }, {
        name: '杨扇蛾',
        unit: '只',
        value: 0
      }, {
        name: '铜绿丽金龟',
        unit: '只',
        value: 0
      }, {
        name: '美国白蛾',
        unit: '只',
        value: 0
      }]
    }]

  }, [bugTotalData])

  return (
    <View style={styles.root}>
      <View absB style={styles.panel}><MapPanel dataSource={memoData} /></View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  panel: {
    width: '100%',
    padding: 24
  }
});
