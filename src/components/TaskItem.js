import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native-ui-lib'

const colors = {
  4: '#cccccc',
  3: '#13ce66',
  2: '#ff0000',
  1: '#ff0000',
}


export const TaskItem = ({ dataSource }) => {
  return <View style={{ ...styles.root, borderLeftColor: colors[dataSource.templateStatus] }} row centerV>
    <View flex>
      <View paddingB-20><Text style={styles.name}>{dataSource.bugName}监测</Text></View>
      <View><Text color='#666'>{dataSource.startTime}-{dataSource.endTime}</Text></View>
    </View>
    <View paddingR-12><Text color={colors[dataSource.templateStatus]}>{dataSource.currentRecordSchedule}/{dataSource.sumRecordSchedule}</Text></View>
  </View>
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    borderLeftColor: '#13ce66',
    borderLeftWidth: 8
  },
  name: {
    fontSize: 15,
    // fontWeight: 'bold'
  }
});
