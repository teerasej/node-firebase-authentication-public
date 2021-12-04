
import * as readline from "readline-sync";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification,signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";



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

        do {
            console.log('Firebase Client')

            console.log('   0: Exit')
            console.log('   1: Create new user')
            console.log('   2: Sign in user')
            console.log('   3: Check email exists')

            console.log('Type command:')
            const command = readline.questionInt()

            if (command == 0) {
                break;
            }

            switch (command) {

                case 1:
                    try {
                        const email = readline.questionEMail()
                        const password = readline.question('password:')
                        console.log(email, password)
                    
                        const auth = getAuth()
                        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                        const user = userCredential.user
                        console.log(user)
                        
                        let actionCodeSettings = {
                            url: 'http://localhost:3000/?email=' + user.email,
                        }
                        await sendEmailVerification(user,actionCodeSettings)
                    } catch (e) {
                        if(e.code == 'auth/email-already-in-use') {
                            console.error('Email already used.')
                        } else {
                            console.error('error:',e)
                        }
                    }
                    break

                case 2:
                    const email = readline.questionEMail()
                    const password = readline.question('password:')
                    console.log(email, password)
                
                    try {
                        const auth = getAuth()
                        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        
                        if(userCredential.user.emailVerified) {
                            console.log(`Hello, ${userCredential.user.email}`)
                        } else {
                            console.log('Sorry, But you need to check your email and click the verification link.')
                        }
                        
                    } catch (e) {
                        console.error('error:',e)
                    }
                    
                    break

                case 3:
                    
                
                    try {
                        const email = readline.questionEMail()
                        const auth = getAuth()
                        const methods = await fetchSignInMethodsForEmail(auth, email)
        
                        if(methods.length > 0) {
                            console.log(`${email} already used.`)
                        } else {
                            console.log(`${email} is available`)
                        }
                        
                    } catch (e) {
                        console.error('error:',e)
                    }
                    break
            }
        } while (command != 0) 
    } catch (e) {
        console.log('error:',e)
    }
})();


