import React, {useEffect, useState} from 'react';
import {Alert, Linking, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from "expo-image-manipulator";

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
      // console.log("DEBUG BOLADO >>>>>> picture", picture);
      const imageResult = await resizePicture(picture);
      // console.log("DEBUG BOLADO >>>>>> imageResult", imageResult);
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
      <TouchableOpacity
        onPress={async () => {
          const picture = await takePictureFromCamera({ cameraType: 'front', aspect: [3, 4] })
          if(!picture.cancelled) {
            props.onPictureTaken(picture)
          }
        }}
        style={styles.successContainer}
        {...props.store.testIds('cadastro_selfie_abrir_camera')}
      >
        <Text>Abrir câmera</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  successContainer: { alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginVertical: 20 },
})
