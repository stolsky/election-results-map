const DISPLAY_MODES = {
    TURNOUT: 1,
    DISTANCE: 2
};
const DISPLAY_MODES_DATA = [
    {
        id: 1,
        title: "Wahlbeteiligung",
        description: "Farbliche Darstellung der Wahlbeteiligung in Prozent."
    },
    {
        id: 2,
        title: "Abstand der Wahlergebnisse",
        description: "Farbliche Darstellung des Abstands der ausgewählten Region zu allen anderen."
    }
];

let current_state = -1;

const get_current_state = () => current_state;

const get_display_mode_data = (id) => DISPLAY_MODES_DATA.find((data) => data.id === id);

const set_current_state = (state) => {
    current_state = state;
};

export {
    DISPLAY_MODES,
    get_current_state,
    get_display_mode_data,
    set_current_state
};
