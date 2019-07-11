import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/messaging'
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
const interests = "interests";
const increment = firebase.firestore.FieldValue.increment(1);
const decrement = firebase.firestore.FieldValue.increment(-1);

const defprofilepicRef = "profile_pictures/default.png";

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.storage = app.storage();
    this.messaging = app.messaging();
    this.functions = app.functions();
    this.messaging.usePublicVapidKey("BDdZqrqvhE6T0OWwOd6qpXIcHbHkwk8QUFW35mdgnBkZEKnkYyx3CqnzXiGvqWop0RP-KG9JxIxmeQEDnUVQ2xo");
  }
      //Auth functions
      signIn = (email, password) =>
        this.auth.signInWithEmailAndPassword(email, password);
      signOut = () => this.auth.signOut();
      resetPassword = email => this.auth.sendPasswordResetEmail(email);
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
    //Get list of majors
    majors = () => this.db.collection("majors").get();
    //Get Interests
    interests = () => this.db.collection(interests).get();

    //Registration functions
    createUser = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);
    createUserInDB = (uid, major, interests, name) => this.db.collection(users).doc(uid).set({
        major: major,
        interests: interests,
        name : name,
        description: "You don't have a description yet. Click here to change that"
    });
    //get default profile pic url
    defaultProfilePicUrl = () => this.storage.ref(defprofilepicRef).getDownloadURL();
    //update photourl
    updateProfilePic = (url) => this.db.collection(users).doc(this.auth.currentUser.uid).update({
        photoURL: (url) ? url : this.defaultProfilePicUrl()
    });
    //get profile pic url from db location
    profilePicURL = (uid) => {
        const userID = uid ? uid : this.auth.currentUser.uid;
        return this.storage.ref('profile_pictures/'+userID).getDownloadURL();
    };
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
            reportCount: 0,
            reports : [],
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
            ctx.db.collection(users).doc(ctx.auth.currentUser.uid).get().then(function (doc) {
                const interests = doc.data().interests;
                resolve(rankAndSort(interests, lunches));
            }).catch(function (error) {
                reject(error);
                console.error("Failed to get user interests", error);
            })
        });
    };
    //profile page requests
    setUserDesc = (description) => this.db.collection(users).doc(this.auth.currentUser.uid).set({description: description});
    updateUserInterests = (interests) => this.db.collection(users).doc(this.auth.currentUser.uid).update({interests: interests});
    //updating profile pic, etc. all the same as registration... so see above
    updateUserBio =  (major, description) => this.db.collection(users).doc(this.auth.currentUser.uid)
        .update({
            major: major,
            description: description
        });
    //Get user
    user = uid => this.db.collection(users).doc(uid).get(); //this contains every relevant infos for a user
    users = async() => await this.db.collection(users).get(); //this contains every relevant infos for a user
    //Get user profile picture url
    userProfilePicURL = (uid) => this.storage.ref('profile_pictures/'+uid).getDownloadURL();
    userProfilePicsURL = (uid) => this.storage.ref('profile_pictures').getDownloadURL();
    sendResetEmail = () => this.auth.sendPasswordResetEmail(this.auth.currentUser.email); //promise! snackbar in return

    //cloud messaging pub/sub requests
    subscribeToLunch = (lunchID, token) => {
        const subscribe = this.functions.httpsCallable('registerUserToTopic');
        return subscribe({
            lunchID: lunchID,
            token: token
        })
    };
    unSubscribeFromLunch = (lunchID, token) => {
        const unsubscribe = this.functions.httpsCallable('unsubscribeUserFromTopic');
        return unsubscribe({
            lunchID: lunchID,
            token: token
        })
    };

    //admin related functionality
    deleteUserByEmail = (email) => {
        const deleteWithEmail = this.functions.httpsCallable('deleteUserByEmail');
        return deleteWithEmail({
            uid : this.auth.currentUser.uid,
            email : email
        })
    };
    //set reports to zero
    removeReports = (docID) => this.db.collection(lunches).doc(docID).update({
        reportCount: 0 //reports NOT to zero because users never can report a lunch multiple times
    });
    //create interest
    addInterest = (title, desc) => this.db.collection(interests).doc().set({
        title: title,
        description: desc
    });
    //delete interest
    deleteInterest = (id) => this.db.collection(interests).doc(id).delete();
    //report lunch
    reportLunch = (lunchID) => {
        const uid = this.auth.currentUser.uid;
        return this.db.collection(lunches).doc(lunchID).update({
        reportCount: increment,
        reports: firebase.firestore.FieldValue.arrayUnion(uid)
        })
    };
    getReportedLunches = () => this.db.collection(lunches).where("reportCount",">",0).get();
    //filter
    async filter(values) {
        let query = this.db.collection('lunches')

        if(values.maxMembers) {
            query = query.where('maxMembers', '==', values.maxMembers)
        }

        if(values.startDate) {
            query= query.where('startTimeStamp', '>=' , values.startDate)
            .where('startTimeStamp', '<=' , values.endDate)
        }
        const lunches = await query.get()
    
        return lunches;
    }
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
