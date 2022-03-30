
import {create_map as create_d3_map, init as init_d3, reset_maps, show_turnouts} from "./d3_adapter.js";
import {hasProperty, isString} from "../../lib/jst/native/typecheck.js";
import {Application} from "../../lib/jst/dom/application.js";
import {Container} from "../../lib/jst/dom/container.js";
import {TextComponent} from "../../lib/jst/dom/textcomponent.js";


const map_containers = [];
let STATE = null;
let current_state = -1;

/** Adds the map with its data to the next free map container.
 *
 * @param {Object} data
 * @param {Object} options
 */
const add_data_map = function (data, options) {

    const next_free_container = map_containers.find(container => container.unused);

    if (next_free_container) {

        const containersize = next_free_container.self.getOffsetSize();

        // "push" size object to current options
        Object.assign(options, {size: {width: containersize.width - 20, height: containersize.height - 20}});

        create_d3_map(
            data,
            "." + next_free_container.class_name,
            options
        );

        next_free_container.unused = false;
    }

};

const is_current_state = (state) => current_state === state.id;

/** Creates main structure of webpage with dynamic features.
 * Versatile customizable through options parameter.
 *
 * @param {Object} display_options
 * @param {Object} display_modes
 * @param {Object} data_source
 */
const init = function (display_options, display_modes = null, data_source = null) {

    STATE = display_modes;

    const header = new Container("AppHeader");

    const mainheader = new Container("MainHeader");
    header.addComponent(mainheader);
    if (hasProperty(display_options, "title") && isString(display_options.title)) {
        mainheader.addComponent(new TextComponent(display_options.title, "Title"));
    }
    if (hasProperty(display_options, "subtitle") && isString(display_options.subtitle)) {
        mainheader.addComponent(new TextComponent(display_options.subtitle, "Subtitle"));
    }

    header.addComponent(new Container("Seperator"));

    if (display_modes instanceof Object) {

        const subheader = new Container("SubHeader");
        header.addComponent(subheader);

        const categories_container = new Container("Categories");
        const statusbar = new TextComponent(null, "Statusbar");
        subheader.append(
            new TextComponent("Kategorien", "Title"),
            categories_container,
            statusbar
        );

        Object.values(display_modes).forEach(mode => {
            if (hasProperty(mode, "title")) {
                const category = new TextComponent(mode.title, "Category");
                category.addEventListener("click", () => {
                    if (category.hasClass("Active")) {
                        category.removeClass("Active");
                        reset_maps();
                    } else {
                        categories_container.getChildren()
                            .filter(child => child.hasClass("Active"))
                            .forEach(child => child.removeClass("Active"));
                        category.addClass("Active");
                        current_state = mode.id;
                        if (mode.id === STATE.TURNOUT.id) {
                            show_turnouts();
                        } else if (mode.id === STATE.DISTANCE.id) {
                            reset_maps();
                        }
                    }
                });
                categories_container.addComponent(category);
                if (hasProperty(mode, "description")) {
                    // category.append(
                    //     new Container("Icon"),
                    //     new TextComponent(mode.description, "Description")
                    // );
                }
            }
        });
    }

    const body = new Container("AppBody");
    const map_container_class_names = [];
    if (hasProperty(display_options, "area") && isString(display_options.area)) {

        body.setStyle("grid-template-areas", `"${display_options.area.replace(/,/g, "\" \"")}"`);

        /** @type {Array<string>} */
        const rows = display_options.area.split(",");
        let max_cols = 0;
        let min_rows = 1; // TODO calculate correct
        rows.forEach(row => {
            const current_cols = row.split(" ");
            if (current_cols.length > max_cols) {
                max_cols = current_cols.length;
            }
            current_cols.forEach(col => {
                if (!map_container_class_names.includes(col)) {
                    map_container_class_names.push(col);
                }
            });
        });

        body.setStyle("height", `calc(90% - ${(min_rows + 1) * 5}px)`);
        body.setStyle("width", `calc(100% - ${(max_cols + 1) * 5}px)`);

        if (hasProperty(display_options, "cols") && isString(display_options.cols)) {
            body.setStyle("grid-template-columns", display_options.cols);
        } else {
            body.setStyle("grid-template-columns", `repeat(${max_cols}, 1fr)`);
        }

        if (hasProperty(display_options, "rows") && isString(display_options.rows)) {
            body.setStyle("grid-template-rows", display_options.rows);
        } else {
            body.setStyle("grid-template-rows", `repeat(${rows.length}, 1fr)`);
        }

    }

    map_container_class_names.forEach(class_name => {
        const map_name = new TextComponent(null, "Name");
        const map_class_name = "Map_" + class_name;
        const map_container = new Container("MapContainer " + map_class_name);
        map_container.setStyle("grid-area", class_name);
        map_containers.push({class_name: map_class_name, self: map_container, unused: true});
        map_container.addComponent(map_name);
        body.addComponent(map_container);
    });

    const app = new Application("Open Data Election");
    app.setContextMenuEnabled(false);
    app.getRootPane().append(header, body);

    init_d3(data_source);

};


export {
    add_data_map,
    init,
    is_current_state,
    STATE
};
