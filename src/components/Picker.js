import * as React from 'react';
import {StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import {Colors} from '../config';

const placeholderProps = {
  value: null,
  color: '#999',
};
export class Picker extends React.Component {
  handleChange = value => {
    const {onChange} = this.props;
    onChange(value);
  };

  render() {
    const {unstyle, options = [], placeholder, value} = this.props;

    return (
      <RNPickerSelect
        value={value}
        // Icon={null}
        style={unstyle ? unstyles : styles}
        useNativeAndroidPickerStyle={false}
        placeholder={{
          ...placeholderProps,
          label: placeholder,
        }}
        items={options}
        onValueChange={this.handleChange}
      />
    );
  }
}

const unstyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    width: '90%',
    color: '#333',
  },
  inputAndroid: {
    height: 50,
    width: '90%',
    color: '#333',
    padding: 0,
  },
});

const styles = StyleSheet.create({
  inputIOS: {
    backgroundColor: Colors.white,
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderColor: Colors.border,
    color: '#333',
    textAlign: 'center',
  },
  inputAndroid: {
    backgroundColor: Colors.white,
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    borderColor: Colors.border,
    color: '#333',
    textAlign: 'center',
  },
});
