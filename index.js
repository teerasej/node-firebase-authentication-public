
import * as readline from "readline-sync";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAPov2IbRYu06oi7fNAGUZ_bJIo8lAseWo",
    authDomain: "ionicpwa-d8c79.firebaseapp.com",
    databaseURL: "https://ionicpwa-d8c79.firebaseio.com",
    projectId: "ionicpwa-d8c79",
    storageBucket: "ionicpwa-d8c79.appspot.com",
    messagingSenderId: "236296839382",
    appId: "1:236296839382:web:935031e7f83afdf3f8e977"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log('Firebase Client')

const email = readline.questionEMail()
const password = readline.question('password:')
console.log(email, password)

const auth = getAuth();
createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user)
        // ...
    })
    .catch((error) => {
        console.error(error)
        // ..
    });