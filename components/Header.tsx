import React, {useContext} from 'react';
import { Pressable } from 'react-native'
import styled from 'styled-components/native';
import {Profile} from '../screens/MoreScreen'
import {css} from 'styled-components'
import TempStore from '../navigation/tempStore'
import { FontAwesome } from '@expo/vector-icons';

const avatarSize = css`
  width: 30px;
  height: 30px;
`;

export const AvatarIcon = styled.Image`
  ${avatarSize}
`;

const Container = styled.View`
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  padding: 25px 25px 0 25px;
  width: 100%;
  margin-top: 10px;
`;

const Subheader = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;
  margin: 0;
  width: 100%;
  margin-top: 10px;
`;

const HeadersHome = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-around;
  padding: 0;
  width: 100%;
  margin-top: 10px;
`;

export const Logo = styled.Image`
  width: 20px;
  height: 40px;
`;

const Label = styled.Text`
  font-size: 16px;
  color: #fff;
  letter-spacing: 0.1px;
`;

const Menu = styled.TouchableOpacity``;

const SubMenu = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: 0;
`;

export type Filtro = 'series' | 'movie' | 'myList' | null

type Header = {
  perfil: Profile
  navigation: any
  callBackFilter: (value: Filtro) => void
}

const Header = (props: Header) => {
  const { perfil, navigation, callBackFilter } = props
  const { lg } = useContext(TempStore)
  
  return (
    <Container>
      <Subheader>
        <Menu onPress={() => callBackFilter(null)}>
          <Logo onPress={() => callBackFilter(null)} resizeMode="contain" source={require('../assets/logo.png')} />
        </Menu>
        <Pressable
          onPress={() => navigation.navigate('More')}
        >
          {
            perfil.uri
            ? <AvatarIcon source={{ uri: perfil.uri }} />
            : <AvatarIcon source={perfil.icon} />
          }
        </Pressable>
      </Subheader>
      
      <HeadersHome>
        <Menu onPress={() => callBackFilter('series')} >
          <Label>{lg.headerHome.series}</Label>
        </Menu>
  
        <Menu onPress={() => callBackFilter('movie')}>
          <Label>{lg.headerHome.movies}</Label>
        </Menu>
  
        <Menu onPress={() => {}}>
          <SubMenu>
            <Label>{lg.headerHome.category}</Label>
            <FontAwesome size={22} style={{ marginLeft: 5 }} name={'caret-down'} color={'#FFF'} />
          </SubMenu>
        </Menu>
      </HeadersHome>
      
    </Container>
  );
};

export default Header;
