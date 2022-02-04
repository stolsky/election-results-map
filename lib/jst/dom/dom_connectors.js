
import {AbstractContainer} from "./abstract_container.js";
import {AbstractTextComponent} from "./abstract_textcomponent.js";
import {Component} from "./component.js";
import {Container} from "./container.js";
import {isString} from "../native/typecheck.js";


/* where ??
    const DISABLED = "disabled";
    setEnabled (enable) {
        console.log(this.tag.getAttribute(DISABLED), this.tag);
        // check for <button>, <command>, <fieldset>, <keygen>, <optgroup>, <option>, <select>, <textarea>, <input> ??
        if (enable) {
            if (this.tag.getAttribute(DISABLED) === DISABLED) {
                this.tag.removeAttribute(DISABLED);
            }
        } else {
            this.tag.setAttribute(DISABLED, DISABLED);
        }
    }
*/

export const Link = class extends AbstractTextComponent {

    constructor (url, className = null) {

        super("a", className);

        this.setURL(url);
        this.setTarget("_blank");

    }

    /** @param {string} target */
    setTarget (target) {
        if (target === "_blank" || target === "_top" || target === "_self") {
            this.tag.setAttribute("target", target);
        }
    }

    /** @param {string} url */
    setURL (url) {
        if (isString(url)) {
            this.tag.setAttribute("href", url);
        }
    }

};

export const TextButton = class extends AbstractTextComponent {

    /**
     * @param {string} text
     * @param {EventListener} actionListener
     */
    constructor (text, actionListener = null) {

        super("button");

        this.text = text;
        this.addEventListener("click", actionListener);

    }

};

export const TextContainer = class extends AbstractContainer {

    /** @param {string} className */
    constructor (className = null) {
        super("p", className);
    }

};

export const IconButton = class extends Component {

    /**
     * @param {string} iconId
     * @param {EventListener} listener
     */
    constructor (iconId, listener) {

        super("button", "Button Icon");

        this.addClass(iconId);

        this.addEventListener("click", listener);

    }

};

export const TextLabel = class extends AbstractTextComponent {

    /** @param {string} text */
    constructor (text) {

        super("span", "Label");

        this.text = text;

    }

};

export const FormLabel = class extends AbstractTextComponent {

    /** @param {string} text */
    constructor (text) {

        super("label");

        this.tag.setAttribute("for", text);
        this.text = text;

    }

};

export const LabeledContainer = class extends Container {

    /**
     * @param {string} labelText
     * @param {string} className
     */
    constructor (labelText, className = null) {

        super(className);

        if (isString(labelText)) {
            this.label = new TextLabel(labelText);
            this.addComponent(this.label);
        }

    }

    /** @param {string} text */
    setLabel (text) {
        if (isString(text)) {
            if (!this.label) {
                this.label = new TextLabel(text);
            }
            this.label.text = text;
        }
    }

};
