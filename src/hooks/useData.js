import AsyncStorage from '@react-native-async-storage/async-storage';
import AMapGeolocation from '@uiw/react-native-amap-geolocation';

import * as React from 'react';
import useSWR, {useSWRConfig} from 'swr';
import axios from 'axios';
import useSWRInfinite from 'swr/infinite';
import queryString from 'query-string';
import {itemId, typeId} from '../config/apis';
import {getFetcher, useRequest} from './useRequest';
import {uploadList} from '../lib/upload';
import {makeTableAvg, makeTableSum} from '../lib/makeData';

const PAGE_SIZE = 16;
const API_KEY = '97986f37560fe9742f02aac3ac43922b';

export const useInfiniteTemplate = params => {
    const {data, error, mutate, size, setSize, isValidating} = useSWRInfinite(
        index =>
            `/api/bjtzh/pest/fixed/point/pageFixedPointRecord?itemId=${itemId}&size=${PAGE_SIZE}&current=${
                index + 1
            }&${queryString.stringify(params)}`,
        async url => {
            const res = await getFetcher(url);
            return res.records;
        },
    );

    const issues = data ? [].concat(...data) : [];
    const isLoading = !data && !error;
    const isRefreshing = !!(isValidating && data && data.length === size);

    return {
        data: issues,
        onRefresh: mutate,
        isLoading,
        isValidating,
        isRefreshing,
        size,
        setSize,
    };
};

export const useHomeData = () => {
    const weathers = useWeather();
    const positions = useAllPosition();
    const templates = useAllTemplate();

    // ['weathers','positions','templates]
    const run = () => {
        return Promise.all([
            weathers.refresh,
            positions.refresh,
            templates.refresh,
        ]);
    };

    return {
        refresh: run,
        loading: weathers.loading || positions.loading || templates.loading,
        error: weathers.error || positions.error || templates.error,
        data: {
            weathers: weathers.data,
            positions: positions.data,
            templates: templates.data,
        },
    };
};

export const useAllPosition = () => {
    const {data, error, loading, refresh} = useRequest(
        '/api/bjtzh/pest/point/position/listPointPositionInfo',
        {
            itemId,
            typeId,
        },
    );

    return {data, error, loading, refresh};
};

export const getPosition = id => {
    const {cache} = useSWRConfig();
    const {data} = cache.get(
        `/api/bjtzh/pest/point/position/listPointPositionInfo?${queryString.stringify(
            {
                itemId,
                typeId,
            },
        )}`,
    );

    return (data || []).find(item => item.deviceId === id);
};

export const useUploadSuccessTemplate = () => {
    const {data, mutate} = useSWR(`uploadSuccessTemplate`, async () => {
        try {
            const res = await AsyncStorage.getItem('uploadSuccessTemplate');
            return res ? JSON.parse(res) : [];
        } catch (error) {
            return [];
        }
    });

    const add = React.useCallback(
        async id => {
            const nextData = [...data, id];
            try {
                await AsyncStorage.setItem(
                    'uploadSuccessTemplate',
                    JSON.stringify(nextData),
                );
            } catch (error) {
            }
        },
        [data],
    );

    return {
        add,
        data,
        refresh: mutate,
    };
};

export const useAllTemplate = () => {
    const {data, error, loading, refresh} = useRequest(
        '/api/bjtzh/pest/template/listTemplateVO/' + itemId,
        null,
    );

    return {data, error, loading, refresh};
};

export const getTemplate = id => {
    const {cache} = useSWRConfig();
    const {data} = cache.get('/api/bjtzh/pest/template/listTemplateVO/' + itemId);
    return data.find(item => item.id === id);
};

export const useUserTemplateList = () => {
    // AsyncStorage.removeItem('userTemplateList')
    const {
        data: list,
        mutate: refresh,
        isValidating,
    } = useSWR(`userTemplateList`, async () => {
        try {
            const res = await AsyncStorage.getItem('userTemplateList');
            return res ? JSON.parse(res) : [];
        } catch (error) {
            return [];
        }
    });

    const _makeData = React.useCallback(data => {
        return Object.entries(data).reduce(
            (result, item) => {
                const [key, value] = item;

                if (key === 'imageList' && value.length > 0) {
                    result.imageList = value.map(item => item.httpUrl);
                    return result;
                }

                if (key === '_tableData' && value) {
                    result['monitorAvg'] = parseFloat(makeTableAvg(value));
                    result['monitorSum'] = parseFloat(makeTableSum(value));
                }

                if (!/^_/.test(key) && !/(id)/.test(key) && value) {
                    if (
                        /^(bugId|itemId|phenology|temperature|templateId|userId)$/.test(key)
                    ) {
                        result[key] = Number(value);
                    } else {
                        result[key] = value;
                    }
                }
                return result;
            },
            {
                itemId,
            },
        );
    }, []);

    const get = React.useCallback(
        id => {
            if (!list) {
                return {};
            }
            return list.find(item => item.id === id) || {};
        },
        [list],
    );

    const remove = React.useCallback(
        async data => {
            let res = null;
            try {
                const imageList = await uploadList(data._fileList || []);
                res = await getFetcher(
                    `/api/bjtzh/pest/fixed/point/saveFixedPointRecord`,
                    'POST',
                    _makeData({...data, imageList}),
                );
            } catch (error) {
                return Promise.reject(error);
            }
            const nextList = list.filter(item => item.id !== data.id);
            AsyncStorage.setItem('userTemplateList', JSON.stringify(nextList));
            refresh(nextList);
            return Promise.resolve(res);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [list],
    );

    const removeAll = React.useCallback(
        async removedList => {
            let res = null;
            try {
                const params = await Promise.all(
                    removedList.map(async item => {
                        try {
                            const imageList = await uploadList(item._fileList);
                            return Promise.resolve(
                                _makeData({
                                    ...item,
                                    imageList,
                                }),
                            );
                        } catch (error) {
                            return Promise.reject(error);
                        }
                    }),
                );

                res = await getFetcher(
                    `/api/bjtzh/pest/fixed/point/saveBatchFixedPointRecord`,
                    'POST',
                    params,
                );

                const nextList = list.filter(
                    item => !removedList.find(d => d.id === item.id),
                );
                AsyncStorage.setItem('userTemplateList', JSON.stringify(nextList));
                refresh(nextList);
                return Promise.resolve(res);
            } catch (error) {
                return Promise.reject(error);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [list],
    );

    const clearAll = async () => {
        await AsyncStorage.setItem('userTemplateList', JSON.stringify([]));
        refresh([]);
    };

    const add = React.useCallback(
        async data => {
            const nextList = [data, ...list];
            try {
                await AsyncStorage.setItem(
                    'userTemplateList',
                    JSON.stringify(nextList),
                );
            } catch (error) {
            }
            refresh(nextList);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [list],
    );

    const update = React.useCallback(
        async data => {
            const nextList = list.map(item => {
                if (item.id === data.id) {
                    return {
                        ...item,
                        ...data,
                    };
                }
                return item;
            });
            try {
                await AsyncStorage.setItem(
                    'userTemplateList',
                    JSON.stringify(nextList),
                );
            } catch (error) {
            }
            refresh(nextList);
        },
        [list],
    );

    return {
        get,
        update,
        remove,
        removeAll,
        add,
        data: list || [],
        isValidating,
        clearAll,
    };
};

export const useBugTotal = () => {
    return useRequest(`/api/bjtzh/pest/detail/getTodayPestNum/25`, null, {});
};

export const getDeveiceList = bugId => {
    return getFetcher(
        `/api/bjtzh/pest/fixed/point/listDeviceBySearch/${itemId}/${bugId}`,
    );
};

export const getDateCharts = data => {
    return getFetcher(
        `/api/bjtzh/pest/fixed/point/getFixedPointTemplateCurveApp`,
        'GET',
        {...data, itemId},
    );
};

export const useDetails = id => {
    return useRequest(
        `/api/bjtzh/pest/fixed/point/getDetailRecordBy/${id}`,
        null,
    );
};

export const usePosition = id => {
    return useRequest(
        `/api/bjtzh/pest/point/position/getPointInfoBy/${id}`,
        null,
    );
};

/**
 * @description: 地块性质下拉框接口
 */
export const usePlotNature = () => {
    return useRequest(
        `/api/bjtzh/pest/bug/inspection/plotNature`,
        null, {
            formatData(res) {
                return res?.map(item => ({label: item.name, value: item.name}));
            },
        }
    );
};

/**
 * @description: 外来入侵生物下拉框接口
 */
export const useSpecies = () => {
    return useRequest(
        `/api/bjtzh/pest/bug/inspection/species`,
        null, {
            formatData(res) {
                return res?.map(item => ({label: item.name, value: item.name}));
            },
        }
    );
};

export const useTemplateFixedPoint = () => {
    return useRequest(
        `/api/bjtzh/pest/device/template/templateFixedPointDetailInfo`,
        {itemId},
    );
};

export const useTemplateFixedPointList = query => {
    return useRequest(
        `/api/bjtzh/pest/fixed/point/pageFixedPointRecord`,
        {itemId, ...query},
        {
            formatData(res) {
                return res?.records;
            },
        },
    );
};

export const useTemplate = id => {
    return useRequest(`/api/bjtzh/pest/template/getTemplateInfoBy/${id}`, {
        'Tenant-Id': 25,
    });
};

export const useWeather = () => {
    return useRequest(`/api/bjtzh/ddtzg5Amini/banner/weather`, {
        city: 'tongzhou-101010600',
    });
};

export const useDistrict = () => {
    return useRequest(
        `/api/bjtzh/pest/point/position/listDistrict`,
        {itemId, typeId},
        {
            formatData(res) {
                return res?.map(item => ({label: item, value: item}));
            },
        },
    );
};

export const useBugCategory = () => {
    return useRequest(
        `/api/bjtzh/pest/bug/classify/getBugClassify`,
        {itemId, levelList: 4},
        {
            formatData(res) {
                return res?.map(item => ({value: item.id * 1, label: item.bugName}));
            },
        },
    );
};

export const useTaskList = status => {
    // console.log(typeof status, 'status')
    let params = {
        status,
    };
    if (!/(3|4)/.test(status)) {
        params.advanceDay = 5;
    }
    return useRequest(
        `/api/bjtzh/pest/template/getTemplateByRecordStatus/${itemId}`,
        params,
        {
            formatData(res) {
                // console.log(res, params, 'res')
                return res?.map(r => ({
                    ...r.bugClassify,
                    startTime: r.startTime.replace(/-/g, '.'),
                    endTime: r.endTime.replace(/-/g, '.'),
                    sumRecordSchedule: r.sumRecordSchedule,
                    currentRecordSchedule: r.currentRecordSchedule,
                    templateName: r.templateName,
                    templateId: r.id,
                    templateStatus: r.templateStatus,
                    frequency: r.frequency,
                    treeNames: r.treeSeedList.map(item => item.treeName).join('，'),
                }));
            },
        },
    );
};

export const useLogin = () => {
    const getToken = async values => {
        try {
            // https://test.dreamdeck.cn/auth/oauth/token?username=gyy&password=123456&grant_type=password
            const res = await getFetcher(
                `/api/bjtzh/auth/oauth/token?grant_type=password&password=${values.password}&username=${values.username}`,
                'POST',
                values,
                {
                    Authorization: 'Basic ZGQ6ZGQ=',
                    TENANT_ID: '1',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
            );
            return res;
        } catch (error) {
            console.error(error, 'error');
        }
    };

    const getUser = token => {
        return getFetcher('/api/bjtzh/admin/user/token/info', 'GET', null, {
            'Tenant-Id': 1,
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            Authorization: `Bearer ${token}`,
        });
    };
    return {getUser, getToken};
};

export const useInspectionList = params => {
    console.log(params, 'params');
    const {data, error, mutate, size, setSize, isValidating} = useSWRInfinite(
        index =>
            `/api/bjtzh/pest/bug/inspection/page?itemId=${itemId}&size=${PAGE_SIZE}&pages=${
                index + 1
            }${
                Object.values(params).length > 0
                    ? '&' + queryString.stringify(params)
                    : ''
            }`,
        async url => {
            const res = await getFetcher(url);
            console.log(res.records, 'res');
            // mutate([])
            return res.records || [];
        },
    );

    const issues = data
        ? (data[0] || data || []).reduce((result, item) => {
            if (item.id && !result.find(r => r.id === item.id)) {
                result.push({...item});
            }
            return result;
        }, [])
        : [];
    const isLoading = !data && !error;
    const isRefreshing = !!(isValidating && data && issues.length === size);

    // console.log(issues, data.length, size, 'size');

    return {
        data: issues,
        onRefresh: mutate,
        isLoading,
        isValidating,
        isRefreshing,
        size,
        setSize,
    };
};

export const useInspection = params => {
    return useRequest(`/api/bjtzh/pest/bug/inspection/${params.id}`, null);
};

export const updateInspection = data => {
    return getFetcher(`/api/bjtzh/pest/bug/inspection`, 'POST', data);
};

export const getCurrentLocation = keywords => {
    return axios({
        url: `https://restapi.amap.com/v3/assistant/inputtips?key=ce54fb644202f44e97271b291b074a20&keywords=${keywords}&types=&city=北京&children=1&offset=10&page=1&extensions=base`,
        method: 'GET',
    });
};

export const useAMapGeolocation = () => {
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        const run = async () => {
            AMapGeolocation.setApiKey(API_KEY);
            AMapGeolocation.setLocationMode(1);
            AMapGeolocation.addLocationListener(res => {
                if (res) {
                    setData(res);
                    AMapGeolocation.stop();
                }
                console.log('返回定位信息', res);
            });
        };

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        start: AMapGeolocation.start,
        stop: AMapGeolocation.stop,
        data,
    };
};

export const usePlaceSearch = value => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (!value) {
            return;
        }

        const run = async keywords => {
            setLoading(true);
            try {
                const res = await getCurrentLocation(keywords);
                setData(
                    (res.data.tips || []).filter(
                        item => typeof item.address === 'string' && item.address,
                    ),
                );
            } catch (error) {
                console.error(error, 'error');
            }
            setLoading(false);
        };

        run(value);
    }, [value]);

    return {data, loading};
};

export const useInspectionTemplate = () => {
    const {mutate: globalMutate} = useSWRConfig();
    const {data, mutate} = useSWR(`inspectionTemplate`, async () => {
        try {
            const res = await AsyncStorage.getItem('inspectionTemplate');
            return JSON.parse(res || '{}');
        } catch (error) {
            return {};
        }
    });
    const update = async data => {
        try {
            await AsyncStorage.setItem('inspectionTemplate', JSON.stringify(data));
            mutate();
        } catch (error) {
        }
    };

    const remove = async () => {
        try {
            await AsyncStorage.removeItem('inspectionTemplate');
            mutate('{}');
            globalMutate(
                key =>
                    typeof key === 'string' &&
                    key.startsWith(
                        `/api/bjtzh/pest/bug/inspection/page?itemId=${itemId}&size=${PAGE_SIZE}&pages=`,
                    ),
                undefined,
                {
                    revalidate: true,
                },
            );
        } catch (error) {
        }
    };

    return {
        data,
        update,
        remove,
    };
};
