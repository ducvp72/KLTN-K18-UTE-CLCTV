import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ToastAndroid,
  Keyboard
} from 'react-native';
import { validEmail } from '../../utils/RegexConfig';
import { AppStyles } from '../../utils/AppStyles';
import { baseUrl } from '../../utils/Configuration';
import { Button, useTheme } from 'react-native-paper';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';

function ForgotPasswordScreen({navigation}) {
  const [email, setEmail] = useState('');
  const { t } = useTranslation() 
  const theme = useTheme()
  const [loading, setLoading] = useState(false)

  Keyboard.addListener('keyboardDidHide', () => {
    Keyboard.dismiss();
  });

  const onPressEmail = async() => {
    if (email.length <= 0) {
      ToastAndroid.show(t('common:fillRequiredField'), 3);
      return;
    }

    if(validEmail.test(email) === false) {
      ToastAndroid.show(t('common:email') + ' ' + t('common:invalid'), 2);
      return
    } 
    setLoading(true)
    await axios({
      method: 'post',
      url: `${baseUrl}/auth/send-to-forgot-password`,
      data: {
        email: email, 
      }
    })
    .then(function (response) {
      setLoading(false)
      navigation.navigate('ChangePassword', { email: email });
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
      <Text style={[styles.title, styles.leftTitle]}>{t('common:forgotPasswordHeader')}</Text>
      <View style={styles.InputContainer}>
        <TextInput
          style={styles.body}
          placeholder={t('common:inputEmail')}
          onChangeText={setEmail}
          value={email}
          placeholderTextColor={AppStyles.color.grey}
          underlineColorAndroid="transparent"
        />
      </View>
      <Text style={[styles.or, {color: theme.colors.text}]}
      onPress={() => navigation.goBack()}
      >
          {t('common:alreadyRememberAccount')}
      </Text>
      <Button
        uppercase={false}
        mode="text" 
        style={styles.loginContainer}
        labelStyle={styles.loginText}
        onPress={() => onPressEmail()}
        >
        {t('common:getCode')}
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

export default ForgotPasswordScreen