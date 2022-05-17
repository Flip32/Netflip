import React, {useEffect, useState} from 'react';
import {Alert, Linking, StyleSheet, TouchableOpacity, View, Text,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator";
import {ActivityIndicator, Avatar, Modal, Portal} from 'react-native-paper'
import {saveAvatarOnStorage} from '../service/firestore'

const imagePickerConfig: any = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  aspect: [4, 3],
  allowsEditing: false,
  quality: 0.4,
  base64: true,
  cameraType: 'back',
};

export const showPermissionRejectionAlert = (permission: any, title: any, tryAgainMessage: any, dontAskAgainMessage: any) => {
  if (permission.canAskAgain) {
    Alert.alert(
      title,
      tryAgainMessage,
      [
        {
          text: 'Entendi',
          style: 'cancel'
        },
      ]);
  } else {
    Alert.alert(
      title,
      dontAskAgainMessage,
      [
        {text: 'Acessar configurações', onPress: async () => Linking.openSettings()},
        {
          text: 'Cancelar',
          style: 'cancel'
        },
      ]);
  }
}

export async function resizePicture(pictureFile: any, resizeWidth = 800, compressRate = 0.8) {
  const finalFile = await ImageManipulator.manipulateAsync(
    pictureFile.uri,
    [{resize: {width: resizeWidth}}],
    {compress: compressRate, format: ImageManipulator.SaveFormat.PNG}
  );
  
  //Se tem base64 na origem, seta o mesmo no final.
  //Avaliar se é preciso comprimir o base64.
  finalFile.base64 = pictureFile.base64;
  
  return finalFile;
}


export async function takePictureFromCamera(customConfig?: any) {
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
  if (cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted') {
    let picture: any = await ImagePicker.launchCameraAsync({...imagePickerConfig, ...customConfig});
    
    if (!picture.cancelled) {
      const imageResult = await resizePicture(picture);
      return imageResult;
    } else {
      return picture;
    }
  } else {
    showPermissionRejectionAlert(
      cameraPermission,
      'Permissão de acesso a câmera',
      'Será necessário permitir o uso da Câmera e armazenamento interno. Por favor, aceite na próxima solicitação ...',
      'Acesse as configurações do seu dispositivo e permita o acesso à câmera e armazenamento interno para continuar'
    );
    
    return null;
  }
}

const CameraScreen = (props: any) => {
  
  const [image, setImage] = useState(null)
  const name = props.route.params.name;
  const [loading, setLoading] = useState(false)
  
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
    <>
      <View style={styles.container}>
        {
          image &&
          <View style={styles.imageContainer}>
            <Avatar.Image size={150} source={{uri: image.uri}}/>
          </View>
        }
        <TouchableOpacity
          onPress={async () => {
            setLoading(true)
            try{
              const picture = await takePictureFromCamera({ cameraType: 'front', aspect: [3, 4] })
              if(!picture.cancelled) {
                setImage(picture)
              }
              setLoading(false)
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível tirar a foto')
              setLoading(false)
            }
          }}
          style={[ styles.button, styles.buttonTakePicture]}>
          <Text style={styles.buttonLAbel}>{image ? 'Tirar outra' : 'Abrir câmera'}</Text>
        </TouchableOpacity>
        {
          image &&
          <TouchableOpacity
            style={[ styles.button, styles.buttonTakeUseAvatar]}
            onPress={async () => {
              setLoading(true)
              let url
              try{
                url = await saveAvatarOnStorage(image, name)
                setLoading(false)
              } catch (e) {
                Alert.alert('Erro', 'Não foi possível salvar a foto')
                setLoading(false)
              }
              
              if(url){
                props.navigation.navigate('More', {
                  icon: null,
                  name: name,
                  image: url,
                });
              }
            }}
          >
            <Text style={styles.buttonLAbel}>Usar como Avatar</Text>
          </TouchableOpacity>
        }
      </View>
      <Portal>
        <Modal visible={loading}>
          <ActivityIndicator size="large" color="#0000ff" />
        </Modal>
      </Portal>
    </>
  )
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginBottom: 20,
    borderRadius: 4,
    padding: 12,
  },
  buttonTakePicture: {  backgroundColor: '#252525' },
  buttonTakeUseAvatar: { backgroundColor: '#220068' },
  buttonLAbel: { color: '#FFF', fontSize: 18 },
  imageContainer: { marginBottom: 40 },
})
