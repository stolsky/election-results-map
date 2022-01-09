
import {InputComponent, InputType} from "./input_component.js";
import {Container} from "./container.js";
import {FormLabel} from "./dom_connectors.js";
import {isString} from "../native/typecheck.js";


const RadioButton = class extends Container {

    /**
     * @param {string} label
     * @param {any} value
     * @param {EventListener} action
     */
    constructor (label, value, action = null) {

        super("RadioButton");

        this.input = new InputComponent(InputType.RadioButton);
        this.input.id = label;
        this.input.value = String(value);


        this.input.addEventListener("change", function () {
            action(this.value);
        });

        this.addComponent(new FormLabel(label));
        this.addComponent(this.input);

    }

    set groupName (name) {
        if (this.input && isString(name)) {
            this.input.name = name;
        }
    }

    get groupName () {
        return this.input.name;
    }

};

const RadioButtonGroup = class extends Container {

    /**
     * @param {string} groupName
     * @param {string} className
     */
    constructor (groupName, className = null) {

        super(className);

        this.name = (isString(groupName)) ? groupName : "RadioButtonGroup";

    }

    /**
     * @override
     *
     * @param {RadioButton} element
     */
    addElement (element) {
        if (element instanceof RadioButton) {
            super.addComponent(element);
            element.groupName = this.name;
        }
    }

    /**
     * @override
     *
     * @param {Array<RadioButton>} elements
     */
    append (...elements) {
        if (elements instanceof Array) {
            elements.forEach(button => this.addElement(button));
        }
    }

};


export {
    RadioButton,
    RadioButtonGroup
};
