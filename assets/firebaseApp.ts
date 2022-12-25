import { initializeApp } from 'firebase/app'

function initiateFirebaseApp() {
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
  const firebaseConfig = {
    apiKey: 'AIzaSyAw49i1OE5mEsQMOWZRHZlWph_MPP1CUDs',
    authDomain: 'no-meeting.firebaseapp.com',
    projectId: 'no-meeting',
    storageBucket: 'no-meeting.appspot.com',
    messagingSenderId: '878106843402',
    appId: '1:878106843402:web:43462bc3ac9ab3ef3882f3',
  }
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
}
export default initiateFirebaseApp
