import * as React from 'react';
import {MapView, Marker, MapType} from 'react-native-amap3d';
import {init, Geolocation} from 'react-native-amap-geolocation';
import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {SearchBar, LoadingModal, Empty} from '../components';
import {View, Icon, Text} from 'react-native-ui-lib';
import {usePlaceSearch, useInspectionTemplate} from '../hooks/useData';
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
  const [mapLoading, setMapLoading] = React.useState(true);
  const [value, setValue] = React.useState('');
  const [placeholder, setPlaceholder] = React.useState('');
  const {update, data: inspectionTemplate} = useInspectionTemplate();
  const {data} = usePlaceSearch(value);

  const handleClick = async data => {
    // console.log(data, 'data');
    await update({...inspectionTemplate, _address: data});
    navigation.navigate('CreatePatrolRecord');
    // console.log(data, 'data');
  };

  const updateCurrentPosition = React.useCallback(callback => {
    Geolocation.getCurrentPosition(
      position => {
        const {longitude, latitude, name} = position.coords;
        console.log(position, 'position');
        setCurrentPosition({longitude, latitude});
        setPlaceholder(name);
        callback && callback({longitude, latitude});
      },
      () => {
        callback && callback();
      },
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 100000},
    );
  }, []);

  const handleSearch = value => {
    const nextValue = value || placeholder;
    setValue(nextValue);
    setPlaceholder(nextValue);
  };

  React.useEffect(() => {
    const run = async () => {
      if (Platform.OS == 'android') {
        try {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
          await init({
            ios: '97986f37560fe9742f02aac3ac43922b',
            android: '97986f37560fe9742f02aac3ac43922b',
          });

          updateCurrentPosition();
        } catch (error) {
          // console.error(error)
        }
        setMapLoading(false);
      }

      if (inspectionTemplate && inspectionTemplate._address) {
        setPlaceholder(inspectionTemplate._address.name);
      }

      //   mapRef.current.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
      //     console.log('11');
      //   });
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [init, inspectionTemplate]);

  //   console.log(data, 'data');

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
          onPress={() => {
            updateCurrentPosition(position => {
              const target = position || currentPosition;
              mapRef.current.moveCamera(
                {
                  tilt: 0,
                  bearing: 0,
                  zoom: 16,
                  target,
                },
                1000,
              );
            });
          }}
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
