import app from 'firebase/app';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DBURL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDERID,
};

class Firebase {
  constructor() {
    console.log(process.env.REACT_APP_FIREBASE_API_KEY);
    app.initializeApp(config);
    this.auth = app.auth();
  }

  //Auth functions
  createUser = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  signOut = () => this.auth.signOut();
  resetPassword = email => this.auth.sendPasswordResetEmail(email);
  updatePassword = password => this.auth.currentUser.updatePassword(password);
}

export default Firebase;
