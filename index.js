
import * as readline from "readline-sync";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

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

(async () => {
    try {
        while (true) {
            console.log('Firebase Client')

            console.log('   0: Exit')
            console.log('   1: Create new user')
            console.log('   2: Sign in user')

            const command = readline.questionInt('Select command:')

            if (command == 0) {
                break;
            }

            switch (command) {

                case 1:
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
    });                    break

                case 2:

                    break
            }
        }
    } catch (e) {
        console.log('error:',e)
    }
})();


