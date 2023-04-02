import * as React from 'react';
import {TouchableOpacity, Alert} from 'react-native';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Image} from 'react-native-ui-lib';
import {AuthenticatedUserContext} from '../providers';
import {
  MapScreen,
  CreatePatrolRecord,
  MyListScreen,
  CreateStep1Screen,
  CreateStep2Screen,
  DetailsScreen,
  TaskCategoryScreen,
  TaskListScreen,
  TaskDetailsScreen,
  PatrolRecordScreen,
  PatrolRecordDetails,
  MapPlaceSearch,
} from '../screens';

import {Icons} from '../config/images';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const headerTitle = {
  headerTitleAlign: 'center',
  tabBarActiveTintColor: '#000000',
};

const tabs = [
  {
    name: 'Home',
    title: '首页',
    component: MapScreen,
  },
  {name: 'TaskCategory', title: '测报任务', component: TaskCategoryScreen},
  {name: 'MyList', title: '我的上报', component: MyListScreen},
  {name: 'PatrolRecord', title: '巡查记录', component: PatrolRecordScreen},
];

const getHeaderTitle = route => {
  return getFocusedRouteNameFromRoute(route) || '首页';
};

const ExitButton = () => {
  const {setUser} = React.useContext(AuthenticatedUserContext);

  const handleClick = () => {
    Alert.alert('退出', '确认退出该帐号吗？', [
      {
        text: '确认',
        onPress: async () => {
          setUser(null);
        },
      },
      {
        text: '取消',
      },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleClick}>
      <View paddingR-10>
        <Image
          style={{width: 24, height: 24}}
          assetName="exit"
          assetGroup="icons"
        />
      </View>
    </TouchableOpacity>
  );
};

const TabStack = () => {
  return (
    <Tab.Navigator>
      {tabs.map((tab, index) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            ...headerTitle,
            tabBarStyle: {height: 56, paddingBottom: 2, overflow: 'hidden'},
            tabBarLabelStyle: {top: -6},
            tabBarLabel: tab.title,
            title: tab.title,
            headerRight: () => {
              return index === 0 && <ExitButton />;
            },
            params: {index},
            tabBarIcon: ({size, focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? Icons[`tab${index + 1}Active`]
                      : Icons[`tab${index + 1}`]
                  }
                  style={{width: size * 1.2, height: size * 1.2}}
                />
              );
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tab"
        options={route => ({title: getHeaderTitle(route), headerShown: false})}
        component={TabStack}
      />
      <Stack.Screen
        name="CreateStep1"
        options={{title: '天气物候', headerTitleAlign: 'center'}}
        component={CreateStep1Screen}
      />
      <Stack.Screen
        name="CreateStep2"
        options={{title: '监测数据采集', headerTitleAlign: 'center'}}
        component={CreateStep2Screen}
      />
      <Stack.Screen
        name="Details"
        options={{title: '上报详情', headerTitleAlign: 'center'}}
        component={DetailsScreen}
      />
      <Stack.Screen
        name="TaskList"
        options={({route}) => {
          return {title: route.params?.title, headerTitleAlign: 'center'};
        }}
        component={TaskListScreen}
      />
      <Stack.Screen
        name="TaskDetails"
        options={{title: '任务详情', headerTitleAlign: 'center'}}
        component={TaskDetailsScreen}
      />
      <Stack.Screen
        name="PatrolRecordDetails"
        options={{title: '巡查详情', headerTitleAlign: 'center'}}
        component={PatrolRecordDetails}
      />
      <Stack.Screen
        name="CreatePatrolRecord"
        options={{title: '巡查上报', headerTitleAlign: 'center'}}
        component={CreatePatrolRecord}
      />
      <Stack.Screen
        name="MapPlaceSearch"
        options={{title: '选择位置', headerTitleAlign: 'center'}}
        component={MapPlaceSearch}
      />
    </Stack.Navigator>
  );
};
