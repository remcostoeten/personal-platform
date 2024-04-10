
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCZdnGJtM7rxzk7y7Ga1vKvGoHv8ja23e4",
    authDomain: "personal-panel---chat.firebaseapp.com",
    projectId: "personal-panel---chat",
    storageBucket: "personal-panel---chat.appspot.com",
    messagingSenderId: "534740783847",
    appId: "1:534740783847:web:2ba1ee44119c4d862a4842"
};


// Initialize Firebase
if (!getApps().length) {
    initializeApp(firebaseConfig);
}
// Initialize Firebase auth
export const auth = getAuth();