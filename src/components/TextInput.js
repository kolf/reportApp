import React from 'react';
import {TextInput as RNTextInput} from 'react-native';
import {Icon} from 'react-native-ui-lib';
import {View} from './View';
import {Button} from './Button';
import {Colors} from '../config';

export const TextInput = ({
  width = '100%',
  leftIconName,
  rightIcon,
  handlePasswordVisibility,
  ...otherProps
}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 4,
        flexDirection: 'row',
        padding: 10,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width,
        borderWidth: 1,
        borderColor: Colors.border,
      }}>
      {leftIconName ? (
        <Icon
          size={20}
          assetName={leftIconName}
          assetGroup="icons"
          style={{marginRight: 10}}
        />
      ) : null}
      <RNTextInput
        style={{
          flex: 1,
          fontSize: 18,
          padding: 0,
          color: Colors.black,
        }}
        placeholderTextColor={Colors.mediumGray}
        {...otherProps}
      />
      {rightIcon ? (
        <Button onPress={handlePasswordVisibility}>
          <Icon
            size={20}
            assetName={rightIcon}
            assetGroup="icons"
            style={{marginRight: 0}}
          />
        </Button>
      ) : null}
    </View>
  );
};
