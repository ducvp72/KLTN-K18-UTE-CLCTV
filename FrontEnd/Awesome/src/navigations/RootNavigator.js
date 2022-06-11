import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DefaultTheme, DarkTheme, getFocusedRouteNameFromRoute  } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import { StackNavigator } from "./StackNavigator";
import { DrawerContainer } from '../components/DrawerContainer'
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { Pressable } from "react-native";
// import { useTranslation } from 'react-i18next';

const Drawer = createDrawerNavigator();
const sideMenuDisabledScreens = ['SignInStack', 'SignUpStack']
export const RootNavigator = () => {
  // const {t} = useTranslation()
  const theme = useTheme();
  const navigationTheme = theme.dark ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={navigationTheme}>
      <Drawer.Navigator 
        detachInactiveScreens={false}
        drawerContent={(props) => <DrawerContainer {...props} />}>
        <Drawer.Screen name="Root" component={StackNavigator} options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'SignInStack'
          if (sideMenuDisabledScreens.includes(routeName))
            return ({
              swipeEnabled: false,
              headerShown: false
            })
            return ({
              headerShown: false
            })
          }}
          />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};
