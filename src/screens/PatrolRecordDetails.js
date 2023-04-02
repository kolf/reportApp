import * as React from 'react';
import {ScrollView} from 'react-native';
import {Text} from 'react-native-ui-lib';
import {FormList, FormItem, Loading, ImagePicker} from '../components';
import {useInspection} from '../hooks/useData';
import {joinUrl} from '../lib/upload';

export const PatrolRecordDetails = React.memo(({route}) => {
  const {params} = route;
  const {data, loading} = useInspection(params);

  console.log(data, 'data');
  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={{flex: 1}}>
      <FormList>
        <FormItem label="监测时间">
          <Text text16>{data.createTime}</Text>
        </FormItem>
        <FormItem label="属地">
          <Text text16>{data.territorial}</Text>
        </FormItem>

        <FormItem label="问题位置描述">
          <Text text16>{data.address}</Text>
        </FormItem>

        <FormItem label="涉及虫种">
          <Text text16>{data.bugName}</Text>
        </FormItem>

        <FormItem label="具体问题">
          <Text text16>{data.question}</Text>
        </FormItem>

        <FormItem label="涉及寄主">
          <Text text16>{data.involveHost}</Text>
        </FormItem>

        <FormItem label="寄主数量/棵">
          <Text text16>{data.treeNum}</Text>
        </FormItem>

        <FormItem label="地块性质">
          <Text text16>{data.plotNature}</Text>
        </FormItem>
        <FormItem label="图片">
          <ImagePicker
            showAddBtn={false}
            files={
              data.imgUrl
                ? joinUrl(data.imgUrl.split(',')).map(item => ({
                    url: item,
                  }))
                : []
            }
          />
        </FormItem>

        <FormItem label="备注">
          <Text text16>{data.remarks}</Text>
        </FormItem>
      </FormList>
    </ScrollView>
  );
});
