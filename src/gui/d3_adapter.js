/* global d3 */

import * as Tooltip from "./tooltip.js";
import { hasProperty, isNumber, isString } from "../../lib/jst/native/typecheck.js";
import { Cache } from "../../lib/jst/resource/cache.js";
import { calculate_distance } from "../data/evaluation.js";
import { DISPLAY_MODES, get_current_state } from "./state.js";


const REGION_DEFAULT_COLOR = "#C7D5D7";

let distance_scale = null;
let turnout_scale = null;
// let density_scale = null;

const Data_Store = new Cache();

// TODO set scale intervals and colors through option parameter
const init = (parties_info) => {

    // TODO calculate the range from the data to be used
    distance_scale = d3.scaleSequential()
        .domain([25, 0]) // TODO test .domain(d3.range(90, 0, -10))
        .interpolator(d3.interpolateYlOrRd);

    turnout_scale = d3.scaleSequential()
        .domain([50, 90])
        .interpolator(d3.interpolateRdYlGn);

    Tooltip.init(parties_info);
};

const calculate_color_from_distance = (points1, points2) => distance_scale(
    calculate_distance(
        points1.map((result) => result.value),
        points2.map((result) => result.value)
    )
);

const mouse_enter = (event, features) => {
    Tooltip.update_data(
        features.properties.name,
        Data_Store.getItem(features.properties.id)
    );

    d3.select(this)
        .raise()
        .interrupt()
        .transition()
        .duration(200)
        .style("stroke", "#000000");
};

const mouse_leave = () => {
    Tooltip.hide();

    d3.select(this)
        .interrupt()
        .transition()
        .duration(200)
        .style("stroke", "#ffffff");
};

const mouse_move = (event) => Tooltip.update_position(event.clientX, event.clientY);

const mouse_click = (event, features) => {

    if (get_current_state() === DISPLAY_MODES.DISTANCE) {

        const { id, name } = features.properties;
        const zone = Data_Store.getItem(id);

        Tooltip.update_data(name, zone, true);
        Tooltip.update_position(event.clientX, event.clientY);

        d3.selectAll(".District")
            .interrupt()
            .transition()
            .duration(500)
            .style("fill", (d) => {
                let color = null;
                if (hasProperty(d.properties, "id")) {
                    const compare_zone = Data_Store.getItem(d.properties.id);
                    color = calculate_color_from_distance(compare_zone.votings, zone.votings);
                }
                return color;
            });

    }

};

const reset_maps = () => {
    d3.selectAll(".District")
        .interrupt()
        .transition()
        .duration(500)
        .style("opacity", 1)
        .style("fill", REGION_DEFAULT_COLOR);

    Tooltip.reset();
};

const show_turnouts = () => {
    d3.selectAll(".District")
        .interrupt()
        .transition()
        .duration(500)
        .style("opacity", 1)
        .style("fill", (d) => {
            let scale_value = 0;
            if (hasProperty(d.properties, "id")) {
                const zone = Data_Store.getItem(d.properties.id);
                scale_value = zone.turnout;
            }
            return turnout_scale(scale_value);
        });
};

const create_map = (dataset, container_class_name, options) => {

    // set dimensions if passed as aparameter via options
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/width#svg
    let width = "auto";
    let height = "auto";
    if (hasProperty(options, "size") && hasProperty(options.size, "width")
    && hasProperty(options.size, "height") && isNumber(options.size.width)
    && isNumber(options.size.height)) {
        width = options.size.width;
        height = options.size.height;
    }

    console.log(dataset.map);

    // create projection of geo.json; center and zoom projection ccording to given dimensions
    const projection = d3.geoMercator().fitSize([width, height], dataset.map);
    const geoGenerator = d3.geoPath().projection(projection);

    // fetch map container and create svg container for map
    d3.select(container_class_name)
        .append("svg")
        .attr("width", width).attr("height", height)
        .append("g")
        .attr("class", "Map");

    // create description container and insert description text
    const description = (hasProperty(options, "description") && isString(options.description))
        ? options.description : null;
    d3.select(container_class_name)
        .append("p")
        .attr("class", "Name")
        .text(description);

    // add geo.json data to svg container
    d3.select(`${container_class_name} .Map`)
        .selectAll("path")
        .data(dataset.map.features)
        .join("path")
        .attr("d", geoGenerator)
        .attr("class", "District")
        .attr("fill", (d) => {

            if (hasProperty(d.properties, "id")) {

                const current_code = d.properties.id;
                const current_district = dataset.election.find((district) => district.id === current_code);

                // store additional data, which cannot be bind to svg elements in a cache
                Data_Store.setItem(
                    current_code,
                    {
                        votings: current_district.results,
                        turnout: current_district.turnout
                    }
                );
            }

            return REGION_DEFAULT_COLOR;
        })
        .on("mouseenter", mouse_enter)
        .on("mouseleave", mouse_leave)
        .on("mousemove", mouse_move)
        .on("click", mouse_click);

};


export {
    create_map,
    init,
    reset_maps,
    show_turnouts
};
