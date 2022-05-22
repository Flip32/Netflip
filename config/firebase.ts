import firebase from "firebase/compat";

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
}
// Initialize Firebase
export const appInitilizer = firebase.initializeApp(firebaseConfig);

export const database = firebase.firestore()
export const auth = firebase.auth()
export const LOCAL_KEY = firebase.auth.Auth.Persistence.LOCAL





