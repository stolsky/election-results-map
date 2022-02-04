
import {Random} from "../random/random.js";


// creates random index from 0 to max
/** @param {number} max */
const randomIndex = (max) => Math.floor(Random.next() * max);

/** @param {Array} arr */
const shuffle = function (arr) {
    let c = arr.length,
        o = null,
        i = null;
    while (c > 0) {
        i = randomIndex(c);
        c = c - 1;
        o = arr[c];
        arr[c] = arr[i];
        arr[i] = o;
    }
    return arr;
};


export {shuffle};
