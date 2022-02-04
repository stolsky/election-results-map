
import {isFunction} from "./typecheck.js";


let req = null;
let func = null;
let lastTime = 0;
let running = false;

const now = () => performance.now();

const run = function () {
    if (running) {
        const newTime = now(),
            dt = newTime - lastTime;
        lastTime = newTime;
        func(dt);
        req = requestAnimationFrame(run);
    }
};

/** @param {Function} f */
const start = function (f) {
    if (isFunction(f) && !running) {
        func = f;
        running = true;
        lastTime = now();
        run();
    }
};

const stop = function () {
    cancelAnimationFrame(req);
    req = null;
    running = false;
    lastTime = 0;
};

const isRunning = () => running;


export {isRunning, now, start, stop};
