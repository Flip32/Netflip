import React, { useContext, useEffect, useRef } from 'react'
import styled from 'styled-components/native'
import Avatar from '../components/Avatar'
import { Alert, Text } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications';
import { auth } from '../config/firebase'
import TempStore from '../navigation/tempStore'
import {CommonActions} from '@react-navigation/native'

const Screen = styled.View`
  flex: 1;
  background-color: #000;
  flex-direction: column;
  padding: 10px;
  justify-content: center;
`;

const AvantarsContainer = styled.View`
  height: 150px;
`;

const Row = styled.View`
  flex: 1;
  background-color: #000;
  padding: 10px;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const NetflixButton = styled.TouchableOpacity`
  flex-direction: row;
  margin: 10px;
  justify-content: center;
  align-items: center;
`;

const ButtonLabel = styled.Text`
  margin: 10px;
  color: gray;
`;

export type Profile = {
  icon: string | null;
  name: string
  uri?: string | null
}

async function logout(navigation: any) {
  try{
    await auth.signOut();
    await AsyncStorage.removeItem('user');
    navigation.navigate('AuthPage');
  } catch (e) {
    Alert.alert('Erro ao sair', e.message);
  }
}

const replaceAvatarsWithImage = (props, profilesAvailables) => {
  if (props.route?.params?.name) {
    profilesAvailables.map((item) => {
      if (item.name === props.route.params.name) {
        if (props.route?.params?.image) {
          item.icon = null
          item.uri = props.route.params.image;
          item.image = null;
        }
        if (props.route?.params?.icon) {
          item.icon = props.route.params.icon;
          item.uri = null;
        }
      }
      return item;
    });
  }
};

const selectProfile = (navigation, item) => {
  navigation.navigate( 'Root', {perfil: item});
};

const editProfile = (navigation, profiles) => {
  navigation.navigate('ProfileToEdit', {profiles: profiles});
};

export async function setLastProfileOnStorage(profile: Profile) {
  await AsyncStorage.setItem('lastProfile', JSON.stringify(profile));
}

export async function getLastProfileFromStorage() {
  const lastProfile = await AsyncStorage.getItem('lastProfile');
  if(lastProfile) {
    return JSON.parse(lastProfile);
  }
  return null;
}

const More = (props) => {
  const { navigation } = props
  const { perfil, setPerfil, profilesAvailables, lg, setPushAction } = useContext(TempStore);
  replaceAvatarsWithImage(props, profilesAvailables);
  const responseListener = useRef()
  
  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { type, navigateTo, params = {} } = response.notification.request.content.data
      if(!!navigateTo){
        setPushAction({ active: true, params: params, navigateTo: navigateTo, type: type})
        getLastProfileFromStorage()
          .then(profile => {
            if(profile) {
              setPerfil(profile)
            } else {
              setPerfil(profilesAvailables[0])
            }
          })
          .finally(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Root'}],
              }),
            )
          })
      }
    });
    
    return () => {
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])
  
  return (
    <Screen>
      <AvantarsContainer>
        <Row horizontal>
          {profilesAvailables.map((item) => {
            return (
              <Avatar
                key={item.name}
                image={item.icon}
                uri={item.uri}
                name={item.name}
                onPress={() => {
                  setPerfil(item)
                  selectProfile(props.navigation, item)
                  setLastProfileOnStorage(item).then()
                }}
              />
            );
          })}
        </Row>
      </AvantarsContainer>
      <NetflixButton
        onPress={() => editProfile(props.navigation, profilesAvailables)}>
        <MaterialIcons name="edit" size={24} color="gray" />
        <ButtonLabel>{lg.settings.editiPerfil}</ButtonLabel>
      </NetflixButton>
      <Text onPress={() => logout(props.navigation)} style={{ color: '#FFF', alignSelf: 'center', position: 'absolute', bottom: 30 }}>{lg.buttonsInteractive.logout}</Text>
    </Screen>
  );
};

export default More;
