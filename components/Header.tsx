import React from 'react';
import { Pressable } from 'react-native'
import styled from 'styled-components/native';
import {Profile} from '../screens/MoreScreen'
import {css} from 'styled-components'

const avatarSize = css`
  width: 30px;
  height: 30px;
  border-radius: 30px;
`;

export const AvatarIcon = styled.Image`
  ${avatarSize}
`;

const Container = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 25px 25px 0 25px;
  width: 100%;
  margin-top: 10px;
`;

export const Logo = styled.Image`
  width: 20px;
  height: 40px;
`;

const Label = styled.Text`
  font-size: 18px;
  color: #fff;
  letter-spacing: 0.1px;
`;

const Menu = styled.TouchableOpacity``;

export type Filtro = 'series' | 'movie' | 'myList' | null

type Header = {
  perfil: Profile
  navigation: any
  callBackFilter: (value: Filtro) => void
}

const Header = (props: Header) => {
  const { perfil, navigation, callBackFilter } = props;
  return (
    <Container>
      <Menu onPress={() => callBackFilter(null)}>
        <Logo onPress={() => callBackFilter(null)} resizeMode="contain" source={require('../assets/logo.png')} />
      </Menu>
      
      <Menu onPress={() => callBackFilter('series')} >
        <Label>Séries</Label>
      </Menu>
      
      <Menu onPress={() => callBackFilter('movie')}>
        <Label>Filmes</Label>
      </Menu>
      
      {/*<Menu onPress={() => {}}>
        <Label>Minha lista</Label>
      </Menu>*/}
      <Pressable
        onPress={() => navigation.navigate('More')}
      >
        <AvatarIcon
          source={perfil.icon}
        />
      </Pressable>
    </Container>
  );
};

export default Header;
