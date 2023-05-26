//#region Languages
export const getTranslation = (key, dictionary, defaultDictionary) => {
    if (!dictionary.dictionary.hasOwnProperty(key)) {
        return defaultDictionary.dictionary[key];
    }
    if (!dictionary.dictionary[key]) {
        return defaultDictionary.dictionary[key];
    }

    return dictionary.dictionary[key];
};

//#endregion
