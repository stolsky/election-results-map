
import {Container, Layout} from "../dom/container.js";
import {hasProperty, hasValue, isString} from "../native/typecheck.js";
import {TextButton, TextComponent} from "./dom_connectors.js";
import {insertStyleSheet} from "../dom/basic.js";


/** @type {Container} */
let mainContainer = null;
/** @type {TextComponent} */
let welcomePhrase = null;
/** @type {TextComponent} */
let introduction = null;
/** @type {Container} */
let content = null;

const setLayout = function (layout) {
    if (hasValue(Layout, layout)) {
        content.addClass(layout);
    }
};

const dispose = function () {
    mainContainer.remove();
    mainContainer = null;
    welcomePhrase = null;
    introduction = null;
    content = null;
};

/** @param {boolean} useDefaultStyle is true by default. if true, injects default style css file "welcome.css" */
const init = function (useDefaultStyle = true, askToShowOnStartup = true) {

    mainContainer = new Container("Welcome");
    mainContainer.addClass("Center");

    welcomePhrase = new TextComponent(null, "Title");
    introduction = new TextComponent(null, "Description");
    content = new Container("Content");
    mainContainer.addComponent(content);

    if (useDefaultStyle) {
        insertStyleSheet("../lib/welcome.css");
        setLayout(Layout.FLEX);
    }

    if (askToShowOnStartup) {
        // TODO
        // container.addComponent(content);
    }

    mainContainer.hide();
};
/** @returns {Container} */
const get = () => mainContainer;

/** @param {string} text adds a welcome phrase like a headline */
const addWelcomeText = function (text) {

    if (isString(text)) {

        welcomePhrase.text = text;

        mainContainer.addComponent(welcomePhrase, 0);

    }

};
/** @param {string} text adds a description to the welcome screen */
const addDescription = function (text) {

    if (isString(text)) {

        introduction.text = text;

        mainContainer.addComponent(introduction, 0);
        mainContainer.addComponent(welcomePhrase, 0);

    }

};

// TODO setLogo

const addSection = function (title = null, description = null, ...buttons) {

    let section = new Container("Section");

    if (isString(title)) {
        section.addComponent(new TextComponent(title, "Title"));
    }

    if (isString(description)) {
        section.addComponent(new TextComponent(description, "Description"));
    }

    buttons.forEach(button => {
        if (button instanceof Object) {

            const buttonContainer = new Container();

            if (hasProperty(button, "label") && hasProperty(button, "action")) {
                buttonContainer.addComponent(new TextButton(button.label, button.action));
            }

            if (hasProperty(button, "description")) {
                buttonContainer.addComponent(new TextComponent(description, "Description"));
            }

            section.addComponent(buttonContainer);
        }
    });

    if (section.getChildren().length > 0) {
        content.addComponent(section);
    } else {
        section = null;
    }

};

// TODO add Icons

// ?? add images

export {
    addDescription,
    addSection,
    addWelcomeText,
    dispose,
    get,
    init,
    setLayout
};
