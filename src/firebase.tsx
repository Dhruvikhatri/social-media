// import React from "react";
import firebase from 'firebase/compat/app'
// import initializeApp from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyC3F-8lS2QBCZNIQBNfaDzcEYlTKkHfK-Q",
    authDomain: "socialmedia-18473.firebaseapp.com",
    projectId: "socialmedia-18473",
    storageBucket: "socialmedia-18473.appspot.com",
    messagingSenderId: "996446853377",
    appId: "1:996446853377:web:f9838494a81e1ae4cc6300"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth()
// const storage = firebase.storage()
// const db = firebase.firestore();
// export default {auth, storage, db }
export default firebase