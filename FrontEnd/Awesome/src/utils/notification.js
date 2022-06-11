import notifee, { AndroidImportance } from '@notifee/react-native';


export const onDisplayNotification = async(groupId, nofiGroup, nofiMessage) => {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
    await notifee.requestPermission();
    await notifee.displayNotification({
      id: groupId,
      title: nofiGroup,
      body: nofiMessage,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
      },
    });
}