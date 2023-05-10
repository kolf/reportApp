import * as React from 'react';
import {MapView, Marker, MapType} from 'react-native-amap3d';
import {StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {SearchBar, Empty} from '../components';
import {View, Icon, Text} from 'react-native-ui-lib';
import {
  usePlaceSearch,
  useInspectionTemplate,
  useCurrentLocation,
} from '../hooks/useData';
import {Colors} from '../config';

const renderItem = ({index, item, onClick}) => {
  const fullAddress = item.district + item.address;
  return (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() =>
          onClick({
            ...item,
            fullAddress,
          })
        }>
        <View style={styles['item-title']}>
          <Text text70 color={Colors.primary}>
            {item.name}
          </Text>
        </View>
        <View paddingT-4>
          <Text>{fullAddress}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const FloatButton = ({icon, style, total, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <View
        borderRadius={4}
        backgroundColor="#fff"
        width={40}
        height={40}
        center>
        <Icon assetName={icon} assetGroup="icons" size={24} />
      </View>
      {total && total !== undefined && (
        <View absT center style={styles.total}>
          <Text color="#fff">{total || 40}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const MapPlaceSearch = ({navigation}) => {
  const mapRef = React.useRef(null);
  const [currentPosition, setCurrentPosition] = React.useState();
  const {run: getCurrentLocation} = useCurrentLocation();
  const [value, setValue] = React.useState('');
  const [placeholder, setPlaceholder] = React.useState('');
  const {update, data: inspectionTemplate} = useInspectionTemplate();
  const {data} = usePlaceSearch(value);

  const handleClick = async data => {
    console.log(data, 'data');
    const [longitude, latitude] = data.location.split(',');

    await update({
      ...inspectionTemplate,
      _address: {
        fullAddress: data.fullAddress,
        name: data.name,
        longitude,
        latitude,
      },
    });
    navigation.navigate('CreatePatrolRecord');
    // console.log(data, 'data');
  };

  const handleCurrentLocation = async () => {
    try {
      const res = await getCurrentLocation();
      // console.log(res, 'res');
      const {longitude, latitude, poiName, address} = res;
      setCurrentPosition({longitude, latitude});
      setPlaceholder(poiName || address);

      mapRef.current.moveCamera(
        {
          tilt: 0,
          bearing: 0,
          zoom: 16,
          target: {
            longitude,
            latitude,
          },
        },
        1000,
      );
    } catch (error) {}
  };

  const handleSearch = value => {
    const nextValue = value || placeholder;
    setValue(nextValue);
    setPlaceholder(nextValue);
  };

  React.useEffect(() => {
    if (inspectionTemplate._address) {
      setPlaceholder(inspectionTemplate._address.name);
    }
  }, [inspectionTemplate]);

  return (
    <View style={styles.root}>
      <View absT style={{zIndex: 100, left: 12, top: 12, right: 12}}>
        <SearchBar
          onSearch={handleSearch}
          placeholder={placeholder || '请输入关键词'}
        />
      </View>

      {data.length > 0 && (
        <View abs style={styles.list}>
          <FlatList
            ListEmptyComponent={<Empty height={300} />}
            renderItem={({item, index}) =>
              renderItem({item, index, onClick: handleClick})
            }
            keyExtractor={(item, index) => item['location'] + '-' + index}
            data={data}
            style={styles.body}
          />
        </View>
      )}

      <View absL style={styles['btn-footer']}>
        <FloatButton
          style={{marginTop: 8}}
          icon="findMe"
          onPress={handleCurrentLocation}
        />
      </View>
      <MapView
        style={styles.map}
        compassEnabled={false}
        zoomControlsEnabled={false}
        scaleControlsEnabled={false}
        distanceFilter={10}
        headingFilter={90}
        ref={mapRef}
        mapType={MapType.Standard}
        initialCameraPosition={{
          target: {
            latitude: 39.745602,
            longitude: 116.760897,
          },
          zoom: 8,
        }}>
        {currentPosition && (
          <Marker position={currentPosition}>
            <Icon size={30} assetGroup="icons" assetName="address" />
          </Marker>
        )}
      </MapView>
      {/* <LoadingModal loading={mapLoading} size={80} color={Colors.success} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  list: {
    left: 12,
    right: 12,
    top: 64,
    zIndex: 100,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingVertical: 6,
    maxHeight: '90%',
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'column',
  },
  'btn-footer': {
    left: 12,
    bottom: 48,
    zIndex: 100,
  },
});
