import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  ToastAndroid
} from 'react-native';
import { Button } from 'react-native-paper';
import { AppStyles } from '../../utils/AppStyles';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { baseUrl } from '../../utils/Configuration';
import { useTheme } from 'react-native-paper';

function ChangePasswordScreen({route, navigation}) {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false)
  const {t} = useTranslation()
  const auth = useSelector((state) => state.auth);
  const { email } = route.params;
  const theme = useTheme()

  Keyboard.addListener('keyboardDidHide', () => {
    Keyboard.dismiss();
  });

  const onPressChangePassword = () => {
    if (code.length <= 0 || newPassword.length <= 0 ) {
      ToastAndroid.show(t('common:fillRequiredField'), 3);
      return;
    }
    setLoading(true)
    if(auth.user) {
      axios({
        method: 'put',
        url: `${baseUrl}/profile/change-password`,
        headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
        data: {
          oldPassword: code, 
          password: newPassword,
        }
      })
      .then(function (response) {
        ToastAndroid.show(t('common:complete'), 3);
        setLoading(false)
      })
      .catch(function (error) {
        ToastAndroid.show(t('common:errorOccured'), 3);
        setLoading(false)
      });
    } else {
      axios({
        method: 'post',
        url: `${baseUrl}/auth/reset-password`,
        headers: {}, 
        data: {
          email: email, 
          password: newPassword,
          code: code
        }
      })
      .then(function (response) {
        ToastAndroid.show(t('common:complete'), 3);
        setLoading(false)
      })
      .catch(function (error) {
        ToastAndroid.show(t('common:errorOccured'), 3);
        setLoading(false)
      });
    }
  };

  return (
    <View style={styles.container}>
          {loading ? (
            <Spinner
              cancelable={false}
              color={theme.colors.primary}
              visible={loading}
              overlayColor="rgba(0, 0, 0, 0.25)"
            />
          ) : (
            <></>
          )}
      {!auth.user? <Text style={[styles.title, styles.leftTitle]}>{t('common:changePasswordHeader')}</Text> : <></>}
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder={auth.user?.fullname ? t('common:oldPassword') : t('common:inputCode')}
          onChangeText={setCode}
          value={code}
          keyboardType = {auth.user?.fullname ? 'default' : 'number-pad'}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder={t('common:newPassword')}
          onChangeText={setNewPassword}
          value={newPassword}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      <Button
        uppercase={false}
        mode='text'
        style={styles.loginContainer}
        labelStyle={styles.loginText}
        onPress={() => onPressChangePassword()}
        >
        {t('common:changePassword')}
      </Button>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  or: {
    color: 'black',
    marginTop: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: 'bold',
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    alignSelf: 'stretch',
    textAlign: 'center',
    // marginLeft: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: 'center',
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
    alignSelf: 'center',
  },
  loginText: {
    color: AppStyles.color.white,
    fontFamily: 'Roboto',
    fontSize: 16
  },
  placeholder: {
    color: 'red',
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: 10
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
});

export default ChangePasswordScreen