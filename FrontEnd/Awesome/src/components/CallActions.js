import React, {useState} from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CallActions = ({onHangupPress, onChangeCamera, toggleVideo, toggleMicrophone}) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  // const onReverseCamera = () => {
  //   console.log('onReverseCamera');
  //   onChangeCamera()
  // };

  const onToggleCamera = () => {
    toggleVideo()
    setIsCameraOn(currentValue => !currentValue);
  };

  const onToggleMicrophone = () => {
    toggleMicrophone()
    setIsMicOn(currentValue => !currentValue);
  };

  return (
    <View style={styles.buttonsContainer}>
      <Pressable onPress={onChangeCamera} style={styles.iconButton}>
        <Ionicons name="ios-camera-reverse" size={30} color={'white'} />
      </Pressable>

      <Pressable onPress={onToggleCamera} style={styles.iconButton}>
        <MaterialIcons
          name={isCameraOn ? 'camera' : 'camera-off'}
          size={30}
          color={'white'}
        />
      </Pressable>

      <Pressable onPress={onToggleMicrophone} style={styles.iconButton}>
        <MaterialIcons
          name={isMicOn ? 'microphone' : 'microphone-off'}
          size={30}
          color={'white'}
        />
      </Pressable>

      <Pressable
        onPress={onHangupPress}
        style={[styles.iconButton, {backgroundColor: 'red'}]}>
        <MaterialIcons name="phone-hangup" size={30} color={'white'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    backgroundColor: '#333333',
    padding: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 10,
    borderRadius: 50,
  },
});

export default CallActions;