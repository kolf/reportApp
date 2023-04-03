import * as React from 'react';
import {StyleSheet, ScrollView, Pressable} from 'react-native';
import {View, Text} from 'react-native-ui-lib';
import {View as RNView, Loading, Error, TaskItem, Empty} from '../components';
import {useTaskList} from '../hooks/useData';

export const TaskListScreen = React.memo(({route, navigation}) => {
  const {
    params: {status},
  } = route;
  const {data, loading} = useTaskList(status);

  const error = !data;

  const handleClick = React.useCallback(
    item => {
      navigation.navigate('TaskDetails', item);
    },
    [data],
  );

  if (loading) {
    return <Loading flex />;
  }

  if (error) {
    return <Error />;
  }

  if (!data.length) {
    return <Empty style={{height: 400}} />;
  }

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.list}>
        {data?.map(item => (
          <Pressable key={item.templateId} onPress={() => handleClick(item)}>
            <TaskItem dataSource={item} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
});
