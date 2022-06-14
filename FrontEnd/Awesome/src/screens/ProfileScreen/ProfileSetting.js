import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Alert,
    ScrollView,
    Pressable,
    Keyboard, ToastAndroid
  } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { validFullname } from '../../utils/RegexConfig';
import { AppStyles, SCREEN_WIDTH } from '../../utils/AppStyles';
import { useTheme, Button } from 'react-native-paper';
import { baseUrl } from '../../utils/Configuration';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../../reducers';
import { useTranslation } from 'react-i18next';

function ProfileSetting(props) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const {t} = useTranslation()

  const [fullname, setFullname] = useState(auth.user?.fullname ?? '');
  const [birth, setBirth] = useState(auth.user?.birth ?? '');
  const [gender, setGender] = useState(auth.user?.gender ?? 'Male');

  Keyboard.addListener('keyboardDidHide', () => {
    Keyboard.dismiss();
  });

  const SaveChange = () => {
    if (fullname.length <= 0 || birth.length <= 0 || gender.length <= 0) {
      ToastAndroid.show(t('common:fillRequiredField'), 3)
      return;
    }

    if(validFullname.test(fullname) === false) {
      ToastAndroid.show(t('common:fullname') + ' ' + t('common:invalid'), 2);
      return
    } 

    axios({
      method: 'put',
      url: `${baseUrl}/profile/change-profile`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        fullname: fullname,
        birth: birth,
        gender: gender,
      }
    })
    .then((response) => {
      if(response.data.user){
        // console.log('id: ', response.data.user.id);
        dispatch(login(response.data.user, auth.tokens, auth.qr));
        ToastAndroid.show(t('common:complete'), 3)
      } else {
        ToastAndroid.show(t('common:invalid'), 3)
      }
    })
    .catch((error) => {
      ToastAndroid.show(t('common:errorOccured'), 3)
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
    <KeyboardAwareScrollView style={{paddingTop: 50}}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <ScrollView >
                <View style={styles.InputContainer}>
                    <Text style={[styles.or, {color: theme.colors.text}]}>
                        {t('common:fullname')}
                    </Text>
                    <TextInput
                    style={[styles.body, {color: theme.colors.text}]}
                    placeholder={t('common:fullname')}
                    onChangeText={setFullname}
                    value={fullname}
                    placeholderTextColor={AppStyles.color.grey}
                    underlineColorAndroid="transparent"
                    />
                </View>
                <Pressable 
                style={styles.InputContainer}
                onPress={() => showPicker()}>
                    <View >
                    <Text style={[styles.or, {color: theme.colors.text}]}>
                        {t('common:birthday')}
                    </Text>
                    <TextInput
                        style={[styles.body, {color: theme.colors.text}]}
                        placeholder={birth}
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
                    <Text style={[styles.or, {color: theme.colors.text}]}>
                        {t('common:gender')}
                    </Text>
                    <Picker
                    selectedValue={gender}
                    style={[styles.gender, {color: theme.colors.text}]}
                    placeholder={gender}
                    onValueChange={(itemValue, itemIndex) => setGender(itemValue)} >
                    <Picker.Item label={t('common:male')} value="Male" />
                    <Picker.Item label={t('common:female')} value="Female" />
                    <Picker.Item label={t('common:other')} value="Other" />
                    </Picker>
                </View>
                <Button 
                uppercase={true}
                mode="text" 
                onPress={SaveChange}
                style={[styles.loginContainer, {backgroundColor: theme.colors.primary}]}
                labelStyle={[styles.loginText, {color: theme.colors.text}]}
                >
                {t('common:save')}
                </Button>
            </ScrollView>
        {/* // </TouchableWithoutFeedback> */}
    </KeyboardAwareScrollView>
    
  );
}

const styles = StyleSheet.create({
  or: {
    marginTop: 10,
    paddingLeft: 20,
    marginBottom: 5,
  },
  InputContainer: {
    width: (SCREEN_WIDTH*0.8),
    marginTop: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'grey',
    borderRadius: 10,
    alignSelf: 'center',
    fontSize: 21
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 20
  },
  gender: {
    height: 42,
    marginBottom: 10,
    marginTop: -7,
    marginLeft: 3,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',
    fontSize: 20
  },
  loginContainer: {
    width: (SCREEN_WIDTH*0.8),
    borderRadius: 10,
    padding: 5,
    marginTop: 30,
    alignSelf: 'center',
  },
  loginText: {
    fontFamily: 'Roboto',
    fontSize: 21,
  },
});

export default ProfileSetting;
