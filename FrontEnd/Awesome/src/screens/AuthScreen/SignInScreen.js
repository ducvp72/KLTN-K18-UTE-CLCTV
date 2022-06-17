import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ScrollView,
  ToastAndroid,
  Keyboard,
} from "react-native";
import { Button as PaperButton, useTheme } from "react-native-paper";
import { AppStyles } from "../../utils/AppStyles";
import Icon from "react-native-vector-icons/FontAwesome5";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Spinner from "react-native-loading-spinner-overlay";

import { validEmail } from "../../utils/RegexConfig";
import { baseUrl, APP_NAME, ACC_NAME } from "../../utils/Configuration";

import notifee from "@notifee/react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login, logout } from "../../reducers";
import messaging from "@react-native-firebase/messaging";
import { PreferencesContext } from "../../context/PreferencesContext";
import { useTranslation } from "react-i18next";
import { Voximplant } from "react-native-voximplant";

function SignInScreen({ props, navigation }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { createSocketContext, removeSocketContext } =
    React.useContext(PreferencesContext);
  const voximplant = Voximplant.getInstance();
  const dispatch = useDispatch();

  Keyboard.addListener("keyboardDidHide", () => {
    Keyboard.dismiss();
  });

  useEffect(() => {
    // removeSocketContext()
    // checkBatteryOptimization()
    // checkPowerManagement()
    dispatch(logout());
    requestPermission();
    (async () => {
      await voximplant.connect();
    })();

    // voximplantConnect();
  }, []);

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("builam66@gmail.com");
  const [password, setPassword] = useState("123456@User");

  const [hidePass, setHidePass] = useState(false);
  const icon = !hidePass ? "eye-slash" : "eye";

  const onPressLogin = () => {
    requestPermission();
    setLoading(true);
    if (email.length <= 0 || password.length <= 0) {
      setLoading(false);
      ToastAndroid.show(t("common:fillRequiredField"), 3);
      return;
    }
    if (validEmail.test(email) === false) {
      setLoading(false);
      ToastAndroid.show(t("common:invalid"), 2);
      return;
    }

    axios({
      method: "post",
      url: `${baseUrl}/auth/login`,
      headers: {},
      data: {
        email: email,
        password: password,
      },
    })
      .then((response) => {
        if (response.data.user) {
          if (response.data.user.isBanned == true) {
            ToastAndroid.show(t("common:isBanned"), 3);
            setLoading(false);
            return;
          }

          if (response.data.user.isActivated == false) {
            ToastAndroid.show(t("common:isActivated"), 3);
            setLoading(false);
            navigation.navigate("VerifyCode", {
              accessToken: response.data.tokens.access.token,
            });
            return;
          }

          getFCMToken();
          voximplantSignIn(response.data.user.id);
          createSocketContext(response.data.user.id);

          AsyncStorage.setItem("@loggedInUserID:id", response.data.user.id);
          AsyncStorage.setItem("@loggedInUserID:key", response.data.user.email);
          AsyncStorage.setItem(
            "@loggedInUserID:access",
            response.data.tokens.access.token
          );
          AsyncStorage.setItem(
            "@loggedInUserID:refresh",
            response.data.tokens.refresh.token
          );
          dispatch(
            login(response.data.user, response.data.tokens, response.data.qr)
          );

          setLoading(false);
          navigation.reset({
            routes: [{ name: "Messages", params: response.data.user.id }],
          });
          // navigation.navigate('Messages', { params: response.data.user.id });
        } else {
          setLoading(false);
          ToastAndroid.show(t("common:invalid"), 3);
        }
      })
      .catch(function (error) {
        setLoading(false);
        // const { message } = error;
        ToastAndroid.show(t("common:errorOccured"), 3);
      });
  };

  const voximplantConnect = async () => {
    await voximplant.disconnect();
    const status = await voximplant.getClientState();
    // console.log('voximplantConnect status 1: ' + status)
    if (status === Voximplant.ClientState.DISCONNECTED) {
      await voximplant.connect();
      // console.log('voximplantConnect status 2: ' + await voximplant.getClientState())
    }
    // else if (status === Voximplant.ClientState.LOGGED_IN) {
    //   redirectHome();
    // }
  };

  const voximplantSignIn = async (userId) => {
    const status = await voximplant.getClientState();
    if (status === Voximplant.ClientState.DISCONNECTED) {
      await voximplant.connect();
    }
    if (
      status === Voximplant.ClientState.CONNECTING ||
      status === Voximplant.ClientState.LOGGING_IN
    ) {
      ToastAndroid.show("Login is in process...", 2);
      return;
    }
    const user = `${userId}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
    try {
      const authResult = await voximplant.login(user, password);
    } catch (e) {
      // console.log(e);
      const authResult = await voximplant.login(user, password);
      ToastAndroid.show(`${t("common:errorOccured")}: ${e.code}`, 2);
    }
  };

  const getFCMToken = () => {
    messaging()
      .getToken()
      .then((token) => {
        AsyncStorage.setItem("@loggedInUserID:messageToken", token);
      });
  };

  const requestPermission = async () => {
    const authStatus = await messaging().requestPermission();
  };

  const checkBatteryOptimization = async () => {
    const batteryOptimizationEnabled =
      await notifee.isBatteryOptimizationEnabled();
    if (batteryOptimizationEnabled) {
      Alert.alert(
        "Restrictions Detected",
        "To ensure notifications are delivered, please disable battery optimization for the app.",
        [
          {
            text: "OK, open settings",
            onPress: async () =>
              await notifee.openBatteryOptimizationSettings(),
          },
          {
            text: "Cancel",
            // onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  const checkPowerManagement = async () => {
    const powerManagerInfo = await notifee.getPowerManagerInfo();
    if (powerManagerInfo.activity) {
      Alert.alert(
        "Restrictions Detected",
        "To ensure notifications are delivered, please adjust your settings to prevent the app from being killed",
        [
          {
            text: "OK, open settings",
            onPress: async () => await notifee.openPowerManagerSettings(),
          },
          {
            text: "Cancel",
            // onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <KeyboardAwareScrollView>
      {loading ? (
        <Spinner
          cancelable={false}
          color={AppStyles.color.tint}
          visible={loading}
          overlayColor="rgba(0, 0, 0, 0.25)"
        />
      ) : (
        <></>
      )}
      <ScrollView style={styles.container}>
        <Text style={[styles.title, styles.leftTitle]}>
          {t("common:signIn")}
        </Text>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="E-mail"
            onChangeText={setEmail}
            autoCapitalize="none"
            value={email}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainerPassword}>
          <TextInput
            style={styles.bodyPassword}
            secureTextEntry={!hidePass}
            placeholder={t("common:password")}
            onChangeText={setPassword}
            autoCapitalize="none"
            value={password}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
          <Icon
            name={icon}
            size={15}
            color={AppStyles.color.grey}
            style={[styles.icon]}
            onPress={() => setHidePass(!hidePass)}
          />
        </View>
        <Text
          style={[styles.or, { color: theme.colors.text }]}
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          {t("common:forgotPassword")}
        </Text>
        <Text
          style={[styles.or, { color: theme.colors.text }]}
          onPress={() => navigation.navigate("SignUpStack")}
        >
          {t("common:needAccount")}
        </Text>
        <PaperButton
          uppercase={false}
          mode="text"
          onPress={() => onPressLogin()}
          style={styles.loginContainer}
          labelStyle={styles.loginText}
        >
          {t("common:logIn")}
        </PaperButton>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
  },
  or: {
    color: "black",
    marginTop: 20,
    // marginBottom: 5,
    alignSelf: "center",
  },
  title: {
    fontSize: AppStyles.fontSize.title,
    fontWeight: "bold",
    color: AppStyles.color.tint,
    marginTop: 20,
    marginBottom: 20,
  },
  leftTitle: {
    alignSelf: "stretch",
    textAlign: "center",
    // marginLeft: 20,
  },
  content: {
    paddingLeft: 50,
    paddingRight: 50,
    textAlign: "center",
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.tint,
    borderRadius: 10,
    padding: 10,
    marginTop: 30,
    alignSelf: "center",
  },
  loginText: {
    color: AppStyles.color.white,
    fontFamily: "Roboto",
    fontSize: 16,
  },
  placeholder: {
    color: "red",
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    alignSelf: "center",
    borderColor: AppStyles.color.grey,
    borderRadius: 10,
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    color: AppStyles.color.text,
  },
  InputContainerPassword: {
    width: AppStyles.textInputWidth.main,
    marginTop: 30,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  bodyPassword: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    alignSelf: "stretch",
    color: AppStyles.color.text,
  },
  icon: {
    textAlign: "center",
    textAlignVertical: "center",
    paddingRight: 15,
  },
});

export default SignInScreen;
