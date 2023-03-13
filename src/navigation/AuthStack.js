import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { LoginScreen, } from '../screens';

const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='Login' component={LoginScreen} />
    </Stack.Navigator>
  );
};
