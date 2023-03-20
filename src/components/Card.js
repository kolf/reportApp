import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from "react-native";
import { View, Text, Image } from "react-native-ui-lib";
import { Colors } from '../config';

export const Card = ({ title, children }) => {
  return <View style={styles.root}>
    {title && <View style={styles.header}><Text style={{ fontSize: 15, fontWeight: 'bold' }}>{title}</Text></View>}
    <View style={styles.body}>{children}</View>
  </View>
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    borderRadius: 6
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  body: {
    padding: 16
  }
})