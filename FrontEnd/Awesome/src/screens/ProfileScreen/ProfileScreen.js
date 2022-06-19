import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ToastAndroid
} from 'react-native';
import { AppIcon, SCREEN_HEIGHT } from '../../utils/AppStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import { login } from '../../reducers';
import { useTheme, TouchableRipple } from 'react-native-paper';
import overlay from '../../utils/overlay';
import { useTranslation } from 'react-i18next';
import {launchImageLibrary} from 'react-native-image-picker';
import FormData from 'form-data'
import { baseUrl } from '../../utils/Configuration';
import Spinner from 'react-native-loading-spinner-overlay';

function ProfileScreen(props) {
  // var CryptoJS = require("crypto-js");
  const theme = useTheme()
  const backgroundColor = overlay(2, theme.colors.surface);
  const auth = useSelector((state) => state.auth);
  const { t } = useTranslation()
  const [selectedFile, setSelectedFile] = useState({ uri: undefined})
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleSelectFile = () => {
    const options = {
      mediaType: 'mixed'
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        return null;
      } else if (response.assets && response.assets.length !== 0) {
        const uri = response.assets[0].uri;
        const fileName = response.assets[0].fileName;
        const type = response.assets[0].type;
        if (uri && fileName) {
          // console.log('uri: ' + uri + '\nfileName: ' + fileName + '\ntyoe: ' +type)
          const file = {
            name: fileName,
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            type: type || 'video/quicktime'
          };
          if(file) {
            setSelectedFile(() => file);
            sendMedia(file)
          }
          // console.log('uri: ' + uri + '\nfileName: ' + fileName + '\ntyoe: ' +type)
        }
      }
    });
  };

  const sendMedia = file => {
    setLoading(true)
    const formData = new FormData();

    formData.append("user-avatar", {
      uri: file.uri,
      type: file.type,
      name: file.name,
    })
    
    axios({
      method: 'post',
      url: `${baseUrl}/profile/change-avatar`,
      headers: {
        Accept: 'application/json',
        "Authorization" : `Bearer ${auth.tokens.access.token}`,
        "Content-Type": 'multipart/form-data',
      }, 
      data: formData
    })
    .then(response => {
      if(response.data){
        ToastAndroid.show(t('common:complete'), 3);
        dispatch(login(response.data.user, auth.tokens, auth.qr));
        setLoading(false)
      } else {
        ToastAndroid.show(t('common:errorOccured'), 3);
        setLoading(false)
      }
    })
    .catch(function (error) {
      ToastAndroid.show(t('common:errorOccured'), 3);
      setLoading(false)
    });
  }

  const editProfile = () => {
    props.navigation.navigate('ProfileSetting')
  }

  const myQR = () => {
    props.navigation.navigate('QRProfileScreen', { groupQR: undefined, groupName: undefined })
  }

  return (
    <KeyboardAwareScrollView>
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
        <ScrollView style={[styles.container, {backgroundColor: backgroundColor}]}>
            <TouchableRipple onPress={handleSelectFile}>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 23, flex: 23, color: theme.colors.text}]}>Avatar</Text>
                <Image style={[styles.avatar,{flexGrow: 5,flex: 5}]} source={{uri: selectedFile.uri ?? auth.user?.avatar} ?? AppIcon.images.personalAvatar}/>
                <Icon
                  style={[styles.chevronRight, {color: theme.colors.text, flex: 2, flexGrow: 2}]}
                  name='chevron-right'
                />
              </View>
            </TouchableRipple>
            <TouchableRipple>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 1, flex: 1, color: theme.colors.text}]}>{t('common:fullname')}</Text>
                <Text numberOfLines={2} style={[styles.rightText, {color: theme.colors.text, flex: 2, flexGrow: 2}]}>{auth.user?.fullname ?? t('common:fullname')}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 1, flex: 1, color: theme.colors.text}]}>Username</Text>
                <Text numberOfLines={2} style={[styles.rightText, {color: theme.colors.text, flex: 2, flexGrow: 2}]}>{'@' + auth.user?.username ?? '@username'}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 1, flex: 1, color: theme.colors.text}]}>Email</Text>
                <Text numberOfLines={2} style={[styles.rightText, {color: theme.colors.text, flex: 3, flexGrow: 3}]}>{auth.user?.email ?? 'user@email.com'}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 2, flex: 2, color: theme.colors.text}]}>{t('common:birthday')}</Text>
                <Text numberOfLines={2} style={[styles.rightText, {color: theme.colors.text, flex: 3, flexGrow: 3}]}>{auth.user?.birth ?? ''}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 2, flex: 2, color: theme.colors.text}]}>{t('common:gender')}</Text>
                <Text numberOfLines={2} style={[styles.rightText, {color: theme.colors.text, flex: 3, flexGrow: 3}]}>{auth.user?.gender == 'male' ? t('common:male') : (auth.user?.gender == 'female' ? t('common:female') : t('common:other'))}</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={myQR}>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 20, flex: 20, color: theme.colors.text}]}>QR Code</Text>
                <Icon
                  style={[styles.rightText, {color: theme.colors.text, flex: 8, flexGrow: 8, fontSize: 30}]}
                  name='qrcode'
                />                  
                <Icon
                  style={[styles.chevronRight, {color: theme.colors.text, flex: 2, flexGrow: 2}]}
                  name='chevron-right'
                />
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={editProfile}>
            <View style={styles.subContainer}>
              <Text style={[styles.leftText, {flexGrow: 28, flex: 28, color: theme.colors.text}]}>{t('common:editProfile')}</Text>
              <Icon
                style={[styles.chevronRight, {color: theme.colors.text, flex: 2, flexGrow: 2}]}
                name='chevron-right'
              />
            </View>
          </TouchableRipple>
        </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: SCREEN_HEIGHT
  },
  subContainer: {
    flex: 1, 
    flexDirection: 'row', 
    paddingLeft: 20, 
    paddingRight: 5,
    paddingVertical: 15, 
    // backgroundColor: 'blue',
    borderBottomWidth: 0.3
  },
  leftText: {
    // backgroundColor: 'red', 
    fontSize: 21, 
    alignSelf: 'center'
  },
  rightText: {
    fontSize: 21, 
    textAlign: 'right',
    // backgroundColor: 'green',
    alignSelf: 'center',
    paddingRight: 10
  },
  chevronRight: {
    // backgroundColor: 'yellow',
    alignSelf: 'center',
    fontSize: 20
  },
  avatar: {
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderWidth: 0.2,
    borderRadius: 10,
    borderColor: 'gray',
    alignSelf:'center',
  },
});

export default ProfileScreen