import notifee, { AndroidImportance } from '@notifee/react-native';
const serverKey = 'AAAA-6O0nOA:APA91bEIAYcyRUI31Ns5d4OtR184o4S-qwcCFJPdB2KmZhXLj-IFg5AVk_l_Pb77a6SoFdPER7sRntKuAx2bdP8QOkhsUEYK6THMqMDih-ED-Tv7TZ8KeAda8YQaC_ThK40fKln3G4BT'


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


export const sendSingleDeviceNotification = (title, body, token, groupId) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    `key=${serverKey}`,
  );

  var raw = JSON.stringify({
    data: {
      groupId: groupId
    },
    notification: {
      body: body,
      title: title,
    },
    to: token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};

export const sendMultiDeviceNotification = data => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append(
    'Authorization',
    `key=${serverKey}`,
  );

  var raw = JSON.stringify({
    data: {},
    notification: {
      body: data.body,
      title: data.title,
    },
    registration_ids: data.token,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  fetch('https://fcm.googleapis.com/fcm/send', requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
};