import React, {useEffect, useState} from 'react';
import {View, StyleSheet, PermissionsAndroid, Alert, Platform, Button} from 'react-native';
import CallActions from '../../components/CallActions';

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallScreen = () => {
  const [permissionGranted, setPermissionGranted] = useState(false);

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



  return (
    <View style={styles.page}>
      <View 
        style={styles.cameraPreview} 
      />
      <CallActions />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraPreview: {
    width: 100,
    height: 150,
    backgroundColor: 'transparent',
    borderRadius: 10,
    position: 'absolute',
    zIndex: 20,
    right: 10,
    top: 10,
  },
});

export default CallScreen