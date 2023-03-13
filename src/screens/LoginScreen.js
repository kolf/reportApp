import * as React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Formik } from 'formik';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Text, Button } from 'react-native-ui-lib'
import { AuthenticatedUserContext } from '../providers';
import { View as RNView, TextInput, Logo, FormErrorMessage, LoadingModal } from '../components';
import { Images, Colors } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { useLogin } from '../hooks/useData'
import { loginValidationSchema } from '../utils';

export const LoginScreen = React.memo(({ navigation }) => {
  const { setUser, setToken } = React.useContext(AuthenticatedUserContext);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const { getToken, getUser } = useLogin()
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  React.useEffect(() => {
    const run = async () => {
      setToken('')
      setUser(null)
      AsyncStorage.removeItem('@token')
      AsyncStorage.removeItem('@user')
      AsyncStorage.removeItem('userTemplateList')
    }

    run()
  }, [])

  const handleLogin = async (values) => {
    setConfirmLoading(true)
    try {
      const res = await getToken(values);
      const token = res.access_token
      await AsyncStorage.setItem('@token', token);
      setToken(token)
    } catch (error) {
      Alert.alert(`登录出错`, `用户名或密码错误，请稍候再试！`)
      // setUser()
    }
    setConfirmLoading(false)
  };
  return (
    <>
      <RNView isSafe style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <View center paddingV-40>
            <Logo uri={Images.login} />
            <Text text40 marginT-20>智慧病虫害</Text>
          </View>
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={loginValidationSchema}
            onSubmit={values => handleLogin(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur
            }) => (
              <>
                <TextInput
                  name='username'
                  leftIconName='walk'
                  placeholder='输入用户名'
                  autoCapitalize='none'
                  textContentType='name'
                  // autoFocus={true}
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                />
                <FormErrorMessage
                  error={errors.username}
                  visible={touched.username}
                />
                <TextInput
                  name='password'
                  leftIconName='key-variant'
                  placeholder='输入密码'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType='password'
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                <View paddingT-30><Button disabled={errors.password || errors.username} label='登录' borderRadius={4} style={{ height: 48 }} backgroundColor={Colors.primary} onPress={handleSubmit} /></View>
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>
        <LoadingModal loading={confirmLoading} size={80} color={Colors.success} />
      </RNView>
    </>
  );
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 50
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.black,
    paddingTop: 20
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.orange
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
