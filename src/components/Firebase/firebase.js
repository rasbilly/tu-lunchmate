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

const defprofilepic = "gs://tu-lunchmate.appspot.com/profile_pictures/default.png";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

      //Auth functions
      signIn = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);
      signOut = () => this.auth.signOut();
      resetPassword = email => this.auth.sendPasswordResetEmail(email);
      updatePassword = password => this.auth.currentUser.updatePassword(password);
      //get user from db and combine with object to store in cache
      onAuthUserListener = (next, fallback) =>
          this.auth.onAuthStateChanged(authUser => {
            if (authUser) {
              this.user(authUser.uid)
                  .then(snapshot => {
                    const dbUser = snapshot.data();
                    // default empty roles
                    if (dbUser.isAdmin==null) {
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
    user = uid => this.db.collection("users").doc(uid).get();
    //Get list of majors
    majors = () => this.db.collection("majors").get();
    //Get Interests
    interests = () => this.db.collection("interests").get();

    //Registration functions
    createUser = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    createUserInDB = (uid) => this.db.collection("users").doc(uid).set({}).then(function() {
        console.log("User created in db");
    }).catch(function(error) {
            console.error("Error creating user: ", error);
    });
    setUserBio =  (major, interests) => this.db.collection("users").doc(this.auth.currentUser.uid)
        .set({
            major: major,
            interests: interests
        }).then(function () {
            console.log("User Bio updated");
        }).catch(function (error) {
            console.error("Error updating bio:",error);
        });
    setProfile = (name, photoURL) => this.auth.currentUser.updateProfile({
        displayName: name,
        photoURL: (photoURL) ? photoURL : defprofilepic
    }).then()
}

export default Firebase;
