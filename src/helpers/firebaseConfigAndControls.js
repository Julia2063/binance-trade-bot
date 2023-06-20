import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    PhoneAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification,
} from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";
import {botModel, userModel} from "./models";
import {format} from "date-fns";

const firebaseConfig = {
    apiKey: "AIzaSyBivXDEHeYIWcANpPmhUvGJaGpYcaLhJWY",
    authDomain: "binance-powerful-bot.firebaseapp.com",
    projectId: "binance-powerful-bot",
    storageBucket: "binance-powerful-bot.appspot.com",
    messagingSenderId: "426509279304",
    appId: "1:426509279304:web:0ddd9038233235f44ab87d",
    measurementId: "G-W5L5D0K017"
};

// Initialize Firebase
export const fire = firebase.initializeApp(firebaseConfig);
export const db = fire.firestore();
export const auth = getAuth();
export const realTimeDb = getDatabase(fire);

/*** ================================================================================
 *          DATABASE FUNCTIONS
 * ================================================================================*/
export function updateDocumentInCollection(collection, document, idDocumnent) {
    return new Promise(function (resolve, reject) {
        try {
            fire.firestore().collection(collection).doc(idDocumnent).update(document).then(r => {
                resolve({result: r})
            }).catch(e => {
                reject(e);
            })
        } catch (e) {
            reject(e);
        }
    })
};

export function setDocumentToCollection(collection, document) {
    return new Promise(function (resolve, reject) {
        try {
            fire.firestore().collection(collection).add(document)
                .then(r => {
                    updateDocumentInCollection(collection, {...document, idPost: r.id}, r.id)
                        .then(res => console.log('success')).catch(e => console.log(e));
                    resolve({result: r});
                }).catch(e => {
                reject(e);
            })
        } catch (e) {
            reject(e);
        }
    })
};

export function getCollectionWhereKeyValue(collection, key, value) {
    return new Promise(function (resolve, reject) {
        fire.firestore().collection(collection).where(key, "==", value).get().then(res => {
            const data = [];
            res.forEach(doc => {
                data.push({
                    ...doc.data(),
                    idPost: doc.id,
                })
            });
            resolve(data)
        }).catch(err => {
            reject(err);
        });
    });
};

export function getDocInCollection(collection, id) {
    return new Promise(function (resolve, reject) {
        try {
            fire.firestore().collection(collection).doc(id)
                .get()
                .then(querySnapshot => {
                    resolve(querySnapshot.data());
                });
        } catch (e) {
            reject(e);
        }
    })
};

export async function  getCollection (collection)    {
    return new  Promise(await function (resolve, reject) {
        fire.firestore().collection(collection).get().then(res => {
            const data = [];
            res.forEach(doc => {
                data.push({
                    idPost: doc.id,
                    ...doc.data()
                })
            });
            resolve(data)
        }).catch(err => {
            reject(err);
        });
    });
};

export async function updateFieldInDocumentInCollection (collection, docId, fieldName, newValue) {
    console.log(collection);
    console.log(docId);
    console.log(fieldName);
    console.log(newValue);

    let result;

    try {
        const docRef = fire.firestore().collection(collection).doc(docId);
        result = await docRef.update({[fieldName]: newValue});
    } catch (error) {
        console.log(error.message);
    }

    return result;
};

export function createNewBot(fund, uid, exchange) {
    let bot_to_firebase = {
        ...botModel,
        fund,
        uid,
        name: Math.floor(Date.now() * Math.random()).toString().slice(0, 6),
        exchange,
        pair: "LTC/USDT",
        status: "waiting for entry",
    };
    
    return new Promise(function (resolve, reject) {
        setDocumentToCollection('bots', bot_to_firebase).then(r => {
            resolve(r);
        }).catch(e => {
            reject(e)
        });
  })
};

/*** ================================================================================
 *          USER Auth
 * ================================================================================*/
export function createNewUser(regInfo) {
    // console.log('We are inside createNewUser');
    // console.log(regInfo);

    return new Promise(function (resolve, reject) {
        getCollectionWhereKeyValue('users', 'uid', regInfo.uid).then(r => {
            if (r.length === 0) {
                let user_to_firebase_start = {
                    ...userModel,
                    uid: regInfo?.uid,
                    email: regInfo?.email || '',
                    //password: regInfo.password,
                    // gender: regInfo?.gender,
                    // firstName: regInfo?.firstName,
                    // lastName: regInfo?.lastName,
                    fullName: regInfo?.fullName || regInfo.email || '',
                    phoneNumber: regInfo?.phoneNumber || '',
                    isEmailVerified: regInfo?.isEmailVerified,
                    dateCreating: format(new Date(), "dd-MM-yyyy HH:mm"),
                    
                    role: 'user',
                };
                setDocumentToCollection('users', user_to_firebase_start).then(r => {
                    console.log('user saved in DB');
                    // localStorage.setItem('binanceBotUserData', JSON.stringify(user_to_firebase_start));
                    resolve(r);
                }).catch(e => {
                    reject(e)
                });
            } else {
                // console.log('We are inside returning user from DB');
                // console.log(r[0]);
                resolve(r[0]);
            }
        }).catch(e => {
            reject('')
        })
    })
};

export async function signUp (email, password) {
    // console.log('We are inside signUp');
    // console.log(email);
    // console.log(password);
    return await createUserWithEmailAndPassword(auth, email, password);
};

export async function signUpAndCreateUser(regInfo, setUser = () => {}) {
    // console.log('We are inside signUpAndCreateUser');
    // console.log(regInfo);
    try {
        const signUpResult = await signUp(regInfo.email, regInfo.password);

        // console.log('We are inside signUpAndCreateUser');
        // console.log(signUpResult.user.uid);
        // console.log(signUpResult.user.emailVerified);

        console.log(signUpResult);

        const newUser = {
        ...regInfo,
          uid: signUpResult.user.uid,
          isEmailVerified: signUpResult.user.emailVerified,
        };

        const user = await createNewUser(newUser);
        setUser(user);

        return true;
    } catch(error) {
        console.log(error);
        return false;
    }

    // await createNewUser(regInfo);
};

export async function signIn (email, password){
    return await signInWithEmailAndPassword(auth, email, password);
};

export function logOut(event, setUser = () => {}, navigate = () => {}, url = ''){
    event.preventDefault();

    navigate(url);
    setUser(userModel);

    return signOut(auth);
};


