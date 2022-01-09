
/**
 * @param {number} val
 *
 * @returns {boolean}
 */
const isNumber = val => typeof val === "number" && isFinite(val);

/**
 * Checks if the parameter is of type "string" and then if it's not empty.
 *
 * @param {string} str
 * @param {boolean} ignoreEmpty
 *
 * @returns {boolean}
 */
const isString = function (str, ignoreEmpty = false) {
    const result = typeof str === "string";
    return (ignoreEmpty) ? result : result && str.length > 0;
};

/**
 * @param {Function} func
 *
 * @returns {boolean}
 * */
const isFunction = func => func instanceof Function;

/**
 * @param {boolean} bool
 *
 * @returns {boolean}
 */
const isBoolean = bool => typeof bool === "boolean";

/** Checks, if a top level property (key) exists in an object
 *
 * @param {Object} obj
 * @param {string} prop
 *
 * @returns {boolean}
 */
const hasProperty = (obj, prop) => (obj instanceof Object && isString(prop)) ? Object.prototype.hasOwnProperty.call(obj, prop) : false;

/** Checks, if a value exists in a flat object
 *
 * @param {Object} obj
 * @param {any} val
 *
 * @returns {boolean}
 */
const hasValue = (obj, val) => (obj instanceof Object) ? Object.values(obj).includes(val) : false;


export {
    hasProperty,
    hasValue,
    isBoolean,
    isFunction,
    isNumber,
    isString
};
