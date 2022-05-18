import firebase from 'firebase/compat/app'
import { auth, database } from '../config/firebase'
import 'firebase/storage';
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { Profile } from '../screens/MoreScreen'
import { profilesAvailablesInitial } from '../navigation'


export const currentFirebaseUser = () => {
  return new Promise((resolve, reject) => {
    let unsubscribe = null;
    unsubscribe = firebase.auth().onAuthStateChanged(
      (user) => resolve(user),
      (error) => reject(error),
      () => unsubscribe()
    )
  })
}

export const getMinhaLista = async (name) => {
  const user = await currentFirebaseUser()
  const listRef = database.collection(`${user.uid}`).doc(`${name}_minhaLista`)
  const doc = await listRef.get()
  const lista = doc.data()
  return lista
}

export const saveItemOnList = async (item, usuario, lista, callback) => {
  const tipo = item.Type
  if(!tipo) return;
  const newList = (!!lista && lista !== {})
                  ? (!!lista[tipo])
                    ? { ...lista, [tipo]: [...lista[tipo], item.imdbID] }
                    : { ...lista, [tipo]: [item.imdbID] }
                  : { [tipo]: [item.imdbID] }
  
  const user = await currentFirebaseUser()
  await database.collection(`${user.uid}`).doc(`${usuario.name}_minhaLista`).set(newList)
  callback()
}

export const removeItemOnList = async (item, usuario, lista, callback) => {
  const tipo = item.Type
  if(!tipo) return;
  const newList =   { ...lista, [tipo]: lista[tipo].filter(id => id !== item.imdbID) }
  
  const user = await currentFirebaseUser()
  await database.collection(`${user.uid}`).doc(`${usuario.name}_minhaLista`).set(newList)
  callback()
}

export const singIn = async (email, password) => {
  return auth.signInWithEmailAndPassword(email, password)
}

export const getAllAvatarsFromDB = async (setProfilesAvailables: (values: Profile[]) => void) => {
  const namesTemp = ['José', 'Luiz', 'João', 'Maria', 'Pedro']
  const user = await currentFirebaseUser()
  const avatars: Profile[] = []
  for(let name of namesTemp) {
      const userRef = database.collection(`${user.uid}`).doc(`${name}_avatar`)
      const doc = await userRef.get()
      const avatar = doc.data()
      if(avatar){
        avatars.push({ name, uri: avatar.url, icon: null })
      }
    }
  
  if(avatars && avatars.length>0){
    const newProfilesTemp = profilesAvailablesInitial.map(profile => {
      const avatar = avatars.find(avatar => avatar.name === profile.name)
      if(avatar){
        return {...profile, uri: avatar.uri, icon: null}
      }
      return profile
    })
    setProfilesAvailables(newProfilesTemp)
  }
}

export const saveAvatarOnDB = async (url: string, name: string) => {
  const user = await currentFirebaseUser()
  await database.collection(`${user.uid}`).doc(`${name}_avatar`).set({url})
}

export const saveAvatarOnStorage = async (avatar, name: string) => {
  const user = await currentFirebaseUser()
  
  const storage = getStorage();
  
  const uri = await avatar.uri;
  const childPath = `${user.uid}/avatars/${name}_avatar`;
  const reference = ref(storage, childPath)
  const response = await fetch(uri)
  const blob = await response.blob()
  const task = await uploadBytes(reference, blob)
  const downloadURL =  await getDownloadURL(reference)
  await saveAvatarOnDB(downloadURL, name)
  return downloadURL;
}
