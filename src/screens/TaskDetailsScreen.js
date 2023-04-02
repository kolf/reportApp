import * as React from 'react';
import {StyleSheet, ScrollView, Pressable} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {View as RNView, Loading, Error, Card} from '../components';
import {Colors} from '../config';
import {getTemplate, useTemplate} from '../hooks/useData';

export const TaskDetailsScreen = React.memo(({route}) => {
  const {params} = route;
  const {data, loading, error} = useTemplate(params.templateId);

  return (
    <ScrollView style={{flex: 1}}>
      <View paddingV-12>
        <View paddingH-16 paddingV-6>
          <Card>
            <Text style={styles.label}>
              测报任务名称：{params.templateName}
            </Text>
          </Card>
        </View>
        <View paddingH-16 paddingV-6>
          <Card title="模板信息">
            <View style={styles.item} paddingT-0>
              <Text style={styles.label}>相关树种：</Text>
              <View flex>
                <Text>{params.treeNames}</Text>
              </View>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>涉及害虫：</Text>
              <Text>{params.bugName}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>开始时间：</Text>
              <Text>{params.startTime}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>结束时间：</Text>
              <Text>{params.endTime}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>测报频率：</Text>
              <Text>{params.frequency}天/次</Text>
            </View>
            <View style={[styles.item, {borderBottomWidth: 0}]}>
              <Text style={styles.label}>测报进度：</Text>
              <Text>
                {params.currentRecordSchedule}/{params.sumRecordSchedule}
              </Text>
            </View>
          </Card>
        </View>
        {data?.pointPositionVOList?.length > 0 && (
          <View paddingH-16 paddingV-6>
            <Card title="点位信息">
              <View row style={styles.tagList}>
                {data.pointPositionVOList.map(item => (
                  <View key={item.deviceId} style={styles.tag} center>
                    <Text>{item.name}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingLeft: 12,
    // flexWrap: 'wrap'
  },
  tagList: {
    marginHorizontal: -4,
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.border,
    minWidth: 80,
    marginHorizontal: 4,
    marginBottom: 6,
    paddingHorizontal: 12,
    borderRadius: 2,
    height: 30,
  },
});
