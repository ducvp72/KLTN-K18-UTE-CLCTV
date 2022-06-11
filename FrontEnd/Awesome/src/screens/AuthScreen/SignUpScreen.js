import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    ScrollView,
    Pressable
  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

import { Button, useTheme } from 'react-native-paper';
import { AppStyles } from '../../utils/AppStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { baseUrl } from '../../utils/Configuration';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { login } from '../../reducers';
import { useTranslation } from 'react-i18next';

function SignUpScreen({navigation}) {
  const [fullname, setFullname] = useState('');
  const [birth, setBirth] = useState('');
  const [gender, setGender] = useState('male');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('')
  const dispatch = useDispatch();
  const { t } = useTranslation() 
  const theme = useTheme()

  const [hidePass, setHidePass] = useState(false);
  const icon = !hidePass ? 'eye-slash' : 'eye';

  const onLogRegister = () => {
    if (email.length <= 0 || password.length <= 0 || fullname.length <= 0
        || birth.length <= 0 || gender.length <= 0 || username.length <= 0) {
        Alert.alert('Please fill out the required fields.');
        return;
    }
    Alert.alert('info', 'fullname: ' + fullname + '\nbirth: ' + birth
    + '\ngender: ' + gender + '\nemail: ' + email + '\npassword: ' + password)
    navigation.navigate('VerifyCode', { accessToken: 'day la access token' });

  }

  const onRegister = () => {
    if (email.length <= 0 || password.length <= 0 || fullname.length <= 0
      || birth.length <= 0 || gender.length <= 0 || username.length <= 0) {
      Alert.alert('Please fill out the required fields.');
      return;
    }

    axios({
        method: 'post',
        url: `${baseUrl}/auth/register`,
        headers: {}, 
        data: {
          fullname: fullname,
          username: username,
          birth: birth,
          gender: gender,
          email: email, 
          password: password
        }
      })
      .then(function (response) {
        if(response.data.user){
          console.log('id: ', response.data.user.id);
          dispatch(login(response.data.user));
          const accessToken = response.data.tokens.access.token;
          navigation.navigate('VerifyCode', { accessToken });
        } else {
          Alert.alert('User does not exist. Please try again.');
        }
      })
      .catch(function (error) {
          const { message } = error;
          Alert.alert(message);
      });

  };

  const [date, setDate] = useState(new Date())
  const [show, setShow] = useState(false)
  
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate
    setShow(false)
    setDate(currentDate)

    let fDate = moment(currentDate).format('DD/MM/YYYY')
    
    setBirth(fDate)
  }

  const showPicker = () => {
    setShow(true)
  }

  return (
    <KeyboardAwareScrollView
    >
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <ScrollView >
                <Text style={[styles.title, styles.leftTitle]}>{t('common:signUp')}</Text>
                <View style={styles.InputContainer}>
                    <TextInput
                    style={styles.body}
                    placeholder={t('common:fullname')}
                    onChangeText={setFullname}
                    autoCapitalize='words'
                    value={fullname}
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid="transparent"
                    />
                </View>
                <View style={styles.InputContainer}>
                    <TextInput
                    style={styles.body}
                    placeholder={t('common:username')}
                    onChangeText={setUsername}
                    autoCapitalize='none'
                    value={username}
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid="transparent"
                    />
                </View>
                <Pressable 
                style={styles.InputContainer}
                onPress={() => showPicker()}>
                    <View >
                    <TextInput
                        style={styles.body}
                        placeholder={t('common:birthday')}
                        editable={false}
                        value={birth}
                        placeholderTextColor={AppStyles.color.grey}
                        underlineColorAndroid="transparent"
                    />
                    </View>
                </Pressable>
                {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode='date'
                    onChange={onDateChange}
                    />
                )}
                <View style={styles.InputContainer}>
                    <Picker
                    selectedValue={gender}
                    style={styles.gender}
                    placeholder={t('common:gender')}
                    onValueChange={(itemValue, itemIndex) => setGender(itemValue)} >
                    <Picker.Item label={t('common:male')} value="Male" />
                    <Picker.Item label={t('common:female')} value="Female" />
                    <Picker.Item label={t('common:other')} value="Other" />
                    </Picker>
                </View>
                <View style={styles.InputContainer}>
                    <TextInput
                    style={styles.body}
                    placeholder={t('common:email')}
                    onChangeText={setEmail}
                    autoCapitalize='none'
                    value={email}
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid="transparent"
                    />
                </View>
                <View style={styles.InputContainerPassword}>
                    <TextInput
                    style={styles.bodyPassword}
                    placeholder={t('common:password')}
                    autoCapitalize='none'
                    secureTextEntry={!hidePass}
                    onChangeText={ text => setPassword(text) }
                    value={password}
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid="transparent"
                    />
                    <Icon
                    name={icon}
                    size={15}
                    color={AppStyles.color.grey}
                    style={[styles.icon]}
                    onPress={() => setHidePass(!hidePass)}
                    />
                </View>
                <Text style={[styles.or, {color: theme.colors.text}]}
                onPress={() => navigation.navigate('SignInStack')}
                >
                    {t('common:alreadyHaveAccount')}
                </Text>
                <Button
                    uppercase={false}
                    mode='text'
                    style={[styles.signupButton]}
                    labelStyle={styles.signupButtonText}
                    onPress={() => onLogRegister()}>
                    {t('common:register')}
                </Button>
            </ScrollView>
        {/* // </TouchableWithoutFeedback> */}
    </KeyboardAwareScrollView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  or: {
    color: 'black',
    marginTop: 20,
    // marginBottom: 5,
    alignSelf: 'center',
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
    alignSelf: 'center',
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  gender: {
    height: 42,
    marginBottom: 7,
    marginTop: -7,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    color: AppStyles.color.text,
  },
  InputContainerPassword: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: AppStyles.color.grey,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bodyPassword: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    alignSelf: 'stretch',
    color: AppStyles.color.text,
  },
  icon: {
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingRight: 15
  },
  signupButton: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    alignSelf: 'center',
    marginBottom: 20
  },
  signupButtonText: {
    color: AppStyles.color.white,
  },
});

export default SignUpScreen;
