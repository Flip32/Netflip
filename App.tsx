import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-native-paper'

import useCachedResources from './hooks/useCachedResources';
// import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export default function App() {
  const loader = useCachedResources();
  // const colorScheme = useColorScheme();

  if (!loader.isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider>
          <Navigation
            authenticated={loader.authenticated}
            cacheAvatars={loader.cacheAvatars}
            initialLG={loader.initialLG}
          />
        </Provider>
      </SafeAreaProvider>
    );
  }
}
