import firebase from 'firebase/compat/app'
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';


export async function registerForPushNotification(){
  console.log('chegou aqui')
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  console.log('========================================')
  console.log('status 1', existingStatus)
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status
  }
  console.log('========================================')
  console.log('finalStatus 1 ', finalStatus)
  if (finalStatus !== 'granted' && finalStatus !== 'undetermined') {
    return;
  }
  console.log('========================================')
  console.log('finalStatus 2 ', finalStatus)
  let token
  try{
    token = await Notifications.getExpoPushTokenAsync();
  } catch (e) {
    return console.log('Deu ruim ao pegar o token', e)
  }
  console.log('token', token)
  return token
}

