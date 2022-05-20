import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'
import {Modal, Paragraph, Portal} from 'react-native-paper'
import { Item } from './Movies'
import TempStore from '../navigation/tempStore'

const styles = StyleSheet.create({
  container: { backgroundColor: '#000', width: '100%', height: '100%', paddingBottom: 10 },
  playerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '30%',
    borderBottomWidth: 2,
    borderColor: 'rgb(255, 69, 58)',
    marginBottom: 20,
    backgroundColor: 'rgb(32,32,32)'
  },
  titlesContainer: { paddingHorizontal: 5 },
  typeContainer: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 0 },
  typesLabels: { marginLeft: 4},
  actionButtonsContainer: { marginTop: 20, paddingHorizontal: 10 },
  actionButtons: { width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginBottom: 10, flexDirection: 'row',  },
  actButtonIcon: { marginRight: 10 },
  descricaoContainer: { paddingHorizontal: 20, marginTop: 30,  },
  elencoContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 20
  }
})

type ItemInfoProps = {
  item: Item
  onClose: () => void
}

const ItemInfo = (props: ItemInfoProps) => {
  
  const { item, onClose } = props
  const { perfil, lg } = useContext(TempStore)
  
  
  useEffect(() => {
    async function inicia() {
      await load()
    }
    
    inicia().then(() => {
    })
    return () => {
    }
  }, [])
  
  async function load() {
  
  }
  
  function Player(){
    return (
      <View style={styles.playerContainer}>
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            position: 'absolute',
            top: 10,
            right: 10
          }}
          onPress={() => onClose()}
        >
          <FontAwesome name={'times-circle'} size={30} color={'#FFF'}/>
        </TouchableOpacity>
        <FontAwesome name={'play'} size={50} color={'#fff'}/>
      </View>
    )
  }
  
  return (
    <Portal>
      <Modal visible={true}>
        
        <View style={styles.container}>
          
          <Player />
          
          <View style={styles.titlesContainer}>
            
            <View style={styles.typeContainer}>
              <Image style={{ width: 20, height: 20 }} resizeMode="contain" source={require('../assets/logo.png')} />
              <Paragraph allowFontScaling={false} style={{ marginLeft: 2 }}>{item.Type}</Paragraph>
            </View>
            <Paragraph allowFontScaling={false} style={{ marginLeft: 2 }}>{item.Title}</Paragraph>
            <View style={[styles.typeContainer, {   }]}>
              <Paragraph allowFontScaling={false} style={styles.typesLabels}>92% Relevante</Paragraph>
              <Paragraph allowFontScaling={false} style={styles.typesLabels}>{item.Year}</Paragraph>
              {
                item.Type === 'series' &&
                <Paragraph allowFontScaling={false} style={styles.typesLabels}>{item.totalSeasons || 1}</Paragraph>
              }
            </View>
          </View>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionButtons, { backgroundColor: '#FFF' }]}>
              <FontAwesome name={'play'} size={30} color={'rgb(32,32,32)'} style={styles.actButtonIcon}/>
              <Paragraph allowFontScaling={false} style={{ color: 'rgb(32,32,32)' }}>Assistir</Paragraph>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButtons, { backgroundColor: 'rgb(32,32,32)' }]}>
              <FontAwesome name={'download'} size={30} color={'#fff'} style={styles.actButtonIcon}/>
              <Paragraph allowFontScaling={false}>{ `Baixar ${item.Type === 'series' ? 'T3:E2' : ''}`}</Paragraph>
            </TouchableOpacity>
          </View>
          
          <View style={styles.descricaoContainer}>
            <Paragraph allowFontScaling={false}>{item.Plot}</Paragraph>
          </View>
  
          {
            item.Actors && item.Actors !== '' && item.Actors !== 'N/A' &&
            <View style={styles.elencoContainer}>
              <Paragraph allowFontScaling={false} numberOfLines={1} style={{fontSize: 12}}>Elenco: {item.Actors}</Paragraph>
            </View>
          }
        </View>
      </Modal>
    </Portal>
  )
}

export default ItemInfo;
