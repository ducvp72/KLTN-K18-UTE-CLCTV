import React, {useEffect,useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../utils/AppStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
// import QRCodeScanner from 'react-native-qrcode-scanner'; //
// import { RNCamera } from 'react-native-camera' //
import {useSelector} from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../utils/Configuration';
// import RNQRGenerator from 'rn-qr-generator'; //
// import { QRreader } from "react-native-qr-decode-image-camera"; //
// import QrCodeReader from 'qrcode-reader'; //
// import { Buffer } from 'buffer'; //
import { BarCodeScanner } from 'expo-barcode-scanner'

export default QRScanScreen = (props) => {
    const auth = useSelector((state) => state.auth);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const theme = useTheme()

    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        if (hasPermission === false) {
          return <Text>No access to camera</Text>;
        }
      })();
    }, [hasPermission]);

    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      // console.log('SCAN TYPE >>>> ',type)
      // console.log('SCAN DATA >>>> ',data)
      let qrData = data;
      try {
        qrData = JSON.parse(data)
      } catch (error) {
        qrData = data
      }
      
      if(qrData.id && (qrData.id !== auth.user.id)) {
        axios({
          method: 'get',
          url: `${baseUrl}/friend/check-isFriend/` + qrData.id,
          headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
          data: {}
        })
        .then((response) => {
          if(response.data){
            props.navigation.navigate('OtherUserProfile', { 
              otherUserFullname: qrData.fullname,
              otherUserEmail: qrData.email,
              otherUserAvatar: qrData.avatar,
              isFriend: response.data,
              otherUserId: qrData.id
            });
          } else {
            props.navigation.navigate('OtherUserProfile', { 
              otherUserFullname: qrData.fullname,
              otherUserEmail: qrData.email,
              otherUserAvatar: qrData.avatar,
              isFriend: 0,
              otherUserId: qrData.id
            });
          }
        })
        .catch(function (error) {
            const { message } = error;
            console.log("QR USER >> " + message);
        });
      } else {
        if(qrData.code && qrData.idGroup) {
          axios({
            method: 'post',
            url: `${baseUrl}/group/joinGroupByCode`,
            headers: {"Authorization" : `Bearer ${auth.tokens.access.token}`}, 
            data: {
              groupId: qrData.idGroup,
              code: qrData.code
            }
          })
          .then((response) => {
            Alert.alert('Join Group','Join group successfull!')
          })
          .catch((response) => {
            Alert.alert('Join Group','Join group failure!')
          });
        } else {
          Alert.alert('QR Code', data, [{
            text: 'COPY', 
            onPress: () => Clipboard.setString(data), 
            style: 'cancel'
          }, 
          {
            text: 'OK', 
            style: 'cancel'
          }], 
          {cancelable: true});
        }
      }
    };
    
    const goBack = () => {
      props.navigation.goBack()
    }

    const openGallery = () => {
      const galleryOptions = {
        mediaType: 'photo',
        includeBase64: true,
      };
      // const PngParse = require('../../utils/PngParse');
      launchImageLibrary(galleryOptions, (response) => {
        if (!response || response.didCancel) {
          return;
        }

        BarCodeScanner.scanFromURLAsync(response.assets[0].uri).then((result) => {
          // console.log('GALL DATA >>> ',result[0])
          handleBarCodeScanned(result[0])
        })
      });
    }

    // if (hasPermission === null) {
    //   return <Text>Requesting for camera permission</Text>;
    // }


    return (
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.childContainer}>
          <Icon 
            name='arrow-left-circle'
            size={35}
            color={theme.colors.primary}
            style={styles.back}
            onPress={goBack}
          />
          {scanned && 
          <Button 
            style={[styles.tryAgain, {borderColor: theme.colors.primary}]}
            mode='text'
            uppercase={false}
            onPress={() => setScanned(false)} 
            labelStyle={styles.tryAgainText}
          >
            Try Again
          </Button>}
          <Icon 
            name='qrcode-plus'
            size={35}
            color={theme.colors.primary}
            style={styles.openGallery}
            onPress={openGallery}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH
  },
  childContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 15
  },
  back: {
    // backgroundColor: 'blue'

  },
  tryAgain: {
    width: (SCREEN_WIDTH*0.5),
    borderRadius: 10,
    borderWidth: 1,
    // backgroundColor: 'red'
  },
  tryAgainText: {
    fontSize: 21
  },
  openGallery: {
    // backgroundColor: 'yellow'
    // marginBottom: 10
  },
});