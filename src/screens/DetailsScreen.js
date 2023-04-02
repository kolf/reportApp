import * as React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {
  FormItem,
  FormList,
  TableForm,
  ImagePicker,
  Loading,
  Error,
} from '../components';
import {useDetails, getPosition} from '../hooks/useData';
import {treeTypeList} from '../lib/makeData';
import {joinUrl} from '../lib/upload';

export const DetailsScreen = React.memo(({route}) => {
  const {params} = route;
  const {data: templateDetailsData, loading} = useDetails(params.id);
  const positionData = getPosition(params.deviceId) || {};

  const error = !templateDetailsData;

  const columns = React.useMemo(() => {
    if (!templateDetailsData) {
      return [];
    }
    const {templateCellDataVOMatrix = [[]]} = templateDetailsData;
    return [
      {
        key: -1,
        dataIndex: 'index',
        title: '序号',
      },
      ...templateCellDataVOMatrix.map(items => {
        const {templateCellId, templateCellName} = items[0];
        return {
          key: templateCellId,
          dataIndex: 'cell-' + templateCellId,
          title: templateCellName,
        };
      }),
    ];
  }, [templateDetailsData]);

  const memoData = React.useMemo(() => {
    if (!templateDetailsData) {
      return [];
    }
    const {templateCellDataVOMatrix = []} = templateDetailsData;

    return templateCellDataVOMatrix.reduce((result, items, index) => {
      items.forEach((item, i) => {
        const id = 'index-' + i;
        if (!result.find(r => r.id === id)) {
          result[i] = {
            id,
            index: i + 1,
            ['cell-' + item.templateCellId]: item.data,
          };
        } else {
          result[i] = {
            id,
            ...result[i],
            ['cell-' + item.templateCellId]: item.data,
          };
        }
      });
      return result;
    }, []);
  }, [templateDetailsData]);

  const memoTreeName = React.useMemo(() => {
    if (!templateDetailsData || !templateDetailsData.phenology) {
      return '';
    }
    return (
      treeTypeList.find(t => t.value == templateDetailsData.phenology) || {}
    ).label;
  }, [templateDetailsData]);

  // console.log(error, loading, templateDetailsData?.imageList, 'loading')

  if (loading) {
    return <Loading flex />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <ScrollView style={{flex: 1}}>
      <View paddingV-12 paddingH-16>
        <Text text70>监测数据</Text>
      </View>
      <FormList>
        <FormItem label="监测点位">
          <Text>{positionData?.name}</Text>
        </FormItem>
        <FormItem label="测报任务">
          <Text>{templateDetailsData.bugName}</Text>
        </FormItem>

        <FormItem label="监测时间">
          <Text>{templateDetailsData.recordTime}</Text>
        </FormItem>
        <FormItem label="温度">
          <Text>{templateDetailsData.temperature || 0}℃</Text>
        </FormItem>

        <FormItem label="树种">
          <Text>{templateDetailsData.treeName || '未知'}</Text>
        </FormItem>

        <FormItem label="物候">
          <Text>{memoTreeName}</Text>
        </FormItem>

        <FormItem label="天气">
          <Text>{templateDetailsData.weather}</Text>
        </FormItem>
        <FormItem label="上报人">
          <Text>{templateDetailsData.nickName || '未知'}</Text>
        </FormItem>
      </FormList>
      <View paddingV-12 paddingH-16>
        <Text text70>监测数据采集</Text>
      </View>
      <TableForm
        columns={columns}
        dataSource={memoData}
        readOnly
        rowKey="index"
      />
      <View paddingV-12 paddingH-16>
        <Text text70>上传图片</Text>
      </View>
      <View backgroundColor="#fff" paddingV-12 paddingH-12>
        <ImagePicker
          showAddBtn={false}
          files={joinUrl(templateDetailsData?.imageList || []).map(item => ({
            url: item,
          }))}
        />
      </View>
      <View paddingV-12 paddingH-16>
        <Text text70>备注</Text>
      </View>
      <View padding-24 backgroundColor="#fff" height={200}>
        <Text>{templateDetailsData.remark || '无'}</Text>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
