import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';

const CameraScreen = (props) => {
  
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
  
  return (
    <View style={styles.container}>
    
    </View>
  )
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {flex: 1}
})
