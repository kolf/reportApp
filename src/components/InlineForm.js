/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2022-04-17 09:41:04
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-03-18 23:32:09
 * @FilePath: /reportApp/src/components/InlineForm.js
 * @Description: 
 */
import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Text, View, Button} from 'react-native-ui-lib';

export const InlineForm = ({children, onChange}) => {
  const [values, setValues] = React.useState({});

  const handleChange = (field, value) => {
    const nextValues = {
      ...values,
      [field]: value,
    };
    setValues(nextValues);
    onChange(nextValues);
  };
  // const Nodes =
  return (
    <View style={styles.root}>
      {React.Children.map(children, child => {
        return (
          <View style={{...styles.item, width: child.props.width || '50%'}}>
            {React.cloneElement(child, {
              onChange: (...args) => {
                if (!child.props.name) {
                  return null;
                }
                handleChange(child.props.name, ...args);
              },
            })}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  item: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
});
