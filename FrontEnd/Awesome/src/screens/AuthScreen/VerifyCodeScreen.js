import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ToastAndroid,
  Keyboard
} from 'react-native';
import { Button } from 'react-native-paper';
import { AppStyles } from '../../utils/AppStyles';
import { baseUrl } from '../../utils/Configuration';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';

function VerifyCodeScreen({route, navigation}) {
  const [code, setCode] = useState('');
  const { accessToken } = route.params;
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState(60);
  const timerRef = useRef(time);

  Keyboard.addListener('keyboardDidHide', () => {
    Keyboard.dismiss();
  });

  const initTimer = () => {
    const timerId = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        clearInterval(timerId);
        setTime(60)
      } else {
        setTime(timerRef.current);
      }
    }, 1000);
    return () => {
      clearInterval(timerId);
      setTime(60)
    };
  }

  const sendCode = async() => {
    setLoading(true)
    initTimer()
    await axios({
      method: 'post',
      url: `${baseUrl}/auth/send-verification-email`,
      headers: {"Authorization" : `Bearer ${accessToken}`}, 
      data: {}      
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

  const onPressVerify = async() => {
    if (code.length <= 0) {
      ToastAndroid.show(t('common:fillRequiredField'), 3);
      return;
    }
    setLoading(true)
    await axios({
      method: 'post',
      url: `${baseUrl}/auth/verify-email/${code}`,
      headers: {"Authorization" : `Bearer ${accessToken}`}, 
      data: {}      
    })
    .then(function (response) {
      ToastAndroid.show(t('common:complete'), 3);
      setLoading(false)
      navigation.navigate('SignIn')
    })
    .catch(function (error) {
      ToastAndroid.show(t('common:errorOccured'), 3);
      setLoading(false)
    });
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
      <Text style={[styles.title, styles.leftTitle]}>{t('common:verifyAccountHeader')}</Text>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder={t('common:inputCode')}
          onChangeText={setCode}
          value={code}
          keyboardType = 'number-pad'
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      <Button
        uppercase={false}
        mode="text" 
        disabled={(time == 60) ? false : true}
        style={styles.loginContainer}
        labelStyle={styles.loginText}
        onPress={() => sendCode()}
        >
        {t('common:getCode')}{((time == 60) ?  '' : ('    ' + time))}
      </Button>
      <Button
        uppercase={false}
        mode="text" 
        style={styles.loginContainer}
        labelStyle={styles.loginText}
        onPress={() => onPressVerify()}
        >
        {t('common:verify')}
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
    borderRadius: 10,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
});

export default VerifyCodeScreen