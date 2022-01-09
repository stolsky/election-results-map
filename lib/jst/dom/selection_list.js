
import {Component} from "./component.js";
import {create} from "./basic.js";
import {isNumber} from "../native/typecheck.js";


const DEFAULT_SELECTION_SIZE = 10;
const SelectionList = class extends Component {

    /** @param {string} className */
    constructor (className = null) {

        super("select", className);

        this.setRows(DEFAULT_SELECTION_SIZE);

    }

    /**
     * @param {string} key
     * @param {string} value
     */
    addItem (key, value) {

        // TODO use the library to do this new Component("option")
        const option = create("option");
        option.textContent = key;
        option.setAttribute("value", value);

        this.tag.appendChild(option);

    }

    /** @param {number} size */
    setRows (size) {
        if (isNumber(size)) {
            this.tag.setAttribute("size", String(size));
        }
    }

};


export {SelectionList};
