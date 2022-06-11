import 'react-native-gesture-handler';
import 'react-native-reanimated'
import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import SearchBar from '../components/SearchBar';

import SignInScreen from '../screens/SignInScreen'
import SignUpScreen from '../screens/SignUpScreen/SignUpScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen/VerifyCodeScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen/ForgotPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import OtherUserProfileScreen from '../screens/OtherUserProfileScreen';

import DrawerContainer from '../components/DrawerContainer';

import {AppIcon, AppStyles} from '../AppStyles';
import {Configuration} from '../Configuration';

import {connect, useSelector} from 'react-redux';


const Stack = createStackNavigator();
const SignInStack = () => (
  <Stack.Navigator
    initialRouteName="SignInStack"
    screenOptions={{
      headerTintColor: 'red',
      headerTitleStyle: styles.headerTitleStyle,
      headerMode: 'float',
      headerShown: false
    }}
    >
    {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
    
  </Stack.Navigator>
);

const SignUpStack = () => (
  <Stack.Navigator
    initialRouteName="SignUpStack"
    screenOptions={{
      headerTintColor: 'red',
      headerTitleStyle: styles.headerTitleStyle,
      headerMode: 'float',
    }}
    >
    {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
    {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
    
  </Stack.Navigator>
);

const HomeStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerTintColor: 'red',
      headerTitleStyle: styles.headerTitleStyle,
      headerMode: 'float',
    }}>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({navigation}) => ({
        headerLeft: () => (
          <Pressable onPress={() => navigation.openDrawer()}>
            <Image style={styles.iconStyle} source={AppIcon.images.menu} />
          </Pressable>
        ),
        headerLeftContainerStyle: {paddingLeft: 10},
        headerRight: () => (
          <Pressable onPress={() => {console.log('Themm chat')}}>
            <Image style={styles.iconStyle} source={AppIcon.images.addChat} />
          </Pressable>
        ),
        headerRightContainerStyle: {paddingRight: 10},
        // headerTitle: () => (
        //   <SearchBar />
        // )
      })}
    />
    <Stack.Screen name="OtherUserProfile" component={OtherUserProfileScreen} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator
    initialRouteName="Profile"
    screenOptions={{
      headerTintColor: 'red',
      headerTitleStyle: styles.headerTitleStyle,
      headerMode: 'float',
    }}>
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={({navigation}) => ({
        headerLeft: () => (
          <Pressable onPress={() => navigation.openDrawer()}>
            <Image style={styles.iconStyle} source={AppIcon.images.menu} />
          </Pressable>
        ),
        headerLeftContainerStyle: {paddingLeft: 10},
      })}
    />
  </Stack.Navigator>
);

const BottomTab = createBottomTabNavigator();
const TabNavigator = () => (
  <BottomTab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarInactiveTintColor: 'grey',
      tabBarActiveTintColor: AppStyles.color.tint,
      tabBarIcon: ({focused}) => {
        return (
          <Image
            style={{
              tintColor: focused ? AppStyles.color.tint : AppStyles.color.grey,
            }}
            source={AppIcon.images.home}
          />
        );
      },
      headerShown: false,
    }}>
    <BottomTab.Screen
      options={{tabBarLabel: 'Home'}}
      name="HomeStack"
      component={HomeStack}
    />
    <BottomTab.Screen
      options={{tabBarLabel: 'Profile'}}
      name="ProfileStack"
      component={ProfileStack}
    />
  </BottomTab.Navigator>
);

// drawer stack
const Drawer = createDrawerNavigator();
const DrawerStack = () => (
  <Drawer.Navigator
    screenOptions={{
      drawerStyle: {outerWidth: 200},
      drawerPosition: 'left',
      headerShown: false,
    }}
    drawerContent={({navigation}) => (
      <DrawerContainer navigation={navigation} />
    )}>
    <Drawer.Screen name="Tab" component={TabNavigator} />
  </Drawer.Navigator>
);

// Manifest of possible screens
const RootNavigator = () => (
  // useSelector((state) => state.auth).user? (
  //   <Stack.Navigator
  //   initialRouteName="DrawerStack"
  //   screenOptions={{headerShown: false}}>
  //   <Stack.Screen name="DrawerStack" component={DrawerStack} />
  //   <Stack.Screen name="SignInStack" component={SignInStack} />
  //   <Stack.Screen name="SignUpStack" component={SignUpStack} />
  //   {/* <Stack.Screen name="DrawerStack" component={DrawerStack} /> */}
  // </Stack.Navigator>
  // ) : (
  //   <Stack.Navigator
  //   initialRouteName="SignInStack"
  //   screenOptions={{headerShown: false}}>
  //   <Stack.Screen name="SignInStack" component={SignInStack} />
  //   <Stack.Screen name="SignUpStack" component={SignUpStack} />
  //   <Stack.Screen name="DrawerStack" component={DrawerStack} />
  //   {/* <Stack.Screen name="DrawerStack" component={DrawerStack} /> */}
  //   </Stack.Navigator>
  // )
  <Stack.Navigator
  initialRouteName="DrawerStack"
  screenOptions={{headerShown: false}}>
  <Stack.Screen name="DrawerStack" component={DrawerStack} />
  <Stack.Screen name="SignInStack" component={SignInStack} />
  <Stack.Screen name="SignUpStack" component={SignUpStack} />
  {/* <Stack.Screen name="DrawerStack" component={DrawerStack} /> */}
</Stack.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <RootNavigator />
  </NavigationContainer>
);

const styles = StyleSheet.create({
  headerTitleStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: 'black',
  },
  iconStyle: {tintColor: AppStyles.color.tint, width: 30, height: 30},
});

export default AppNavigator;
