import React from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';

import ContactScreen from "../screens/ContactScreen/ContactScreen";
import HomeScreen from "../screens/HomeScreen/HomeScreen";

import { useTheme, Text } from "react-native-paper";
import color from "color";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { useTranslation } from "react-i18next";

const BottomTab = createBottomTabNavigator();
export const BottomTabNavigator = () => {
  const theme = useTheme();
  const inActive = color(theme.colors.text).alpha(0.6).rgb().string()
  const { t } = useTranslation()

  return (
    <BottomTab.Navigator
    initialRouteName="Messages"
    // screenOptions={{
    //   tabBarInactiveTintColor: inActive,
    //   tabBarActiveTintColor: theme.colors.primary,
    //   tabBarIcon: ({focused}) => {
    //     return (
    //       <Image
    //         style={{
    //           tintColor: focused ? theme.colors.primary : inActive,
    //         }}
    //         source={AppIcon.images.home}
    //       />
    //     );
    //   },
    //   headerShown: false,}}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          if (route.name === 'Messages') {
            return (
              <Icon 
                name='comments'
                size={25}
                color={focused ? theme.colors.primary : inActive}
              />
            );
          } else if (route.name === 'Contacts') {
            return (
              <Icon 
                name='address-book'
                size={25}
                color={focused ? theme.colors.primary : inActive}
              />
            );
          }
        },
        tabBarInactiveTintColor: inActive,
        tabBarActiveTintColor: theme.colors.primary,
      })}
    >
    <BottomTab.Screen
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{color: focused ? theme.colors.primary : inActive}}>{t('common:messages')}</Text>
        ),
      }}
      name="Messages"
      component={HomeScreen}
    />
    <BottomTab.Screen
      options={{
        tabBarLabel: ({focused}) => (
          <Text style={{color: focused ? theme.colors.primary : inActive}}>{t('common:contacts')}</Text>
        ),
      }}
      name="Contacts"
      component={ContactScreen}
    />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator
