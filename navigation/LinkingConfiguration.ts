/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              TabOneScreen: 'home',
            },
          },
          Search: {
            screens: {
              TabTwoScreen: 'search',
            },
          },
          Soon: {
            screens: {
              TabTwoScreen: 'soon',
            },
          },
          Downloads: {
            screens: {
              TabTwoScreen: 'downloads',
            },
          },
          Menu: {
            screens: {
              TabTwoScreen: 'menu',
            },
          },
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

export default linking;
