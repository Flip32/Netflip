import React from 'react';
import styled from 'styled-components/native';
import Avatar from '../components/Avatar';
import {Alert, AsyncStorage, Text} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import { auth } from '../config/firebase'

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

let profilesAvailables: Profile[] = [
  {
    icon: require('../assets/avatars/avatar1.png'),
    name: 'José',
    uri: null,
  },
  {
    icon: require('../assets/avatars/avatar2.png'),
    name: 'Luiz',
    uri: null,
  },
  {
    icon: require('../assets/avatars/avatar3.png'),
    name: 'João',
    uri: null,
  },
  {
    icon: require('../assets/avatars/avatar4.png'),
    name: 'Maria',
    uri: null,
  },
  {
    icon: require('../assets/avatars/avatar5.png'),
    name: 'Pedro',
    uri: null,
  },
];

async function logout(navigation: any) {
  try{
    await auth.signOut();
    await AsyncStorage.clear();
    navigation.navigate('Auth');
  } catch (e) {
    Alert.alert('Erro ao sair', e.message);
  }
}

const replaceAvatarsWithImage = (props, profilesAvailables) => {
  if (props.route?.params?.name) {
    profilesAvailables.map((item) => {
      if (item.name === props.route.params.name) {
        if (props.route?.params?.image) {
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
  navigation.navigate('Home', {perfil: item});
};

const editProfile = (navigation, profiles) => {
  navigation.navigate('ProfileToEdit', {profiles: profiles});
};

const More = (props) => {
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
                onPress={() => selectProfile(props.navigation, item)}
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
