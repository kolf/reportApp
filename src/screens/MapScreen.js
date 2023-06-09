import * as React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useSWRConfig} from 'swr';
import {MapView, Marker, MapType, Cluster} from 'react-native-amap3d';

import {
  View,
  Text,
  ActionSheet,
  Image,
  Icon as UIcon,
} from 'react-native-ui-lib';
import {
  Sidebar,
  LoadingModal,
  Button as MyButton,
  SearchBar,
} from '../components';
import {Colors} from '../config';
import {
  useTemplateFixedPoint,
  useHomeData,
  useUserTemplateList,
  useAMapGeolocation,
} from '../hooks/useData';

const CustomMarker = React.memo(({name}) => {
  return (
    <View center>
      <View style={styles.markerText} backgroundColor={Colors.success}>
        <Text color="#fff">{name}</Text>
      </View>
      <Image
        assetGroup="icons"
        style={{width: 40, height: 40, marginTop: -4}}
        assetName="insert"
      />
    </View>
  );
});

const getMakerPosition = (markers, name) => {
  const marker = markers.find(m => m.name.search(name) !== -1);
  if (!marker) {
    return null;
  }
  return {
    latitude: marker.latitude * 1,
    longitude: marker.longitude * 1,
  };
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
        <UIcon assetName={icon} assetGroup="icons" size={24} />
      </View>
      {total && total !== undefined && (
        <View absT center style={styles.total}>
          <Text color="#fff">{total || 40}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export const MapScreen = React.memo(({navigation}) => {
  const {mutate} = useSWRConfig();
  const mapRef = React.useRef(null);
  const statusRef = React.useRef(null);
  const clusterRef = React.useRef(null);
  const [showMenu, setShowMenu] = React.useState(false);
  const [coverage, setCoverage] = React.useState(false);
  const aMapGeolocation = useAMapGeolocation();

  const [currentPosition, setCurrentPosition] = React.useState();
  const [currentMarker, setCurrentMarker] = React.useState(null);
  const {data} = useHomeData();
  const {data: userTemplateList, isValidating: userTemplateLoading} =
    useUserTemplateList();
  const {
    data: templateFixedPointList,
    refresh: refreshFixedPositList,
    isValidating,
  } = useTemplateFixedPoint();

  React.useEffect(() => {
    // 刷新地图marker
    const run = async () => {
      if (!userTemplateList) {
        return;
      }
      await refreshFixedPositList();
      await mutate('/api/bjtzh/pest/point/position/listPointPositionInfo');
    };

    if (userTemplateLoading) {
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTemplateLoading]);

  React.useEffect(() => {
    if (data.positions && data.positions.length > 0) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        mapRef.current?.moveCamera(
          {zoom: 11, target: {latitude: 39.80884722, longitude: 116.7749056}},
          500,
        );
      }, 300);
    }
  }, [data.positions]);

  React.useEffect(() => {
    if (aMapGeolocation.data) {
      const {longitude, latitude} = aMapGeolocation.data;
      setCurrentPosition({longitude, latitude});
      mapRef.current.moveCamera(
        {
          tilt: 0,
          bearing: 0,
          zoom: 16,
          target: {longitude, latitude},
        },
        1000,
      );
    }
  }, [aMapGeolocation.data]);

  const handleSearch = React.useCallback(
    value => {
      // console.log(data, 'value');
      if (!data || data.positions?.length === 0 || !value || !mapRef.current) {
        return;
      }
      const position = getMakerPosition(data.positions, value);
      mapRef.current.moveCamera(
        {
          tilt: 0,
          bearing: 0,
          zoom: 16,
          target: position,
        },
        1000,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.positions, mapRef],
  );

  const createEvent = () => {
    navigation.navigate('CreatePatrolRecord');
  };

  const mekeTemplateFixedPointList = React.useMemo(() => {
    if (!templateFixedPointList) {
      return [];
    }

    return templateFixedPointList.map(item => {
      const id = item.deviceId + '-' + item.templateId;
      if (
        Array.isArray(userTemplateList) &&
        userTemplateList.find(u => u.id === id)
      ) {
        return {
          ...item,
          id,
          isWarn: '2',
        };
      }
      return {...item, id};
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateFixedPointList]);

  const unTotal = React.useMemo(() => {
    if (!mekeTemplateFixedPointList) {
      return '0';
    }
    return (
      mekeTemplateFixedPointList.filter(item => item.isWarn === '0').length + ''
    );
  }, [mekeTemplateFixedPointList]);

  const actionSheetProps = React.useMemo(() => {
    if (!currentMarker || !currentMarker.properties || !data.positions) {
      return {
        visible: false,
        title: '',
        options: [],
      };
    }

    const {
      properties: {key},
    } = currentMarker;
    const {name, templateList} = data.positions.find(
      item => item.deviceId === key,
    );

    return {
      visible: true,
      title: name,
      options: (templateList || []).map(t => ({
        label: t.templateName,
        onPress() {
          setShowMenu(false);
          if (t.fixedPointRecordId) {
            navigation.navigate('Details', {
              deviceId: key,
              id: t.fixedPointRecordId,
            });
          } else {
            navigation.navigate('CreateStep1', {
              deviceId: key,
              templateId: t.id,
            });
          }

          setCurrentMarker(null);
        },
      })),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMarker]);

  const getMaker = React.useCallback(
    id => {
      if (!data.positions) {
        return '';
      }
      return data.positions.find(item => item.deviceId === id);
    },
    [data.positions],
  );

  const markerList = React.useMemo(() => {
    if (!data || !data.positions) {
      return [];
    }
    return data.positions.map((m, index) => {
      return {
        properties: {
          key: m.deviceId,
          name: m.name,
        },
        position: {
          latitude: m.latitude * 1,
          longitude: m.longitude * 1,
        },
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.positions]);

  return (
    <View style={styles.root}>
      <Sidebar
        onRefresh={refreshFixedPositList}
        refreshing={isValidating}
        open={showMenu}
        dataSource={mekeTemplateFixedPointList}
        onOpenChange={setShowMenu}>
        <View absT style={{zIndex: 100, left: 12, top: 12, right: 12}}>
          <SearchBar onSearch={handleSearch} placeholder="请输入监测点位名称" />
        </View>
        <View abs style={styles.createBtn}>
          <MyButton onPress={createEvent}>
            <UIcon size={35} assetName="edit" assetGroup="icons" />
          </MyButton>
        </View>
        <View absR style={styles.btnGroup}>
          <FloatButton
            total={unTotal}
            icon="list"
            onPress={() => {
              setShowMenu(true);
            }}
          />
          <FloatButton
            style={{marginTop: 8}}
            icon="coverage"
            onPress={() => setCoverage(!coverage)}
          />
          <FloatButton
            style={{marginTop: 8}}
            icon="findMe"
            onPress={aMapGeolocation.start}
          />
        </View>
        <MapView
          compassEnabled={false}
          zoomControlsEnabled={false}
          scaleControlsEnabled={false}
          distanceFilter={10}
          headingFilter={90}
          ref={mapRef}
          onCameraIdle={({nativeEvent}) => {
            if (clusterRef.current) {
              statusRef.current = nativeEvent;
              clusterRef.current?.update(nativeEvent);
            }
          }}
          mapType={coverage ? MapType.Satellite : MapType.Standard}
          initialCameraPosition={{
            target: {
              latitude: 39.745602,
              longitude: 116.760897,
            },
            zoom: 16,
          }}>
          {currentPosition && (
            <Marker position={currentPosition}>
              <UIcon size={30} assetGroup="icons" assetName="address" />
            </Marker>
          )}
          {markerList.length > 0 && (
            <Cluster
              ref={clusterRef}
              onPress={({position}) => {
                mapRef.current?.moveCamera(
                  {
                    target: position,
                    zoom: statusRef.current?.cameraPosition.zoom + 1,
                  },
                  200,
                );
              }}
              points={markerList}
              renderMarker={item => (
                <Marker
                  onPress={() => setCurrentMarker(item)}
                  key={item.properties.key}
                  // icon={require("../assets/insert.png")}
                  position={item.position}>
                  <CustomMarker name={getMaker(item.properties.key)?.name} />
                </Marker>
              )}
            />
          )}
        </MapView>
      </Sidebar>
      <ActionSheet
        useSafeArea
        useNativeIOS
        {...actionSheetProps}
        onDismiss={e => {
          setCurrentMarker(null);
        }}
      />
      <LoadingModal size={80} color={Colors.success} />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  btnGroup: {
    paddingTop: 70,
    paddingRight: 20,
    zIndex: 2,
  },
  input: {
    padding: 12,
  },
  fieldStyle: {
    backgroundColor: '#fff',
    height: 42,
    paddingLeft: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  total: {
    backgroundColor: Colors.error,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    right: 30,
    top: -6,
    borderRadius: 10,
  },
  markerText: {
    paddingHorizontal: 6,
    fontSize: 10,
    borderRadius: 4,
  },
  createBtn: {
    bottom: 32,
    right: 12,
    backgroundColor: Colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    paddingLeft: 12,
    paddingTop: 12,
    zIndex: 100,
  },
});
