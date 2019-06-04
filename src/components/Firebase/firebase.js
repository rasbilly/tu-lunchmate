import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

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
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  //Auth functions
  createUser = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  signIn = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  signOut = () => this.auth.signOut();
  resetPassword = email => this.auth.sendPasswordResetEmail(email);
  updatePassword = password => this.auth.currentUser.updatePassword(password);
  //get user from db and merge into object to store in cache
  onAuthUserListener = (next, fallback) =>
      this.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          this.user(authUser.uid)
              .get()
              .then(snapshot => {
                const dbUser = snapshot.data();
                // default empty roles
                if (!dbUser.isAdmin) {
                  dbUser.isAdmin = false;
                }
                // merge auth and db user
                authUser = {
                  uid: authUser.uid,
                  email: authUser.email,
                  ...dbUser,
                };
                next(authUser);
              });
        } else {
          fallback();
        }
      });

  //Get user
  user = uid => this.db.collection("users").get(uid)

}

export default Firebase;
