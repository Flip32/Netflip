import React from 'react';
import styled from 'styled-components/native';
import {Profile} from '../screens/MoreScreen'
import {css} from 'styled-components'
import {Pressable} from 'react-native'

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

type Header = {
  perfil: Profile
  navigation: any
}

const Header = (props: Header) => {
  const { perfil, navigation } = props;
  return (
    <Container>
      <Logo resizeMode="contain" source={require('../assets/logo.png')} />
      <Menu>
        <Label>Séries</Label>
      </Menu>
      <Menu>
        <Label>Filmes</Label>
      </Menu>
      <Menu>
        <Label>Minha lista</Label>
      </Menu>
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
