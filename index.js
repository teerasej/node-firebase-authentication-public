
import * as readline from "readline-sync";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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

    // Remove unworthy databaseURL config...
    const firebaseConfig = {
        
    };

    // Initialize Firebase
    console.log('...initializing app')
    const app = initializeApp(firebaseConfig);
    console.log('...initializing app success')

    try {



        let command = -1;
        let signedInUser;

        // ad hoc signin
        signedInUser = await signIn('', '')

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
                        const message = readline.question('Messsage:')

                        if (!message) {
                            continue
                        }

                        // Remove these things...
                        const fireStore = getFirestore(app)
                        const noteCollection = collection(fireStore, '/notes')
                        const doc = await addDoc(noteCollection, {
                            userId: signedInUser.uid,
                            message: message,
                            createdDate: serverTimestamp()
                        })

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

