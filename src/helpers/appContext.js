import React, {useState} from 'react';
import {dictionaryModel, userModel} from "./models";
import {englishDictionary} from "./dictionaries";

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
});

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(userModel);
    const [dictionary, setDictionary] = useState(englishDictionary);
    const [defaultDictionary, setDefaultDictionary] = useState(englishDictionary);
    const [dictionaries, setDictionaries] = useState([]);
    const [lang, setLang] = useState('en');

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
        setLang
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
};
