import React from 'react';
import { TextInput as RNTextInput } from 'react-native';

import { View } from './View';
import { Icon } from './Icon';
import { Button } from './Button';
import { Colors } from '../config';

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
        borderColor: Colors.border
      }}
    >
      {leftIconName ? (
        <Icon
          name={leftIconName}
          size={22}
          color={Colors.mediumGray}
          style={{ marginRight: 10 }}
        />
      ) : null}
      <RNTextInput
        style={{
          flex: 1,
          fontSize: 18,
          padding: 0,
          // height: 18,
          color: Colors.black,
        }}
        placeholderTextColor={Colors.mediumGray}
        {...otherProps}
      />
      {rightIcon ? (
        <Button onPress={handlePasswordVisibility}>
          <Icon
            name={rightIcon}
            size={22}
            color={Colors.mediumGray}
            style={{ marginRight: 0 }}
          />
        </Button>
      ) : null}
    </View>
  );
};
