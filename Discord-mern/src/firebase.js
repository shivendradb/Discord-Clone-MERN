import firebase from 'firebase'

const firebaseConfig = {
    // your firebase config
    apiKey: "AIzaSyCLMApl2Axp-jcgJ0gv1dTLNsV7RmIGjK4",
    authDomain: "discord-clone-9a532.firebaseapp.com",
    projectId: "discord-clone-9a532",
    storageBucket: "discord-clone-9a532.appspot.com",
    messagingSenderId: "195471315187",
    appId: "1:195471315187:web:df1fdc772bb507c7fa2786"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db