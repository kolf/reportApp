import React, { useState, createContext, useEffect, useCallback } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';
import { useLogin } from '../hooks/useData';
export const AuthenticatedUserContext = createContext({});


export const AuthenticatedUserProvider = ({ children }) => {
  const { getUser } = useLogin()
  const [user, setUser] = useState();
  const [token, setToken] = useState();

  useEffect(() => {
    AsyncStorage.getItem('@token').then(res => {
      if (res) {
        setToken(res)
      }
    })
  }, [])

  const auth = useCallback(async () => {
    const netinfo = await NetInfo.fetch();

    try {
      const token = await AsyncStorage.getItem('@token');
      const { sysUser } = await getUser(token);
      await AsyncStorage.setItem('@user', JSON.stringify(sysUser));
      setUser(sysUser);
    } catch (error) {
      if (netinfo.isConnected) {
        setUser(null)
      } else {
        const newUser = await AsyncStorage.getItem('@user');
        setUser(JSON.parse(newUser))
      }
    }
    return token
  }, [])

  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser, setToken, token, auth }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
