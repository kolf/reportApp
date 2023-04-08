import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import {InlineForm, DateRange, TableView, Picker} from '../components';
import {useDistrict, useBugCategory, useInspectionList} from '../hooks/useData';

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 48,
  },
  {
    title: '属地',
    dataIndex: 'territorial',
  },
  {
    title: '监测虫害',
    dataIndex: 'bugName',
  },
  {
    title: '监测时间',
    dataIndex: 'updateTime',
  },
];

const defaultOption = {
  value: 0,
  label: '全部',
};

const makeQuery = values => {
  return Object.entries(values).reduce((result, item) => {
    const [key, value] = item;
    console.log(key, value, 'key, value');
    if (value) {
      if (key === 'date' && value.length > 0) {
        const [startDate, endDate] = value;
        result.startTime = startDate;
        result.endTime = endDate;
      } else if (typeof value === 'object') {
        result[key] = value.value === '0' ? undefined : value.value;
      } else {
        result[key] = value === '全部' ? undefined : value;
      }
    }

    return result;
  }, {});
};

export const PatrolRecordScreen = ({navigation}) => {
  const [query, setQuery] = React.useState({
    name: '',
    bugName: '',
    startTime: '',
    endTime: '',
  });

  const {data, setSize, size, isRefreshing, onRefresh} = useInspectionList(
    makeQuery(query),
  );
  const {data: districtRange = []} = useDistrict();
  const {data: bugCategoryRange = []} = useBugCategory();

  const memoData = React.useMemo(() => {
    if (!data) {
      return [];
    }

    return data.map((item, index) => {
      return {
        ...item,
        key: item.id,
        index: index + 1,
      };
    });
  }, [data]);

  const handleClick = ({id, deviceId}) => {
    navigation.navigate('PatrolRecordDetails', {
      deviceId,
      id,
    });
  };

  const onFilter = values => {
    setQuery({
      ...query,
      ...values,
    });
  };

  return (
    <View style={styles.root}>
      <InlineForm onChange={onFilter}>
        <Picker
          placeholder="请选择虫害"
          options={[
            defaultOption,
            ...bugCategoryRange.map(o => ({label: o.label, value: o.label})),
          ]}
          name="bugName"
        />
        <Picker
          placeholder="请选择区域"
          options={[defaultOption, ...districtRange]}
          name="name"
        />
        <DateRange name="date" width="70%" />
      </InlineForm>
      <TableView
        rowKey="key"
        pageProps={{
          isRefreshing,
          onRefresh,
          size,
          setSize,
        }}
        showDot
        columns={columns}
        dataSource={memoData}
        onClick={handleClick}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
