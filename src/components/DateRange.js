import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet } from "react-native";
import { View, Text, DateTimePicker } from "react-native-ui-lib";
import { Colors } from '../config';


const dateProps = {
  hideUnderline: true,
  display: 'default',
  mode: 'date',
  dateFormat: 'YYYY-MM-DD'
}

//补全0
const completeDate = (value) => {
  return value < 10 ? "0" + value : value;
}


const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1; //注意月份需要+1
  const year = date.getFullYear();
  //补全0，并拼接
  return year + "-" + completeDate(month) + "-" + completeDate(day);
}

export const DateRange = ({ onChange }) => {
  const [values, setValues] = useState([])
  const handleChange = (index, value) => {
    let nextValues = [...values]
    nextValues[index] = formatDate(value)
    setValues(nextValues)
    onChange && onChange(nextValues)
  }


  return (
    <View style={styles.root}>
      <DateTimePicker style={styles.date} {...dateProps} placeholder='开始时间' onChange={value => handleChange(0, value)} />
      <View style={{ width: '10%' }}><Text style={{ textAlign: 'center' }}>-</Text></View>
      <DateTimePicker style={styles.date} {...dateProps} placeholder='结束时间' onChange={value => handleChange(1, value)} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: Colors.white,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    flexDirection: "row",
    textAlign: 'center',
    height: 30,
  },
  date: {
    width: '45%',
    textAlign: 'center',
    height: 30,
    top: 14,
    fontSize: 14
  }
})