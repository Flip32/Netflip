import React, {useState, useEffect, useContext} from 'react';
import { ColorSchemeName } from 'react-native';
import { FontAwesome, Foundation, MaterialCommunityIcons } from '@expo/vector-icons';
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
import NewPAge from '../screens/NewsPage'
import DownloadsPage from '../screens/DownloadsPAge'

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
    background: 'rgb(32,32,32)',
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


/*
*  SE TIVER CLONADO ESSE PROJETO DO GITHUB, não esquecer de criar uma conta firebase,
* criar um arquivo firebase.json com as credenciais do seu firebase,
* adicionar o firabase ao android, e baixar o arquivo google-services.json
*/
export default function Navigation({ authenticated, cacheAvatars, initialLG }) {
  const [perfil, setPerfil] = useState('teste')
  const [profilesAvailables, setProfilesAvailables] = useState<Profile[]>(profilesAvailablesInitial)
  const [lg, setLg] = useState(null)
  const [pushAction, setPushAction] = useState(null)
  
  useEffect(() => {
    if(cacheAvatars && cacheAvatars.length > 0){
      setProfilesAvailables(cacheAvatars)
    }
    setLg(initialLG)
  }, [])
  
  return (
    // @ts-ignore
    <TempStore.Provider value={{ perfil, setPerfil, profilesAvailables, setProfilesAvailables, lg, setLg, setPushAction, pushAction }}>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={DarkTheme}>
        <RootNavigator authenticated={authenticated} />
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
function RootNavigator({authenticated}) {
  return (
    <Stack.Navigator initialRouteName={!!authenticated ? 'More' : 'AuthPage'}>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Screen name="ProfileToEdit" component={ProfileToEdit} options={{ headerShown: false }} />
      {/*<Stack.Screen name="InitialPage" component={InitialPage} options={{ headerShown: false }} />*/}
      <Stack.Screen name="ChooseIcon" component={ChooseIcon} options={{ headerShown: false }} />
      <Stack.Screen name="AuthPage" component={AuthPage} options={{ headerShown: false }} />
      <Stack.Screen name="More" component={More} options={{ headerShown: false }} />
      {/*<Stack.Screen name="Camera" component={CameraScreen} options={{ title: lg.pageTitles.Camera }}  />*/}
      <Stack.Screen name="Camera" component={CameraScreen} />
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
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name={lg.pageTitles.home}
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} type={'F'} /> }}
      />
      <BottomTab.Screen
        name={lg.pageTitles.soon}
        component={NewPAge}
        options={{
          headerShown: false,
          title: `${lg.pageTitles.soon}`,
          // tabBarIcon: ({ color }) => <TabBarIcon name="play-circle-o" color={color} />,
          tabBarIcon: ({ color }) => <TabBarIcon name="play-box-multiple-outline" color={color} type={'MI'} />,
        }}
      />
      <BottomTab.Screen
        name={lg.pageTitles.search}
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <BottomTab.Screen
        name={lg.pageTitles.downloads}
        component={DownloadsPage}
        options={{
          headerShown: false,
          title: `${lg.pageTitles.downloads}`,
          tabBarIcon: ({ color }) => <TabBarIcon name="arrow-circle-o-down" color={color} />,
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
  type: "MI" | "F"
}) {
  if(props.type === "F"){
    return <Foundation size={20} style={{ marginBottom: -3 }} {...props} />;
  }
  if(props.type === 'MI'){
    return <MaterialCommunityIcons size={20} style={{ marginBottom: -3 }} {...props} />;
  }
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}
