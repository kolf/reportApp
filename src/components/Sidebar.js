import * as React from 'react';
import {StyleSheet, FlatList, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import {View, Text, ListItem, Incubator, Button} from 'react-native-ui-lib';
import {Colors} from '../config';

const renderItem = ({item, onClick}) => {
  return (
    <ListItem key={item.id} style={styles.listItem} onPress={onClick}>
      {item.isWarn === '0' && <View style={styles.dot} />}
      <View center flex>
        <Text>{item.fixedPointNameAndBugName}</Text>
      </View>
    </ListItem>
  );
};

const SearchInput = ({onSearch}) => {
  const [value, setValue] = React.useState('');
  return (
    <Incubator.TextField
      onChangeText={setValue}
      value={value}
      validate={['required']}
      containerStyle={styles.input}
      fieldStyle={styles.fieldStyle}
      placeholder="请输入点位或害虫名称"
      trailingAccessory={
        <Button
          size="small"
          backgroundColor={Colors.success}
          borderRadius={0}
          label="搜索"
          onPress={() => onSearch(value)}
        />
      }
    />
  );
};

export const Sidebar = React.memo(
  ({
    dataSource,
    open: propsOpen,
    refreshing,
    onRefresh,
    children,
    onOpenChange,
  }) => {
    const navigation = useNavigation();
    const ref = React.useRef(null);
    const openRef = React.useRef(false);
    const [value, setValue] = React.useState('');

    // console.log(propsOpen, openRef, 'g')

    React.useEffect(() => {
      // console.log(propsOpen, openRef, 'openRef')
      if (ref.current && openRef.current !== propsOpen) {
        openRef.current = propsOpen;
        ref.current[propsOpen ? 'openDrawer' : 'closeDrawer']();
      }
    }, [propsOpen]);

    const memoData = React.useMemo(() => {
      if (!value) {
        return dataSource;
      }

      const re = new RegExp(value);
      return dataSource.filter(item => {
        return re.test(item.fixedPointNameAndBugName);
      });
    }, [dataSource, value]);

    const handleClick = index => {
      const {deviceId, templateId, fixedPointRecordId} = memoData[index];

      if (fixedPointRecordId) {
        navigation.navigate('Details', {
          deviceId,
          id: fixedPointRecordId,
        });
        return;
      }

      navigation.navigate('CreateStep1', {
        deviceId,
        templateId,
      });
    };

    return (
      <DrawerLayout
        drawerWidth={260}
        ref={el => (ref.current = el)}
        drawerPosition={DrawerLayout.positions.Right}
        drawerType="front"
        drawerBackgroundColor="#fff"
        renderNavigationView={() => (
          <FlatList
            ListHeaderComponent={<SearchInput onSearch={setValue} />}
            ListEmptyComponent={
              <View height={400} center>
                <Text text70>暂无数据</Text>
              </View>
            }
            refreshing={refreshing}
            onRefresh={onRefresh}
            data={memoData}
            renderItem={({item, index}) =>
              renderItem({
                item,
                onClick() {
                  handleClick(index);
                },
              })
            }
            keyExtractor={(item, i) => {
              return item.id + '-' + i;
            }}
          />
        )}
        onDrawerOpen={() => onOpenChange(true)}
        onDrawerClose={() => {
          onOpenChange(false);
        }}>
        {children}
      </DrawerLayout>
    );
  },
);

const styles = StyleSheet.create({
  root: {},
  listItem: {
    height: 50,
    alignItems: 'center',
    borderTopColor: '#eeeeee',
    borderTopWidth: 1,
    marginTop: -1,
    marginLeft: 12,
  },
  dot: {
    width: 8,
    height: 8,
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: '#f00',
  },
  input: {
    padding: 12,
  },
  fieldStyle: {
    backgroundColor: '#f5f5f5',
    height: 30,
    paddingLeft: 12,
  },
});
