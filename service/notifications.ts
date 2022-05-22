import firebase from 'firebase/compat/app'
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';


export async function registerForPushNotification(){
  console.log('chegou aqui')
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status
  }
  if (finalStatus !== 'granted' && finalStatus !== 'undetermined') {
    return;
  }
  let token
  try{
    token = await Notifications.getExpoPushTokenAsync();
  } catch (e) {
    return console.log('Deu ruim ao pegar o token', e)
  }
  console.log('token', token)
  return token
}

