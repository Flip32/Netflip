import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View, Text, Alert } from 'react-native'
import { ActivityIndicator, HelperText, Portal, TextInput, Modal } from 'react-native-paper'
import { CommonActions } from "@react-navigation/native"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Logo } from '../components/Header'
import styled from 'styled-components'
import * as Yup from 'yup'
import { Formik } from 'formik'
import {getAllAvatarsFromDB, saveTokenPushNotification, singIn} from '../service/firestore'
import TempStore from '../navigation/tempStore'
import {registerForPushNotification} from '../service/notifications'

const HeaderAuth = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 25px 25px 0 25px;
  width: 100%;
  margin-top: 15px;
`;

export const LogoBigContainer = styled.View`
  align-self: center;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  position: absolute;
  top: 30%;
`;

export const LogoBig = styled.Image`
  width: 200px;
  height: 100px;
`;

const AuthPage = (props) => {
  
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setProfilesAvailables } = useContext(TempStore)
  
  const schema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
  })
  
  type LoginForm = {
    email: string,
    password: string
  }
  
  async function login(values: LoginForm) {
    const {email, password} = values
    
    try{
      setLoading(true)
      const log = await singIn(email, password)
      if(!log){
        throw new Error('User not found')
      }
      const tokenFCM = await registerForPushNotification()
      if(!!tokenFCM){
        await saveTokenPushNotification(tokenFCM)
      }
      const newProfilesTemp: any = await getAllAvatarsFromDB()
      if(newProfilesTemp && newProfilesTemp.length>0){
        setProfilesAvailables(newProfilesTemp)
      }
      setLoading(false)
      Alert.alert(
        'User Authenticated',
        `User ${log.user.email} has succesfuly been authenticated!`,
        [
          {
            text: 'OK',
            onPress: () => {
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'More'}],
                }),
              )
              AsyncStorage.setItem('user', `${email}-${password}`)
            }},
        ],
      );
    } catch (e) {
      Alert.alert('Login Failed', e.message)
      setLoading(false)
      return console.log('Deu ruim ao fazer login', e)
    }
  }
  
  const formRender = () => {
    return (
      <View style={styles.formContainer}>
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values) => {
            await login(values)
            // actions.setSubmitting(false)
          }}
          validationSchema={schema}
        >
          {({ handleChange, handleBlur, submitForm, values, errors, touched }) => (
            <>
              <TextInput
                allowFontScaling={false}
                label={'Email'}
                mode={'outlined'}
                error={!!errors.email && touched.email}
                style={{backgroundColor: '#4c4b4b', color: '#fff'}}
                onChangeText={handleChange("email")}
                onBlur={() => handleBlur('email')}
                autoCapitalize={'none'}
              />
              { !!errors.email && touched.email && <HelperText style={styles.error}>{errors.email}</HelperText> }
  
              <TextInput
                allowFontScaling={false}
                label={'Senha'}
                mode={'outlined'}
                error={!!errors.password && touched.password}
                style={{backgroundColor: '#4c4b4b', color: '#fff'}}
                onChangeText={handleChange("password")}
                onBlur={() => handleBlur('password')}
                secureTextEntry
              />
              { !!errors.password && touched.password && <HelperText style={styles.error}>{errors.password}</HelperText> }
              <TouchableOpacity style={styles.buttonContainer2} onPress={() => {
                submitForm()
              } } >
                <Text style={styles.buttonLabel}>Entrar</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      
      </View>
    )
  }
  
  return (
    <>
      <View style={styles.container}>
        {
          showLogin &&
          <HeaderAuth>
            <Logo resizeMode="contain" source={require('../assets/logo.png')}/>
          </HeaderAuth>
        }
    
        {
          !showLogin &&
          <LogoBigContainer>
            <LogoBig resizeMode="contain" source={require('../assets/images/icon.png')}/>
          </LogoBigContainer>
        }
    
        {
          showLogin && formRender()
        }
        {
          !showLogin &&
          <TouchableOpacity style={styles.buttonContainer} onPress={() => setShowLogin(true)}>
            <Text style={styles.buttonLabel}>Entrar</Text>
          </TouchableOpacity>
        }
      </View>
      <Portal>
        <Modal visible={loading}>
          <ActivityIndicator size="large" />
        </Modal>
      </Portal>
    </>
  )
}

export default AuthPage;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#101010'},
  buttonContainer: {
    backgroundColor: '#ba0000',
    borderRadius: 4,
    padding: 15,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '96%',
    alignSelf: 'center',
    bottom: 10,
    
  },
  buttonLabel: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  buttonContainer2: {
    backgroundColor: '#ba0000',
    borderRadius: 4,
    padding: 15,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    alignSelf: 'center',
    marginTop: 10
  },
  formContainer: {
    width: '100%',
    height: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  error: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5
  }
})
