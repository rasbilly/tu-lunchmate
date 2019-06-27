import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
import 'firebase/storage'
import * as firebase from "firebase";

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DBURL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDERID,
};

const lunches = "lunches";
const users = "users";
const increment = firebase.firestore.FieldValue.increment(1);
const decrement = firebase.firestore.FieldValue.increment(-1);

const defprofilepicRef = "profile_pictures/default.png";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
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
                    if (dbUser && 'isAdmin' in dbUser && dbUser.isAdmin==null) {
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
    user = uid => this.db.collection(users).doc(uid).get();
    //Get list of majors
    majors = () => this.db.collection("majors").get();
    //Get Interests
    interests = () => this.db.collection("interests").get();

    //Registration functions
    createUser = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    createUserInDB = (uid, major, interests) => this.db.collection(users).doc(uid).set({
        major: major,
        interests: interests
    });
    setUserBio =  (major, interests) => this.db.collection(users).doc(this.auth.currentUser.uid)
        .set({
            major: major,
            interests: interests
        });
    setProfile = (name, photoURL) => this.auth.currentUser.updateProfile({
        displayName: name,
        photoURL: (photoURL) ? photoURL : this.defaultProfilePicUrl
    });
    //get profile pic url from db location
    profilePicURL = () => this.storage.ref('profile_pictures/'+this.auth.currentUser.uid).getDownloadURL();
    //get default profile pic url
    defaultProfilePicUrl = () => this.storage.ref(defprofilepicRef).getDownloadURL();
    //upload pic and get profile pic url in return
    uploadProfilePic = (picture) => this.storage
        .ref('profile_pictures/'+this.auth.currentUser.uid)
        .put(picture);

    //Main page requests
    createLunch = (title, description, interests, startTimeStamp, endTimeStamp, maxUsers, mensa) => {
        const uid = this.auth.currentUser.uid;
        return this.db.collection(lunches).doc().set({
            title: title,
            description: description,
            interests: interests,
            startTimeStamp: firebase.firestore.Timestamp.fromDate(startTimeStamp),
            endTimeStamp: firebase.firestore.Timestamp.fromDate(endTimeStamp),
            maxMembers: maxUsers,
            memberCount: 1,
            members: [],
            owner: uid,
            mensa: mensa
        });
    };
    updateLunch = (title, description, interests, startTimeStamp, endTimeStamp, maxUsers, mensa, lunchID) => {
        const uid = this.auth.currentUser.uid;
        return this.db.collection(lunches).doc(lunchID).update({
            title: title,
            description: description,
            interests: interests,
            startTimeStamp: firebase.firestore.Timestamp.fromDate(startTimeStamp),
            endTimeStamp: firebase.firestore.Timestamp.fromDate(endTimeStamp),
            maxMembers: maxUsers,
            memberCount: 1,
            members: [],
            owner: uid,
            mensa: mensa
        });
    };
    getJoinedLunches = () => this.db.collection(lunches)
        .where("members","array-contains",this.auth.currentUser.uid)
        .get();
    getOwnLunches = () => this.db.collection(lunches)
        .where("owner","==",this.auth.currentUser.uid).get();
    deleteLunch = (lunchID) => this.db.collection(lunches).doc(lunchID).delete();
    joinLunch = (lunchID) => {
        const uid = this.auth.currentUser.uid;
        return this.db.collection(lunches).doc(lunchID).update({
            memberCount: increment,
            members: firebase.firestore.FieldValue.arrayUnion(uid)
        });

    };
    leaveLunch = (lunchID) => {
        const uid = this.auth.currentUser.uid;
         return this.db.collection(lunches).doc(lunchID).update({
            memberCount: decrement,
            members: firebase.firestore.FieldValue.arrayRemove(uid)
        });
    };
    getFreeLunches = () => {
        const ctx = this;
        return new Promise(function (resolve, reject) {
            ctx.db.collection(lunches).get().then(function (snapshot) {
                const lunchList = snapshot.docs.map(doc => {
                    var result = doc.data();
                    result.id = doc.id;
                    return result;
                });
                const freeLunches = [];
                lunchList.some(function (lunch) {
                    if (lunch.hasOwnProperty("maxMembers") && lunch.hasOwnProperty("memberCount")) {
                        if (lunch.memberCount<lunch.maxMembers){
                            freeLunches.push(lunch);
                        }
                    }
                });
                resolve(freeLunches);
            }).catch(function (error) {
                reject(error);
                console.error("Failed to get lunches: ",error);
            })
        });
    };
    sortLunchesByInterests = (lunches) => {
        const ctx = this;
        return new Promise(function (resolve, reject) {
            this.db.collection(users).doc(this.auth.currentUser.uid).get().then(function (doc) {
                const interests = doc.data().interests;
                resolve(rankAndSort(interests, lunches));
            }).catch(function (error) {
                reject(error);
                console.error("Failed to get user interests", error);
            })
        });
    };
}
/*
sorts lunches by own interests match: e.g. [Sports, Photography] and [Sports, Photography]
is obviously better than [Sports, Photography] and [Sports, Gaming]
 */
function rankAndSort(interests, lunches) {
    lunches.some(function(lunch) {
        let similarities = 0;
        if(lunch.hasOwnProperty("interests")){
            const lunchInterests = lunch.interests;
            lunchInterests.forEach(function (item) {
                if(interests.includes(item)){
                    similarities++;
                }
            });
            lunch.similarity = similarities;
        } else lunch.similarity = 0;
    });
    lunches.sort((a, b) => (a.similarity > b.similarity) ? -1 : 1);
    return lunches;
}

function filterByUserCount(min, max, lunches) {
    const newList = [];
    lunches.some(function (lunch) {
        if (lunch.hasOwnProperty("maxMembers")) {
            if (lunch.maxMembers<=max&&lunch.maxMembers>=min){
                newList.push(lunch);
            }
        }
    });
    return newList;
}

export default Firebase;
