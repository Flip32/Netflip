import React, {useContext, useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, View, Image, Dimensions, TouchableOpacity, FlatList} from 'react-native';
import { Searchbar, Paragraph, Text } from 'react-native-paper';
import api from '../assets/movies.json'
import { FontAwesome } from '@expo/vector-icons'
import TempStore from '../navigation/tempStore'
import ItemInfo from '../components/itemInfo'
import {isIos} from './HomeScreen'

const {width, height } = Dimensions.get('window');

export default function SearchScreen() {
  
  const { lg } = useContext(TempStore)
  
  const [searchQuery, setSearchQuery] = useState('')
  const onChangeSearch = (query: string) => setSearchQuery(query)
  const [list, setList] = useState(undefined)
  const [showItemInfo, setShowItemInfo] = useState(null)

  useEffect(() => {
    if(searchQuery === ''){
      return setList(undefined)
    }
      setList(api.filter(item => item.Title.toLowerCase().includes(searchQuery.toLowerCase())))
  }, [searchQuery])

  return (
    <>
      <SafeAreaView style={styles.container}>
        {
          !isIos && <View style={{height: 30}} />
        }
        <Searchbar
          placeholder={lg.bottomIcons.search}
          onChangeText={onChangeSearch}
          value={searchQuery}
          clearAccessibilityLabel="Clear"
        />
        <Paragraph allowFontScaling={false} style={styles.title}>{!list ? lg.searchTitle.allList : lg.searchTitle.filtered}</Paragraph>
        {
          !list &&
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            style={styles.list}
          >
            {
              api.map( item => {
                return (
                  <TouchableOpacity onPress={() => setShowItemInfo(item)} key={item.imdbID} style={styles.itemContainer}>
            
                    <Image style={styles.itemImage} source={{uri: item.Poster}} />
            
                    <View style={styles.itemInfo}>
                      <Text>{ item.Title }</Text>
                    </View>
            
                    <View style={styles.playContainer}>
                      <FontAwesome name={'play-circle-o'} size={35} color={'#fff'} />
                    </View>
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
        }
        {
          list &&
            <FlatList
              contentContainerStyle={styles.listContainer}
              style={styles.list}
              data={list}
              numColumns={3}
              keyExtractor={item => item.imdbID}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity onPress={() => setShowItemInfo(item)} key={item.imdbID} style={styles.itemContainerPosters}>
          
                    <Image style={styles.itemImagePoster} source={{uri: item.Poster}} />
        
                  </TouchableOpacity>
                )}
              }
            />
        }
      </SafeAreaView>
      {
        showItemInfo && <ItemInfo item={showItemInfo} onClose={() => setShowItemInfo(undefined)} />
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#000'
  },
  listContainer: { alignItems: 'flex-start', justifyContent: 'center' },
  list: { paddingHorizontal: 10 },
  itemInfo: { width: width/1.8, alignItems: 'flex-start', justifyContent: 'center', paddingHorizontal: 10 },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 10
  },
  itemContainer: { flexDirection: 'row', marginBottom: 5 },
  itemImage: { width: width/3.8, height: width/8, marginRight: 10, marginBottom: 10, borderRadius: 4 },
  playContainer: { width: width/8, alignItems: 'center', justifyContent: 'center', borderRadius: 4, backgroundColor: '#000' },
  
  itemContainerPosters: { flexDirection: 'row', marginBottom: 10 },
  itemImagePoster: { width: (width - 40)/3, height: ((height*0.8) - 80)/3, marginRight: 5, borderRadius: 4 },
});
