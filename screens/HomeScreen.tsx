import React, {useEffect, useState, useContext} from 'react'
import {Dimensions, StatusBar, StyleSheet} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import { RootTabScreenProps } from '../types'
import styled from 'styled-components/native'
import { Text, View } from '../components/Themed'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Movies, {Item} from '../components/Movies'
import api from '../assets/movies.json'
import apiMoviesCache from '../assets/movieToResume.json'
import TempStore from '../navigation/tempStore'

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

const itemDestaqueDefault: Item = {
    "Title": "Black Mirror",
    "Year": "2011–",
    "Rated": "TV-MA",
    "Released": "04 Dec 2011",
    "Runtime": "60 min",
    "Genre": "Drama, Sci-Fi, Thriller",
    "Director": "N/A",
    "Writer": "Charlie Brooker",
    "Actors": "Daniel Lapaine, Hannah John-Kamen, Michaela Coel, Beatrice Robertson-Jones",
    "Plot": "An anthology series exploring a twisted, high-tech multiverse where humanity's greatest innovations and darkest instincts collide.",
    "Language": "English",
    "Country": "UK",
    "Awards": "Won 6 Primetime Emmys. Another 24 wins & 85 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BYTM3YWVhMDMtNjczMy00NGEyLWJhZDctYjNhMTRkNDE0ZTI1XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "8.8/10"
      }
    ],
    "Metascore": "N/A",
    "imdbRating": "8.8",
    "imdbVotes": "396,848",
    "imdbID": "tt2085059",
    "Type": "series",
    "totalSeasons": "5",
    "Response": "True"
  }

export default function HomeScreen(props: RootTabScreenProps<'Home'>) {
  const { navigation, route } = props;
  
  const { perfil } = useContext(TempStore);
  
  const [itensRecomendados, setItensRecomendados] = useState(() => api);
  const [itensTop10, setItensTop10] = useState(() => api)
  const [continuarAssisindo, setContinuarAssisindo] = useState([])
  const [destaque, setDestaque] = useState(itemDestaqueDefault)
  
  function atualizarContinuarAssistindo(){
    if(!perfil) return;
    console.log('api movies cache', apiMoviesCache)
    // @ts-ignore
    const moviesArr = apiMoviesCache[perfil.name]
    if(moviesArr && moviesArr.length > 0){
      setContinuarAssisindo(moviesArr)
    }
  }
  
  function atualizarDestaque() {
    const itemAleatorio: Item = api[Math.floor(Math.random() * api.length)]
    setDestaque(itemAleatorio)
  }
  
  function atualizarRecomendados() {
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
  }
  
  useEffect(() => {
    atualizarContinuarAssistindo()
    atualizarDestaque();
    atualizarRecomendados();
  }, []);

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Container>
        <Poster source={{ uri: destaque.Poster }}>
          <Gradient
            locations={[0, 0.2, 0.6, 0.93]}
            colors={[
              'rgba(0,0,0,0.5)',
              'rgba(0,0,0,0.0)',
              'rgba(0,0,0,0.0)',
              'rgba(0,0,0,1)',
            ]}>
            <Header navigation={navigation} perfil={perfil} />
            <Hero item={destaque} />
          </Gradient>
        </Poster>
        { (!!continuarAssisindo && continuarAssisindo.length > 0) &&
          <Movies label="Continuar assitindo" itens={continuarAssisindo} />
        }
        <Movies label="Recomendados" itens={itensRecomendados} />
        <Movies label="Top 10" itens={itensTop10} />
      </Container>
    </>
  );
}
