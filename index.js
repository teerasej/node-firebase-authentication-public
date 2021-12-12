
import * as readline from "readline-sync";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";

import * as fs from 'fs/promises'
import Axios from "axios";

const signIn = async (email, password) => {
    try {

        console.log(email, password)

        const auth = getAuth()
        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        if (userCredential.user.emailVerified) {
            console.log(`Hello, ${userCredential.user.email}`)

            return userCredential.user

        } else {
            console.log('Sorry, But you need to check your email and click the verification link.')
        }

    } catch (e) {
        console.error('error:', e)
        return null;
    }
}



(async () => {

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
    console.log('...initializing app')
    const app = initializeApp(firebaseConfig);
    console.log('...initializing app success')

    try {



        let command = -1;
        let signedInUser;

        // ad hoc signin
        signedInUser = await signIn('teerasej@gmail.com', '111222333')

        do {
            console.log('\n==== Firebase Client ====')

            console.log('   0: Exit')
            console.log('   1: Sign in user')

            console.log('\n --- Note ---')
            console.log('   2: Create tweet')

            console.log('Type command:')
            const command = readline.questionInt()

            if (command == 0) {
                break;
            }

            switch (command) {

               
                case 1:
                    const email = readline.questionEMail()
                    const password = readline.question('password:')
                    signedInUser = await signIn(email, password)


                    break

                case 2:

                    try {
                        if (!signedInUser) {
                            console.log('   please sign in first.')
                            continue
                        }

                        const message = readline.question('Messsage:')

                        if (!message) {
                            continue
                        }

                        const functions = getFunctions(app);
                        // Remove this if production
                        connectFunctionsEmulator(functions, "localhost", 5001);

                        const createMessage = httpsCallable(functions, 'createMessage');

                        const result = await createMessage({ userId: signedInUser.uid, message: message})

                        console.log(`   message created ${result}`)
                        

                        
                    } catch (error) {
                        console.log('Error', error)
                    }

                    break

                
            }
        } while (command != 0)
    } catch (e) {
        console.log('error:', e)
    }
})();

