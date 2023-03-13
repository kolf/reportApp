import * as React from 'react';
import { StyleSheet, StatusBar, TouchableOpacity, PermissionsAndroid, Platform } from "react-native";
import useSWR, { useSWRConfig } from "swr";
import { MapView, Marker, MapType, Cluster } from "react-native-amap3d";
// import Geolocation from '@react-native-community/geolocation';
import { init, Geolocation } from "react-native-amap-geolocation";
// import Geolocation from 'react-native-geolocation-service';
import { View, Incubator, Button, Text, ActionSheet, Image } from 'react-native-ui-lib'
import { Sidebar, Icon, LoadingModal } from '../components'
import { Colors } from '../config'
import { useTemplateFixedPoint, useHomeData, useUserTemplateList } from '../hooks/useData'

const CustomMarker = React.memo(({ name }) => {
  return <View center>
    <View style={styles.markerText} backgroundColor={Colors.success}><Text color='#fff'>{name}</Text></View>
    <Image assetGroup='icons' style={{ width: 40, height: 40, marginTop: -4 }} assetName='insert' />
  </View>
})

const getMakerPosition = (markers, name) => {
  const marker = markers.find(m => m.name.search(name) !== -1);
  if (!marker) {
    return null
  }
  return {
    latitude: marker.latitude * 1, longitude: marker.longitude * 1
  }
}

const FloatButton = ({ icon, style, total, onPress }) => {
  return <TouchableOpacity onPress={onPress} style={style}><View borderRadius={4} backgroundColor='#fff' width={40} height={40} center><Icon name={icon} size={24} /></View>
    {total && total !== undefined && <View absT center style={styles.total}><Text color='#fff'>{total || 40}</Text></View>}
  </TouchableOpacity>
}

const SearchBar = ({ onSearch }) => {
  const [value, setValue] = React.useState('')
  return <View absT style={{ zIndex: 100, width: '100%' }} _backgroundColor='translate'>
    <Incubator.TextField
      onChangeText={setValue}
      value={value}
      validate={['required']}
      containerStyle={styles.input}
      fieldStyle={styles.fieldStyle}
      placeholder='请输入监测点位名称'
      trailingAccessory={<Button backgroundColor={Colors.success} borderRadius={0} label='搜索' onPress={() => onSearch(value)} />}
    />
  </View>
}
export const MapScreen = React.memo(({ navigation }) => {
  const { mutate } = useSWRConfig()
  const mapViewRef = React.useRef(null)
  const statusRef = React.useRef(null)
  const clusterRef = React.useRef(null)
  const [mapLoading, setMapLoading] = React.useState(true)
  const [showMenu, setShowMenu] = React.useState(false)
  const [coverage, setCoverage] = React.useState(false)
  const [currentPosition, setCurrentPosition] = React.useState()
  const [currentMarker, setCurrentMarker] = React.useState(null)
  const { data, error, loading } = useHomeData()
  const { data: userTemplateList, isValidating: userTemplateLoading } = useUserTemplateList()
  const { data: templateFixedPointList, refresh: refreshFixedPositList, isValidating } = useTemplateFixedPoint();

  // console.log(userTemplateLoading, 'userTemplateLoading')

  React.useEffect(() => {

    // 刷新地图marker
    const run = async () => {
      if (!userTemplateList) {
        return
      }
      await refreshFixedPositList()
      await mutate('/api/bjtzh/pest/point/position/listPointPositionInfo')
    }

    if (userTemplateLoading) {
      run()
    }
    // run()
  }, [userTemplateLoading])

  React.useEffect(() => {
    if (data.positions && data.positions.length > 0) {
      mapViewRef.current?.moveCamera({ zoom: 11, target: { "latitude": 39.80884722, "longitude": 116.7749056 } }, 500)
    }

  }, [data.positions])

  React.useEffect(() => {
    const run = async () => {
      if (Platform.OS == "android") {
        try {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
          await init({
            ios: "97986f37560fe9742f02aac3ac43922b",
            android: "97986f37560fe9742f02aac3ac43922b",
          });
          updateCurrentPosition()
        } catch (error) {
          // console.error(error)
        }
      }
      setMapLoading(false)
    }

    run()
  }, [])
  // const { run } = useAllTemplateData()

  const updateCurrentPosition = React.useCallback((callback) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords
        setCurrentPosition({ longitude, latitude });
        callback && callback({ longitude, latitude })
      },
      (error) => {
        callback && callback()
      },
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 100000 }
    );
  }, [])

  const handleSearch = React.useCallback((value) => {
    if (!data || data.positions?.length === 0 || !value || !mapViewRef.current) {
      return
    }
    const position = getMakerPosition(data.positions, value);
    mapViewRef.current.moveCamera(
      {
        tilt: 0,
        bearing: 0,
        zoom: 16,
        target: position,
      },
      1000
    );

  }, [data.positions, mapViewRef])

  const mekeTemplateFixedPointList = React.useMemo(() => {
    if (!templateFixedPointList) {
      return []
    }

    return templateFixedPointList.map(item => {
      const id = item.deviceId + '-' + item.templateId
      if (Array.isArray(userTemplateList) && userTemplateList.find(u => u.id === id)) {
        return {
          ...item,
          id,
          isWarn: '2'
        }
      }
      return { ...item, id }
    })
  }, [templateFixedPointList])

  const unTotal = React.useMemo(() => {
    if (!mekeTemplateFixedPointList) {
      return '0'
    }
    return mekeTemplateFixedPointList.filter(item => item.isWarn === '0').length + ''
  }, [mekeTemplateFixedPointList])

  const actionSheetProps = React.useMemo(() => {
    if (!currentMarker || !currentMarker.properties || !data.positions) {
      return {
        visible: false,
        title: '',
        options: []
      }
    }

    const { properties: { key } } = currentMarker
    const { name, templateList } = data.positions.find(item => item.deviceId === key)

    return {
      visible: true,
      title: name,
      options: (templateList || []).map(t => ({
        label: t.templateName, onPress() {
          setShowMenu(false)
          if (t.fixedPointRecordId) {
            navigation.navigate('Details', {
              deviceId: key,
              id: t.fixedPointRecordId
            })
          } else {
            navigation.navigate('CreateStep1', {
              deviceId: key,
              templateId: t.id
            })
          }

          setCurrentMarker(null)
        }
      })),

    }
  }, [currentMarker])

  const getMaker = React.useCallback((id) => {
    if (!data.positions) {
      return ''
    }
    return data.positions.find(item => item.deviceId === id)
  }, [data.positions])


  const markerList = React.useMemo(() => {
    if (!data || !data.positions) {
      return []
    }
    return data.positions.map((m, index) => {
      return {
        properties: {
          key: m.deviceId,
          name: m.name
        },
        position: {
          latitude: m.latitude * 1, longitude: m.longitude * 1
        }
      }
    })
  }, [data.positions])


  return (
    <View style={styles.root}>
      <Sidebar onRefresh={refreshFixedPositList} refreshing={isValidating} open={showMenu} dataSource={mekeTemplateFixedPointList} onOpenChange={setShowMenu}>
        <SearchBar onSearch={handleSearch} />
        <View absR style={styles.btnGroup}><FloatButton total={unTotal} icon='menu' onPress={() => {
          setShowMenu(true)
        }} />
          <FloatButton style={{ marginTop: 8 }} icon='animation-outline' onPress={() => setCoverage(!coverage)} />
          <FloatButton style={{ marginTop: 8 }} icon='crosshairs-gps' onPress={
            () => {
              updateCurrentPosition((position) => {
                const target = position || currentPosition;
                mapViewRef.current.moveCamera(
                  {
                    tilt: 0,
                    bearing: 0,
                    zoom: 16,
                    target,
                  },
                  1000
                );
              })
            }
          } />
        </View>
        <MapView
          compassEnabled={false}
          zoomControlsEnabled={false}
          scaleControlsEnabled={false}
          distanceFilter={10}
          headingFilter={90}
          // myLocationEnabled
          // myLocationButtonEnabled
          ref={mapViewRef}
          onCameraIdle={({ nativeEvent }) => {
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
          }}
        >
          {currentPosition && <Marker position={currentPosition}>
            <Icon size={30} color={Colors.primary} name='map-marker-radius'></Icon>
          </Marker>}
          {markerList.length > 0 && <Cluster
            ref={clusterRef}
            onPress={({ position }) => {
              mapViewRef.current?.moveCamera(
                {
                  target: position,
                  zoom: statusRef.current?.cameraPosition.zoom + 1,
                },
                200
              );
            }}
            points={markerList}
            renderMarker={(item) => (
              <Marker
                onPress={() => setCurrentMarker(item)}
                key={item.properties.key}
                // icon={require("../assets/insert.png")}
                position={item.position}
              >
                <CustomMarker name={getMaker(item.properties.key)?.name} />
              </Marker>
            )}
          />}
        </MapView>
      </Sidebar>
      <ActionSheet
        useSafeArea
        useNativeIOS
        {...actionSheetProps}
        onDismiss={(e) => {
          setCurrentMarker(null);
        }}
      />
      <LoadingModal loading={mapLoading} size={80} color={Colors.success} />
    </View>
  );
})

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  btnGroup: {
    paddingTop: 70, paddingRight: 20,
    zIndex: 2
  }, input: {
    padding: 12
  },
  fieldStyle: {
    backgroundColor: '#fff',
    height: 42,
    paddingLeft: 20,
    borderRadius: 4, overflow: 'hidden'
  },
  total: {
    backgroundColor: Colors.error,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    right: 30,
    top: -6,
    borderRadius: 10
  },
  markerText: {
    paddingHorizontal: 6,
    fontSize: 10,
    borderRadius: 4
  }
});
