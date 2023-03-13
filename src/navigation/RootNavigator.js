import React, { useState, useContext, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
// import { onAuthStateChanged } from 'firebase/auth';

import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { AuthenticatedUserContext } from '../providers';
import { Loading } from '../components';
import { useLogin } from '../hooks/useData'
// import { auth } from '../config';

export const RootNavigator = () => {
  const { user, token, auth } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      await auth()
      setLoading(false)
    }

    run()
  }, [token]);

  if (loading) {
    return null
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
