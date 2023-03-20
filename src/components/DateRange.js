import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text, DateTimePicker} from 'react-native-ui-lib';
import {Colors} from '../config';

const dateProps = {
  mode: 'date',
  dateFormat: 'YYYY-MM-DD',
};

//补全0
const completeDate = value => {
  return value < 10 ? '0' + value : value;
};

const formatDate = date => {
  const day = date.getDate();
  const month = date.getMonth() + 1; //注意月份需要+1
  const year = date.getFullYear();
  //补全0，并拼接
  return year + '-' + completeDate(month) + '-' + completeDate(day);
};

export const DateRange = ({onChange, style}) => {
  const [values, setValues] = useState([]);
  const handleChange = (index, value) => {
    let nextValues = [...values];
    nextValues[index] = formatDate(value);
    setValues(nextValues);
    onChange && onChange(nextValues);
  };

  return (
    <View style={styles.root} row>
      <DateTimePicker
        {...dateProps}
        // style={styles.date}
        placeholder="开始时间"
        onChange={value => handleChange(0, value)}
      />
      <View style={{width: 20}}>
        <Text style={{textAlign: 'center'}}>-</Text>
      </View>
      <DateTimePicker
        {...dateProps}
        // style={styles.date}
        placeholder="结束时间"
        onChange={value => handleChange(1, value)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    // backgroundColor: Colors.error,
    // width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    height: 30,
  },
  date: {
    flex: 1,
  },
});
