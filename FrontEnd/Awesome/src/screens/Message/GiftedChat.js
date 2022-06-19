import React, { useRef, useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import Spinner from "react-native-loading-spinner-overlay";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
  Platform,
  ToastAndroid,
  PermissionsAndroid,
  Keyboard,
} from "react-native";
import {
  renderSend,
  renderVideo,
  CustomtInputToolbar,
  // CustomActions,
  RenderBubble,
  renderAvatar,
  renderTime,
  renderCustomView,
} from "../../components/MessageScreenRender";
import axios from "axios";
import FormData from "form-data";
import { useTranslation } from "react-i18next";
import { PreferencesContext } from "../../context/PreferencesContext";
import { baseUrl } from "../../utils/Configuration";
import { useSelector } from "react-redux";
import { useTheme, Portal } from "react-native-paper";
// import DocumentPicker, { isInProgress, types } from 'react-native-document-picker';
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import { Header } from "../../navigations/StackNavigator";
import * as Location from "expo-location";

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
];

export function Chat(props) {
  var CryptoJS = require("crypto-js");
  const theme = useTheme();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const { groupName, groupId, groupAdmin, groupType, userId, friendId } =
    props.route.params; //no socket
  const auth = useSelector((state) => state.auth);
  const ref = useRef(null);
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [permissionGranted, setPermissionGranted] = useState(false);

  Keyboard.addListener("keyboardDidHide", () => {
    Keyboard.dismiss();
  });

  const { toggleLoad, socketContext, load } = React.useContext(PreferencesContext);

  const getPermissions = async () => {
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    const recordAudioGranted =
      granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === "granted";
    const cameraGranted =
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] === "granted";
    const readExternalStorage =
      granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
      "granted";
    const writeExternalStorage =
      granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
      "granted";
    const fineLocation =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      "granted";
    const coarseLocation =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
      "granted";
    const backgroundLocation =
      granted[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] ===
      "granted";
    if (
      !cameraGranted ||
      !recordAudioGranted ||
      !readExternalStorage ||
      !writeExternalStorage ||
      !fineLocation ||
      !coarseLocation ||
      !backgroundLocation
    ) {
      // ToastAndroid.show(t('common:permissionError'), 3)
    } else {
      setPermissionGranted(true);
    }
  };

  useEffect(() => {
    props.navigation.setOptions({
      title: groupName,
      header: ({ scene, previous, navigation }) => (
        <Header
          scene={scene}
          previous={previous}
          navigation={navigation}
          friendId={friendId}
          groupName={groupName}
          groupType={groupType}
          groupId={groupId}
          callBuzz={callBuzz}
        />
      ),
    });

    if (Platform.OS === "android") {
      getPermissions();
    } else {
      setPermissionGranted(true);
    }
    loadMessages()
    // axios({
    //   method: "put",
    //   url: `${baseUrl}/group`,
    //   headers: { Authorization: `Bearer ${auth.tokens.access.token}` },
    //   data: {
    //     groupId: groupId,
    //     seen: true,
    //   },
    // });
  }, []);

  // useEffect(() => {
  //   loadMessages()
  // }, [load])

  const loadMessages = () => {
    axios({
      method: "get",
      url: `${baseUrl}/message/${groupId}?sortBy=createdAt:desc&limit=30`,
      headers: { Authorization: `Bearer ${auth.tokens.access.token}` },
      data: {},
    })
      .then(function (response) {
        setLoading(false);
        if (response.data.results) {
          setMessages(() => transformMessages(response.data.results));
        } else {
          ToastAndroid.show(t("common:empty"), 3);
        }
      })
      .catch(function (error) {
        // setAccessToken(response)
        setLoading(false);
        const { message } = error;
        ToastAndroid.show(t("common:errorOccured") + " " + message, 3);
      });
  }

  useEffect(() => {
    // console.log('SOCKET CHANGE - GIFTEDCHAT')
    socketContext.on("room:chat", (message) => {
      // console.log('LISTEN ON SOCKET - GIFTEDCHAT')
      if (message)
        // console.log('Tin nhan Screen Message')
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [transformSingleMessage(message)])
        );
    });
  }, [socketContext]);

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
    return true;
  };

  const transformSingleMessage = (message) => {
    if (isValidMessage(message)) {
      // console.log('OUTPUT TRANS TYPEID: ' + message.typeId)
      let transformedMessage = {
        typeId: message.typeId,
        _id: message._id,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.user._id != userId ? message.user._id : 1,
          name: message.user.name,
          avatar: message.user.avatar,
        },
        // sent: message.sent,
        // pending: message.pending
      };
      if (message.text != "null" && message.text != undefined) {
        transformedMessage.text = CryptoJS.AES.decrypt(
          message.text,
          groupId
        ).toString(CryptoJS.enc.Utf8);
        if (message.typeId != -1 && message.typeId != "-1") {
          transformedMessage.system = true;
          switch (message.typeId) {
            case "0": //tao
              transformedMessage.text =
                transformedMessage.text + t("common:sysCreate");
              break;
            case 0: //tao
              transformedMessage.text =
                transformedMessage.text + t("common:sysCreate");
              break;
            case "1": //vao
              transformedMessage.text =
                transformedMessage.text + t("common:sysJoin");
              break;
            case 1: //vao
              transformedMessage.text =
                transformedMessage.text + t("common:sysJoin");
              break;
            case "2": //xoa tv
              transformedMessage.text =
                t("common:sysDel") + transformedMessage.text;
              break;
            case 2: //xoa tv
              transformedMessage.text =
                t("common:sysDel") + transformedMessage.text;
              break;
            default: //roi
              transformedMessage.text =
                transformedMessage.text + t("common:sysLeave");
              break;
          }
        }
      } else if (message.video != "null" && message.video != undefined) {
        transformedMessage.video = CryptoJS.AES.decrypt(
          message.video,
          groupId
        ).toString(CryptoJS.enc.Utf8);
      } else if (message.image != "null" && message.image != undefined) {
        transformedMessage.image = CryptoJS.AES.decrypt(
          message.image,
          groupId
        ).toString(CryptoJS.enc.Utf8);
      } else if (message.voice != "null" && message.voice != undefined) {
        transformedMessage.voice = CryptoJS.AES.decrypt(
          message.voice,
          groupId
        ).toString(CryptoJS.enc.Utf8);
      } else if (message.file != "null" && message.file != undefined) {
        transformedMessage.file = CryptoJS.AES.decrypt(
          message.file,
          groupId
        ).toString(CryptoJS.enc.Utf8);
      } else if (message.location != "null" && message.location != undefined) {
        transformedMessage.location = message.location;
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
      };
      if (message.text != "null") {
        transformedMessage.text = CryptoJS.AES.encrypt(
          message.text,
          groupId
        ).toString();
      } else if (message.video != "null") {
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
      });
    }
    return [];
  };

  const buzzMessage = [
    {
      _id: new Date().getTime(),
      text: "📞 BUZZ!!!!",
      createdAt: new Date(),
      user: {
        _id: 1,
        name: auth.user.fullname,
        avatar: auth.user.avatar,
      },
    },
  ];

  const callBuzz = () => {
    onSendTest(buzzMessage);
  };

  const onSendTest = useCallback((messages = []) => {
    if (messages[0]._id) {
      axios({
        method: "post",
        url: `${baseUrl}/message/sendMess`,
        headers: { Authorization: `Bearer ${auth.tokens.access.token}` },
        data: {
          groupId: groupId,
          text: CryptoJS.AES.encrypt(messages[0].text, groupId).toString(),
        },
      })
        .then(function (res) {
          socketContext.emit("room:chat", {
            roomId: groupId,
            message: transformSingleSentMessage(messages[0]),
          });
          toggleLoad();
          // transformSingleSentMessage(messages[0])
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messages)
          );
          // setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
          ToastAndroid.show(t("common:complete"), 1);
        })
        .catch(function (err) {
          const { message } = error;
          ToastAndroid.show(t("common:errorOccured") + " " + message, 3);
        });
    }
  }, []);

  const handleLaunchCamera = (mediaType) => {
    if (permissionGranted == false) getPermissions();
    const options = {
      saveToPhotos: true,
      videoQuality: "high",
      durationLimit: 30,
      mediaType: mediaType,
    };
    launchCamera(options, (response) => {
      // console.log('CAMERA response', JSON.stringify(response));
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
            uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
            type: type || "video/quicktime",
          };
          sendMedia(file);
          // console.log('CAMERA: ' + JSON.stringify(file))
        }
      }
    });
  };

  const handleSelectFile = () => {
    if (permissionGranted == false) getPermissions();
    const options = {
      mediaType: "mixed",
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
            uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
            type: type || "video/quicktime",
          };
          sendMedia(file);
          // setSelectedFile(() => file);
          // console.log('uri: ' + uri + '\nfileName: ' + fileName + '\ntyoe: ' +type)
        }
      }
    });
  };

  const handleDocumentSelection = async () => {
    if (permissionGranted == false) getPermissions();
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: false,
    }).then((response) => {
      if (response.type == "success") {
        let { size, uri } = response;
        if (size >= 10240) {
          ToastAndroid.show(t("common:under10MB"), 3);
          return;
        }
        let nameParts = uri.split("/");
        let tempName = nameParts[nameParts.length - 1];
        let types = response.mimeType.split("/");
        let type = types[types.length - 1];
        var file = {
          name:
            tempName[tempName.length - 1] == "." ? tempName + type : tempName,
          size: size,
          uri: uri,
          type: response.mimeType,
        };
        // console.log('response >> ', file)
        sendMedia(file);
      }
    });
  };

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: false,
        });
        ToastAndroid.show(t("common:startRecording"), 3);
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      } else {
        get;
      }
    } catch (err) {
      ToastAndroid.show(t("common:permissionError"), 3);
    }
  }

  const recorderAction = (stopCase) => {
    if (stopCase == "del") {
      if (recordings[0]?.file) {
        setRecordings([]);
        ToastAndroid.show(t("common:complete"), 3);
      }
      return;
    }

    if (stopCase == "replay") {
      if (recordings[0]?.sound) {
        ToastAndroid.show(t("common:replay"), 3);
        recordings[0].sound.replayAsync();
      }
      return;
    }

    if (stopCase == "send") {
      if (recordings[0]?.file) {
        let nameParts = recordings[0].file.split("/");
        let tempName = nameParts[nameParts.length - 1];
        const file = {
          name: tempName,
          type: "audio/m4a",
          uri: recordings[0].file,
        };
        sendMedia(file);
      } else {
        ToastAndroid.show(t("common:empty"), 3);
        return;
      }
    }
  };

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    ToastAndroid.show(t("common:stopRecording"), 3);
    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    // console.log('updatedRecordings >>>> ', updatedRecordings)
    setRecordings(updatedRecordings);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  const sendMedia = (file) => {
    console.log("sendMedia >> ", file);
    const formData = new FormData();
    formData.append("user-avatar", file);
    formData.append("groupId", groupId);

    axios({
      method: "post",
      url: `${baseUrl}/message/sendFile`,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${auth.tokens.access.token}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    })
      .then((response) => {
        if (response.data) {
          // console.log('RES FILE: ' + JSON.stringify(response.data))
          if (response.data) {
            socketContext.emit("room:chat", {
              roomId: groupId,
              message: response.data,
            });
            toggleLoad();
            setMessages((previousMessages) =>
              GiftedChat.append(previousMessages, [
                transformSingleMessage(response.data),
              ])
            );
            ToastAndroid.show(t("common:complete"), 3);
          }
        } else {
          // Alert.alert('Upload failed. Please try again.');
          ToastAndroid.show(t("common:errorOccured"), 3);
        }
      })
      .catch(function (error) {
        const { message } = error;
        // Alert.alert(message);
        ToastAndroid.show(t("common:errorOccured") + " " + message, 3);
      });

    setRecordings([]);
    setRecording();
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      ToastAndroid.show(t("common:permissionError"), 3);
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.BestForNavigation,
    })
      .then((location) => {
        if (!location.coords.latitude || !location.coords.longitude) return;
        // console.log('Location >> ', location.coords)
        axios({
          method: "post",
          url: `${baseUrl}/message/location`,
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${auth.tokens.access.token}`,
          },
          data: {
            groupId: groupId,
            location: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
          },
        })
          .then((response) => {
            if (response.data) {
              // console.log('RES FILE: ' + JSON.stringify(response.data))
              if (response.data) {
                socketContext.emit("room:chat", {
                  roomId: groupId,
                  message: transformSingleSentMessage(response.data),
                });
                toggleLoad();
                setMessages((previousMessages) =>
                  GiftedChat.append(previousMessages, [
                    transformSingleMessage(response.data),
                  ])
                );
                ToastAndroid.show(t("common:complete"), 3);
              }
            } else {
              // Alert.alert('Upload failed. Please try again.');
              ToastAndroid.show(t("common:errorOccured"), 3);
            }
          })
          .catch(function (error) {
            const { message } = error;
            // Alert.alert(message);
            ToastAndroid.show(t("common:errorOccured") + " " + message, 3);
          });
      })
      .catch((err) => {
        ToastAndroid.show(t("common:errorOccured"), 3);
      });
  };

  return (
    <>
      {loading ? (
        <Spinner
          cancelable={true}
          color={theme.colors.primary}
          visible={loading}
        />
      ) : (
        <>
          {/* <View style={{position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: 'transparent', zIndex: 9999}}>
          

        </View> */}
          <GiftedChat
            listViewProps={{
              style: {
                backgroundColor: theme.colors.background,
              },
            }}
            messages={messages}
            onSend={(message) => onSendTest(message)}
            user={{
              _id: 1,
            }}
            renderBubble={(props) => <RenderBubble props={props} />}
            showAvatarForEveryMessage={false}
            showUserAvatar={false}
            scrollToBottom
            renderAvatar={(props) => renderAvatar(props)}
            renderTime={(props) => renderTime(props)}
            inverted={true}
            renderCustomView={(props) => renderCustomView(props)}
            renderInputToolbar={(props) => (
              <CustomtInputToolbar
                props={props}
                Gallery={() => handleSelectFile()}
                Photo={() => handleLaunchCamera("photo")}
                Video={() => handleLaunchCamera("video")}
                File={() => handleDocumentSelection()}
                start={() => startRecording()}
                stop={() => stopRecording()}
                del={() => recorderAction("del")}
                replay={() => recorderAction("replay")}
                send={() => recorderAction("send")}
                currentLocation={() => getCurrentLocation()}
              />
            )}
            renderMessageVideo={(message) => renderVideo(message)}
            // keyboardShouldPersistTaps='never'
            placeholder={t("common:typeAMessage")}
            renderSend={(props) => renderSend(props)}
            ref={ref}
          />
        </>
      )}
    </>
  );
}

export default Chat;
