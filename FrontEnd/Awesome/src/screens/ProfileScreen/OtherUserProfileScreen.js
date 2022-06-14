import React, { useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ToastAndroid
} from 'react-native';
import { Button } from 'react-native-paper';
import { AppStyles, SCREEN_HEIGHT } from '../../utils/AppStyles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios';
import {useSelector} from 'react-redux';
import { useTheme, Menu } from 'react-native-paper';
import overlay from '../../utils/overlay';
import { useTranslation } from 'react-i18next';
import { baseUrl } from '../../utils/Configuration';
import { PreferencesContext } from '../../context/PreferencesContext';

export function OtherUserProfileScreen(props) {
  const theme = useTheme()
  const backgroundColor = overlay(2, theme.colors.surface);
  const { t } = useTranslation()
  const auth = useSelector((state) => state.auth);
  const [visible, setVisible] = React.useState(false);
  const [isFriend, setIsFriend] = useState(props.route.params.isFriend)
  const { otherUserFullname, otherUserEmail, otherUserAvatar, otherUserId} = props.route.params;
  const { toggleLoad } = React.useContext(PreferencesContext);

  const addFriend = () => {
    axios({
      method: 'post',
      url: `${baseUrl}/friend/add-friend`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        friendId: otherUserId
      }
    })
    .then((response) => {
      if(response) 
      {
        setIsFriend(2);
        toggleLoad()
        ToastAndroid.show(t('common:complete'), 3);
      }
    })
    .catch(function (error) {
      ToastAndroid.show(t('common:errorOccured'), 3);
    });
  }

  const acceptFriendReq = () => {
    axios({
      method: 'post',
      url: `${baseUrl}/friend/accept-friend`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        friendId: otherUserId
      }
    })
    .then((response) => {
      if(response) 
      {
        toggleLoad()
        setIsFriend(1);
        ToastAndroid.show(t('common:complete'), 3);
      }
    })
    .catch(function (error) {
      ToastAndroid.show(t('common:errorOccured'), 3);
    });
  }

  const deleteFriendReq = () => {
    axios({
      method: 'delete',
      url: `${baseUrl}/friend/delete-invtiation`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        friendId: otherUserId
      }
    })
    .then((response) => {
      if(response) 
      {
        toggleLoad()
        setIsFriend(0);
        ToastAndroid.show(t('common:complete'), 3);
      }
    })
    .catch(function (error) {
      ToastAndroid.show(t('common:errorOccured'), 3);
    });
  }

  const deleteFriend = () => {
    axios({
      method: 'post',
      url: `${baseUrl}/friend/unfriend`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        friendId: otherUserId
      }
    })
    .then((response) => {
      if(response) 
      {
        toggleLoad()
        setIsFriend(0);
        ToastAndroid.show(t('common:complete'), 3);
      }
    })
    .catch(function (error) {
      ToastAndroid.show(t('common:errorOccured'), 3);
    });
  }

  const createMessage = () => {
    axios({
      method: 'post',
      url: `${baseUrl}/group/createChat`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        memberId: [otherUserId]
      }
    })
    .then((response) => {
      if(response.data) 
      {
        // console.log('createMessage >> ' + JSON.stringify(response.data))
        // props.navigation.dispatch(
        //   CommonActions.navigate({
        //     name: 'Chat',
        //     params: {
        //       groupName: otherUserFullname,
        //       groupId: response.data.id,
        //       groupType: 'personal',
        //       friendId: otherUserId,
        //       userId: auth.user.id,
        //     },
        //   })
        // );
        props.navigation.replace('Chat', { 
          groupName: otherUserFullname,
          groupId: response.data.id,
          groupType: 'personal',
          friendId: otherUserId,
          userId: auth.user.id,
        });
      }
    })
    .catch(function (error) {
      ToastAndroid.show(t('common:errorOccured'), 3);
    });
  }

  return (
    <KeyboardAwareScrollView>
        <ScrollView style={[styles.container, {backgroundColor: backgroundColor}]}>
          <View style={[styles.header, {backgroundColor: theme.colors.primary }]}></View>
          <Image style={styles.avatar} source={{uri: otherUserAvatar ?? '../../../assets/images/none_avatar.png'}}/>
          <View style={[styles.body, {backgroundColor: backgroundColor}]}>
            <View style={[styles.bodyContent, {backgroundColor: backgroundColor}]}>
              <Text style={[styles.name, {color: theme.colors.text}]}>{otherUserFullname ?? 'Fullname'}</Text>
              {/* <Text style={styles.description}>{auth.user?.birth ?? ''}</Text> */}
              <Text style={[styles.description, {color: theme.colors.text}]}>{otherUserEmail ?? ''}</Text>
              
            <View style={styles.buttonBody}>
              {isFriend == 1? (
              <Button
                  uppercase={false}
                  mode='text'
                  style={styles.loginContainer}
                  labelStyle={[styles.loginText, {color: theme.colors.text}]}
                  onPress={createMessage}
                  >
                  {t('common:message')}
              </Button>          
              ) : isFriend == 0? (
                <Button
                    mode='text'
                    uppercase={false}
                    style={styles.loginContainer}
                    labelStyle={[styles.loginText, {color: theme.colors.text}]}
                    onPress={addFriend}
                    >
                    {t('common:addFriend')}
                </Button>          
                ) : isFriend == 2? (
                  <Button
                      mode='text'
                      uppercase={false}
                      style={styles.loginContainer}
                      labelStyle={[styles.loginText, {color: theme.colors.text}]}
                      onPress={deleteFriendReq}
                      >
                      {t('common:sentFriendReq')}
                  </Button>          
                  ) : (
                    <Text
                        // mode='text'
                        // uppercase={false}
                        style={[styles.loginContainer, {backgroundColor: theme.colors.background, color: theme.colors.text, padding: 12}]}
                        labelStyle={[styles.loginText, {color: theme.colors.text}]}
                        >
                        {t('common:receiveFriendReq')}
                    </Text>          
                    )}
              {isFriend == 3?
                <Icon 
                  name='check'
                  size={21}
                  color={theme.colors.primary}
                  style={[styles.friendshipIcon, {borderColor: theme.colors.primary}]}
                  onPress={acceptFriendReq}
                /> : <></>
              }
              {isFriend == 3?
                <Icon 
                  name='times'
                  size={21}
                  color='red'
                  style={[styles.friendshipIcon, {borderColor: 'red'}]}
                  onPress={deleteFriendReq}
                /> : <></>
              }
              {isFriend == 1? <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={<Icon 
                  name='ellipsis-h'
                  size={21}
                  color={theme.colors.primary}
                  style={[styles.friendshipIcon, {borderColor: theme.colors.primary}]}
                  onPress={() => setVisible(true)}
                />}
              >
                <Menu.Item onPress={deleteFriend} title={t('common:deleteFriend')} />
              </Menu> : <></>}
            </View>
            </View>
        </View>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
    header:{
      height:200,
    },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'gray',
      marginBottom:10,
      alignSelf:'center',
      position: 'absolute',
      marginTop:130,
      zIndex: 9999,
      backgroundColor: 'white'
    },
    body:{
      marginTop:40,
      height: SCREEN_HEIGHT - 320
    },
    bodyContent: {
      flex: 1,
      alignItems: 'center',
      padding:30,
    },
    name:{
      fontSize:28,
      fontWeight: "600"
    },
    description:{
      fontSize:16,
      marginTop:10,
      textAlign: 'center'
    },
    buttonBody:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // flex:1
    },
    friendshipIcon: {
      maxWidth: 40,
      borderRadius: 10,
      borderWidth: 1,
      alignSelf:'center',
      alignItems: 'center',
      alignContent: 'center',
      textAlign: 'center',
      flexGrow: 1,
      backgroundColor: 'transparent',
      justifyContent: 'center',
      padding: 10,
      marginTop: 15,
      marginLeft: 5,
      flex: 1,
    },
    // loginContainer: {
    //   width: AppStyles.buttonWidth.main,
    //   backgroundColor: AppStyles.color.tint,
    //   borderRadius: 10,
    //   padding: 10,
    //   marginTop: 15,
    //   alignSelf: 'center',
    //   flex: 9,
    //   flexGrow: 9
    // },
    loginContainer: {
      width: AppStyles.buttonWidth.main,
      backgroundColor: AppStyles.color.tint,
      borderRadius: 10,
      padding: 10,
      marginTop: 30,
      alignSelf: 'center',
      flex: 9,
      flexGrow: 9,
      marginTop: 15,
    },
    loginText: {
      color: AppStyles.color.white,
      fontFamily: 'Roboto',
      fontSize: 16
    },
});

export default OtherUserProfileScreen