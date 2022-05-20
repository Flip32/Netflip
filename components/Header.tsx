import React, {useContext, useEffect, useState} from 'react';
import {Dimensions, Pressable, ScrollView, TouchableOpacity, View} from 'react-native'
import styled from 'styled-components/native';
import { css } from 'styled-components'
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'
import { Portal, Modal } from 'react-native-paper'
import TempStore from '../navigation/tempStore'
import { Profile } from '../screens/MoreScreen'

const { width, height } = Dimensions.get('window')

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

export const Subheader = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 0;
  margin: 0;
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

export const Menu = styled.TouchableOpacity``;

const SubMenu = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: center;
  padding: 0;
`;

export type Filtro = 'series' | 'movie' | 'myList' | null

export type FiltroGenre = 'Home' | 'My List' | "Action" | "Adventure" | "Animation" | "Biography" | "Comedy" | "Crime" | "Documentary" | "Drama" | "Fantasy" | "History" | "Horror" | "Mystery" | "Romance" | "Short" | "Sci-Fi" | "Thriller"

export type FiltroGenreList = { key: string, value: FiltroGenre }[]

type Header = {
  perfil: Profile
  navigation: any
  callBackFilter: (value: Filtro) => void
  callBackFilterGenre: (value: FiltroGenre) => void
}

const Header = (props: Header) => {
  const { perfil, navigation, callBackFilter, callBackFilterGenre } = props
  const { lg } = useContext(TempStore)
  const [showCategorias, setShowCategorias] = useState(false)
  const [categorias, setCategorias] = useState<FiltroGenreList[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState<FiltroGenre | undefined>(undefined)
  
  const HeadersHome = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: ${selectedCategoria ? 'flex-start' : 'space-around'};
  padding: 0;
  width: 100%;
  margin-top: 10px;
`;
  
  useEffect(() => {
    const catArr: FiltroGenreList = Object.keys(lg.genreFilters).map(k => {
      return {key: k, value: lg.genreFilters[k]}
    })
    setCategorias(catArr)
  }, [])
  
  return (
    <>
      <LinearGradient
        start={{x: width / 2, y: 0}}
        end={{x: width / 2, y: 0.5}}
        colors={['rgba(0, 0 , 0, 0.4)', 'rgba(0, 0 , 0, 0.5)', 'rgba(0, 0 , 0, 0)']}
        style={{flex: 1, zIndex: -1}}
      >
        <Container>
          <Subheader>
            <Menu onPress={() => callBackFilter(null)}>
              <Logo onPress={() => callBackFilter(null)} resizeMode="contain" source={require('../assets/logo.png')}/>
            </Menu>
            <Pressable
              onPress={() => navigation.navigate('More')}
            >
              {
                perfil.uri
                ? <AvatarIcon source={{uri: perfil.uri}}/>
                : <AvatarIcon source={perfil.icon}/>
              }
            </Pressable>
          </Subheader>
          
          <HeadersHome>
            {
              !selectedCategoria &&
              <>
                <Menu onPress={() => callBackFilter('series')}>
                  <Label>{lg.headerHome.series}</Label>
                </Menu>
  
                <Menu onPress={() => callBackFilter('movie')}>
                  <Label>{lg.headerHome.movies}</Label>
                </Menu>
              </>
            }
            
            <Menu onPress={() => {
              if(categorias.length < 1 ) return;
              setShowCategorias(!showCategorias)
            }}>
              <SubMenu>
                <Label>{selectedCategoria ?? lg.headerHome.category}</Label>
                <FontAwesome size={22} style={{marginLeft: 5}} name={'caret-down'} color={'#FFF'}/>
              </SubMenu>
            </Menu>
          </HeadersHome>
        
        </Container>
      </LinearGradient>
      <Portal>
        <Modal visible={showCategorias} style={{ height: '100%' }}>
            <View style={{ height: '90%', alignItems: 'center', justifyContent: 'center', paddingTop: 30 }}>
              <ScrollView
                style={{alignSelf: 'center', width: '90%'}}
                contentContainerStyle={{ alignItems: 'center', justifyContent: 'center'}}
                showsVerticalScrollIndicator={false}
              >
                {
                  categorias.map((item, index) => (
                    <TouchableOpacity
                      style={{ marginBottom: 25 }}
                      key={index}
                      onPress={() => {
                        callBackFilterGenre(item.key)
                        if(item.key === 'Home') {
                          setSelectedCategoria(undefined)
                        } else {
                          setSelectedCategoria(item.value)
                        }
                        setShowCategorias(false)
                      }}
                    >
                      <Label>{item.value}</Label>
                    </TouchableOpacity>
                  ))
                }
              </ScrollView>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 0,
                }}
                onPress={() => setShowCategorias(false)}
              >
                <FontAwesome name={'times-circle'} size={50} color={'#FFF'}/>
              </TouchableOpacity>
            </View>
        </Modal>
      </Portal>
    </>
  );
};

export default Header;
