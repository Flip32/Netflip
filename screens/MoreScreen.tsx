import React, {useContext} from 'react';
import styled from 'styled-components/native';
import Avatar from '../components/Avatar';
import {Alert, AsyncStorage, Text} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import { auth } from '../config/firebase'
import TempStore from '../navigation/tempStore'

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
  icon: string
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

const selectProfile = (navigation, item, initialProfile) => {
  navigation.navigate(!!initialProfile ? 'Root' : 'Home', {perfil: item});
};

const editProfile = (navigation, profiles) => {
  navigation.navigate('ProfileToEdit', {profiles: profiles});
};

const More = (props) => {
  const { perfil, setPerfil, profilesAvailables } = useContext(TempStore);
  replaceAvatarsWithImage(props, profilesAvailables);
  
  
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
                  console.log('perfil ao escolher um ',perfil)
                  selectProfile(props.navigation, item, perfil)
                }}
              />
            );
          })}
        </Row>
      </AvantarsContainer>
      <NetflixButton
        onPress={() => editProfile(props.navigation, profilesAvailables)}>
        <MaterialIcons name="edit" size={24} color="gray" />
        <ButtonLabel>Gerenciar perfis</ButtonLabel>
      </NetflixButton>
      <Text onPress={() => logout(props.navigation)} style={{ color: '#FFF', alignSelf: 'center', position: 'absolute', bottom: 30 }}>Sair</Text>
    </Screen>
  );
};

export default More;
