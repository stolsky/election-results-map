
import {Component} from "./component.js";
import {isString} from "../native/typecheck.js";
import {setAttributesFromOptions} from "./basic.js";


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

const MediaAttributes = ["autoplay", "controls", "loop", "muted"];
const AbstractMediaComponent = class extends ResourceComponent {

    play () {
        this.tag.play();
    }

    pause () {
        this.tag.pause();
    }

    setOptions (options) {
        setAttributesFromOptions(this.tag, options, MediaAttributes);
    }

};

const AudioComponent = class extends AbstractMediaComponent {

    /**
     * @param {string} resourcePath
     * @param {string} className
     */
    constructor (resourcePath = null, className = null) {

        super("audio", className);
        super.src = resourcePath;

    }

};

const VideoComponent = class extends AbstractMediaComponent {

    /**
     * @param {string} resourcePath
     * @param {string} className
     */
    constructor (resourcePath = null, className = null) {

        super("video", className);
        super.src = resourcePath;

    }

};


export {
    AudioComponent,
    ImageComponent,
    VideoComponent
};
