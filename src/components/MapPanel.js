import React, { useMemo, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { View, Text, Image } from "react-native-ui-lib";
import { Colors } from "../config";

export const MapPanel = ({ dataSource }) => {
  return (
    <View style={styles.root} paddingB-16>
      {dataSource.map((item, index) => (
        <View key={"panel-" + index} paddingB-12>
          <View style={styles.title} padding-14>
            <Text text70M>{item.title}</Text>
          </View>
          <View style={styles.content} padding-12 paddingB-0>
            <View row>
              {item.list.map((c, i) => (
                <View flex center key={"item-" + i}>
                  <View paddingB-8>
                    <Text color={Colors.success} text50R>
                      {c.value}
                    </Text>
                  </View>
                  <View>
                    <Text>{c.name}</Text>
                  </View>
                  <View>
                    <Text>({c.unit})</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fff",
    borderRadius: 6,
    // overflow: "hidden",
  },
  title: {
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
});
