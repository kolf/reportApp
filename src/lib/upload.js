import RNFetchBlob from 'react-native-blob-util'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { bucketName, API_ROOT } from '../config/apis'

const url = `${API_ROOT['/api/bjtzh']}/admin/file`

export const uploadItem = (image) => {
  return new Promise(async (resole, reject) => {
    try {
      token = await AsyncStorage.getItem('@token');
      if (!token) {
        throw new Error(`token失效了！`)
      }
    } catch (error) {
      return Promise.reject(error)
    }
    RNFetchBlob.fetch('POST', url + '/upload',
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        "Tenant-Id": '1',
      },
      [{ name: 'bucketName', data: bucketName }, { name: 'file', filename: image.fileName || 'image-0.png', data: RNFetchBlob.wrap(image.url) }]).then((res) => {
        const data = JSON.parse(res.data);
        if (data.code !== 0) {
          reject(new Error(data.msg))
          return
        }
        const { bucketName, fileName } = data.data;
        const httpUrl = bucketName + '-' + fileName
        resole({ ...image, httpUrl })
      }).catch((err) => {
        reject(err)
      })
  })
}

export const uploadList = async (imageList) => {
  if (imageList.length === 0 || imageList.every(item => item.httpUrl)) {
    return Promise.resolve(imageList)
  }
  try {
    return new Promise.all(imageList.map((item, index) => {
      if (item.httpUrl) {
        return Promise.resolve({ ...item, fileName: 'image-' + index })
      }
      return uploadItem(item)
    }))
  } catch (error) {
    return Promise.reject(error)
  }
}

export const joinUrl = imageList => {
  // https://zhyl.zwyun.bjtzh.gov.cn/admin/file/pest/168ce9487a5b48c69bf232a36ffb5533.png
  return imageList.map(item => `${url}/${bucketName}/${item.replace(bucketName + '-', '')}`)
}
