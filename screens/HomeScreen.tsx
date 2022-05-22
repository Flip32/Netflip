import React, {useEffect, useState, useContext, useRef} from 'react'
import {Alert, Dimensions, Platform, StatusBar, StyleSheet} from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import {RootTabParamList, RootTabScreenProps} from '../types'
import styled from 'styled-components/native'
import { Text, View } from '../components/Themed'
import Header, {Filtro, FiltroGenre} from '../components/Header'
import Hero from '../components/Hero'
import Movies, {Item} from '../components/Movies'
import api from '../assets/movies.json'
import apiMoviesCache from '../assets/movieToResume.json'
import TempStore from '../navigation/tempStore'
import { getMinhaLista} from '../service/firestore'
import ItemInfo from '../components/itemInfo'
import * as Notifications from 'expo-notifications'
import { removeItemOnList, saveItemOnList } from '../service/firestore'

export const isIos = Platform.OS === 'ios'

export const Container = styled.ScrollView`
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
  
export type notification = { "type": "ShowMovie", "navigateTo": RootTabParamList, "params"?: { "imdbID": string } }

export default function HomeScreen(props: RootTabScreenProps<'Home'>) {
  const { navigation } = props
  const { perfil, lg, pushAction, setPushAction } = useContext(TempStore)
  
  const [itensRecomendados, setItensRecomendados] = useState(() => api)
  const [itensTop10, setItensTop10] = useState(() => api)
  const [continuarAssisindo, setContinuarAssisindo] = useState([])
  const [destaque, setDestaque] = useState(itemDestaqueDefault)
  const [filtro, setFiltro] = useState(null)
  const [filtroGenero, setFiltroGenero] = useState(null)
  const [minhaLista, setMinhaLista] = useState()
  const [itensMinhaLista, setItensMinhaLista] = useState([])
  const [showItemInfo, setShowItemInfo] = useState<Item | undefined>(undefined)
  const responseListener = useRef()
  
  function atualizarContinuarAssistindo(){
    if(!perfil) return;
    // @ts-ignore
    const moviesArr = apiMoviesCache[perfil.name]
    if(moviesArr && moviesArr.length > 0){
      if(!!filtroGenero){
        setContinuarAssisindo(moviesArr.filter(item => item.Genre.toLowerCase().includes(filtroGenero.toLowerCase())))
      } else if (!!filtro){
        setContinuarAssisindo(moviesArr.filter(item => item.Type.toLowerCase().includes(filtro.toLowerCase())))
      } else {
        setContinuarAssisindo(moviesArr)
      }
    }
  }
  
  function atualizarDestaque() {
    let arr = !!filtro ? api.filter(item => item.Type.toLowerCase().includes(filtro.toLowerCase())) : api
    arr = !!filtroGenero ? arr.filter(item => item.Genre.toLowerCase().includes(filtroGenero.toLowerCase())) : arr
    const itemAleatorio: Item = arr[Math.floor(Math.random() * arr.length)]
    if(!!itemAleatorio && !!itemAleatorio.Poster){
      setDestaque(itemAleatorio)
    } else {
      setDestaque(itemDestaqueDefault)
    }
  }
  
  function atualizarRecomendados() {
    if(!api || api.length < 1) return;
    const itensR = api.filter(item => {
      if(!item.imdbRating) return false;
      return Number(item.imdbRating) >= 7.5;
    });
    let arr = !!filtro ? itensR.filter(item => item.Type.toLowerCase().includes(filtro.toLowerCase())) : itensR
    arr = !!filtroGenero ? arr.filter(item => item.Genre.toLowerCase().includes(filtroGenero.toLowerCase())) : arr
    
    const arrSorted = arr.sort((a, b) => {
      if(a.imdbRating > b.imdbRating) return -1;
      if(a.imdbRating < b.imdbRating) return 1;
      return 0;
    })
    
    if(arr.length > 0){
      setItensRecomendados(arrSorted);
    }
  }
  
  function atualizarTop10(){
    if(!filtro && !filtroGenero) return;
    if(filtroGenero){
      setItensTop10(api.filter(item => item.Genre.toLowerCase().includes(filtroGenero.toLowerCase())))
    } else {
      setItensTop10(api.filter(item => item.Type.toLowerCase().includes(filtro.toLowerCase())))
    }
  }
  
  async function atualizarMinhaLista(){
    const lista = await getMinhaLista(perfil.name)
    if(!!lista && lista !== {}){
      setMinhaLista(lista)
    }
  }
  
  useEffect(() => {
    atualizarContinuarAssistindo()
    atualizarDestaque();
    atualizarRecomendados();
    atualizarTop10()
  }, [filtro, filtroGenero])
  
  useEffect(() => {
    atualizarMinhaLista().then()
  }, [])
  
  useEffect(() => {
    if(!pushAction) return;
    const { active, params, type,navigateTo  } = pushAction
      if(active){
        if(type === 'ShowMovie'){
          const findItem = api.find(item => item.imdbID === params.imdbID)
          if(!!findItem){
            console.log('ta caindo nesse bloco 2')
            setShowItemInfo(findItem)
          } else {
            Alert.alert('Oops', 'Ocorreu um erro ao carregar a página')
          }
          setPushAction(null)
        } else {
          navigation.navigate(lg.pageTitles[navigateTo.toLowerCase()], params)
          setPushAction(null)
        }
      }
  }, [pushAction])
  
  useEffect(() => {
    if(!minhaLista || minhaLista === {}) return;
      // filtrar api com array de imdbID da minhaLista
    const arr = []
    const arrIDs = []
    Object.keys(minhaLista).forEach(key => {
      arrIDs.push(...minhaLista[key])
    })
    
    arrIDs.forEach(id => {
      const newItem = api.find(itemApi => itemApi.imdbID === id)
      if(!newItem) return;
      arr.push(newItem)
    })

    if(arr.length > 0){
      setItensMinhaLista(arr)
    }
  }, [minhaLista])
  
  // TODO - Pensar numa forma melhor de só ter 1 listener no projeto
  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { type, navigateTo, params = {} } = response.notification.request.content.data
      if(!!navigateTo){
        const rota = lg.pageTitles[navigateTo.toLowerCase()]
        // navigation.navigate(rota === lg.pageTitles.home ? 'Root' : rota, params)
        if(rota === lg.pageTitles.home && type === 'ShowMovie'){
          const findItem = api.find(item => item.imdbID === params?.imdbID)
          if(findItem){
            console.log('ta caindo nesse bloco 1')
            setShowItemInfo(findItem)
          } else {
            Alert.alert('Oops', 'Ocorreu um erro ao carregar a página')
          }
        } else {
          navigation.navigate(lg.pageTitles[navigateTo.toLowerCase()], params)
        }
      }
    });
    
    return () => {
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])
  
  function changeFilter(value: Filtro){
    setFiltro(value)
  }
  
  function changeFilterGenre(value: FiltroGenre){
    if(value === 'Home'){
      setFiltroGenero(null)
    } else {
      setFiltroGenero(value)
    }
  }

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
            <Header navigation={navigation} perfil={perfil} callBackFilter={changeFilter} callBackFilterGenre={changeFilterGenre} />
            <Hero
              item={destaque}
              lista={minhaLista}
              callbackUpdateHome={atualizarMinhaLista}
              onClickItem={(item: Item) => setShowItemInfo(item)}
              removeItemOnList={removeItemOnList}
              saveItemOnList={saveItemOnList}
              
            />
          </Gradient>
        </Poster>
        <Movies label={lg.blockTitle.recommended} itens={itensRecomendados} onClickItem={(item: Item) => setShowItemInfo(item)} />
        {
          (!!itensMinhaLista && itensMinhaLista.length > 0) &&
          <Movies label={lg.blockTitle.myList} itens={itensMinhaLista} onClickItem={(item: Item) => setShowItemInfo(item)} />
        }
        { (!!continuarAssisindo && continuarAssisindo.length > 0) &&
          <Movies label={lg.blockTitle.keepWatching} itens={continuarAssisindo} onClickItem={(item: Item) => setShowItemInfo(item)} />
        }
        <Movies label={itensTop10?.length < 10 ? `Top ${itensTop10.length}` : `${lg.blockTitle.top10}`} itens={itensTop10} onClickItem={(item: Item) => setShowItemInfo(item)} />
        <Movies label={itensTop10?.length < 10 ? `Top ${itensTop10.length}` : `${lg.blockTitle.top10}`} itens={itensTop10} onClickItem={(item: Item) => navigation.navigate('Modal')}/>
      </Container>
      {
        showItemInfo && <ItemInfo item={showItemInfo} onClose={() => setShowItemInfo(undefined) } />
      }
    </>
  );
}
