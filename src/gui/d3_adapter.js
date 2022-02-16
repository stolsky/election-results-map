/* global d3 */

import {hasProperty} from "../../lib/jst/native/typecheck.js";


let tooltip = null;
let color_scale = null;

const create_data_map = function (data_map, width, height, container_name) {

    const projection = d3.geoMercator().fitSize([width, height], data_map.borders);
    const geoGenerator = d3.geoPath().projection(projection);

    d3.select(container_name)
        .append("svg").attr("width", width).attr("height", height)
        .append("g").attr("class", "Map");

    d3.select(container_name)
        .append("p")
        .attr("class", "Name")
        .text(data_map.borders.features[0].properties.name);

    if (!color_scale) {
        color_scale = d3.scaleLinear()
            .domain([0, 1])
            .range(["lemonchiffon", "salmon", "rebeccapurple", "skyblue"]);

        // const myColor = d3.scaleSequential()
        //     .interpolator(d3.interpolateInferno)
        //     .domain([1, 100]);
    }
    if (!tooltip) {
        tooltip = d3.select(".AppBody")
            .append("div")
            .attr("class", "Tooltip");
    }

    // d3 transition tutorial
    // https://www.d3-graph-gallery.com/graph/interactivity_transition.html

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
        tooltip
            .style("left", (x + 15) + "px")
            .style("top", (y + 90) + "px");
    };

    const mouse_click = function (event, features) {

        // TODO onclick on self -> deselect
        d3.selectAll(".District")
            .transition()
            .duration(200)
            .style("fill", "#cccccc");
        d3.select(this)
            .transition()
            .duration(200)
            .style("fill", "#ffffff");

        // TODO
        // trigger recolor
    };

    // choropleth tutorial
    // https://www.d3-graph-gallery.com/graph/choropleth_basic.html

    const geojson_map = d3.select(container_name + " .Map")
        .selectAll("path")
        .data(data_map.borders.features)
        .join("path")
        .attr("d", geoGenerator)
        .attr("class", "District")
        // TODO instead of "code" use key_mapping variable
        // .attr("id", d => d.features.properties.code)
        .on("mouseenter", mouse_enter)
        .on("mouseleave", mouse_leave)
        .on("mousemove", mouse_move)
        .on("click", mouse_click);

    return geojson_map;
};


// map.selectAll("path")
//     .data(data.votings, d => d.C)
//     .join()
//     .attr("fill", d => {
//         console.log(d);
//         // return colorScale(d.total);
//         return false;
//     });

/*
function update(option) {
    svg.selectAll("path").interrupt().transition()
        .duration(1000).ease(d3.easeLinear)
        .attrTween("d", projectionTween(projection, projection = option.projection))
    d3.timeout(loop, 1000)
}
*/


export {
    create_data_map
};
