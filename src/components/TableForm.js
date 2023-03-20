import * as React from 'react';
import { StyleSheet, ActivityIndicator, TextInput } from 'react-native'
import { View, Text, Incubator } from 'react-native-ui-lib'
import { Colors } from '../config'

const TableRow = ({ index, dataSource, columns, onChange, readOnly }) => {
  return (
    <View row backgroundColor={index % 2 ? '#fff' : '#f5f5f5'}>
      {columns.map((column, i) => (
        <View
          flex
          center
          key={'col-' + column.dataIndex + '-' + i}
          style={styles.col}
        >
          {column.dataIndex !== 'index' && !readOnly ? <TextInput keyboardType='numeric' style={styles.input} value={dataSource[column.dataIndex]} onChangeText={value => {
            const nextValue = value.replace(/[^\d]+/, '');
            onChange(index, column.dataIndex, nextValue)
          }} /> : <Text>{dataSource[column.dataIndex]}</Text>}
        </View>
      ))}
    </View>
  );
}

export const TableForm = ({ dataSource = [], columns, loading, readOnly, onChange }) => {
  const [data, setData] = React.useState(dataSource);

  React.useEffect(() => {
    onChange && onChange(data)
  }, [])

  const total = React.useMemo(() => {
    return data.reduce((result, item) => {
      const fields = Object.keys(item).filter(key => key !== 'index')
      fields.forEach(field => {
        const value = Number(item[field])
        if (result[field]) {
          result[field] += value
        } else {
          result[field] = value
        }
      })
      return result
    }, {})
  }, [data])

  const mean = React.useMemo(() => {
    return columns.filter(column => column.dataIndex !== 'index').reduce((result, column) => {
      const { dataIndex } = column
      result[dataIndex] = (total[dataIndex] / data.length).toFixed(2)
      return result;
    }, {})

  }, [data])

  const handleChange = (index, field, value) => {
    const nextData = data.map((item, i) => {
      if (index === i) {
        return {
          ...item,
          [field]: value
        }
      }
      return item
    })
    onChange && onChange(nextData)
    setData(nextData)
  }

  return (
    <View>
      <View row backgroundColor={Colors.border}>
        {columns.map((column, index) => (
          <View
            key={'header-' + column.dataIndex + '-' + index}
            flex
            center
            style={styles.col}
          >
            <Text>{column.title}</Text>
          </View>
        ))}
      </View>
      {loading ? <View><ActivityIndicator mode='center' size={48} /></View> :
        <View>{data.map((item, index) => <TableRow key={'row-' + index} index={index} readOnly={readOnly} columns={columns} dataSource={item} onChange={handleChange} />)}
          <View row>
            {columns.map((column, index) => (
              <View
                key={'total-' + column.dataIndex + '-' + index}
                flex
                center
                style={styles.col}
              >
                <Text>{index === 0 ? '总数量' : total[column.dataIndex]}</Text>
              </View>
            ))}
          </View>
        </View>}
      <View row backgroundColor={Colors.border}>
        {columns.map((column, index) => (
          <View
            key={'mean-' + column.dataIndex + '-' + index}
            flex
            center
            style={styles.col}
          >
            <Text>{index === 0 ? '平均' : mean[column.dataIndex]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  col: {
    padding: 8,
    height: 46
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.border,
    color: '#666',
    width: '100%',
    padding: 6,
    textAlign: 'center'
  }
})