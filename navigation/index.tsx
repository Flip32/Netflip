import React, {useState, useEffect, useContext} from 'react';
import { ColorSchemeName } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import HomeScreen from '../screens/HomeScreen'
import SearchScreen from '../screens/SearchScreen';
import { RootStackParamList, RootTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import ProfileToEdit from '../screens/ProfileToEditScreen'
import More, {Profile} from '../screens/MoreScreen'
import ChooseIcon from '../screens/ChooseIconScreen'
import CameraScreen from '../screens/CameraScreen'
import AuthPage from '../screens/AuthScreen'
import TempStore from './tempStore'
import InitialPage from '../screens/initialPage'
import {getAllAvatarsFromDB, singIn} from '../service/firestore'
import languages from '../assets/languages.json'
import {Theme} from '@react-navigation/native/src/types'

const LightTheme: Theme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 59, 48)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(216, 216, 216)',
    notification: 'rgb(255, 59, 48)',
  },
};

const DarkTheme: Theme = {
  dark: true,
  colors: {
    primary: 'rgb(255, 69, 58)',
    background: 'rgb(76,75,75)',
    card: 'rgb(18, 18, 18)',
    text: 'rgb(229, 229, 231)',
    border: 'rgb(39, 39, 41)',
    notification: 'rgb(255, 59, 48)',
  },
};

export const profilesAvailablesInitial: Profile[] = [
  {
    icon: require('../assets/avatars/avatar1.png'),
    name: 'José',
    uri: null,
  },
  {
    icon: require('../assets/avatars/avatar2.png'),
    name: 'Luiz',
    uri: null,
  },
  {
    icon: require('../assets/avatars/avatar3.png'),
    name: 'João',
    uri: null,
  },
  {
    icon: require('../assets/avatars/avatar4.png'),
    name: 'Maria',
    uri: null,
  },
  {
    icon: require('../assets/avatars/avatar5.png'),
    name: 'Pedro',
    uri: null,
  },
];

const linguasDisponiveis = [ 'en', 'pt' ]
type LG = {
  "bottomIcons": {
    "home": string
    "search": string
    "downloads": string
    "menu": string
    "soon": string
  },
  "headerHome": {
    "series": string
    "movies": string
  },
  "buttonsInteractive": {
    "myList": string
    "myAccount": string
    "logout": string
    "login": string
    "register": string
    "more": string
    "watch": string
  },
  "blockTitle": {
    "keepWatching": string
    "myList": string
    "recommended": string,
    "top10": string
  },
  "settings": {
    "editiPerfil": string
    "edit": string
  },
  "pageTitles": {
    "camera": RootTabParamList
    "home": RootTabParamList
    "search": RootTabParamList
    "downloads": RootTabParamList
    "menu": RootTabParamList
    "soon": RootTabParamList
  }
}

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [perfil, setPerfil] = useState('teste')
  const [profilesAvailables, setProfilesAvailables] = useState<Profile[]>(profilesAvailablesInitial)
  const [authenticated, setAuthenticated] = useState<boolean|null>(null)
  const [lg, setLg] = useState<LG | null>(null)

  
  async function userLogged(){
    const persisted = await AsyncStorage.getItem('user');
    try{
      if(!!persisted){
        const email = persisted.split('-')[0]
        const password = persisted.split('-')[1]
        const log = await singIn(email, password)
        // @ts-ignore
        if(log?.user.uid){
          await getAllAvatarsFromDB(setProfilesAvailables)
          setAuthenticated(true)
        } else {
          setAuthenticated(false)
        }
      } else {
        setAuthenticated(false)
      }
    } catch (e) {
      console.log('Deui ruim ao tentar logar', e)
      setAuthenticated(false)
    }
  }
  
  /*
  * Captura a linguagem do dispositivo do usuario
  */
  async function carregarLg(){
    const localization = Localization.locale
    const idioma = linguasDisponiveis.find(l => localization.includes(l))
    if(!idioma){
      // @ts-ignore
      setLg(languages['en'])
    } else {
      // @ts-ignore
      setLg(languages[idioma])
    }
    
  }
  
  useEffect(() => {
    userLogged().then()
    carregarLg().then()
  }, [])
  
  return (
    // @ts-ignore
    <TempStore.Provider value={{ perfil, setPerfil, profilesAvailables, setProfilesAvailables, lg, setLg }}>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : LightTheme}>
        <RootNavigator authenticated={authenticated} lg={lg} />
      </NavigationContainer>
    </TempStore.Provider>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

// @ts-ignore
function RootNavigator({authenticated, lg}) {
  if(lg === null || authenticated === null){
    return <InitialPage/>
  }
  return (
    <Stack.Navigator initialRouteName={!!authenticated ? 'More' : 'AuthPage'}>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="ProfileToEdit" component={ProfileToEdit} options={{ headerShown: false }} />
      {/*<Stack.Screen name="InitialPage" component={InitialPage} options={{ headerShown: false }} />*/}
      <Stack.Screen name="ChooseIcon" component={ChooseIcon} options={{ headerShown: false }} />
      <Stack.Screen name="AuthPage" component={AuthPage} options={{ headerShown: false }} />
      <Stack.Screen name="More" component={More} options={{ headerShown: false }} />
      <Stack.Screen name="Camera" component={CameraScreen} options={{ title: lg.pageTitles.Camera }}  />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { lg } = useContext(TempStore)

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name={lg.pageTitles.home}
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} /> }}
      />
      <BottomTab.Screen
        name={lg.pageTitles.search}
        component={SearchScreen}
        options={{
          // headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <BottomTab.Screen
        name={lg.pageTitles.soon}
        component={SearchScreen}
        options={{
          // headerShown: false,
          title: `${lg.pageTitles.soon}`,
          tabBarIcon: ({ color }) => <TabBarIcon name="folder" color={color} />,
        }}
      />
      <BottomTab.Screen
        name={lg.pageTitles.downloads}
        component={SearchScreen}
        options={{
          title: `${lg.pageTitles.downloads}`,
          tabBarIcon: ({ color }) => <TabBarIcon name="download" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
