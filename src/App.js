import * as React from 'react';
import {SWRConfig} from 'swr';
import {AppState, StatusBar, Platform} from 'react-native';
import {AMapSdk} from 'react-native-amap3d';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './navigation/RootNavigator';
import {Colors, Typography, Assets} from 'react-native-ui-lib';
import {AuthenticatedUserProvider} from './providers';
import {
  Colors as colors,
  Typography as typography,
  Images as images,
  Icons as icons,
} from './config';

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
        await AMapSdk.init(
          Platform.select({
            android: '97986f37560fe9742f02aac3ac43922b',
            ios: '97986f37560fe9742f02aac3ac43922b',
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
