import { registerRootComponent } from 'expo';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import { onDisplayNotification } from './src/utils/notificationFCM'

// notifee.onBackgroundEvent(async ( detail ) => {
//     const { notification } = detail;
  
//     if (notification) {
//       console.log('BG NOTI: ' + notification)
//     }
// });

// notifee.onBackgroundEvent(async ({ type, detail }) => {
//     const { notification, pressAction } = detail;
  
//     // Check if the user pressed the "Mark as read" action
//     if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
//       // Remove the notification
//       await notifee.cancelNotification(notification.id);
//     }
// });

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    onDisplayNotification(remoteMessage.data.groupId, remoteMessage.notification.title, remoteMessage.notification.body)
});

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
