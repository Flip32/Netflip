import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import  { Asset } from 'expo-asset';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  
  
  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
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
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }
    
    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
