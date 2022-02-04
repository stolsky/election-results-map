
const State = class {

    update (dt) {
        return dt;
    }

    render () {
        return true;
    }

    enter () {
        return true;
    }

    exit () {
        return true;
    }

};

const StateStack = class {

    constructor () {

        this.states = [];

    }

    clear () {
        this.states = [];
    }

    update (dt) {
        if (this.states.length > 0) {
            this.states[this.states.length - 1].update(dt);
        }
    }

    render (ctx) {
        this.states.forEach(state => state.render(ctx));
    }

    push (state) {
        if (state instanceof State) {
            this.states.push(state);
            state.enter();
        }
    }

    pop () {
        const state = this.states.pop();
        state.exit();
    }

    isEmpty () {
        return this.states.length === 0;
    }

};


export {
    State,
    StateStack
};
