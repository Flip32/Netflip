import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import  { Asset } from 'expo-asset';
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import { getAllAvatarsFromDB, singIn } from '../service/firestore'
import languages from '../assets/languages.json'

const linguasDisponiveis = [ 'en', 'pt' ]

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean|null>(false)
  const [cacheAvatars, setCacheAvatars] = useState([])
  const [initialLG, setInitialLG] = useState(languages['pt'])
  
  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function userLogged(){
      const persisted = await AsyncStorage.getItem('user');
      try{
        if(!!persisted){
          const email = persisted.split('-')[0]
          const password = persisted.split('-')[1]
          const log = await singIn(email, password)
          // @ts-ignore
          if(log?.user.uid){
            const newProfilesTemp: any = await getAllAvatarsFromDB()
            if(newProfilesTemp && newProfilesTemp.length>0){
              setCacheAvatars(newProfilesTemp)
            }
            setAuthenticated(true)
          }
        }
      } catch (e) {
        console.log('Deui ruim ao tentar logar', e)
      }
    }
  
    /*
     * Captura a linguagem do dispositivo do usuario
     */
    async function carregarLg(){
      try{
        const localization = Localization.locale
        const idioma = linguasDisponiveis.find(l => localization.includes(l))
        if(!!idioma){
          // @ts-ignore
          setInitialLG(languages[idioma])
        }
      } catch (e) {
        console.log('Deu ruim ao tentar capturar a linguagem do dispositivo', e)
      }
    
    }
    
    async function cacheResourcesAsync() {
      const images = [
        require('../assets/avatars/avatar1.png'),
        require('../assets/avatars/avatar2.png'),
        require('../assets/avatars/avatar3.png'),
        require('../assets/avatars/avatar4.png'),
        require('../assets/avatars/avatar5.png'),
        require('../assets/avatars/avatar6.png'),
        
        require('../assets/images/adaptive-icon.png'),
        require('../assets/images/downloadFake.png'),
        require('../assets/images/favicon.png'),
        require('../assets/images/icon.png'),
        require('../assets/images/newsFake.png'),
        require('../assets/images/splash.png'),
        
        require('../assets/movies/movie1.jpg'),
        require('../assets/movies/movie2.jpg'),
        require('../assets/movies/movie3.jpg'),
        require('../assets/movies/movie4.jpg'),
        
        require('../assets/banner.png'),
        require('../assets/icon.png'),
        require('../assets/logo.png'),
        require('../assets/poster.jpg'),
      ];
    
      const cacheImages = images.map(image => {
        return Asset.fromModule(image).downloadAsync();
      });
      return Promise.all(cacheImages);
    }
    
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
  
        // Load assets
        await cacheResourcesAsync();
        
        // Load user Language
        await carregarLg()
        
        // Load user logged
        await userLogged()
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        Alert.alert('Deu ruim', e)
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }
    
    loadResourcesAndDataAsync();
  }, []);

  return {isLoadingComplete, authenticated, cacheAvatars, initialLG};
}
