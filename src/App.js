import React, {useContext, useEffect, useState} from 'react';
import AOS from 'aos';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import '../src/assets/font/font-awesome.css'
import routes from './pages';
import Page404 from './pages/404';
import {AppContext} from "./helpers/appContext";
import {
    db,
    fire,
    getCollectionWhereKeyValue,
    setDocumentToCollection,
    updateDocumentInCollection
} from "./helpers/firebaseConfigAndControls";
import firebase from "firebase/compat/app";
import {collectionsNames, userModel} from "./helpers/models";
import {englishDictionary, russianDictionary} from "./helpers/dictionaries";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import { doc, onSnapshot } from 'firebase/firestore';



function App() {
    //#region Get data from appContext
    const {user, setUser, dictionary, defaultDictionary, setDictionary, setDefaultDictionary, setDictionaries} = useContext(AppContext);
    //#endregion

    console.log(user);

    const location = useLocation();

    //#region Get navigate variable
    const navigate = useNavigate();
    //#endregion
    // const [user, setUser] = useState(userModel);

    //#region Get userData function
   
    //#endregion

    //#region Handle auth state changing
    useEffect(() => {
        AOS.init({
            duration : 2000
        });

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // alert('Signed in');
                console.log('We are inside onAuthStateChanged');
                console.log(user);
                getCollectionWhereKeyValue(collectionsNames.users, 'uid', user.uid).then(res => {
                    console.log('We are inside getCollectionWhereKeyValue in onAuth');
                    console.log(res);
                        if (res.length === 0) {
                            setTimeout(() => {
                                getCollectionWhereKeyValue(collectionsNames.users, 'uid', user.uid).then(r => {
                                    console.log('Get collection launched in loop');
                                    if (r.length > 0 && user.emailVerified !== r.isEmailVerified) {
                
                                        updateDocumentInCollection(collectionsNames.users, {
                                            ...r[0],
                                            isEmailVerified: user.emailVerified,
                                        }, r[0].idPost).then(result => {
                                            setUser({
                                                ...r[0],
                                                isEmailVerified: user.emailVerified,
                                            });
                                        }).catch(error => {
                                            setUser(r[0]);
                                            console.log(error);
                                        })
                                    } else {
                                        setUser(r[0]);
                                    }
                                })
                                    .catch(err => console.log(err));
                            }, 1000)
                        } else {
                            if (user.emailVerified !== res.isEmailVerified) {
                                updateDocumentInCollection(collectionsNames.users, {
                                    ...res[0],
                                    isEmailVerified: user.emailVerified,
                                }, res[0].idPost).then(result => {
                                    setUser({
                                        ...res[0],
                                        isEmailVerified: user.emailVerified,
                                    });
                                }).catch(error => {
                                    setUser(res[0]);
                                    console.log(error);
                                })
                            } else {
                                setUser(res[0]);
                            }
                        }
                        onSnapshot(doc(db, "users", res[0].idPost), (doc) => {
                            setUser({...user, ...doc.data()});
                            });
                        navigate('/work-page')
                        // localStorage.setItem('binanceBotUserData', JSON.stringify(r[0]));
                }
                ).catch(e => console.log(e));
            } else {
                // alert('Signed out');
                setUser(userModel);
                // localStorage.removeItem('binanceBotUserData');
            }
        });
    }, []);
    //#endregion

    //#region Set dictionary
    useEffect(() => {
        setDictionary(englishDictionary);
        setDefaultDictionary(englishDictionary);
        setDictionaries([russianDictionary, englishDictionary]);
    }, []);
    //#endregion

    //#region Render
    return (
        <>
         
            <Header background={location.pathname === '/work-page' || location.pathname === '/user-profile' ? true : false}/>
            {/*<button*/}
            {/*    onClick={() => {*/}
            {/*        getCollectionWhereKeyValue('users', 'uid', user.uid).then(r => {*/}
            {/*                setUser(r[0]);*/}
            {/*                // localStorage.setItem('binanceBotUserData', JSON.stringify(r[0]));*/}
            {/*            }*/}
            {/*        ).catch(e => console.log(e));*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Set user*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => console.log(user)}*/}
            {/*>*/}
            {/*    Check user*/}
            {/*</button>*/}

            <Routes>
                {
                    routes.map((data,idx) => (
                        <Route key={idx} path={data.path} element={data.component} exact />
                    ))
                }

                <Route path='*' element={<Page404 />} />
            </Routes>

            <Footer />
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                icon={false}
                progressClassName="toastProgress"
                bodyClassName="toastBody"
            />
        </>
    );
    //#endregion
}

export default App;
