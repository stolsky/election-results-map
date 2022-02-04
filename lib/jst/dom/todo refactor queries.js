

/** query selector one element
 *
 * @param  {string} query
 * @param  {HTMLElement} startFrom if not set, than document's root node is used
 *
 * @returns {HTMLElement}
 */
const $ = (query, startFrom = null) => (startFrom instanceof HTMLElement) ? startFrom.querySelector(query) : document.querySelector(query);
/** query selector multiple elements
 *
 * @param  {string} query
 * @param  {HTMLElement} startFrom if not set, than document's root node is used
 *
 * @returns {Array<HTMLElement>}
 */
const $$ = (query, startFrom = null) => (startFrom instanceof HTMLElement) ? Array.from(startFrom.querySelectorAll(query)) : Array.from(document.querySelectorAll(query));

/**
 * @param {HTMLElement | string} target
 *
 * @returns {HTMLElement}
 */
const getHTMLElement = (target) => {
    if (target instanceof HTMLElement) {
        return target;
    } else if (isString(target)) {
        return $(target, null);
    } else {
        return null;
    }
};
/** get all siblings from a specific node
 *
 * @param {HTMLElement} node
 *
 * @returns {Array<Node>}
 */
const getSiblings = (node) => {
    let arr = null;
    if (getHTMLElement(node)) {
        if (node.parentNode) {
            // childNodes returns a NodeList which is not an array
            // we have to convert via Array.from(array-like)
            arr = Array.from(node.parentNode.childNodes).filter(sibling => sibling !== node);
        }
    }
    return arr;
};
/** gets a node from the dom tree upon selected node by class name
 *
 *  @param {Element} node
 *  @param {string} selector containing class name
 *
 *  @returns {Element}
 */
const getParent = (node, selector) => {
    while (node instanceof Node && node.tagName !== "BODY") {
        if (node.className === selector) {
            break;
        }
        node = node.parentElement;
    }
    return node;
};
