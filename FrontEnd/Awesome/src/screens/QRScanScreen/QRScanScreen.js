import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert, ToastAndroid } from "react-native";
import { Button, useTheme } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../utils/AppStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { launchImageLibrary } from "react-native-image-picker";
import { useSelector } from "react-redux";
import axios from "axios";
import { baseUrl } from "../../utils/Configuration";
import { useTranslation } from "react-i18next";
import { BarCodeScanner } from "expo-barcode-scanner";
import { PreferencesContext } from "../../context/PreferencesContext";
import Spinner from "react-native-loading-spinner-overlay";

export default QRScanScreen = (props) => {
  const auth = useSelector((state) => state.auth);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const { toggleLoad, createSocketContext, socketContext } =
    React.useContext(PreferencesContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (hasPermission === false) {
        ToastAndroid.show(t("common:permissionError"), 3);
      }
    })();
  }, [hasPermission]);

  const signalJoin = {
    typeId: "join",
    user: {
      name: auth.user.fullname,
      _id: auth.user.id,
    },
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setLoading(true);
    setScanned(true);
    // console.log('SCAN TYPE >>>> ',type)
    // console.log('SCAN DATA >>>> ',data)
    let qrData = data;
    try {
      qrData = JSON.parse(data);
    } catch (error) {
      qrData = data;
    }

    if (qrData.id && qrData.id !== auth.user.id) {
      axios({
        method: "get",
        url: `${baseUrl}/friend/check-isFriend/` + qrData.id,
        headers: { Authorization: `Bearer ${auth.tokens.access.token}` },
        data: {},
      })
        .then((response) => {
          setLoading(false);
          if (response.data) {
            props.navigation.navigate("OtherUserProfile", {
              otherUserFullname: qrData.fullname,
              otherUserEmail: qrData.email,
              otherUserAvatar: qrData.avatar,
              isFriend: response.data,
              otherUserId: qrData.id,
            });
          } else {
            props.navigation.navigate("OtherUserProfile", {
              otherUserFullname: qrData.fullname,
              otherUserEmail: qrData.email,
              otherUserAvatar: qrData.avatar,
              isFriend: 0,
              otherUserId: qrData.id,
            });
          }
        })
        .catch(function (error) {
          // const { message } = error;
          setLoading(false);
          ToastAndroid.show(t("common:errorOccured"), 3);
        });
    } else {
      if (qrData.code && qrData.idGroup) {
        axios({
          method: "post",
          url: `${baseUrl}/group/joinGroupByCode`,
          headers: { Authorization: `Bearer ${auth.tokens.access.token}` },
          data: {
            groupId: qrData.idGroup,
            code: qrData.code,
          },
        })
          .then((response) => {
            createSocketContext(auth.user.id);
            setTimeout(() => {
              socketContext.emit("room:all", {
                roomId: qrData.idGroup,
                message: signalJoin,
              });
            }, 2000);
            socketContext.emit("room:all", {
              roomId: qrData.idGroup,
              message: signalJoin,
            });
            toggleLoad();
            Alert.alert("QR Code", t("common:complete"));
            setLoading(false);
          })
          .catch((response) => {
            setLoading(false);
            Alert.alert(
              "QR Code",
              data,
              [
                {
                  text: t("common:copy"),
                  onPress: () => Clipboard.setString(data),
                  style: t("common:cancel"),
                },
                {
                  text: t("common:confirm"),
                  style: t("common:cancel"),
                },
              ],
              { cancelable: true }
            );
          });
      } else {
        setLoading(false);
        Alert.alert(
          "QR Code",
          data,
          [
            {
              text: t("common:copy"),
              onPress: () => Clipboard.setString(data),
              style: t("common:cancel"),
            },
            {
              text: t("common:confirm"),
              style: t("common:cancel"),
            },
          ],
          { cancelable: true }
        );
      }
    }
    // setLoading(false)
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const openGallery = () => {
    const galleryOptions = {
      mediaType: "photo",
      includeBase64: true,
    };
    // const PngParse = require('../../utils/PngParse');
    launchImageLibrary(galleryOptions, (response) => {
      if (!response || response.didCancel) {
        return;
      }

      BarCodeScanner.scanFromURLAsync(response.assets[0].uri).then((result) => {
        // console.log('GALL DATA >>> ',result[0])
        handleBarCodeScanned(result[0]);
      });
    });
  };

  // if (hasPermission === null) {
  //   return <Text>Requesting for camera permission</Text>;
  // }

  return (
    <View style={styles.container}>
      {loading ? (
        <Spinner
          cancelable={false}
          color={theme.colors.primary}
          visible={loading}
          overlayColor="rgba(0, 0, 0, 0.25)"
        />
      ) : (
        <></>
      )}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject]}
      />
      <View style={styles.childContainer}>
        <Icon
          name="arrow-left-circle"
          size={35}
          color={theme.colors.primary}
          style={styles.back}
          onPress={goBack}
        />
        {scanned && (
          <Button
            style={[styles.tryAgain, { borderColor: theme.colors.primary }]}
            mode="text"
            uppercase={false}
            onPress={() => setScanned(false)}
            labelStyle={styles.tryAgainText}
          >
            Try Again
          </Button>
        )}
        <Icon
          name="qrcode-plus"
          size={35}
          color={theme.colors.primary}
          style={styles.openGallery}
          onPress={openGallery}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH,
  },
  childContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 15,
  },
  back: {
    // backgroundColor: 'blue'
  },
  tryAgain: {
    width: SCREEN_WIDTH * 0.5,
    borderRadius: 10,
    borderWidth: 1,
    // backgroundColor: 'red'
  },
  tryAgainText: {
    fontSize: 21,
  },
  openGallery: {
    // backgroundColor: 'yellow'
    // marginBottom: 10
  },
});
