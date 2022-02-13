
import {Application} from "../../lib/jst/dom/application.js";
import {Container} from "../../lib/jst/dom/container.js";
import {create_data_map} from "./d3_adapter.js";
import {TextComponent} from "../../lib/jst/dom/textcomponent.js";

const map_containers = [];

const init = function (options) {

    const app = new Application("Open Data Election");
    const main_container = new Container("Main Maximize");
    app.getRootPane().addComponent(main_container);

    const title = new TextComponent("Wahlergebnisse", "Title");
    const description = new TextComponent("Visuelle Darstellung der Wahlergebnisse 2005", "Description");
    const title_container = new Container("TitleContainer");
    title_container.append(title, description);
    main_container.addComponent(title_container);

    const map_container_class_name = ["CityDistrict", "FederalState", "Country"];
    map_container_class_name.forEach(map_class_name => {
        const map_name = new TextComponent(null, "Name");
        const map_container = new Container("MapContainer " + map_class_name);
        map_containers.push({class_name: map_class_name, self: map_container, unused: true});
        map_container.addComponent(map_name);
        main_container.addComponent(map_container);
    });

};

/** Adds the map with its data to the next free map container.
 *
 * @param {Object} data
 * @param {Object} options
 */
const add_data_map = function (data, options) {

    const next_free_container = map_containers.find(container => container.unused);

    if (next_free_container) {

        let size = null;
        size = next_free_container.self.getOffsetSize();

        create_data_map(
            data,
            size.width - 20,
            size.height - 20,
            "." + next_free_container.class_name
        );

        next_free_container.unused = false;
    }

};


export {
    add_data_map,
    init
};
