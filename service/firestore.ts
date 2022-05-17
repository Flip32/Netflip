import firebase from 'firebase/compat'
import {auth, database} from '../config/firebase'



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
