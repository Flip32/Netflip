import React from 'react'
import { StyleSheet, View } from 'react-native'
import { LogoBig, LogoBigContainer } from './AuthScreen'

const InitialPAge = () => {
  
  return (
    <View style={styles.container}>
      <LogoBigContainer>
        <LogoBig resizeMode="contain" source={require('../assets/images/icon.png')}/>
      </LogoBigContainer>
    </View>
  )
}

export default InitialPAge;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000'}
})
