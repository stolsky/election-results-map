
import {Application} from "../../lib/jst/dom/application.js";
import {Container} from "../../lib/jst/dom/container.js";
import {TextComponent} from "../../lib/jst/dom/textcomponent.js";
import {hasProperty} from "../../lib/jst/native/typecheck.js";
import {create_geojson_map} from "./leaflet_adapter.js";


const init_gui = function () {
    const app = new Application("Open Data Election");
    const title_container = new Container("TitleContainer");
    const title = new TextComponent("Wahlergebnisse", "Title");
    const description = new TextComponent("Visuelle Darstellung der Wahlergebnisse 2005", "Description");
    title_container.append(title, description);
    const map_container = new Container("MapContainer Maximize");
    map_container.setAttribute("id", "MapContainer");
    const menu = new Container("Menu");
    app.getRootPane().append(map_container, title_container, menu);
};

const visualize = function (data, options) {
    init_gui();
    data.forEach(dataset => {
        if (hasProperty(dataset, "type") && dataset.type === "FeatureCollection") {
            create_geojson_map(dataset);
        } else {
            // visualize data
        }
    });
};

export {
    visualize
};
