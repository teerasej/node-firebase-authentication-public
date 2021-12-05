
import * as readline from "readline-sync";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, doc, serverTimestamp, query, where, deleteDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import * as fs from 'fs/promises'

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
        signedInUser = await signIn('teerasej@gmail.com','111222')

        do {
            console.log('\nFirebase Client')

            console.log('   0: Exit')
            console.log('   1: Create new user')
            console.log('   2: Sign in user')
            console.log('   3: Check email exists')

            console.log('\n --- Note ---')
            console.log('   4: Create tweet')
            console.log('   5: List tweets')
            console.log('   6: Remove tweet')
            console.log('   7: Edit tweet')

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

                        signedInUser = user;

                        let actionCodeSettings = {
                            url: 'http://localhost:3000/?email=' + user.email,
                        }
                        await sendEmailVerification(user, actionCodeSettings)
                    } catch (e) {
                        if (e.code == 'auth/email-already-in-use') {
                            console.error('Email already used.')
                        } else {
                            console.error('error:', e)
                        }
                    }
                    break

                case 2:
                    const email = readline.questionEMail()
                    const password = readline.question('password:')
                    signedInUser = await signIn(email, password)


                    break

                case 3:


                    try {
                        const email = readline.questionEMail()
                        const auth = getAuth()
                        const methods = await fetchSignInMethodsForEmail(auth, email)

                        if (methods.length > 0) {
                            console.log(`${email} already used.`)
                        } else {
                            console.log(`${email} is available`)
                        }

                    } catch (e) {
                        console.error('error:', e)
                    }
                    break

                case 4:

                    if (!signedInUser) {
                        console.log('   please sign in first.')
                        continue
                    }

                    const message = readline.question('Messsage:')

                    if (!message) {
                        continue
                    }

                    console.log('Attach photo?')
                    console.log('1. No')
                    console.log('2. Yes')
                    const attachPhotoChoice = readline.questionInt('Type command:')
                    
                    let requestAttachPhoto = false
                    
                    if(attachPhotoChoice != 1) {
                        requestAttachPhoto = true
                    }

                    const fireStore = getFirestore(app)
                    const noteCollection = collection(fireStore,'/notes')
                    const doc = await addDoc(noteCollection, {
                        userId: signedInUser.uid,
                        message: message,
                        createdDate: serverTimestamp()
                    })

                    if(requestAttachPhoto) {

                        const fileName = readline.question('File name to upload:')

                        if(!fileName || fileName.length == 0) {
                            continue
                        }
                            
                        const storage = getStorage(app)
                        const remoteFileRef = ref(storage, `images/${fileName}`)
                        const buffer = await fs.readFile(fileName)

                        console.log('   uploading...')
                        const result = await uploadBytes(remoteFileRef, buffer)
                        console.log('   uploaded...')
                    }
                    
                    break

                case 5:

                    try {
                        if (!signedInUser) {
                            console.log('   please sign in first.')
                            continue
                        }
    
                        const fireStore = getFirestore(app)
                        const noteCollection = collection(fireStore,'/notes')

                        const q = query(noteCollection, where("userId", "==", signedInUser.uid));

                        const messageSnapshots = await getDocs(q)
                        const messageArray = messageSnapshots.docs.map(doc => { 
                            return { ...doc.data(), id: doc.id }
                        });




                        for (let index = 0; index < messageArray.length; index++) {
                            const message = messageArray[index];
                            console.log(`[${index}]: ${message.id}`)
                            console.log(JSON.stringify(message, null, '\t'))
                        }
                    } catch (error) {
                        console.log('Error', error)
                    }


                    break

                case 6:

                    try {
                        if (!signedInUser) {
                            console.log('   please sign in first.')
                            continue
                        }

                        const messageId = readline.question('Message ID:')                         

                        const fireStore = getFirestore(app)
                        const deletingDoc = doc(fireStore,'/notes', messageId)
                        await deleteDoc(deletingDoc)
                    
                        console.log(`   doc ${messageId} deleted.`)
                        
                    } catch (error) {
                        console.log('Error', error)
                    }

                    break

                case 7:

                    try {
                        if (!signedInUser) {
                            console.log('   please sign in first.')
                            continue
                        }

                        const messageId = readline.question('Message ID to Edit:')
                        
                       
                        const fireStore = getFirestore(app)
                        const targetDoc = doc(fireStore, '/notes', messageId)
                        const editingDoc = await getDoc(targetDoc)
                        
                        console.log(`Current message: ${editingDoc.data().message}`)
                        const newMessage = readline.question('New Message:')

                        updateDoc(targetDoc, {
                            message: newMessage,
                            updatedDate: serverTimestamp()
                        })

                        console.log(`   doc ${messageId} updated with '${newMessage}'.`)

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

