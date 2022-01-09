
import {Component} from "./component.js";
import {isString} from "../native/typecheck.js";


const ResourceComponent = class extends Component {

    /** @param {string} path */
    set src (path) {
        if (isString(path)) {
            this.tag.setAttribute("src", path);
        }
    }

    get src () {
        return this.tag.getAttribute("src");
    }

};

const ImageComponent = class extends ResourceComponent {

    /**
     * @param {string} sourcePath
     * @param {string} className
     */
    constructor (sourcePath = null, className = null) {

        super("img", className);
        super.src = sourcePath;

    }

};


export {
    ImageComponent
};
