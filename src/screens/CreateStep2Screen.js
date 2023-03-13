import * as React from "react";
import { StyleSheet, ScrollView, Alert, BackHandler } from "react-native";
import { View, Text, Button, Incubator } from 'react-native-ui-lib'
import { Steps, LoadingModal, TableForm, ImagePicker } from '../components'
import { AuthenticatedUserContext } from '../providers';
import { getTemplate, useUserTemplateList } from '../hooks/useData';
import { makeTableCellData } from '../lib/makeData'
import { Colors } from '../config'


const stepList = [{
  title: '天气物候'
}, {
  title: '监测数据采集'
}]

const getTableDataIndexMap = (columns) => {
  return columns.reduce((result, { dataIndex, title }) => {
    result[dataIndex] = title;
    return result
  }, {})
}

export const CreateStep2Screen = React.memo(({ route, navigation }) => {
  const { user, auth } = React.useContext(AuthenticatedUserContext)
  const { params } = route
  const [confirmLoading, setConfirmLoading] = React.useState(true);
  const _id = params.deviceId + '-' + params.templateId
  const { get: getUserTemplate, update: updateUserTemplate, remove: removeUserTemplate } = useUserTemplateList()
  const currentUserTemplate = getUserTemplate(_id)
  const templateData = getTemplate(params.templateId)

  const [formData, setFormData] = React.useState({
    remark: currentUserTemplate?.remark,
    fileList: currentUserTemplate?._fileList || [],
    tableData: currentUserTemplate?._tableData
  })

  React.useEffect(() => {
    const run = async () => {
      try {
        updateUserTemplate({
          id: _id,
          remark: formData?.remark,
          _fileList: formData?.fileList,
          _tableDataSize: memoData?.length,
          _tableData: memoData,
          _tableDataIndexMap: getTableDataIndexMap(columns)
        })
      } catch (error) {
        // console.error(error)
      }
      setConfirmLoading(false)
    }
    run()
  }, [])

  const memoData = React.useMemo(() => {
    if (!templateData) {
      return []
    }

    if (formData?.tableData) {
      return formData.tableData
    }
    const { dataRow = 0, templateCellList = [] } = templateData;
    let result = Array.from({ length: dataRow }, (item, index) => {
      let nextItem = { index: index + 1 }
      templateCellList.forEach(t => {
        nextItem['cell-' + t.id] = ''
      })
      return nextItem
    })
    return result
  }, [templateData, formData.tableData])

  const columns = React.useMemo(() => {
    if (!templateData) {
      return []
    }
    const { templateCellList = [] } = templateData;
    return [{
      dataIndex: 'index',
      title: '序号'
    }, ...templateCellList.map(t => ({
      dataIndex: 'cell-' + t.id,
      title: t.cellName
    }))]
  }, [templateData])

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    })
  }

  const handleNext = async () => {
    if (confirmLoading) {
      return
    }
    setConfirmLoading(true)
    const _tableDataIndexMap = getTableDataIndexMap(columns);
    // Alert.alert(`提交中`)
    try {
      await auth()
      const res = await removeUserTemplate({
        ...currentUserTemplate,
        _tableDataSize: memoData?.length,
        _fileList: formData?.fileList,
        _tableData: memoData,
        templateCellDataMap: makeTableCellData(_tableDataIndexMap, memoData, memoData?.length),
        remark: formData?.remark,
      })
      setConfirmLoading(false)
      navigation.navigate('Home')
    } catch (error) {
      // console.error(error, 'error')
      Alert.alert(`提交失败`, `当前暂无网络，数据已存入我的上报中，请在有网时进行上传`)
      await updateUserTemplate({
        id: _id,
        remark: formData?.remark,
        _fileList: formData?.fileList,
        _tableDataSize: memoData?.length,
        _tableData: memoData,
        _tableDataIndexMap
      })
      setConfirmLoading(false)
      navigation.navigate('Home')
    }
  }

  const handlePrev = async () => {
    await updateUserTemplate({
      id: _id,
      remark: formData?.remark,
      _fileList: formData?.fileList,
      _tableDataSize: memoData?.length,
      _tableData: memoData,
      _tableDataIndexMap: getTableDataIndexMap(columns)
    })
    navigation.goBack()
  }

  return (
    <ScrollView enableOnAndroid={true}>
      <View paddingV-20><Steps
        items={stepList}
        current={1}
      /></View>
      <TableForm columns={columns} dataSource={memoData} rowKey='index' onChange={value => handleChange('tableData', value)} />

      <View paddingV-12 paddingH-16 row><Text text70>上传图片</Text></View>
      <View backgroundColor='#fff' paddingV-12>
        <ImagePicker
          showAddBtn={true}
          files={formData.fileList}
          onChange={value => handleChange('fileList', value)}
        />
      </View>
      <View paddingV-12 paddingH-16><Text text70>备注</Text></View>
      <View padding-24 backgroundColor='#fff'>
        <Incubator.TextField
          value={formData.remark}
          placeholder='请输入'
          disabled
          showCharCounter
          maxLength={200}
          onChangeText={value => handleChange('remark', value)}
          fieldStyle={{
            height: 100,
            alignItems: 'flex-start'
          }}
        />
      </View>

      <View paddingT-40 paddingH-16 paddingB-40>
        <View paddingV-8>
          <Button label='上一步' disabled={confirmLoading} borderRadius={4} style={{ height: 48 }} backgroundColor={Colors.white} color={Colors.black} outlineColor={Colors.primary} onPress={handlePrev}></Button>
        </View>
        <View paddingV-8>
          <Button disabled={confirmLoading} label='提交' borderRadius={4} style={{ height: 48 }} backgroundColor={Colors.primary} onPress={handleNext}></Button>
        </View>
      </View>
      <LoadingModal loading={confirmLoading} size={80} color={Colors.success} />
    </ScrollView>
  );
})

const styles = StyleSheet.create({

});
