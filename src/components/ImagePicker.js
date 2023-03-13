import * as React from 'react'
import { StyleSheet, Dimensions, TouchableOpacity, Linking, Platform, Modal } from 'react-native'
import { View, Text, Image, Button } from 'react-native-ui-lib'
import ImageViewer from 'react-native-image-zoom-viewer';
import * as RNImagePicker from 'react-native-image-picker';
import { PickerModal } from './PickerModal'
import { Icon } from './Icon';
import { Colors } from '../config'
// import { uploadItem } from '../lib/upload'

const imageWidth = (Dimensions.get('window').width - 24) / 3
const gap = 6;

const pickOptions = [{
  label: '选择本机相片',
  value: '1'
}, {
  label: '拍照',
  value: '2'
}]

export const ImagePicker = ({ files, showAddBtn, onChange }) => {
  const clicked = React.useRef(false)
  const [imageList, setImageList] = React.useState(files || [])
  const [showView, setShowView] = React.useState(false);
  const [showPicker, setShowPicer] = React.useState(false)
  const [showViewIndex, setShowViewIndex] = React.useState(-1)

  const remove = (index) => {
    const nextImageList = imageList.filter((item, i) => i !== index)
    setImageList(nextImageList)
    onChange && onChange(nextImageList)
  }

  const handlelaunchCamera = async () => {
    if (clicked && clicked.current) {
      return
    }

    clicked.current = true
    try {
      const res = await RNImagePicker.launchCamera({
        mediaTypes: 'photo',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })


      if (!res.didCancel) {
        let url = res.assets[0].uri;
        let httpUrl = ''
        // try {
        //   const uploadRes = await uploadItem({ url });
        //   httpUrl = uploadRes.httpUrl
        // } catch (error) {

        // }

        const nextImageList = [...imageList, { url, httpUrl }];
        setImageList(nextImageList)
        onChange && onChange(nextImageList)
      }
    } catch (error) {

    }
    clicked.current = false
  }

  const handlerLibrary = async () => {
    if (clicked && clicked.current) {
      return
    }

    clicked.current = true
    // No permissions request is necessary for launching the image library
    try {
      const res = await RNImagePicker.launchImageLibrary({
        mediaTypes: 'photo',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!res.didCancel) {
        let url = res.assets[0].uri;
        let httpUrl = ''
        // try {
        //   const uploadRes = await uploadItem({ url });
        //   httpUrl = uploadRes.httpUrl
        // } catch (error) {

        // }
        const nextImageList = [...imageList, { url, httpUrl }];
        setImageList(nextImageList)
        onChange && onChange(nextImageList)
      }
    } catch (error) {
      // console.log(error, 'error')
    }
    clicked.current = false
  }

  return <View style={styles.root} paddingH-12>
    {imageList.map((file, index) => <TouchableOpacity onPress={() => {
      setShowViewIndex(index)
      setShowView(true)
    }} style={styles.image} width={imageWidth} key={file.url + index}>
      <Image source={{ uri: file.url }} style={{
        height: imageWidth - gap * 2, width: imageWidth - gap * 2,
        backgroundColor: '#f5f5f5'
      }} />
      {showAddBtn && <View absR style={styles.close}><TouchableOpacity onPress={() => remove(index)}><Icon color='#999' size={16} name='close'></Icon></TouchableOpacity></View>}
    </TouchableOpacity>)}
    {showAddBtn && imageList.length < 5 && <View padding-6 height={imageWidth} width={imageWidth}>
      <TouchableOpacity onPress={() => setShowPicer(true)} style={styles.add} flex center>
        <Image style={{ width: 60, height: 60 }} assetName="add" assetGroup="icons" />
      </TouchableOpacity>
    </View>}
    <Modal visible={showView} transparent={true}>
      <ImageViewer index={showViewIndex} imageUrls={imageList} onClick={e => {
        setShowView(false);
        // showViewIndex(-1)
      }} />
    </Modal>
    <PickerModal show={showPicker} options={pickOptions} onPress={(value) => {
      if (value === '1') {
        handlerLibrary()
      } else if (value === '2') {
        handlelaunchCamera()
      }
      setShowPicer(false)
    }} />
  </View>
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: 'wrap',
    minHeight: imageWidth
  },
  image: {
    width: imageWidth,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center'
  },
  close: {
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  add: {
    borderWidth: 1,
    borderColor: Colors.border,
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})