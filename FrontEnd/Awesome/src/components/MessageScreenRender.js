import React from 'react';
import { InputToolbar, Send, Bubble, Actions, Avatar, Time } from 'react-native-gifted-chat'
// import Icon from 'react-native-vector-icons/FontAwesome5';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import { useTheme } from 'react-native-paper';
import { Platform, StyleSheet, Dimensions, Text, View} from 'react-native';

const renderTime = props => {
    return (
        <Time
        {...props}
            timeTextStyle={{
                right: {
                    color: 'gray'
                },
                left: {
                    color: 'gray'
                }
            }}
        />
    )
}

const renderAvatar = props => {
    return (
        <Avatar
        {...props}
        containerStyle={{
            left: {
                width: 40,
                maxHeight: 40,
                borderColor: 'gray',
                borderRadius: 10,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
                flex: 1,
                marginRight: -4,
                padding: 0
            }
        }}
        imageStyle={{
            left: {
                width: 40,
                height: 40,
                alignSelf: 'center',
                borderColor: 'gray',
                borderRadius: 10,
                borderWidth: 1,
                marginRight: 0,
                paddingRight: 0,
                backgroundColor: 'white'
            }
        }}
        />
    )
}
const RenderBubble = ({props}) => {
    const theme = useTheme()
    return (
      <Bubble
        {...props}
        wrapperStyle={{
            right: { 
              backgroundColor: theme.colors.primary,
              borderRadius: 10,
            },
            left: { 
              backgroundColor: 'white',
              borderRadius: 10,
            },
        }}
        textStyle={{
            right: {
                color: 'black'
            },
            left: { 
                color: 'black'
            },
        }}

        // {/* and paste it into the follow 3 */}
        containerToPreviousStyle={{
            right: { 
                borderTopRightRadius: 0 
            },
            left: { 
                borderTopLeftRadius: 0,
            },
        }}
        containerToNextStyle={{
            right: { 
                borderBottomRightRadius: 0 
            },
            left: { 
                borderBottomLeftRadius: 0,
            },
        }}
        containerStyle={{
            right: { 
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0
            },
            left: { 
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
            },
        }}
      />
    );
};

const customtInputToolbar = props => {
    return (
        <InputToolbar
        {...props}
        containerStyle={{
            backgroundColor: "white",
            // borderTopColor: "#E8E8E8",
            borderTopWidth: 1,
        //   padding: 8
        }}
        />
    );
};

const CustomActions = ({props, Gallery, Photo, Video}) => {
    return (
        <Actions
        {...props}
        containerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
        icon={() => (
        //   <Icon
        //       name='plus'
        //       size={16}
        //   />
            <Text>
                +
            </Text>
        )}
        options={{
            'Open Gallery': Gallery,
            'Take Photo': Photo,
            'Record Video': Video,
        }}
        optionTintColor="#222B45"
        />
    )
}

const renderSend = (props) => {
    return (
        <Send
            {...props}
            containerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingRight: 20,
                paddingLeft: 10
            }}
        >
            <Text>{'>'}</Text>
        </Send>
    );
}

const getSource = (message) => {
    if (message && message.currentMessage) {
        return message.currentMessage.audio ? message.currentMessage.audio : message.currentMessage.video ? message.currentMessage.video : null;
    }
    return null;
}

const renderVideo = (message) => {
    const source = getSource(message);
    if (source) {
        return (
        <View style={styles.videoContainer} key={message.currentMessage._id}>
            {Platform.OS === 'ios' ? <Video
            style={styles.videoElement}
            shouldPlay
            // height={156}
            // width={242}
            muted={true}
            paused={true}
            repeat={false}
            source={{ uri: source }}
            allowsExternalPlayback={false}></Video> : <VideoPlayer
            style={styles.videoElement}
            source={{ uri: source }}
            paused={true}
            repeat={false}
            muted={true}
            />}
        </View>
        );
    }
    return <></>;
};

const styles = StyleSheet.create({
    videoContainer: {
        height: 200,
        width: 300,
    },
    videoContainerFullscreen: {
        position: "absolute",
        // left: 0,
        // bottom: 0,
        width: Dimensions.get('window').height,
        height: Dimensions.get('window').width,
        minWidth: Dimensions.get('window').height,
        minHeight: Dimensions.get('window').width,
        width: Dimensions.get('screen').height,
        height: Dimensions.get('screen').width,
        zIndex: 9999
    },
    videoElement: {
    },
})

export {
    RenderBubble,
    renderSend,
    renderVideo,
    customtInputToolbar,
    CustomActions,
    renderAvatar,
    renderTime
}