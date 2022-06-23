import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Alert,
  Platform,
} from "react-native";
import CallActions from "../../components/CallActions";
import Ionicons from "react-native-vector-icons/Ionicons";
// import {useNavigation, useRoute} from '@react-navigation/core';
import { Voximplant } from "react-native-voximplant";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./../../utils/AppStyles";

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = (props) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [callStatus, setCallStatus] = useState("Initializing...");
  const [localVideoStreamId, setLocalVideoStreamId] = useState("");
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState("");
  const [sendVideo, setSendVideo] = useState(true);
  const [microphone, setMicrophone] = useState(true);
  const [frontCamera, setFrontCamera] = useState(true);
  const [localVideo, setLocalVideo] = useState(props.route.params.videoCall);
  const [videoCall, setVideoCall] = useState(props.route.params.videoCall);

  const {
    friendId,
    groupName,
    // videoCall,
    call: incomingCall,
    isIncomingCall,
  } = props.route.params;
  console.log(
    "Friend ID Call Screen => " +
      friendId +
      " " +
      groupName +
      " isVideo " +
      videoCall
  );
  const voximplant = Voximplant.getInstance();

  const call = useRef(incomingCall);
  const endpoint = useRef(null);

  const { CameraManager } = Voximplant.Hardware;
  const camera = CameraManager.getInstance();

  // const calling = new Voximplant.Call;

  const goBack = () => {
    props.navigation.navigate("Messages");
  };

  useEffect(() => {
    const getPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const recordAudioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === "granted";
      const cameraGranted =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === "granted";
      if (!cameraGranted || !recordAudioGranted) {
        Alert.alert("Permissions not granted");
      } else {
        setPermissionGranted(true);
      }
    };

    if (Platform.OS === "android") {
      getPermissions();
    } else {
      setPermissionGranted(true);
    }
  }, []);

  const callSettings = {
    video: {
      sendVideo: videoCall,
      receiveVideo: videoCall,
    },
  };

  useEffect(() => {
    if (!permissionGranted) {
      return;
    }

    const makeCall = async () => {
      call.current = await voximplant.call(friendId, {
        video: {
          sendVideo: videoCall,
          receiveVideo: videoCall,
        },
      });
      subscribeToCallEvents();
    };

    const answerCall = async () => {
      try {
        subscribeToCallEvents();
        endpoint.current = call.current.getEndpoints()[0];
        // ((endpoint) => {
        //   const mediaRenderer = endpoint.mediaRenderer;
        //   mediaRenderer.enabled();
        //   mediaRenderer.requestVideoSize(640, 480);
        //   console.log('Video size: ' + mediaRenderer.videoSize)
        // })
        subscribeToEndpointEvent();
        call.current.answer({
          video: {
            sendVideo: videoCall,
            receiveVideo: videoCall,
          },
        });
      } catch {
        call.current.getEndpoints().forEach((endpoint) => {
          setupEndpointListeners(endpoint, false);
        });
        call.current.hangup();
        props.navigation.navigate("Messages");
      }
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, (callEvent) => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, (callEvent) => {
        setCallStatus("Calling...");
      });
      call.current.on(Voximplant.CallEvents.Connected, (callEvent) => {
        setCallStatus("Connected");
      });
      call.current.on(Voximplant.CallEvents.Disconnected, (callEvent) => {
        props.navigation.navigate("Messages");
      });
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        (callEvent) => {
          // console.log("LOCALVIDEO ADD >>>>>>>>>> ", callEvent.videoStream);
          setLocalVideoStreamId(callEvent.videoStream.id);
          setLocalVideo(true);
        }
      );
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamRemoved,
        (callEvent) => {
          // console.log("LOCALVIDEO REMOVE >>>>>>>>>> ", callEvent.videoStream);
          setLocalVideoStreamId(callEvent.videoStream.id);
          setLocalVideo(false);
        }
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, (callEvent) => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };

    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        (endpointEvent) => {
          // console.log("remote video add << ", endpointEvent.videoStream);
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
          setVideoCall(true);
        }
      );
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamRemoved,
        (endpointEvent) => {
          // console.log("remote video remove << ", endpointEvent.videoStream);
          setVideoCall(false);
        }
      );
    };

    const showError = (reason) => {
      // Reason: ${reason}
      Alert.alert("Call failed", ``, [
        {
          text: "OK",
          onPress: props.navigation.navigate("Messages"),
        },
      ]);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.Disconnected);
    };
  }, [permissionGranted]);

  const setupEndpointListeners = (endpoint, on) => {
    Object.keys(Voximplant.EndpointEvents).forEach((eventName) => {
      const callbackName = `_onEndpoint${eventName}`;
      if (typeof this[callbackName] !== "undefined") {
        endpoint[on ? "on" : "off"](eventName, this[callbackName]);
      }
    });
  };

  const onHangupPress = async () => {
    try {
      await call.current.getEndpoints().forEach((endpoint) => {
        setupEndpointListeners(endpoint, false);
      });
      await call.current.hangup();
      props.navigation.navigate("Messages");
    } catch {
      try {
        await call.current.getEndpoints().forEach((endpoint) => {
          setupEndpointListeners(endpoint, false);
        });
        await call.current.hangup();
        props.navigation.navigate("Messages");
      } catch {
        props.navigation.navigate("Messages");
      }
    }
  };

  const onChangeCamera = async () => {
    if (!videoCall) return;
    if (frontCamera == true) {
      await camera.switchCamera(Voximplant.Hardware.CameraType.BACK);
      setFrontCamera(false);
    } else {
      await camera.switchCamera(Voximplant.Hardware.CameraType.FRONT);
      setFrontCamera(true);
    }
  };

  const toggleVideo = async () => {
    if (!videoCall) return;
    if (sendVideo == true) {
      await call.current.sendVideo(false);
      setSendVideo(!sendVideo);
    } else {
      await call.current.sendVideo(true);
      setSendVideo(!sendVideo);
    }
  };

  const toggleMicrophone = async () => {
    if (microphone == true) {
      await call.current.sendAudio(false);
      setMicrophone(!microphone);
    } else {
      await call.current.sendAudio(true);
      setMicrophone(!microphone);
    }
  };

  return (
    <View style={styles.page}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" color="black" size={25} />
      </Pressable>
      {videoCall ? (
        <></>
      ) : (
        <View style={styles.hideRemoteVideo}>
          <View style={styles.cameraPreview}>
            <Text style={styles.name}>{groupName}</Text>
            <Text style={styles.phoneNumber}>{callStatus}</Text>
          </View>
        </View>
      )}
      {localVideo ? (
        <Voximplant.VideoView
          videoStreamId={localVideoStreamId}
          style={styles.localVideo}
          scaleType={Voximplant.RenderScaleType.SCALE_FIT}
          showOnTop={true}
        />
      ) : null}
      <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={styles.remoteVideo}
        scaleType={Voximplant.RenderScaleType.SCALE_FIT}
      />

      {/* {videoCall ? (
        sendVideo ? (
          <Voximplant.VideoView
            videoStreamId={localVideoStreamId}
            style={styles.localVideo}
          />
        ) : (
          <></>
        )
      ) : (
        <></>
      )} */}

      <CallActions
        onHangupPress={onHangupPress}
        onChangeCamera={onChangeCamera}
        toggleVideo={toggleVideo}
        toggleMicrophone={toggleMicrophone}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: "100%",
    backgroundColor: "gray",
  },
  cameraPreview: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
    zIndex: 60,
  },
  localVideo: {
    width: 100,
    height: 150,
    backgroundColor: "transparent",
    borderRadius: 10,
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 55,
  },
  remoteVideo: {
    backgroundColor: "transparent",
    borderRadius: 10,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
    zIndex: 50,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: "black",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 60,
  },
  hideRemoteVideo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "gray",
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 51,
  },
  hideLocalVideo: {
    backgroundColor: "transparent",
    position: "absolute",
    width: 100,
    height: 150,
    right: 10,
    top: 10,
    zIndex: 56,
  },
});

export default CallingScreen;
