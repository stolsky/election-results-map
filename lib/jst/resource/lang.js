
import {hasProperty, isString} from "../native/typecheck.js";
import {Cache} from "./cache.js";


const BASE = "base";

const cache = new Cache();

const Language = Object.freeze({
    de: "de",
    en: "en"
});
let current = null;

/**
 * @param {Object} data
 * @param {string} id
 */
const addLanguagePack = function (data, id = null) {
    if (data instanceof Object) {
        cache.setItem(id || BASE, data);
    }
};

const removeLanguagePack = function (id = null) {
    cache.deleteItem(id || BASE);
};

const getWord = (wordId, id = null) => cache.getItem(id || BASE)[wordId];

const setCurrentLanguage = (type) => {
    if (isString(type) && hasProperty(Language, type.toLowerCase())) {
        current = type.toLowerCase();
    }
};

const getCurrentLanguage = () => current;


export {
    addLanguagePack,
    getCurrentLanguage,
    getWord,
    Language,
    removeLanguagePack,
    setCurrentLanguage
};
