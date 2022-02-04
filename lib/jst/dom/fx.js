
import {isFunction, isNumber} from "../native/typecheck.js";
import {Component} from "./component.js";


/*
export const Fx = (function () {

    const fifo = [];

    let busy = false;

    const animate = function () {
        if (!busy && fifo.length > 0) {
            const anim = fifo.shift();


            if (hasProperty(anim, "component") && hasProperty(anim, "transformation")) {

                const tag = anim.component.getHTMLElement();
                tag.style.transform = anim.transformation;
                busy = true;
                if (hasProperty(anim, "repeat") && anim.repeat) {
                    fifo.push(anim);
                }
            }


        }
    };

    const core = {};

    core.add = function (...anims) {

        anims.forEach(elem => {
            fifo.push(elem);
        });

        animate();

        return Object.freeze(core);
    };

    return Object.freeze(core);

})();
*/

const queue = [];

const scrollTop = function (component, val) {
    if (component instanceof Component && isNumber(val)) {
        const tag = component.getHTMLElement();
        if (tag.scrollTop !== val) {
            tag.scrollTop = val;
        }
    }
};

const add = function (...anims) {
    //
};

const fadeIn = function (component, transitionEnd = null) {
    if (component instanceof Component) {
        component.setStyle("opacity", "1");

        if (isFunction(transitionEnd)) {
            component.getHTMLElement().ontransitionend = transitionEnd;
        }
    }
};

const fadeOut = function (component, transitionEnd = null) {
    if (component instanceof Component) {
        component.setStyle("opacity", "0");

        if (isFunction(transitionEnd)) {
            component.getHTMLElement().ontransitionend = transitionEnd;
        }
    }
};

export {add, fadeIn, fadeOut};
