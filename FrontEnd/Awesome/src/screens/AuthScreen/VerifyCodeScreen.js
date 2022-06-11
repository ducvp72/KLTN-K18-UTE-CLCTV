import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Button } from 'react-native-paper';
import { AppStyles } from '../../utils/AppStyles';
import { baseUrl } from '../../utils/Configuration';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../reducers';
import { useTranslation } from 'react-i18next';

function VerifyCodeScreen({route, navigation}) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const auth = useSelector((state) => state.auth);
  const { accessToken } = route.params;
  const { t } = useTranslation()
  const dispatch = useDispatch();

  const onPressVerify = () => {
    if (code.length <= 0) {
      Alert.alert('Please fill out the required fields.');
      return;
    }
    console.log('token: ', accessToken)
    console.log('code: ', code)
    Alert.alert('Da xac minh', 'token: ' + accessToken + '\ncode: ' + code)

    axios({
      method: 'post',
      url: `${baseUrl}/auth/verify-email/${code}`,
      headers: {"Authorization" : `Bearer ${accessToken}`}, 
      data: {}      
    })
    .then(function (response) {
      if(response.data.user){
        if(auth.user) {
          navigation.reset({
            routes: [{ name: 'Messages', params: response.data.user.id}],
          });
        } else {
          navigation.navigate('SignInStack')
        }
        // console.log('id: ', response.data.user.id);
        // AsyncStorage.setItem('@loggedInUserID:id', response.data.user.id);
        // AsyncStorage.setItem('@loggedInUserID:key', response.data.user.email);
        // AsyncStorage.setItem('@loggedInUserID:access', response.data.tokens.access.token);
        // AsyncStorage.setItem('@loggedInUserID:refresh', response.data.tokens.refresh.token);
        // dispatch(login(response.data.user));
        // navigation.navigate('SignedIn');
      } else {
        Alert.alert('User does not exist. Please try again.');
      }
    })
    .catch(function (error) {
        const { message } = error;
        Alert.alert(message);
    });
    
  };

  return (
    <View style={styles.container}>
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