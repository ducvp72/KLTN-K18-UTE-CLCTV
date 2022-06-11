import React, { useState, useEffect, useLayoutEffect} from 'react';
import { StyleSheet, Text, View,Image,FlatList} from 'react-native';
import { Searchbar, useTheme, Menu, TouchableRipple, Dialog, Portal, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Spinner from 'react-native-loading-spinner-overlay';
import { CommonActions } from '@react-navigation/native';
import {connect, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
// import Toast from 'react-native-simple-toast';
import overlay from "../../utils/overlay";
import { useTranslation } from 'react-i18next';
import { PreferencesContext } from '../../context/PreferencesContext';
import { baseUrl, socketUrl } from '../../utils/Configuration';
import { onDisplayNotification, sendSingleDeviceNotification } from '../../utils/notificationFCM'
import {Voximplant} from 'react-native-voximplant';
import { AppIcon } from '../../utils/AppStyles';
// import { io } from 'socket.io-client';
// import Dialog from "react-native-dialog";
// import { Dialog } from '../../components/Dialog';
// import { Header } from '../../navigations/StackNavigator';
import { ConfirmDialog, InputDialog } from '../../components/Dialog';

function HomeScreen(props) {
  var CryptoJS = require("crypto-js");
  // console.log('PROPS: ' + props.user.id)
  const { load, socketContext, createSocketContext } =  React.useContext(PreferencesContext);

  // const [socket, setSocket] = useState(io(socketUrl, {
  //   auth: {
  //     userId: props.user.id
  //   },
  // }));

  const theme = useTheme();
  const backgroundColor = overlay(2, theme.colors.surface);
  const { t } = useTranslation()
  const auth = useSelector((state) => state.auth);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  const [lastMessages, setLastMessages] = useState([])
  const [id, setId] = useState('')
  const [visible, setVisible] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const voximplant = Voximplant.getInstance();
  const [createGroupName, setCreateGroupName] = useState('')

  const toggeDialog = () => {
    setDialogVisible(!dialogVisible);
  };

  useEffect(() => {
    // props.navigation.navigate('Messages', { pagrams: props.user.id });
    // props.navigation.setOptions({
    //   title: 'KEC',
    //   header: ({ scene, previous, navigation }) => (
    //     <Header scene={scene} previous={previous} navigation={navigation} friendId={'H'} groupName={'H'} groupType={'H'} groupId={'H'} showDialog={'H'}/>
    //   ),
    // })
    if((!auth.user)||(!props.user.id)||(props.user.id == undefined)) {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'SignInStack' },
          ],
        })
      );
    } else {
      AsyncStorage.getItem('@loggedInUserID:id').then((response) => {
        if(response) {
          setId(response)

        }
      })
      loadLastMess()
    }

    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvent => {
      props.navigation.navigate('IncomingCallScreen', {call: incomingCallEvent.call});
    });

    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, []);

  // useEffect(() => {
  //   if (!socket) return;

  //   socket.on('connect', () => {
  //     console.log('SOCKET ON CONNECT - HOME')
  //   });
  //   socket.on('disconnect', () => {
  //     console.log('SOCKET DISCONNECT - HOME')
  //   });
  // }, [socket]);

  useEffect(() => {
    if (!socketContext) return;

    socketContext.on('connect', () => {
      console.log('socketContext ON CONNECT - HOME')
    });
    socketContext.on('disconnect', () => {
      createSocketContext(auth.user.id)
    });
  }, [socketContext]);

  useEffect(() => {
    socketContext.on('room:chat', (message) => {
      if(message)
        console.log('ON ROOM:CHAT ' + props.user.fullname + ' RECEIVE ' + JSON.stringify(message))

        const nofiText = (message.text ? (CryptoJS.AES.decrypt(message.text, message.groupId)).toString(CryptoJS.enc.Utf8) : 'Media message')
        const nofiGroup = (message.groupType != "personal" ? message.groupName : message.user.name)
        const nofiMessage = (message.groupType === "personal" ? '' : `${message.user.name}: `) + `${nofiText}`
        console.log('nofiText >>> ' + nofiText)
        onDisplayNotification(message.groupId, nofiGroup, nofiMessage)
        // AsyncStorage.getItem('@loggedInUserID:messageToken').then((response) => {
        //   sendSingleDeviceNotification(nofiGroup, nofiMessage, response, message.groupId)
        // })

        setTimeout(() => {
          loadLastMess()
        },1000)

    });

  }, [socketContext])

  useEffect(() => {
    loadLastMess()
  }, [load])

  const loadLastMess = () => {
    console.log('LOAD LAST MESS ' + props.user.fullname)
    AsyncStorage.getItem('@loggedInUserID:access').then((response) => {
      axios({
        method: 'get',
        url: `${baseUrl}/message/ListLast?key`,
        headers: {"Authorization" : `Bearer ${response}`}, 
        data: {}
      })
      .then(function(res) {
  
        if(res.data)
          setLastMessages(res.data.sort(function (a, b) {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          }));  
        setLoading(false)
      })
      .catch(function(err) {
        const { message } = error;
        Alert.alert(message);
        setLoading(false)
      })
    })
  }

  const onChangeSearch = (query) => {
    console.log('search query: ', query)
    setCurrentPage(0)
    setTotalPage(1)
    setIsSearching(false)
    setLoading(false)
    setSearchResult([])
    setSearchQuery(query);
  } 

  const createGroup = async() => {
    if((!createGroupName)||(createGroupName=='')||(createGroupName.length==0))
      return
    toggeDialog()
    await axios({
      method: 'post',
      url: `${baseUrl}/group/createGroup`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        groupName: createGroupName
      }
    })
    .then(response => {
      if(response.data ) {
        setCreateGroupName('')
        loadLastMess()
      } else {
        console.log("createGroup >>> " + response)
      }
    })
    .catch(err => {
      console.log("createGroup >>> " + err)
    })
  }

  const SearchItemView = ({ item }) => {
    return (
      <TouchableRipple onPress={() => getItem(item.fullname, item.email, item.avatar, item.isFriend, item.userId)}>
      <View style={[styles.itemStyle, {backgroundColor: backgroundColor}]} >
        <Image source={{uri: item.avatar} }  
        style={styles.userPhoto} 
        />
        <View style={styles.userInfo} >
          <Text style={[styles.userFullname, {color: theme.colors.text }]} >
            {item.fullname}
          </Text>
          <Text style={[styles.userUsername, {color: theme.colors.text }]} >
            {'@'}{item.username ?? item.subname}
          </Text>
        </View>
        <Icon 
          name={item.isFriend == 0 ? 'user-times' : (item.isFriend == 1 ? 'user-check' : 'user-clock')}
          size={20}
          color={item.isFriend == 1 ? theme.colors.primary : theme.colors.text}
          style={[styles.friendshipIcon]}
          onPress={() => friendshipPress(item.isFriend)}
        />
      </View>
      </TouchableRipple>

    );
  };

  const ConvertTime = (time) => {
    // console.log('time ' + time)
    if(time < 60)
      return Math.round(time) + 'm'
    else if(time < 1440)
      return Math.round(time/60) + 'h'
      else if(time < 10080)
        return Math.round(time/1440) + 'd'
        else return Math.round(time/10080) + 'w'
  }

  const MessagesItemView = ({ item }) => {
    // console.log('MESS ITEM ' + props.user.fullname + ' ' + JSON.stringify(item))
    let member
    let groupName
    if(item.groupType === 'personal')
    {
      member = item.member[0].id == id? item.member[1] : item.member[0]
      groupName = item.member[0].id == id? item.member[1].fullname : item.member[0].fullname
    } else {
      member = item.admin
      groupName = item.groupName
    }
    // console.log('ITEM: ' + item.member[0].id)

    const updatedAt = (new Date().getTime() - new Date(item.lastMessage.updatedAt). getTime())/60000

    return (
      <TouchableRipple onPress={() => getMessage(groupName,item._id,item.admin,item.groupType, member.id)} >
      <View style={[styles.itemStyle, {backgroundColor: backgroundColor}]} >
        <Image source={item.groupType == 'personal' ? {uri: member.avatar} : AppIcon.images.publicAvatar}  
        style={styles.userPhoto} 
        />
        <View style={styles.userInfo} >
          <Text numberOfLines={1} style={[styles.userFullname, {color: theme.colors.text }]} >
            {groupName}
          </Text>
          <View style={styles.userMessage}>
            <Text numberOfLines={1} style={[styles.userUsername, {color: theme.colors.text }]} >
              {item.lastMessage.sender == id ? `${t('common:you')}: ` : ''}
              {item.lastMessage.text != 'null' ? (CryptoJS.AES.decrypt(item.lastMessage.text, item._id)).toString(CryptoJS.enc.Utf8) : 'Media message'}
            </Text>
            <Text style={[styles.userMessageTime, {color: theme.colors.text }]} >
              {ConvertTime(updatedAt)}
            </Text>
          </View>
        </View>
        {/* {item.groupType === 'public' ?
        <Menu
          visible={item._id == visible}
          onDismiss={() => setVisible(false)}
          anchor={
            item.groupType === 'public' ?
            <View style={{justifyContent: 'center',alignItems: 'center',flex:1}}>
              <Icon 
                name='ellipsis-h'
                size={20}
                color={theme.colors.text}
                style={[styles.friendshipIcon]}
                onPress={() => setVisible(item._id)}
              />
            </View> : <></>
          }>
          <Menu.Item onPress={() => {}} title={t('common:deleteChat')} />
        </Menu> : <></>
        } */}

      </View>
      </TouchableRipple>
    );
  };

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          width: '100%',
          backgroundColor: backgroundColor,
        }}>
      </View>
    );
  };

  const getItem = (fullname, email, avatar, isFriend, id) => {
    // console.log('Id : ' + item.userId + ' Fullname : ' + item.fullname);
    props.navigation.navigate('OtherUserProfile', { 
      otherUserFullname: fullname,
      otherUserEmail: email,
      otherUserAvatar: avatar,
      isFriend: isFriend,
      otherUserId: id
    });
  };

  const getMessage = (groupName, groupId, admin, groupType, friendId) => {
    // console.log(item)

    props.navigation.navigate('Chat', { 
      groupName: groupName,
      groupId: groupId,
      groupAdmin: admin,
      groupType: groupType,
      friendId: friendId,
      userId: id,
      // socket: socket
    });
  };

  const friendshipPress = (friendship) => {
    console.log(friendship)
  }
  
  const queryMoreMessages = async(token) => {
    return new Promise(function (resolve) {
        const newResults = [];
          
        axios({
          method: 'get',
          url: `${baseUrl}/sort/getUserClient?key=`+searchQuery+'&page='+(currentPage+1),
          headers: {"Authorization" : `Bearer ${token}`}, 
          data: {}
        })
        .then(function (response) {
          // setCurrentPage(currentPage + 1)
          setCurrentPage(response.data.page)
          setTotalPage(response.data.totalPages)
          if(response.data.totalResults != 0){
            response.data.results.forEach(element => {
              newResults.push(element)
            });
            setSearchResult((kq) => {
              return kq.concat(newResults)
            })
            console.log('Trang: ' + response.data.page +' tim duoc ' + response.data.totalResults)
            setLoading(false)
    
          } else {
            setLoading(false)
            setIsSearching(false)
            console.log('Khong tim duoc ', response.data.totalResults)
          }
        })
        .catch(function (error) {
            setLoading(false)
            setIsSearching(false)
            const { message } = error;
            console.log(message);
        });

        setTimeout(function () {
            resolve(newResults);
        }, 100);
    });
  };

  const onSearch = async() => {
      if(searchQuery.length <= 0) return
      if(currentPage == totalPage) {
        console.log('Day la trang cuoi')
        return
      }
      console.log('Da tim kiem ', searchQuery)
      if(searchQuery.length >= 0)
      {
        await AsyncStorage.getItem('@loggedInUserID:access').then((response) => {
          setIsSearching(true)
          setLoading(true)

          queryMoreMessages(response).then((results) => {
            console.log('Kq: ' + results)
          })
        })

      }
  }

  return (
      < >
        <Portal>
          <InputDialog 
          visible={dialogVisible} toggleDialog={toggeDialog} createGroup={createGroup} 
          setCreateGroupName={setCreateGroupName} title={t('common:createGroup')}
          />
        </Portal>

        <Searchbar style={[styles.searchbar, {backgroundColor: backgroundColor}]}
          placeholder={t('common:search')}
          onChangeText={(query) => onChangeSearch(query)}
          value={searchQuery}
          onIconPress={onSearch}
          onSubmitEditing={onSearch}
          onBlur={() => setIsSearching(false)}
          // onFocus={(query) => onChangeSearch(query)}
        />
        { isSearching ? (
          <View style={{paddingBottom: 52}}>
            <FlatList
            data={searchResult}
            onEndReached={onSearch}
            onEndReachedThreshold={0.1}
            // keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={SearchItemView}
            /> 
            <Spinner
              cancelable={true}
              color={theme.colors.primary}
              // overlayColor='#fff'
              //visibility of Overlay Loading Spinner
              visible={loading}
              // textContent={'Searching...'}
              // textStyle={styles.spinnerTextStyle}
            />         
          </View>
        ) : (
          <>
          <View style={styles.addGroupIcon} pointerEvents={dialogVisible ? 'none' : 'auto'}>
            <Icon
            name='plus'
            size={30}
            onPress={toggeDialog}
            />
          </View>
          <View style={{paddingBottom: 52}}>
            <FlatList
            data={lastMessages}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={MessagesItemView}
            refreshing={false}
            onRefresh={loadLastMess}
            extraData={lastMessages}
            /> 
            <Spinner
              cancelable={true}
              color={theme.colors.primary}
              visible={loading}
            />         
          </View>
          </>
        )}
        
      </>
  );
}

const styles = StyleSheet.create({
  addGroupIcon: {
    borderWidth: 2,
    borderRadius: 50,
    borderColor: 'black',
    position: 'absolute',
    zIndex: 9999,
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flex:1
  },
  dialogContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  searchbar: {
    marginBottom: 0,
    borderColor: '#B6B6B4',
    borderWidth: 1,
    borderRadius: 0,
    
  },
  scrollViewContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  centerText: {
    textAlign: "center",
  },
  button: {
    marginTop: 20,
  },
  itemStyle: {
    padding: 10,
    // margin: 0,
    backgroundColor: '#fff',
    flex:1,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#B6B6B4',
  },
  userPhoto: {
    minWidth: 50,
    minHeight: 50,
    maxHeight: 50,
    maxWidth: 50,
    margin: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignSelf:'center',
    flexGrow: 1,
    backgroundColor: 'white',
    flex: 1,
  },
  friendshipIcon: {
    margin: 5,
    alignSelf:'center',
    backgroundColor: 'transparent',
  },
  userInfo: {
    flexGrow: 8,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    paddingLeft: 5
  },
  userFullname: {
    // marginTop: 1,
    // borderWidth: 1,
    // borderColor: '#B6B6B4',
    flexGrow: 6,
    fontSize: 20,
    color: '#000',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userUsername: {
    // borderWidth: 1,
    // borderColor: 'red',
    flexGrow: 4,
    fontSize: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userMessage: {
    flexGrow: 8,
    flex: 1,
    flexDirection: 'row',
  },
  userMessageTime: {
    flexGrow: 1,
    fontSize: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    textAlign: 'right'
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);
