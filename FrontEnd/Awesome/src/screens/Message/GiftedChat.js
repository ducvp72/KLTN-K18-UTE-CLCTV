import React, { useRef, useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import Spinner from 'react-native-loading-spinner-overlay';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { Platform, View} from 'react-native';
import {renderSend, renderVideo, customtInputToolbar, CustomActions, RenderBubble, renderAvatar, renderTime} from '../../components/MessageScreenRender'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios';
import FormData from 'form-data'
import { useTranslation } from 'react-i18next';
import { PreferencesContext } from '../../context/PreferencesContext';
import { baseUrl } from '../../utils/Configuration';
import {connect, useSelector} from 'react-redux';
import { useTheme } from 'react-native-paper';

import { Header } from '../../navigations/StackNavigator';

export function Chat(props) {
  var CryptoJS = require("crypto-js");
  const theme = useTheme();
  const {t} = useTranslation()
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([]);
  const { groupName, groupId, groupAdmin, groupType, userId, friendId } = props.route.params; //no socket
  const auth = useSelector((state) => state.auth);
  const ref = useRef(null)
  
  const { toggleLoad, socketContext } =
    React.useContext(PreferencesContext);

  useEffect(() => {
    props.navigation.setOptions({
      title: groupName,
      header: ({ scene, previous, navigation }) => (
        <Header scene={scene} previous={previous} navigation={navigation} friendId={friendId} groupName={groupName} groupType={groupType} groupId={groupId}/>
      ),
    });

    axios({
      method: 'get',
      url: `${baseUrl}/message/${groupId}?sortBy=createdAt:desc&limit=30`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {}
    })
    .then(function (response) {
      setLoading(false)
      if(response.data.results){
        setMessages(() => transformMessages(response.data.results));
      } else {
        console.log('Khong co tin nhan')
      }
    })
    .catch(function (error) {
      // setAccessToken(response)
      setLoading(false)
        const { message } = error;
        console.log(message);
    });
  }, [])

  useEffect(() => {
    console.log('SOCKET CHANGE - GIFTEDCHAT')
    socketContext.on("room:chat", (message) => {
        console.log('LISTEN ON SOCKET - GIFTEDCHAT')
        if(message)
        // console.log('Tin nhan Screen Message')
          setMessages(previousMessages => GiftedChat.append(previousMessages, [transformSingleMessage(message)]))
      });
  }, [socketContext])
  
  // socket.emit("room:join", { roomId: groupId });

  const isValidMessage = (message) => {
    // return message &&
    //   message.id &&
    //   message.sentAt &&
    //   message.sender &&
    //   message.sender.uid &&
    //   message.sender.name &&
    //   message.sender.avatar &&
    //   message.category &&
    //   message.category === 'message'
    return true
  };

  const transformSingleMessage = (message) => {
    if (isValidMessage(message)) {
      // console.log('OUTPUT TRANS TYPEID: ' + message.typeId)
      let transformedMessage = {
        typeId : message.typeId,
        _id: message._id,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id != userId ? message.user._id : 1,
          name: message.user.name,
          avatar: message.user.avatar,
        },
        // sent: message.sent,
        // pending: message.pending
      }
      if (message.text != 'null' && message.text != undefined) {
        transformedMessage.text = (CryptoJS.AES.decrypt(message.text, groupId)).toString(CryptoJS.enc.Utf8)
      } else if (message.video != 'null' && message.video != undefined) {
          transformedMessage.video = (CryptoJS.AES.decrypt(message.video, groupId)).toString(CryptoJS.enc.Utf8); 
        } else {
          transformedMessage.image = (CryptoJS.AES.decrypt(message.image, groupId)).toString(CryptoJS.enc.Utf8);
        }
      return transformedMessage;
    }
    return message;
  };

  const transformSingleSentMessage = (message) => {
    if (isValidMessage(message)) {
      // console.log('OUTPUT SENT MESSAGE: ' + JSON.stringify(message))
      let transformedMessage = {
        groupId: groupId,
        groupName: groupName,
        groupType: groupType,
        _id: message._id,
        createdAt: message.createdAt,
        user: {
          _id: userId,
          name: auth.user.fullname,
          avatar: auth.user.avatar,
        },
        // sent: message.sent,
        // pending: message.pending
      }
      if (message.text != 'null') {
        transformedMessage.text = CryptoJS.AES.encrypt(message.text, groupId).toString();
      } else if (message.video != 'null') {
          transformedMessage.video = message.video; 
        } else {
          transformedMessage.image = message.image;
        }
      return transformedMessage;
    }
    return message;
  };

  const transformMessages = (messages) => {
    if (messages && messages.length !== 0) {
      const transformedMessages = [];
      for (const message of messages) {
        if (isValidMessage(message)) {
          transformedMessages.push(transformSingleMessage(message));
        }
      }
      return transformedMessages.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });;
    }
    return [];
  };

  const onSendTest = useCallback((messages = []) => {
    // console.log('groupId: ' + groupId)
    // console.log('groupAdmin: ' + groupAdmin)
    // console.log('message: ' + messages)
    // const roomId = groupId
    // const sentMessage = {
    //   text: messages[0].text,
    //   image: 'null',
    //   video: 'null',
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    //   id: new Date().getTime(),
    //   user: {
    //     avatar: auth.user?.avatar,
    //     name: auth.user?.fullname,
    //     _id: 1,
    //   },
    // };

    // console.log('DA BAM GUI, ' + messages[0].text)
    if(messages[0]._id) {
      
      socketContext.emit('room:chat',{
        roomId : groupId,
        message : transformSingleSentMessage(messages[0])
      })

      // socket.on("connection", (socket) => {
      //   console.log('SOCKET ON EMIT')
      //   socket.broadcast.emit('room:chat',{
      //     roomId : groupId,
      //     message : messages[0]
      //   })
      // });
      setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }

    axios({
      method: 'post',
      url: `${baseUrl}/message/sendMess`,
      headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
      data: {
        groupId: groupId,
        // text: messages[0].text,
        text: CryptoJS.AES.encrypt(messages[0].text, groupId).toString(),
        typeId: messages[0]._id
      }
    })
    .then(function(res) {
      console.log('DA POST ' + res.data)
      toggleLoad()
      // if(res.data)
      //   socket.emit('room:chat',{
      //     roomId : groupId,
      //     message : res.data
      // })
    })
    .catch(function(err) {
      const { message } = error;
      console.log(message);
    })
  }, [])

  // const onSend = useCallback((messagess = []) => {
  //   console.log('TYPE: ' + messagess[0]._id)
  //   // const [messageToSend] = messages;
  //   // messagess[0].sent = false;
  //   // messagess[0].pending = true
    
  //   setMessages(previousMessages => GiftedChat.append(previousMessages, messagess))

  //   if(messagess[0]) {
  //     socket.emit('room:chat',{
  //       roomId : groupId,
  //       message : messagess[0]
  //     })
  //   }

  //   AsyncStorage.getItem('@loggedInUserID:access').then((response) => {
  //     axios({
  //       method: 'post',
  //       url: `${baseUrl}/message/sendMess`,
  //       headers: {"Authorization" : `Bearer ${response}`}, 
  //       data: {
  //         groupId: groupId,
  //         text: messagess[0].text,
  //         typeId: messagess[0]._id
  //       }
  //     })
  //     .then(function(res) {
        
  //         console.log('RES: ' + res.data.typeId)
  //         test = res.data.typeId
  //       // if(res.data) {
  //       //   socket.emit('room:chat',{
  //       //     roomId : groupId,
  //       //     message : res.data
  //       //   })
  //       // }

  //       // console.log('TEST RES: ' + test)
  //       // 
  //       // setMessages(previousMessages => {
  //       //   // console.log('LAST: ' + storedMessages.current[0].typeId)
  //       //   // console.log('LAST-1: ' + storedMessages.current[1].typeId)
  //       //   console.log('INDEX: ' + previousMessages.findIndex(message => message.typeId === res.data.typeId))
  //       //   const newArr = [...previousMessages];
  //       //   // newArr[index] = res.data;
  //       //   // console.log('NEW ARR INDEX: ' + newArr[index])
  //       //   return newArr;
  //       // });
  //     })
  //     .catch(function(err) {
  //       console.log(err)
  //     })
  //   })
    
  // }, [])

  const handleLaunchCamera = (mediaType) => {
    const options = {
      saveToPhotos: true,
      videoQuality: 'high',
      durationLimit: 30,
      mediaType: mediaType
    }
    launchCamera(options, (response) => {
      // console.log('CAMERA response', JSON.stringify(response));
      if(response.didCancel) {
        return null
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
          sendMedia(file)
          // console.log('CAMERA: ' + JSON.stringify(file))
        }
      }
    })
  }

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
          sendMedia(file)
          // setSelectedFile(() => file);
          // console.log('uri: ' + uri + '\nfileName: ' + fileName + '\ntyoe: ' +type)
        }
      }
    });
  };

  const sendMedia = file => {
    const formData = new FormData();
    formData.append("user-avatar", {
      uri: file.uri,
      type: file.type,
      name: file.name,
    })
    formData.append("groupId", groupId)
    AsyncStorage.getItem('@loggedInUserID:access').then((response) => {
      axios({
        method: 'post',
        url: `${baseUrl}/message/sendFile`,
        headers: {
          Accept: 'application/json',
          "Authorization" : `Bearer ${response}`,
          "Content-Type": 'multipart/form-data',
        }, 
        data: formData
      })
      .then(response => {
        if(response.data){
          console.log('RES FILE: ' + JSON.stringify(response.data))
          if(response.data) {
            socketContext.emit('room:chat',{
              roomId : groupId,
              message : transformSingleSentMessage(response.data)
            })
            setMessages(previousMessages => GiftedChat.append(previousMessages, [transformSingleMessage(response.data)]))
          }
        } else {
          Alert.alert('Upload failed. Please try again.');
        }
      })
      .catch(function (error) {
          const { message } = error;
          Alert.alert(message);
      });
    })
  }

  return (
    <>
    {loading? 
      <Spinner
      cancelable={true}
      color={theme.colors.primary}
      visible={loading}
      />    
    :
        <GiftedChat
        listViewProps={{
          style: {
            backgroundColor: theme.colors.background,
          },
        }}
        messages={messages}
        onSend={message => onSendTest(message)}
        user={{
          _id: 1,
        }}
        renderBubble={props => 
        <RenderBubble 
          props={props}/>}
        showAvatarForEveryMessage={false}
        showUserAvatar={false}
        scrollToBottom
        renderAvatar={props => renderAvatar(props)}
        renderTime={props => renderTime(props)}
        inverted={true}
        renderInputToolbar={props => customtInputToolbar(props)}
        renderActions={props => (
          <CustomActions
            props={props}
            Gallery={() => handleSelectFile()}
            Photo={() => handleLaunchCamera('photo')}
            Video={() => handleLaunchCamera('video')}
          />
        )}
        renderMessageVideo={message => renderVideo(message)}
        // keyboardShouldPersistTaps='never'
        placeholder={t('common:typeAMessage')}
        renderSend={props => renderSend(props)}
        ref={ref}
        />
    }
    </>
  )
}

export default Chat

