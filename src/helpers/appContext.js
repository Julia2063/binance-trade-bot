import React, {useState} from 'react';
import {dictionaryModel, userModel} from "./models";
import {englishDictionary} from "./dictionaries";
import { useEffect } from 'react';
import { db, getCollectionWhereKeyValue } from './firebaseConfigAndControls';
import { doc, onSnapshot } from 'firebase/firestore';



export const AppContext = React.createContext({
    user: userModel,
    lang: 'en',
    dictionary: dictionaryModel,
    dictionaries: [],
    defaultDictionary: dictionaryModel,
    setUser: () => {},
    setLang: () => {},
    setDictionary:  () => {},
    setDictionaries: () => {},
    setDefaultDictionary: () => {},
    bots: [],
    setBots: () => {},
    botAdded: 0,
    setBotAdded: () => {},
    getedOrders:[],
    setGetedOrders: () => {},
    history: [],
    setHistory: () => {},

});

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(userModel);
    const [dictionary, setDictionary] = useState(englishDictionary);
    const [defaultDictionary, setDefaultDictionary] = useState(englishDictionary);
    const [dictionaries, setDictionaries] = useState([]);
    const [lang, setLang] = useState('en');
    const [bots, setBots] = useState([]);
    const [botAdded, setBotAdded] = useState(0);
    const [getedOrders, setGetedOrders] = useState([]);
    const [history, setHistory] = useState([]);

    
    /* const getData = async() => {
        try {
            const botsArray = await getCollectionWhereKeyValue("bots", "uid", user.uid);
            setBots(botsArray);
        } catch (error) {
            console.log(error);
        }
        
    };

    useEffect(() => {
        getData();
      
    }, [user, botAdded]); */

    useEffect(() => {
        setGetedOrders([]);

    }, [user.idPost])
  
    const contextValue = {
        user,
        setUser,
        dictionary,
        setDictionary,
        defaultDictionary,
        setDefaultDictionary,
        dictionaries,
        setDictionaries,
        lang,
        setLang,
        bots,
        setBots,
        botAdded,
        setBotAdded,
        getedOrders, 
        setGetedOrders,
        history,
        setHistory
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
};
