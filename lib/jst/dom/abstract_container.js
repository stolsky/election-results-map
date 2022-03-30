
import {Component} from "./component.js";
import {isNumber} from "../native/typecheck.js";


const AbstractContainer = class extends Component {

    /**
     * @param {Component} component
     * @param {number} index
     */
    addComponent (component, index = -1) {
        if (component instanceof Component) {

            component.parent = this;

            if (isNumber(index)) {
                if (index === -1) {
                    this.tag.appendChild(component.getHTMLElement());
                    this.children.push(component);
                } else if (index === 0) {
                    this.tag.insertBefore(component.getHTMLElement(), this.tag.firstChild);
                    this.children.splice(0, 0, component);
                } else {
                    // TODO
                }
            }
        }
    }

    /**
     * @param {Component} newComponent
     * @param {Component} oldComponent
     */
    replaceComponent (newComponent, oldComponent) {
        if (newComponent instanceof Component && oldComponent instanceof Component) {
            this.tag.replaceChild(newComponent.getHTMLElement(), oldComponent.getHTMLElement());
        }
    }

    /** @param {Array<Component>} components */
    append (...components) {
        components.forEach(comp => this.addComponent(comp));
    }

    /** @returns {Array<Component>} */
    getChildren () {
        return this.children;
    }

    clear () {
        this.tag.innerHTML = "";
    }

};


export {AbstractContainer};
