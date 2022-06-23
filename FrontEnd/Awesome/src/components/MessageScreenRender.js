import React from "react";
import {
  InputToolbar,
  Send,
  Bubble,
  Actions,
  Avatar,
  Time,
} from "react-native-gifted-chat";
import Icon from "react-native-vector-icons/FontAwesome5";
// import Video from 'react-native-video';
import VideoPlayer from "react-native-video-controls";
import { useTheme } from "react-native-paper";
import { Alert, StyleSheet, Linking, Text, View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useTranslation } from "react-i18next";

const renderTime = (props) => {
  return (
    <Time
      {...props}
      timeTextStyle={{
        right: {
          color: "gray",
        },
        left: {
          color: "gray",
        },
      }}
    />
  );
};

const renderAvatar = (props) => {
  return (
    <Avatar
      {...props}
      containerStyle={{
        left: {
          width: 40,
          maxHeight: 40,
          borderColor: "gray",
          borderRadius: 10,
          borderWidth: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          flex: 1,
          marginRight: -4,
          padding: 0,
        },
      }}
      imageStyle={{
        left: {
          width: 40,
          height: 40,
          alignSelf: "center",
          borderColor: "gray",
          borderRadius: 10,
          borderWidth: 1,
          marginRight: 0,
          paddingRight: 0,
          backgroundColor: "white",
        },
      }}
    />
  );
};
const RenderBubble = ({ props }) => {
  const theme = useTheme();
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#67d4d2",
          borderRadius: 10,
        },
        left: {
          backgroundColor: "#97f784",
          borderRadius: 10,
        },
      }}
      textStyle={{
        right: {
          color: "black",
        },
        left: {
          color: "black",
        },
      }}
      // {/* and paste it into the follow 3 */}
      containerToPreviousStyle={{
        right: {
          borderTopRightRadius: 0,
        },
        left: {
          borderTopLeftRadius: 0,
        },
      }}
      containerToNextStyle={{
        right: {
          borderBottomRightRadius: 0,
        },
        left: {
          borderBottomLeftRadius: 0,
        },
      }}
      containerStyle={{
        right: {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
        left: {
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        },
      }}
    />
  );
};

const CustomtInputToolbar = ({
  props,
  Gallery,
  Photo,
  Video,
  File,
  start,
  stop,
  del,
  replay,
  send,
  currentLocation,
}) => {
  const [recordMode, setRecordMode] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const { t } = useTranslation();
  if (recordMode)
    return (
      <View style={styles.recordModeContainer}>
        <Icon
          onPress={() => {
            if (isRecording) return;
            setRecordMode(false);
          }}
          name="keyboard"
          size={21}
          style={[styles.recordButton, { flex: 1, flexGrow: 1 }]}
        />
        <Icon
          onPress={() => {
            if (isRecording) return;
            setIsRecording(true);
            start();
          }}
          name="microphone"
          size={30}
          style={[
            styles.recordButton,
            { color: isRecording ? "gray" : "green" },
          ]}
        />
        <Icon
          onPress={() => {
            if (!isRecording) return;
            setIsRecording(false);
            stop();
          }}
          name="stop"
          size={30}
          style={[styles.recordButton, { color: isRecording ? "red" : "gray" }]}
        />
        <Icon
          onPress={() => {
            if (isRecording) return;
            setIsRecording(false);
            replay();
          }}
          name="play"
          size={30}
          style={[
            styles.recordButton,
            { color: isRecording ? "gray" : "green" },
          ]}
        />
        <Icon
          onPress={() => {
            if (isRecording) return;
            setIsRecording(false);
            del();
          }}
          name="trash-alt"
          size={30}
          style={[
            styles.recordButton,
            { color: isRecording ? "gray" : "black" },
          ]}
        />
        <Text
          style={[styles.recordSend]}
          onPress={() => {
            if (isRecording) return;
            setIsRecording(false);
            send();
          }}
        >
          {">"}
        </Text>
      </View>
    );

  return (
    <InputToolbar
      {...props}
      renderActions={(props2) => (
        <Actions
          {...props2}
          containerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
          icon={() => <Text>+</Text>}
          // options={{
          //     'Select Photo': Gallery,
          //     'Take Photo': Photo,
          //     'Record Video': Video,
          //     'Select File': File,
          //     'Voice Chat': () => {
          //         setRecordMode(true);
          //     },
          //     'Send Current Location': () => {
          //         console.log('Current location')
          //     },
          //     (t('common:selectPhoto')): Gallery
          // }}
          options={{
            [t("common:selectPhoto")]: Gallery,
            [t("common:takePhoto")]: Photo,
            [t("common:recordVideo")]: Video,
            [t("common:selectFile")]: File,
            [t("common:voiceChat")]: () => {
              setRecordMode(true);
            },
            [t("common:sendLocation")]: currentLocation,
          }}
          optionTintColor="#222B45"
        />
      )}
      containerStyle={{
        backgroundColor: "white",
        // borderTopColor: "#E8E8E8",
        borderTopWidth: 1,
        //   padding: 8
      }}
    />
  );
};

// const CustomActions = ({props, Gallery, Photo, Video, File}) => {
//     return (
//         <Actions
//         {...props}
//         containerStyle={{
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}
//         icon={() => (
//             <Text>
//                 +
//             </Text>
//         )}
//         options={{
//             'Select Photo': Gallery,
//             'Take Photo': Photo,
//             'Record Video': Video,
//             'Select File': File,
//             'Record Audio': () => {
//                 recording = true;
//             },
//         }}
//         optionTintColor="#222B45"
//         />
//     )
// }

// const CustomRecorder = ({props}) => {
//     console.log('CustomRecorder >> ', props)
//     return (
//         <Composer>
//             <View style={{height: 41, backgroundColor: 'red', zIndex: 9999}}>
//                 Texttttttttttttt
//             </View>
//         </Composer>
//     )
// }

const renderSend = (props) => {
  return (
    <Send
      {...props}
      containerStyle={{
        alignItems: "center",
        justifyContent: "center",
        paddingRight: 20,
        paddingLeft: 10,
      }}
    >
      <Text>{">"}</Text>
    </Send>
  );
};

const getSource = (message) => {
  if (message && message.currentMessage) {
    return message.currentMessage.video ? message.currentMessage.video : null;
  }
  return null;
};

const renderVideo = (message) => {
  const source = getSource(message);
  if (source) {
    return (
      <View style={styles.videoContainer} key={message.currentMessage._id}>
        <VideoPlayer
          style={styles.videoElement}
          source={{ uri: source }}
          paused={true}
          repeat={false}
          muted={false}
          disableBack={true}
          disableSeekbar={true}
          disableFullscreen={true}
          disableVolume={true}
        />
      </View>
    );
  }
  return <></>;
};

const OpenURLButton = ({ url, children }) => {
  const handlePress = React.useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`${url}`);
    }
  }, [url]);

  return (
    <View style={{ borderRadius: 10, backgroundColor: "transparent" }}>
      <Button title={children} onPress={handlePress} color="transparent" />
    </View>
  );
};

const renderCustomView = (props) => {
  if (props?.currentMessage?.file && props?.currentMessage?.file != "null") {
    return (
      <View style={([styles.voiceContainer], { width: 200 })}>
        <OpenURLButton url={props.currentMessage.file}>
          File message
        </OpenURLButton>
      </View>
    );
  }

  if (
    props?.currentMessage?.location &&
    props?.currentMessage?.location != "null"
  ) {
    return (
      <View style={styles.locationContainer}>
        <MapView
          liteMode={true}
          // pointerEvents='none'
          // provider={PROVIDER_GOOGLE}
          style={styles.location}
          region={{
            latitude: props.currentMessage.location.latitude,
            longitude: props.currentMessage.location.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            // onPress={() => console.log('Location >>> ', props.currentMessage.location)}
            coordinate={{
              latitude: props.currentMessage.location.latitude,
              longitude: props.currentMessage.location.longitude,
            }}
          />
        </MapView>
      </View>
    );
  }

  if (props?.currentMessage?.voice && props?.currentMessage?.voice != "null") {
    return (
      <View style={[styles.voiceContainer]} key={props.currentMessage._id}>
        <VideoPlayer
          disableBack={true}
          disableSeekbar={true}
          disableFullscreen={true}
          disableVolume={true}
          style={styles.voiceElement}
          source={{ uri: props.currentMessage.voice }}
          paused={true}
          repeat={false}
          muted={false}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  locationContainer: {
    // ...StyleSheet.absoluteFillObject,
    height: 200,
    width: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  location: {
    ...StyleSheet.absoluteFillObject,
  },
  recordModeContainer: {
    flex: 1,
    backgroundColor: "white",
    height: 41,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
  },
  voiceContainer: {
    height: 40,
    width: 300,
    borderRadius: 10,
  },
  videoContainer: {
    height: 200,
    width: 200,
    borderRadius: 10,
  },
  videoElement: {
    borderRadius: 10,
    resizeMode: "contain",
  },
  voiceElement: {
    borderRadius: 10,
    resizeMode: "contain",
    backgroundColor: "transparent",
    // borderColor: 'gray',
    borderWidth: 0.3,
  },
  recordButton: {
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: "black",
    borderRadius: 5,
    flex: 3,
    flexGrow: 3,
    alignSelf: "center",
    textAlign: "center",
  },
  recordSend: {
    paddingVertical: 3,
    borderWidth: 0.5,
    borderColor: "black",
    borderRadius: 5,
    flex: 1,
    flexGrow: 1,
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export {
  RenderBubble,
  renderSend,
  renderVideo,
  CustomtInputToolbar,
  // CustomActions,
  renderAvatar,
  renderTime,
  renderCustomView,
  // CustomRecorder
};

{
  /* {Platform.OS === 'ios' ? <Video
            style={styles.videoElement}
            shouldPlay
            // height={156}
            // width={242}
            muted={true}
            paused={true}
            repeat={false}
            source={{ uri: source }}
            allowsExternalPlayback={false}>
        </Video> : <VideoPlayer
            style={styles.videoElement}
            source={{ uri: source }}
            paused={true}
            repeat={false}
            muted={true}
            />} */
}
