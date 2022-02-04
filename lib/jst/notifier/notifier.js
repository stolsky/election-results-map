
import {
    Container,
    Paragraph,
    TextComponent
} from "./dom_connectors.js";
import {
    hasProperty,
    hasValue,
    isBoolean,
    isNumber,
    isString
} from "../lib/js_tools.js";
import {
    insertStyleSheet
} from "./dom_basic.js";


let container = null;

let autoDeleteTime = 0; // 0 = never delete
let useIcons = true;

/*
let height = 0;
let contentHeight = 0;
let kill = [];
let box = null;
*/


const Message = {
    SUCCESS: {
        name: "Success",
        color: "",
        icon: "",
        use: true
    },
    STANDARD: {
        name: "Standard",
        color: "",
        icon: "",
        use: true
    },
    WARNING: {
        name: "Warning",
        color: "",
        icon: "",
        use: true
    },
    ERROR: {
        name: "Error",
        color: "",
        icon: "",
        use: true
    }
};

export const getMessageOptions = () => Object.assign({}, Message);

/**
 * @param {string} text
 * @param {string} cssColor
 * @param {string} iconClassName
 */
const addMessage = function (text, type) {
    if (isString(text) && container instanceof Container) {

        const notification = new Paragraph("Notification");

        if (type instanceof Object) {

            notification.addClass();

            if (hasProperty(type, "color")) {
                notification.setStyle("background-color", type.color);
            }

            if (useIcons) {
                const icon = (hasProperty(type, "icon")) ? type.icon : "Bell";
                notification.addComponent(new TextComponent("", "Icon " + icon));
            }
        }

        notification.addComponent(new TextComponent(text, "Text"));

        container.addComponent(notification);
    }
};

/** @param {string} text */
export const success = function (text) {
    addMessage(text, Message.SUCCESS);
};

/** @param {string} text */
export const log = function (text) {
    addMessage(text, Message.STANDARD);
};

/** @param {string} text */
export const warn = function (text) {
    addMessage(text, Message.WARNING);
};

/** @param {string} text */
export const error = function (text) {
    addMessage(text, Message.ERROR);
};

/** @param {Object} settings */
export const applyMessageSettings = function (settings) {

    if (settings instanceof Object) {
        Object.keys(settings).forEach(type => {
            if (hasProperty(Message, type)) {
                Object.keys(settings[type]).forEach(value => {
                    // name is reserved
                    if (value !== "name") {
                        if (hasProperty(Message[type], value)) {
                            Message[type][value] = settings[type][value];
                        }
                    }
                });
            }
        });
    }

};

// TODO how to do better -> goal position: absolute; left: 0 | right: 0 ; top: 0 | bottom: 0
// ALSO check horizontal values, vertical values
export const Position = Object.freeze({
    LEFT: "Left",
    RIGHT: "Right",
    TOP: "Top",
    BOTTOM: "Bottom"
});
export const setPosition = function (x = null, y = null) {

    if (hasValue(Position, x)) {
        container.addClass(x);
    }

    if (hasValue(Position, y)) {
        container.addClass(y);
    }

};

/**
 * @param {boolean} useDefaultStyle
 */
export const init = function (useDefaultStyle = true) {

    if (useDefaultStyle) {
        insertStyleSheet("notifier.css");
        setPosition(Position.LEFT, Position.RIGHT);
    }

    container = new Container("Notifier");

};

/** @returns {Container} */
export const get = () => container;

export const setAutoDeleteTime = function (seconds) {
    if (isNumber(seconds) && seconds > 0) {
        autoDeleteTime = seconds;
    }
};
