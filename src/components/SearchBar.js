import {Incubator, Button} from 'react-native-ui-lib';
import {Colors} from '../config';
import * as React from 'react';
import {StyleSheet} from 'react-native';

export const SearchBar = ({onSearch, placeholder}) => {
  const [value, setValue] = React.useState('');
  return (
    <Incubator.TextField
      onChangeText={setValue}
      value={value}
      validate={['required']}
      containerStyle={styles.input}
      fieldStyle={styles.fieldStyle}
      placeholder={placeholder}
      trailingAccessory={
        <Button
          backgroundColor={Colors.success}
          borderRadius={0}
          label="搜索"
          onPress={() => onSearch(value)}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  input: {
    // padding: 12,
    flex: 1
  },
  fieldStyle: {
    backgroundColor: '#fff',
    height: 42,
    paddingLeft: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
});
