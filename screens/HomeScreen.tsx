import React, {useEffect, useState} from 'react'
import {Dimensions, StatusBar, StyleSheet} from 'react-native';
import {LinearGradient} from 'expo-linear-gradient';
import { RootTabScreenProps } from '../types';
import styled from 'styled-components/native'
import { Text, View } from '../components/Themed';
import Header from '../components/Header'
import Hero from '../components/Hero'
import Movies, {Item} from '../components/Movies'
import api from '../assets/movies.json';


const Container = styled.ScrollView`
  flex: 1;
  background-color: #000;
`;

const Poster = styled.ImageBackground`
  width: 100%;
  height: ${(Dimensions.get('window').height * 81) / 100}px;
`;

const Gradient = styled(LinearGradient)`
  height: 100%;
`;

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  
  const [itensRecomendados, setItensRecomendados] = useState(() => api);
  const [itensTop10, setItensTop10] = useState(() => api)
  
  useEffect(() => {
      if(!api || api.length < 1) return;
      const itensR = api.filter(item => {
        if(!item.imdbRating) return false;
        return Number(item.imdbRating) >= 7.5;
      });
      if(itensR.length > 0){
        setItensRecomendados(itensR.sort((a, b) => {
          if(a.imdbRating > b.imdbRating) return -1;
          if(a.imdbRating < b.imdbRating) return 1;
          return 0;
        }));
      }
  }, [])
  
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Container>
        <Poster source={require('../assets/poster.jpg')}>
          <Gradient
            locations={[0, 0.2, 0.6, 0.93]}
            colors={[
              'rgba(0,0,0,0.5)',
              'rgba(0,0,0,0.0)',
              'rgba(0,0,0,0.0)',
              'rgba(0,0,0,1)',
            ]}>
            <Header />
            <Hero />
          </Gradient>
        </Poster>
        <Movies label="Recomendados" itens={itensRecomendados} />
        <Movies label="Top 10" itens={itensTop10} />
      </Container>
    </>
  );
}
