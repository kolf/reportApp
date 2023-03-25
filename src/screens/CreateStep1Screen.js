import * as React from 'react';
import {ScrollView} from 'react-native';
import {View, Text, Button} from 'react-native-ui-lib';
import {
  Steps,
  FormList,
  FormItem,
  Loading,
  Picker,
  CountDown,
} from '../components';
import {AuthenticatedUserContext} from '../providers';
import {
  useWeather,
  useUserTemplateList,
  getTemplate,
  getPosition,
} from '../hooks/useData';
import {treeTypeList} from '../lib/makeData';
import {Colors} from '../config';

const stepList = [
  {
    title: '天气物候',
  },
  {
    title: '监测数据采集',
  },
];

export const CreateStep1Screen = React.memo(({route, navigation}) => {
  const {params} = route;
  const _id = params.deviceId + '-' + params.templateId;
  const recordTimeRef = React.useRef(null);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const {user} = React.useContext(AuthenticatedUserContext);
  const {
    get: getUserTemplate,
    update: updateUserTemplate,
    add: addUserTemplate,
  } = useUserTemplateList();
  const currentUserTemplate = getUserTemplate(_id);
  const {data: weatherData, refresh} = useWeather();
  const positionData = getPosition(params.deviceId);
  const templateData = getTemplate(params.templateId);
  const [formData, setFormData] = React.useState({});

  // console.log(currentUserTemplate, 'currentUserTemplate')
  React.useEffect(() => {
    if (currentUserTemplate.id) {
      setFormData({
        phenology: currentUserTemplate.phenology + '',
        treeId: currentUserTemplate.treeId + '',
      });
    }
  }, [currentUserTemplate]);

  React.useEffect(() => {
    refresh();
  }, []);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const recordTimeChange = React.useCallback(value => {
    recordTimeRef.current = value;
  }, []);

  const handleNext = async () => {
    setConfirmLoading(true);
    const data = {
      id: _id,
      userId: user.userId,
      phenology: formData.phenology,
      treeId: formData.treeId,
      name: positionData?.name,
      recordTime: recordTimeRef.current,
      bugName: templateData?.bugClassify?.bugName,
      bugId: templateData?.bugId,
      itemId: templateData?.itemId,
      deviceId: params.deviceId,
      templateId: params.templateId,
      weather: weatherData?.weather,
      temperature: weatherData?.temperature,
      _district: positionData?.district,
    };
    if (currentUserTemplate.id) {
      await updateUserTemplate(data);
    } else {
      await addUserTemplate(data);
    }
    setConfirmLoading(false);
    navigation.navigate('CreateStep2', params);
  };

  const checkNext = React.useMemo(() => {
    return !formData.treeId || !formData.phenology;
  }, [formData.treeId, formData.phenology]);

  const treeSeedList = React.useMemo(() => {
    return (
      templateData?.treeSeedList.map(item => ({
        value: item.id + '',
        label: item.treeName,
      })) || []
    );
  }, [templateData]);

  const loading = React.useMemo(() => {
    return !(
      weatherData &&
      templateData &&
      positionData &&
      currentUserTemplate
    );
  }, [weatherData, templateData, positionData, currentUserTemplate]);

  if (loading) {
    return <Loading flex />;
  }

  // console.log(currentUserTemplate, 'currentUserTemplate')

  return (
    <ScrollView style={{flex: 1}}>
      <View paddingV-20>
        <Steps items={stepList} current={0} />
      </View>
      <FormList>
        <FormItem label="测报模板">
          <Text text16>{templateData?.templateName}</Text>
        </FormItem>
        <FormItem label="监测点位">
          <Text text16>{positionData?.name}</Text>
        </FormItem>
        <FormItem label="树种" required>
          {treeSeedList && (
            <Picker
              height={50}
              unstyle
              placeholder="请选择树种"
              value={formData.treeId}
              options={treeSeedList}
              name="treeId"
              onChange={value => handleChange('treeId', value)}
            />
          )}
        </FormItem>
        <FormItem label="物候" required>
          {treeTypeList && (
            <Picker
              height={50}
              unstyle
              placeholder="请选择物候"
              value={formData.phenology}
              options={treeTypeList}
              name="phenology"
              onChange={value => handleChange('phenology', value)}
            />
          )}
        </FormItem>
        <FormItem label="天气">
          <Text text16>{weatherData?.weather}</Text>
        </FormItem>
        <FormItem label="温度">
          <Text text16>{weatherData?.temperature || 0}℃</Text>
        </FormItem>
        <FormItem label="监测时间">
          <CountDown onChange={recordTimeChange} />
        </FormItem>
        <FormItem label="测报人">
          <Text text16>{user.nickName}</Text>
        </FormItem>
      </FormList>
      <View paddingV-40 paddingH-16>
        <Button
          label="下一步"
          borderRadius={4}
          style={{height: 48}}
          disabled={checkNext || confirmLoading}
          backgroundColor={Colors.primary}
          onPress={handleNext}
        />
      </View>
    </ScrollView>
  );
});
