import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ToastAndroid
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { SCREEN_HEIGHT, AppIcon } from '../../utils/AppStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios';
import {useSelector} from 'react-redux';
import { useTheme, Switch, TouchableRipple, Portal } from 'react-native-paper';
import overlay from '../../utils/overlay';
import { useTranslation } from 'react-i18next';
import { baseUrl } from '../../utils/Configuration';
import { InputDialog, ConfirmDialog } from '../../components/Dialog';
import { PreferencesContext } from '../../context/PreferencesContext';

function GroupInfoScreen(props) {
  const theme = useTheme()
  const backgroundColor = overlay(2, theme.colors.surface);
  const auth = useSelector((state) => state.auth);
  const { t } = useTranslation()
  const [group, setGroup] = useState();
  const [joinStatus, setJoinStatus] = useState();
  const [loading, setLoading] = useState(true);
  const groupId = props.route.params.groupId
  const [createGroupName, setCreateGroupName] = useState('')
  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [leaveVisible, setLeaveVisible] = useState(false);
  const { load, toggleLoad} =  React.useContext(PreferencesContext); 

  useEffect(() => {
    getGroupProfile()

    // return () => {
    //   // setGroup()
    //   // setJoinStatus()
    // };
  }, [load])

  const getGroupProfile = () => {
    axios({
        method: 'get',
        url: `${baseUrl}/group/getGroupById/` + groupId,
        headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
        data: {}
    })
      .then((response) => {
        if(response.data) {
          setGroup(response.data)
          setJoinStatus(response.data.status)
          setLoading(false)
        } else {
          ToastAndroid.show(t('common:empty'), 3);
        }
      })
      .catch(function (error) {
        ToastAndroid.show(t('common:errorOccured'), 3);
    });
  }

  const groupMemberList = () => {
    axios({
        method: 'get',
        url: `${baseUrl}/group/searchMember?key&groupId=` + groupId,
        headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
        data: {}
    })
      .then((response) => {
        if(response.data) {
          props.navigation.navigate('GroupMemberList', { memberList: response.data.results, groupId: group._id, isAdmin: (group.admin.username == auth.user.username)});
        } else {
          ToastAndroid.show(t('common:empty'), 3);
        }
      })
      .catch(function (error) {
        ToastAndroid.show(t('common:errorOccured'), 3);
    });
  }

  const groupQR = () => {
    axios({
        method: 'get',
        url: `${baseUrl}/group/qrGroup/` + groupId,
        headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
        data: {}
    })
      .then((response) => {
        if(response.data) {
            props.navigation.navigate('QRProfileScreen', { groupQR: response.data.qr, groupName: group.groupName});
        } else {
          ToastAndroid.show(t('common:empty'), 3);
        }
      })
      .catch(function (error) {
        ToastAndroid.show(t('common:errorOccured'), 3);
    });
  }

  const changeJoinStatus = async() => {
    await axios({
        method: 'put',
        url: `${baseUrl}/group/setStatusJoin`,
        headers: {
            Accept: 'application/json',
            "Authorization" : `Bearer ${auth.tokens.access.token}`,
            "Content-Type": 'application/json',
        }, 
        data: {
            groupId: groupId, 
            status: joinStatus == "close" ? "open" : "close"
        }
      })
      .then(function(response) {
        if(response.data) {
          ToastAndroid.show(t('common:complete'), 3);
            setJoinStatus(response.data.status)
        } else {
          ToastAndroid.show(t('common:empty'), 3);
        }
      })
      .catch(function (error) {
        ToastAndroid.show(t('common:errorOccured'), 3);
    });
  }

  const changeNameGroup = async() => {
    if(group.admin.username !== auth.user.username)
      return
    if((!createGroupName)||(createGroupName=='')||(createGroupName.length==0))
      return
    toggeDialog()
    await axios({
      method: 'post',
      url: `${baseUrl}/group/changeNameGroup`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        groupId: groupId,
        groupName: createGroupName
      }
    })
    .then(response => {
      if(response.data ) {
        ToastAndroid.show(t('common:complete'), 3);
        setCreateGroupName('')
        getGroupProfile()
      } else {
        ToastAndroid.show(t('common:empty'), 3);
      }
    })
    .catch(err => {
      ToastAndroid.show(t('common:errorOccured'), 3);
    })
  }

  const toggeDialog = () => {
    if(group.admin.username !== auth.user.username)
      return
    setDialogVisible(!dialogVisible);
  };

  const toggeConfirmDialog = () => {
    setConfirmVisible(!confirmVisible)
  };

  const toggeLeaveDialog = () => {
    setLeaveVisible(!leaveVisible)
  };

  const deleteGroup = async() => {
    toggeConfirmDialog()
    await axios({
      method: 'delete',
      url: `${baseUrl}/group/adminDeleteGroup`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        groupId: groupId
      }
    })
    .then(response => {
      toggleLoad()
      ToastAndroid.show(t('common:complete'), 3);
      props.navigation.reset({
        routes: [{ name: 'Messages', params: auth.user.id}],
      });
    })
    .catch(err => {
      ToastAndroid.show(t('common:errorOccured'), 3);
    })
  }

  const leaveGroup = async() => {
    toggeLeaveDialog()
    await axios({
      method: 'delete',
      url: `${baseUrl}/group/deleteGroup`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        groupId: [groupId]
      }
    })
    .then(response => {
      toggleLoad()
      ToastAndroid.show(t('common:complete'), 3);
      props.navigation.reset({
        routes: [{ name: 'Messages', params: auth.user.id}],
      });
    })
    .catch(err => {
      ToastAndroid.show(t('common:errorOccured'), 3);
    })
  }

  return (
    <KeyboardAwareScrollView>
      {
        (loading)?
        <Spinner
          cancelable={true}
          color={theme.colors.primary}
          visible={loading}
        />     
        :
        <ScrollView style={[styles.container, {backgroundColor: backgroundColor}]}>
            <Portal>
              <InputDialog 
              visible={dialogVisible} toggleDialog={toggeDialog} 
              createGroup={changeNameGroup} setCreateGroupName={setCreateGroupName}
              title={t('common:groupName')}
              />
            </Portal>
            <Portal>
              <ConfirmDialog 
              visible={confirmVisible} toggleDialog={toggeConfirmDialog} 
              deleteGroup={deleteGroup} title={t('common:deleteGroup')}
              />
            </Portal>
            <Portal>
              <ConfirmDialog 
              visible={leaveVisible} toggleDialog={toggeLeaveDialog} 
              deleteGroup={leaveGroup} title={t('common:leaveGroup')}
              />
            </Portal>
            <TouchableRipple>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 23, flex: 23, color: theme.colors.text}]}>{t('common:avatar')}</Text>
                <Image style={[styles.avatar,{flexGrow: 5,flex: 5}]} source={AppIcon.images.publicAvatar}/>
                <Icon
                  style={[styles.chevronRight, {color: theme.colors.text, flex: 2, flexGrow: 2}]}
                  name='chevron-right'
                />
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={toggeDialog}>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 9, flex: 9, color: theme.colors.text}]}>{t('common:info')}</Text>
                <Text numberOfLines={2} style={[styles.rightText, {color: theme.colors.text, flex: 19, flexGrow: 19}]}>{group.groupName}</Text>
                <Icon
                  style={[styles.chevronRight, {color: theme.colors.text, flex: 2, flexGrow: 2}]}
                  name='chevron-right'
                />
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={groupMemberList}>
              <View style={styles.subContainer}>
                <Text style={[styles.leftText, {flexGrow: 20, flex: 20, color: theme.colors.text}]}>{t('common:member')}</Text>
                <Text style={[styles.rightText, {color: theme.colors.text, flex: 8, flexGrow: 8}]}>{group.countMember}</Text>
                <Icon
                  style={[styles.chevronRight, {color: theme.colors.text, flex: 2, flexGrow: 2}]}
                  name='chevron-right'
                />
              </View>
            </TouchableRipple>
            {
              (group.admin.username == auth.user.username) ? 
              <TouchableRipple onPress={changeJoinStatus}>
                <View style={styles.subContainer}>
                  <Text style={[styles.leftText, {flexGrow: 20, flex: 20, color: theme.colors.text}]}>{t('common:joinStatus')}</Text>
                  <View pointerEvents="none" style={[styles.rightText, {color: theme.colors.text, flex: 10, flexGrow: 10, paddingRight: 10}]}>
                    <Switch value={joinStatus === "open"} />
                  </View>
                </View>
              </TouchableRipple>
              : <></>
            }
            {
              (joinStatus == "open") ? 
              <TouchableRipple onPress={groupQR}>
                <View style={styles.subContainer}>
                  <Text style={[styles.leftText, {flexGrow: 20, flex: 20, color: theme.colors.text}]}>{t('common:qrCode')}</Text>
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
              :
              <></>
            }
            {
              ((group.admin.username == auth.user.username)&&(group.countMember<2)) ?
              <TouchableRipple onPress={toggeConfirmDialog}>
                <View style={styles.subContainer}>
                  <Text style={[styles.leftText, {flexGrow: 28, flex: 28, color: 'red'}]}>{t('common:deleteGroup')}</Text>
                  <Icon
                    style={[styles.chevronRight, {color: 'red', flex: 2, flexGrow: 2}]}
                    name='chevron-right'
                  />
                </View>
              </TouchableRipple> : <></>
            }
            {
              (group.countMember>1) ?
              <TouchableRipple onPress={toggeLeaveDialog}>
                <View style={styles.subContainer}>
                  <Text style={[styles.leftText, {flexGrow: 28, flex: 28, color: 'red'}]}>{t('common:leaveGroup')}</Text>   
                  <Icon
                    style={[styles.chevronRight, {color: 'red', flex: 2, flexGrow: 2}]}
                    name='chevron-right'
                  />
                </View>
              </TouchableRipple> : <></>
            }
        </ScrollView>
      }
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
      borderWidth: 1,
      borderRadius: 10,
      borderColor: 'gray',
      alignSelf:'center',
    },
  });
  

export default GroupInfoScreen