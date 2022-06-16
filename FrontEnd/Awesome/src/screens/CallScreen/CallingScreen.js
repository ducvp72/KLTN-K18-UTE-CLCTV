import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import CallActions from '../../components/CallActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import {useNavigation, useRoute} from '@react-navigation/core';
import {Voximplant} from 'react-native-voximplant';

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = (props) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [callStatus, setCallStatus] = useState('Initializing...');
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
  const [sendVideo, setSendVideo] = useState(true)
  const [microphone, setMicrophone] = useState(true)
  const [frontCamera, setFrontCamera] = useState(true)
  // const navigation = useNavigation();
  // const route = useRoute();

  const {friendId, groupName, videoCall, call: incomingCall, isIncomingCall} = props.route.params;
  console.log('Friend ID Call Screen => ' + friendId + ' ' + groupName)
  const voximplant = Voximplant.getInstance();

  const call = useRef(incomingCall);
  const endpoint = useRef(null);
  
  const { CameraManager } = Voximplant.Hardware
  const camera = CameraManager.getInstance()

  // const calling = new Voximplant.Call;

  const goBack = () => {
    props.navigation.goBack()
  };

  useEffect(() => {
    const getPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const recordAudioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
      const cameraGranted =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
      if (!cameraGranted || !recordAudioGranted) {
        Alert.alert('Permissions not granted');
      } else {
        setPermissionGranted(true);
      }
    };

    if (Platform.OS === 'android') {
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
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0]
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
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, callEvent => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallStatus('Calling...');
      });
      call.current.on(Voximplant.CallEvents.Connected, callEvent => {
        setCallStatus('Connected');
      });
      call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
        props.navigation.goBack();
      });
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        callEvent => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        },
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };

    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
    };

    const showError = reason => {
      // Reason: ${reason}
      Alert.alert('Call failed', ``, [
        {
          text: 'OK',
          onPress: props.navigation.goBack(),
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
        if (typeof this[callbackName] !== 'undefined') {
            endpoint[(on) ? 'on' : 'off'](eventName, this[callbackName]);
        }
    });
  }

  const onHangupPress = () => {
    try {
      call.current.getEndpoints().forEach(endpoint => {
        setupEndpointListeners(endpoint, false);
      })
      call.current.hangup();
    } catch {
      props.navigation.goBack()
    }
 
  };

  const onChangeCamera = () => {
    if(frontCamera==true) {
      setFrontCamera(false)
      camera.switchCamera(Voximplant.Hardware.CameraType.BACK)
    } else {
      setFrontCamera(true)
      camera.switchCamera(Voximplant.Hardware.CameraType.FRONT)
    }
  }

  const toggleVideo = () => {
    if(!videoCall) return
    if(sendVideo==true) {
      setSendVideo(false)
      // calling.sendVideo(false)
      call.current.sendVideo(false)
    } else {
      setSendVideo(true)
      // calling.sendVideo(true)
      call.current.sendVideo(true)
    }
    
  }

  const toggleMicrophone = () => {
    if(microphone==true) {
      setMicrophone(false)
      call.current.sendAudio(false);
    } else {
      setMicrophone(true)
      call.current.sendAudio(true);
    }
    
  }

  return (
    <View style={styles.page}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" color="black" size={25} />
      </Pressable>

      <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={styles.remoteVideo}
      />

      <Voximplant.VideoView
        videoStreamId={localVideoStreamId}
        style={styles.localVideo}
      />

      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{groupName}</Text>
        <Text style={styles.phoneNumber}>{callStatus}</Text>
      </View>

      <CallActions onHangupPress={onHangupPress} onChangeCamera={onChangeCamera} toggleVideo={toggleVideo} toggleMicrophone={toggleMicrophone}/>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  cameraPreview: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  localVideo: {
    width: 100,
    height: 150,
    backgroundColor: 'transparent',
    borderRadius: 10,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  remoteVideo: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: 'black',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
});

export default CallingScreen;