import * as React from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, Colors} from 'react-native-ui-lib';

export const FormList = ({children, ...rest}) => {
  return (
    <View style={styles.root} {...rest}>
      {children}
    </View>
  );
};

export const FormItem = ({required, label, children, ...rest}) => {
  return (
    <View row center style={styles.item} marginL-16 {...rest}>
      <View style={styles.label} row>
        <Text text16>{label}</Text>
        {required && (
          <Text color={Colors.error} paddingLeft={4}>
            *
          </Text>
        )}
      </View>
      <View flex>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
  },
  label: {
    width: 120,
    fontSize: 16,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingLeft: 0,
    minHeight: 50,
  },
});
