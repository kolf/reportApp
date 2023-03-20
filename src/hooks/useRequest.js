/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2022-04-17 09:41:04
 * @LastEditors: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @LastEditTime: 2023-03-19 12:48:11
 * @FilePath: /reportApp/src/hooks/useRequest.js
 * @Description:
 */
import useSWR from 'swr';
import axios from 'axios';
import queryString from 'query-string';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_ROOT} from '../config/apis';

export const getFetcher = async (url, method = 'GET', data, headers) => {
  const apiRootKey = (url.match(/(\/api\/\w+)\//) || [])[1];

  try {
    const token = await AsyncStorage.getItem('@token');
    const res = await axios({
      url: /^https/.test(url)
        ? url
        : url.replace(apiRootKey, API_ROOT[apiRootKey]),
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...headers,
      },
      [method === 'GET' ? 'params' : 'data']: data,
    });
    const resData = res.data;
    if (resData.code !== 0) {
      throw new Error(resData.msg);
    }
    return Promise.resolve(resData.data);
  } catch (error) {
    console.error(error, url, JSON.stringify(data), 'error');
    return Promise.reject(error);
  }
};

export const useRequest = (name, args, options = {}) => {
  const url =
    args && Object.keys(args).length > 0
      ? `${name}?${queryString.stringify(args)}`
      : name;

  const {data, error, mutate, isValidating} = useSWR(
    name ? url : null,
    async url => getFetcher(url, options.method, options.data),
  );

  const result = options.formatData ? options.formatData(data) : data;

  return {
    data: result,
    loading: !error && !data,
    refresh: mutate,
    error,
    isValidating,
  };
};
