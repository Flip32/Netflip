import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Alert, AsyncStorage} from 'react-native';
import {HelperText, TextInput} from 'react-native-paper'
import { CommonActions } from "@react-navigation/native";
import { Logo } from '../components/Header'
import styled from 'styled-components'
import * as Yup from 'yup'
import { Formik } from 'formik'
import {auth, LOCAL_KEY} from '../config/firebase'
import {singIn} from '../service/firestore'

const HeaderAuth = styled.View`
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  padding: 25px 25px 0 25px;
  width: 100%;
  margin-top: 10px;
`;

const AuthPage = (props) => {
  
  const [showLogin, setShowLogin] = useState(false)
  
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
      const log = await singIn(email, password)
      if(!log){
        throw new Error('User not found')
      }
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
      Alert.alert('Login Failed', e.message);
      return console.log('Deu ruim ao fazer login', e)
    }
  }
  
  
  const formRender = () => {
    return (
      <View style={styles.formContainer}>
        <Formik
          initialValues={{ email: 'teste@email.com', password: '123456' }}
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
                style={{backgroundColor: 'white'}}
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
                style={{backgroundColor: 'white'}}
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
      <HeaderAuth>
        <Logo resizeMode="contain" source={require('../assets/logo.png')}/>
      </HeaderAuth>
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
