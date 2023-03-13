import React, { useState } from "react";
import { FlatList, VirtualizedList, StyleSheet, TouchableOpacity, } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { Empty } from "./Empty";
import { Loading } from './Loading'

const colors = {
  0: '#cccccc',
  2: '#13ce66',
  1: '#ff0000'
}

const renderItem = ({ dataSource, showDot, columns, onClick }) => {
  return (
    <TouchableOpacity onPress={onClick}>
      <View flex center row style={{
        ...styles.row,
        backgroundColor: dataSource.index % 2 ? '#fff' : '#eee'
      }}>
        {columns.map((column) => (
          <View
            key={column.dataIndex}
            style={{
              width: column.width,
              flex: column.width ? null : 1
            }}
          >
            <View center row>{showDot && column.dataIndex === 'index' && <View style={{ ...styles.dot, backgroundColor: colors[dataSource.status] }} />}
              <Text gray60 center>{dataSource[column.dataIndex] || "---"}</Text></View>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

export const TableView = ({
  columns = [],
  dataSource = [],
  showDot,
  onClick,
  pageProps,
  rowKey = "id",
}) => {

  const getItem = React.useCallback((data, index) => {
    return data[index]
  }, [dataSource])

  return (
    <View style={styles.container}>
      <View row center style={styles.header}>
        {columns.map((column) => (
          <View
            center
            key={column.dataIndex}
            flex
            style={{ width: column.width, flex: column.width ? null : 1 }}
          >
            <Text>{column.title}</Text>
          </View>
        ))}
      </View>
      <FlatList
        ListEmptyComponent={<Empty height={300} />}
        renderItem={(data) => renderItem({
          dataSource: data.item, columns, showDot, onClick() {
            onClick(data.item)
          }
        })}
        keyExtractor={(item, index) => item[rowKey] + '-' + index}
        data={dataSource}
        style={styles.body}
        onEndReachedThreshold={1} //距离底部半屏触发事件
        initialNumToRender={4}
        onEndReached={() => pageProps?.setSize(pageProps.size + 1)}
        refreshing={pageProps?.isRefreshing}
        onRefresh={pageProps?.onRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    height: 46,
    backgroundColor: "#ccc",
    textAlign: 'center'
  },
  body: {

  },
  row: {
    minHeight: 46
  },
  dot: {
    width: 8, height: 8,
    marginRight: 6,
    borderRadius: 4
  }
});
