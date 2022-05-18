import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

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

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [perfil, setPerfil] = React.useState('teste')
  const [profilesAvailables, setProfilesAvailables] = React.useState<Profile[]>(profilesAvailablesInitial)
  const [authenticated, setAuthenticated] = React.useState<boolean|null>(null)
  
  
  async function userLogged(){
    const persisted = await AsyncStorage.getItem('user');
    try{
      if(!!persisted){
        const email = persisted.split('-')[0]
        const password = persisted.split('-')[1]
        const log = await singIn(email, password)
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
  
  React.useEffect(() => {
    userLogged().then()
  }, [])
  
  return (
    <TempStore.Provider value={{ perfil, setPerfil, profilesAvailables, setProfilesAvailables }}>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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

function RootNavigator({authenticated}) {
  if(authenticated === null){
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
      <Stack.Screen name="Camera" component={CameraScreen} options={{ title: 'Camera' }}  />
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

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} /> }}
      />
      <BottomTab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Soon"
        component={SearchScreen}
        options={{
          headerShown: false,
          title: 'Soon',
          tabBarIcon: ({ color }) => <TabBarIcon name="folder" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Downloads"
        component={SearchScreen}
        options={{
          title: 'Downloads',
          tabBarIcon: ({ color }) => <TabBarIcon name="download" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Menu"
        component={More}
        options={{
          headerShown: false,
          title: 'Menu',
          tabBarIcon: ({ color }) => <TabBarIcon name="bars" color={color} />,
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
