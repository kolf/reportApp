import * as React from 'react';
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text, ActionSheet, Picker } from "react-native-ui-lib";
import { Colors } from '../config'

export const Select = ({ title, defaultValue, unstyle, onChange, options = [], placeholder }) => {
  const [visible, setVisible] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue)

  const memoOptions = React.useMemo(() => {
    return [...options.map((item) => ({
      label: item.label,
      onPress() {
        setValue(item.value)
        onChange && onChange(item.value, item);
      },
    })), { label: "取消" }]
  })


  const labelName = React.useMemo(() => {
    return options.find(option => option.value === value)?.label || placeholder
  }, [value, options])

  return (
    <>
      <TouchableOpacity style={unstyle ? null : styles.root} onPress={(e) => setVisible(true)}>
        <Text>
          {labelName}
        </Text>
      </TouchableOpacity>
      <ActionSheet
        useSafeArea
        // showCancelButton
        useNativeIOS
        title={title}
        // cancelButtonIndex={options.length}
        // destructiveButtonIndex={value}
        options={memoOptions}
        visible={visible}
        onDismiss={(e) => setVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.white,
    padding: 5,
    width: '100%',
    height: 30,
    borderWidth: 1,
    borderColor: Colors.border,
    display: 'flex',
    alignItems: 'center'
  }
})