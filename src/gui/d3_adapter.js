/* global d3 */

import {hasProperty, isNumber, isString} from "../../lib/jst/native/typecheck.js";
import {Cache} from "../../lib/jst/resource/cache.js";
import {calculate_distance} from "../data/evaluation.js";


let tooltip = null;

let distance_scale = null;
let turnout_scale = null;
let density_scale = null;

const Data_Store = new Cache();

const calculate_color_from_votings = (votings1, votings2) => distance_scale(
    calculate_distance(
        votings1.map(result => result.value),
        votings2.map(result => result.value)
    )
);

const mouse_enter = function (event, features) {

    if (hasProperty(features.properties, "bezeichnung")) {
        tooltip
            .text(features.properties.bezeichnung)
            .style("opacity", 1);
    }

    d3.selectAll(".District")
        .transition()
        .duration(200)
        .style("opacity", 0.3);

    d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1);
};

const mouse_leave = function (event) {

    tooltip.style("opacity", 0);

    d3.selectAll(".District")
        .transition()
        .duration(200)
        .style("opacity", 1);
};

const mouse_move = function (event) {
    const [x, y] = d3.pointer(event);
    // TODO use transform.translate() instead of left & top
    // TODO calculate the x & y in a way that it looks the same in every resolution
    tooltip
        .style("left", (x + 15) + "px")
        .style("top", (y + 90) + "px");
};

const mouse_click = function (event, features) {

    const comparison_district_code = features.properties.code;
    const comparison_district = Data_Store.getItem(comparison_district_code);

    d3.selectAll(".District")
        .interrupt()
        .transition()
        .duration(500)
        .style("opacity", 1)
        .style("fill", d => {
            let color = null;
            if (hasProperty(d.properties, "code")) {
                const current_district = Data_Store.getItem(d.properties.code);
                color = calculate_color_from_votings(current_district.votings, comparison_district.votings);
            }
            return color;
        });
};

// const handle_zoom = function (event) {
//     d3.select("svg g")
//         .attr("transform", event.transform);
// };

// const zoom = d3.zoom()
//     .on("zoom", handle_zoom);


const create_data_map = function (dataset, container_class_name, options) {

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
    // create projection of geo.json; center and zoom projection ccording to given dimensions
    const projection = d3.geoMercator().fitSize([width, height], dataset.borders);
    const geoGenerator = d3.geoPath().projection(projection);

    // fetch map container and create svg container for map
    d3.select(container_class_name)
        .append("svg").attr("width", width).attr("height", height)
        .append("g").attr("class", "Map");

    // d3.select("svg").call(zoom);

    // create description container and insert description text
    const description = (hasProperty(options, "description") && isString(options.description))
        ? options.description : null;
    d3.select(container_class_name)
        .append("p")
        .attr("class", "Name")
        .text(description);

    // create color scales if not available
    if (!distance_scale) {
        distance_scale = d3.scaleSequential(d3.interpolate("white", "purple"))
            .domain([0, 50]);
    }
    if (!turnout_scale) {
        turnout_scale = d3.scaleSequential()
            .domain([50, 90])
            .interpolator(d3.interpolateRdYlGn);
    }

    // create tooltip if not available
    if (!tooltip) {
        tooltip = d3.select(".AppBody")
            .append("div")
            .attr("class", "Tooltip");
    }

    // add geo.json data to svg container
    d3.select(container_class_name + " .Map")
        .selectAll("path")
        .data(dataset.borders.features)
        .join("path")
        .attr("d", geoGenerator)
        .attr("class", "District")
        .attr("fill", d => {

            let scale_value = 0;

            if (hasProperty(d.properties, "code")) {

                const current_code = d.properties.code;
                const current_district = dataset.votings.find(district => district.id === current_code);

                // store additional data, which cannot be bind to svg elements in a cache
                Data_Store.setItem(
                    current_code,
                    {
                        votings: current_district.results,
                        turnout: current_district.turnout
                    });

                scale_value = current_district.turnout;
            }

            return turnout_scale(scale_value);
        })
        .on("mouseenter", mouse_enter)
        .on("mouseleave", mouse_leave)
        .on("mousemove", mouse_move)
        .on("click", mouse_click);

};


export {
    create_data_map
};
