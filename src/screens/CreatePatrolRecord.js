import * as React from 'react';
import {ScrollView, Alert, TouchableOpacity} from 'react-native';
import {View, NumberInput, Button, Incubator, Text} from 'react-native-ui-lib';
import {
  FormList,
  FormItem,
  CountDown,
  Picker,
  ImagePicker,
} from '../components';
import {AuthenticatedUserContext} from '../providers';

import {
  useDistrict,
  useBugCategory,
  updateInspection,
  useInspectionTemplate,
} from '../hooks/useData';
import {Colors} from '../config';

export const CreatePatrolRecord = React.memo(({route, navigation}) => {
  const {auth} = React.useContext(AuthenticatedUserContext);
  const {update, data: inspectionTemplate, remove} = useInspectionTemplate();
  const {data: bugCategoryRange = []} = useBugCategory();
  const {data: districtRange = []} = useDistrict();
  const recordTimeRef = React.useRef(null);
  const [formData, setFormData] = React.useState({
    imgUrl: [],
  });
  const [confirmLoading, setConfirmLoading] = React.useState(false);

  const makeParams = data => {
    if (!data) {
      return {};
    }
    const [longitude, latitude] =
      (inspectionTemplate &&
        inspectionTemplate._address &&
        inspectionTemplate._address.location.split(',')) ||
      [];

    return {
      ...data,
      longitude,
      latitude,
      createTime: recordTimeRef.current,
      address: inspectionTemplate && inspectionTemplate._address?.fullAddress,
      treeNum: data.treeNum && data.treeNum.number,
      imgUrl: data.imgUrl && data.imgUrl.map(file => file.httpUrl).join(','),
      bugName:
        data.bugId &&
        bugCategoryRange.find(item => item.value === data.bugId)?.label,
    };
  };

  const handleSubmit = async () => {
    setConfirmLoading(true);
    try {
      await auth();
      const res = updateInspection(makeParams(formData));
      await remove();
    } catch (error) {
      Alert.alert(
        `提交失败`,
        `当前暂无网络，数据已存入我的上报中，请在有网时进行上传`,
      );
    }
    setConfirmLoading(false);
    navigation.navigate('Home');
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleAddress = async () => {
    await update({
      ...inspectionTemplate,
      ...formData,
    });
    navigation.navigate('MapPlaceSearch');
  };

  React.useEffect(() => {
    if (inspectionTemplate) {
      setFormData({
        ...setFormData,
        ...inspectionTemplate,
      });
    }
  }, [inspectionTemplate]);

  const recordTimeChange = React.useCallback(value => {
    recordTimeRef.current = value;
  }, []);

  return (
    <ScrollView style={{flex: 1}}>
      <FormList>
        <FormItem label="监测时间">
          <CountDown onChange={recordTimeChange} />
        </FormItem>
        <FormItem label="属地" required>
          {districtRange && (
            <Picker
              height={50}
              unstyle
              placeholder="请选择"
              value={formData.territorial}
              options={districtRange}
              name="territorial"
              onChange={value => handleChange('territorial', value)}
            />
          )}
        </FormItem>

        <FormItem label="问题位置描述" required onClick={handleAddress}>
          <TouchableOpacity
            onPress={handleAddress}
            style={{paddingVertical: 12, paddingRight: 12}}>
            {inspectionTemplate && inspectionTemplate._address ? (
              <Text>{inspectionTemplate._address.fullAddress}</Text>
            ) : (
              <Text color="#ccc">请选择</Text>
            )}
          </TouchableOpacity>
        </FormItem>

        <FormItem label="涉及虫种" required>
          {bugCategoryRange && (
            <Picker
              height={50}
              unstyle
              placeholder="请选择"
              value={formData.bugId}
              options={bugCategoryRange}
              name="bugId"
              onChange={value => handleChange('bugId', value)}
            />
          )}
        </FormItem>

        <FormItem label="具体问题" required>
          <Incubator.TextField
            value={formData.question}
            placeholder="请输入"
            onChangeText={value => handleChange('question', value)}
          />
        </FormItem>

        <FormItem label="涉及寄主" required>
          <Incubator.TextField
            value={formData.involveHost}
            placeholder="请输入"
            onChangeText={value => handleChange('involveHost', value)}
          />
        </FormItem>

        <FormItem label="寄主数量/棵" required>
          <NumberInput
            value={formData.treeNum}
            placeholder="请输入"
            onChangeNumber={value => handleChange('treeNum', value)}
          />
        </FormItem>

        <FormItem label="地块性质" required>
          <Incubator.TextField
            value={formData.plotNature}
            placeholder="请输入"
            onChangeText={value => handleChange('plotNature', value)}
          />
        </FormItem>
        <FormItem label="图片">
          <ImagePicker
            showAddBtn={true}
            files={formData.imgUrl}
            onChange={value => handleChange('imgUrl', value)}
          />
        </FormItem>

        <FormItem label="备注">
          <Incubator.TextField
            value={formData.remark}
            placeholder="请输入"
            maxLength={200}
            onChangeText={value => handleChange('remark', value)}
          />
        </FormItem>
      </FormList>
      <View paddingV-40 paddingH-16>
        <Button
          label="提交"
          borderRadius={4}
          style={{height: 48}}
          disabled={confirmLoading}
          backgroundColor={Colors.primary}
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
});
