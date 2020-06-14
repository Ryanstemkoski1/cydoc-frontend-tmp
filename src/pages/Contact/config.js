import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyD5RP-goEDfIOUm__CuoivKJcVIjYEKpwY",
    authDomain: "cydoc-contact-us.firebaseapp.com",
    databaseURL: "https://cydoc-contact-us.firebaseio.com",
    projectId: "cydoc-contact-us",
    storageBucket: "cydoc-contact-us.appspot.com",
    messagingSenderId: "389654805087",
    appId: "1:389654805087:web:dc4d471f0cc4a11efc39ea",
    measurementId: "G-5MXT0W1SBS"
  };

firebase.initializeApp(config);

export default firebase;