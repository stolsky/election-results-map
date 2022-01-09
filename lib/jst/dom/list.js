
import {AbstractContainer} from "./abstract_container.js";
import {AbstractTextComponent} from "./abstract_textcomponent.js";


const ListItem = class extends AbstractTextComponent {

    /**
     * @param {string} text
     * @param {string} className
     */
    constructor (text = null, className = null) {
        super("li", className);
        this.text = text;
    }

};

const ListContainer = class extends AbstractContainer {

    /**
     * @param {string} className
     * @param {boolean} ordered
     */
    constructor (className = null, ordered = false) {

        const tag = (ordered) ? "ol" : "ul";

        super(tag, className);

    }

    /** @param {ListItem} item */
    addItem (item) {

        if (item instanceof ListItem) {

            super.addComponent(item);

        }

    }

    /** @param {ListItem} item */
    addComponent (item) {

        this.addItem(item);

    }

};


export {
    ListContainer,
    ListItem
};
