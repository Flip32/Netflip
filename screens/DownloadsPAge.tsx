import React, { useContext } from 'react';
import {Alert, ImageBackground, Pressable, SafeAreaView, StyleSheet, View} from 'react-native';
import { AvatarIcon, } from '../components/Header'
import TempStore from '../navigation/tempStore'
import { Text } from 'react-native-paper'

const DownloadsPage = (props) => {
  
  const { navigation } = props
  const { perfil, lg } = useContext(TempStore)
  
  const Header = () => {
    return (
      <View style={styles.header}>
        <Text allowFontScaling={false} style={styles.title}>{lg.pageTitles.soon}</Text>
        <Pressable
          onPress={() => navigation.navigate('More')}
        >
          {
            perfil.uri
            ? <AvatarIcon source={{uri: perfil.uri}}/>
            : <AvatarIcon source={perfil.icon}/>
          }
        </Pressable>
      </View>
    )
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <Pressable style={styles.container} onPress={() => Alert.alert('Essa página ainda é fake.')}>
        <Header perfil={perfil} navigation={navigation} />
        <ImageBackground source={require('../assets/images/downloadFake.png')} style={styles.backgroundImage} resizeMode={'contain'}/>
      </Pressable>
    </SafeAreaView>
  )
}

export default DownloadsPage;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000', },
  title: { fontSize: 24, fontWeight: 'bold' },
  header:{ flex: 0.05, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10},
  backgroundImage: {flex: 0.95},
})
