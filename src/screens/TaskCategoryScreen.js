import * as React from 'react';
import { StyleSheet, Pressable } from "react-native";
import { View, Image, Text } from 'react-native-ui-lib'

export const categorys = [{
  icon: 'group1',
  title: '全部',
  value: '0'
}, {
  icon: 'group2',
  title: '即将开始',
  value: '2'
}, {
  icon: 'group3',
  title: '测报中',
  value: '3'
}, {
  icon: 'group4',
  title: '已结束',
  value: '4'
}]

export const TaskCategoryScreen = ({ navigation }) => {
  const handleClick = ({ value, title }) => {
    navigation.navigate('TaskList', {
      status: value, title
    })
  }

  return (
    <View style={styles.root}>
      <View style={styles.list} row>
        {categorys.map(category => <Pressable key={category.value} style={styles.item} onPress={e => handleClick(category)}>
          <Image assetGroup='icons' assetName={category.icon} style={styles.icon} />
          <Text style={styles.name}>{category.title}</Text>
        </Pressable>)}


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 40,
    paddingVertical: 40,
    backgroundColor: '#fff',
    flex: 1
  },
  list: {
    'flexWrap': 'wrap'
  },
  item: {
    width: '50%',
    height: 170,
    alignItems: 'center'
  },
  icon: {
    width: 120, height: 120
  }, name: {
    marginTop: 10
  }
});
