import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { StyleSheet, View, Image } from "react-native";
// import MenuButton from './MenuButton';
import {
  Caption,
  Drawer,
  Switch,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import Animated from "react-native-reanimated";
import { PreferencesContext } from "../context/PreferencesContext";
import { Picker } from "@react-native-picker/picker";
import { Voximplant } from "react-native-voximplant";
import { logout } from "../reducers";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

export function DrawerContainer(props) {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const paperTheme = useTheme();

  const { t, i18n } = useTranslation();
  const selectedLanguageCode = i18n.language;
  const voximplant = Voximplant.getInstance();
  const setSelectedLanguage = (code) => {
    console.log("code: " + code);
    return i18n.changeLanguage(code);
  };

  const { rtl, theme, toggleRTL, toggleTheme, removeSocketContext } =
    React.useContext(PreferencesContext);
  // const translateX = Animated.interpolate(props.progress, {
  //   inputRange: [0, 0.5, 0.7, 0.8, 1],
  //   outputRange: [-100, -85, -70, -45, 0],
  // });

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            // transform: [{ translateX: -100 }],
            /////////
          },
        ]}
      >
        <View style={styles.userInfoSection}>
          <TouchableRipple
            onPress={() => {
              props.navigation.toggleDrawer();
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                marginTop: 30,
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Image
                style={{
                  alignSelf: "center",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "gray",
                  width: 50,
                  height: 50,
                  backgroundColor: "white",
                }}
                source={{
                  uri:
                    auth.user?.avatar ?? "../../assets/images/none_avatar.png",
                }}
              />
            </View>
          </TouchableRipple>
          <Title style={styles.title}>
            {auth.user?.fullname ?? "Fullname"}
          </Title>
          <Caption style={styles.caption}>
            {"@" + auth.user?.username ?? ""}
          </Caption>
          <Caption style={styles.caption}>{auth.user?.email ?? ""}</Caption>
          {/* <View style={styles.row}>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                202
              </Paragraph>
              <Caption style={styles.caption}>Obserwuje</Caption>
            </View>
            <View style={styles.section}>
              <Paragraph style={[styles.paragraph, styles.caption]}>
                159
              </Paragraph>
              <Caption style={styles.caption}>Obserwujący</Caption>
            </View>
          </View> */}
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="account-outline"
                color={color}
                size={size}
              />
            )}
            label={t("common:profile")}
            onPress={() => {
              props.navigation.closeDrawer();
              props.navigation.navigate("Profile");
            }}
          />
          {/* <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="tune" color={color} size={size} />
            )}
            label={t('common:preferences')}
            onPress={() => {}}
          /> */}
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="logout" color={color} size={size} />
            )}
            label={t("common:signOut")}
            onPress={async () => {
              const result = await voximplant.disconnect().then((result) => {
                removeSocketContext();
                dispatch(logout());
                props.navigation.closeDrawer();
                props.navigation.reset({
                  routes: [{ name: "SignInStack" }],
                });
              });
            }}
          />
        </Drawer.Section>
        <Drawer.Section title={t("common:preferences")}>
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>{t("common:darkTheme")}</Text>
              <View pointerEvents="none">
                <Switch value={theme === "dark"} />
              </View>
            </View>
          </TouchableRipple>
          {/* <TouchableRipple onPress={toggleRTL}>
            <View style={styles.preference}>
              <Text>RTL</Text>
              <View pointerEvents="none">
                <Switch value={rtl === "right"} />
              </View>
            </View>
          </TouchableRipple> */}
          <View style={styles.preference}>
            <Text>{t("common:languages")}</Text>
            <Picker
              selectedValue={selectedLanguageCode}
              style={[styles.languageSelect, { color: paperTheme.colors.text }]}
              dropdownIconColor={paperTheme.colors.text}
              placeholder={selectedLanguageCode}
              // itemStyle={{fontSize: 10}}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedLanguage(itemValue)
              }
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="Tiếng Việt" value="vn" />
              <Picker.Item label="中国人" value="zh" />
            </Picker>
          </View>
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 20,
  },
  title: {
    marginTop: 10,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: "row",
    // alignItems: "center",
  },
  section: {
    flexDirection: "row",
    // alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  languageSelect: {
    flex: 1, // This flex is optional, but probably desired
    alignItems: "center",
    flexDirection: "row",
    fontSize: 10,
    margin: 0,
    padding: 0,
  },
});
