import * as React from 'react';
import {SWRConfig} from 'swr';
import {AppState, StatusBar, Platform, PermissionsAndroid} from 'react-native';
import {AMapSdk} from 'react-native-amap3d';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './navigation/RootNavigator';
import {Colors, Typography, Assets, ThemeManager} from 'react-native-ui-lib';
import {AuthenticatedUserProvider} from './providers';
import {API_KEY} from './config/apis';
import {
  Colors as colors,
  Typography as typography,
  Images as images,
  Icons as icons,
} from './config';

ThemeManager.setComponentTheme('Text', {
  color: '#666',
});
Colors.loadColors(colors);
Assets.loadAssetsGroup('images', images);
Assets.loadAssetsGroup('icons', icons);
Typography.loadTypographies(typography);

const App = () => {
  const [loading, setLoading] = React.useState(true);
  const mapRef = React.useRef(new Map());

  React.useEffect(() => {
    const loaderCache = async () => {
      try {
        if (Platform.OS == 'android') {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          ]);
        }

        await AMapSdk.init(
          Platform.select({
            android: API_KEY,
            ios: API_KEY,
          }),
        );

        const res = await AsyncStorage.getItem('app-cache');

        mapRef.current = new Map(JSON.parse(res || '[]'));
      } catch (error) {}
      AppState.addEventListener('change', () => {
        let appState = AppState.currentState;
        if (appState.match(/inactive|background/)) {
          try {
            AsyncStorage.setItem(
              'app-cache',
              JSON.stringify(Array.from(mapRef.current.entries())),
            );
          } catch (error) {}
        }
      });
      setLoading(false);
    };

    loaderCache();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <SWRConfig
      value={{
        provider: () => mapRef.current,
      }}>
      <AuthenticatedUserProvider>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </SafeAreaProvider>
      </AuthenticatedUserProvider>
    </SWRConfig>
  );
};

export default App;
