import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Appbar, useTheme, TouchableRipple } from "react-native-paper";
import { useRoute, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Image, View } from "react-native";

import BottomTabNavigator from "../components/BottomTabNavigator";
import OtherUserProfileScreen from '../screens/ProfileScreen/OtherUserProfileScreen'
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import ProfileSetting from "../screens/ProfileScreen/ProfileSetting";
import SignInScreen from '../screens/AuthScreen/SignInScreen'
import SignUpScreen from '../screens/AuthScreen/SignUpScreen';
import VerifyCodeScreen from '../screens/AuthScreen/VerifyCodeScreen';
import ForgotPasswordScreen from '../screens/AuthScreen/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/AuthScreen/ChangePasswordScreen';
import Chat from '../screens/Message/GiftedChat'
import CallScreen from "../screens/CallScreen/CallScreen";
import CallingScreen from '../screens/CallScreen/CallingScreen'
import IncomingCallScreen from "../screens/CallScreen/IncomingCallScreen";
import QRScanScreen from "../screens/QRScanScreen/QRScanScreen";
import QRProfileScreen from "../screens/QRScanScreen/QRProfileScreen";
import FriendRequestScreen from "../screens/ContactScreen/FriendRequestScreen"
import GroupInfoScreen from "../screens/ProfileScreen/GroupInfoScreen";
import GroupMemberList from "../screens/ProfileScreen/GroupMemberList";

import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from "react-i18next";

// import AsyncStorage from '@react-native-async-storage/async-storage'
// import { useTranslation } from "react-i18next";

const Stack = createStackNavigator();
const SignInStack = () => (
  <Stack.Navigator
    initialRouteName="SignInStack"
    screenOptions={{
      headerShown: false,
      swipeEnabled: false,
      gestureEnabled: false
    }}
    >
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
  </Stack.Navigator>
);

const SignUpStack = () => (
  <Stack.Navigator
    initialRouteName="SignUpStack"
    screenOptions={{
      headerShown: false
    }}
    >
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
  </Stack.Navigator>
);

export const Header = ({ scene, previous, navigation, friendId, groupName, groupType, groupId, callBuzz }) => {
  const auth = useSelector((state) => state.auth);
  const { options } = scene.descriptor;
  const theme = useTheme();
  const route = useRoute();

  const title =
  options.headerTitle !== undefined
    ? options.headerTitle
    : options.title !== undefined
    ? options.title
    : scene.route.name;

  return (
    <Appbar.Header statusBarHeight={0} theme={{ colors: { primary: theme.colors.surface } }}>
      {previous ? (
        <Appbar.BackAction
          onPress={navigation.goBack}
          // onPress={route.name == 'ProfileSetting' ? navigation.navigate('Profile') : navigation.goBack}
          color={theme.colors.text}
          style={{marginLeft: 5}}
        />
      ) : (
        <TouchableRipple onPress={() => {navigation.openDrawer();}}>
          <View style={{width: 40, height: 40, marginLeft: 10,justifyContent: 'center',alignItems: 'center',flex:1}}>
            <Image
              style={{alignSelf: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'gray', width: 40, height: 40, backgroundColor: 'white'}}
              size={40}
              source={{uri: auth.user?.avatar ?? '../../assets/images/none_avatar.png'}}
            />
          </View>
        </TouchableRipple>
      )}
      <Appbar.Content
        title={title}
        titleStyle={{
          fontSize: 21,
          color: theme.colors.text,
        }}
      />
      {route.name == 'ProfileSetting' ? <Appbar.Action icon='account-lock' color={theme.colors.text}
        onPress={() => {
          navigation.navigate('ChangePassword', { email: auth.user.email })
        }} 
        /> : <></>}
      {/* {route.name == 'Profile' ? <Appbar.Action icon='qrcode' color={theme.colors.text}
      onPress={() => {
        navigation.navigate('QRProfileScreen', { email: auth.user.email })
      }} 
      /> : <></>} */}
      {route.name == 'Messages' || route.name == 'Contacts' ? 
      <>
        {/* <Appbar.Action icon='chat-plus-outline' color={theme.colors.text}
          onPress={() => {
            console.log('DL >> ' + JSON.stringify(showDialog))
            console.log('groupName >> ' + JSON.stringify(groupName))
          }}
        /> */}
        <Appbar.Action icon='qrcode-scan' color={theme.colors.text}
          onPress={() => {
            navigation.navigate('QRScanScreen')
          }} 
        />
      </>
      : <></>}
      {(route.name == 'Chat' && groupType === 'personal') ? 
      <Appbar.Action icon='phone-forward' color={theme.colors.text}
        onPress={() => {
          navigation.navigate('CallingScreen', { friendId: friendId, groupName: groupName, videoCall: false })
          callBuzz()
        }} 
      /> : <></>}
      {(route.name == 'Chat' && groupType === 'personal') ? 
      <Appbar.Action icon='video' color={theme.colors.text}
        onPress={() => {
          navigation.navigate('CallingScreen', { friendId: friendId, groupName: groupName, videoCall: true })
          callBuzz()
        }} 
      /> : <></>}
      {(route.name == 'Chat' && groupType === 'public') ? 
      <Appbar.Action icon='information-outline' color={theme.colors.text}
        onPress={() => {
          navigation.navigate('GroupInfoScreen', { groupId: groupId })
        }} 
      /> : <></>}
    </Appbar.Header>
  );
};

export const StackNavigator = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Stack.Navigator
      initialRouteName="SignInStack"
      headerMode="screen"
      screenOptions={{
        // headerShown: false,
        animationEnabled: false,
        header: ({ scene, previous, navigation }) => (
          <Header scene={scene} previous={previous} navigation={navigation} />
        ),
      }}
      // screenOptions={({navigation}) => ({
      //   headerLeft: () => (
      //     <Pressable onPress={() => navigation.openDrawer()}>
      //       <Icon
      //       name='bars'
      //       size={25}
      //       color={theme.colors.primary}
      //       />
      //     </Pressable>
      //   ),
      //   headerLeftContainerStyle: {paddingLeft: 10},
      //   headerRight: () => (
      //     <Pressable onPress={() => {console.log('Themm chat')}}>
      //       <Icon
      //       name='plus'
      //       size={25}
      //       color={theme.colors.primary}
      //       />
      //     </Pressable>
      //   ),
      //   headerRightContainerStyle: {paddingRight: 10},
      // })}
    >
      <Stack.Screen
        name="Messages"
        component={BottomTabNavigator}
        options={
          ({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Messages';
          // console.log('routeName >>> ' + routeName)
          // const routeName = route.state
          //   ? route.state.routes[route.state.index].name
          //   : "Messages";
          return { 
            headerTitle: routeName == "Messages" ? t('common:messages') : t('common:contacts'),
          };
        }}
      />
      <Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen} options={{headerTitle: t('common:profile')}}/>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{headerTitle: t('common:profile')}}/>
      <Stack.Screen name="ProfileSetting" component={ProfileSetting} options={{headerTitle: t('common:editProfile'),}}/>
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{headerTitle: t('common:changePassword')}}/>
      <Stack.Screen name="FriendRequest" component={FriendRequestScreen} options={{headerTitle: t('common:friendRequest')}}/>
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="SignInStack" component={SignInStack}  options={{headerShown: false}}/>
      <Stack.Screen name="SignUpStack" component={SignUpStack}  options={{headerShown: false}}/>
      <Stack.Screen name="CallingScreen" component={CallingScreen}  options={{headerShown: false}}/>
      <Stack.Screen name="CallScreen" component={CallScreen}  options={{headerShown: false}}/>
      <Stack.Screen name="IncomingCallScreen" component={IncomingCallScreen}  options={{headerShown: false}}/>
      <Stack.Screen name="QRScanScreen" component={QRScanScreen}  options={{headerShown: false}}/>
      <Stack.Screen name="QRProfileScreen" component={QRProfileScreen}  options={{headerTitle: t('common:qrCode')}}/>
      <Stack.Screen name="GroupInfoScreen" component={GroupInfoScreen}  options={{headerTitle: t('common:groupInfo')}}/>
      <Stack.Screen name="GroupMemberList" component={GroupMemberList}  options={{headerTitle: t('common:member')}}/>
    </Stack.Navigator>
  );
};
