/* global d3 */

import {hasProperty, isNumber, isString} from "../../lib/jst/native/typecheck.js";
import {is_current_state, STATE} from "./visualization.js";
import {Cache} from "../../lib/jst/resource/cache.js";
import {calculate_distance} from "../data/evaluation.js";


let parties = null;

let distance_scale = null;
let turnout_scale = null;
let density_scale = null;

const get_party_property = (id, property) => parties.find(party => party.id === id)[property];

const Tooltip = (function () {

    let first_draw = true;
    let tooltip = null;
    let tooltip_visible = false;

    let textfield = null;

    let chart = null;
    let chart_width = 0;
    let chart_height = 0;
    let x_axis = null;
    let y_axis = null;

    const init_chart = function (data) {

        // TODO set width related to number of datasets (bars) to represent
        chart_width = 200;
        chart_height = 200;

        const content = chart.select(".Content")
            .append("svg")
            .attr("width", chart_width + 20)
            .attr("height", chart_height + 40)
            .style("overflow", "visible")
            .append("g")
            .attr("transform", "translate(" + 20 + "," + 10 + ")");

        x_axis = d3.scaleBand()
            .range([0, chart_width])
            .domain(data.map(d => get_party_property(d.id, "name")))
            .padding(0.5);
        content.append("g")
            .attr("transform", `translate(0, ${chart_height})`)
            .call(d3.axisBottom(x_axis))
            .selectAll("text")
            .attr("transform", "translate(5, -3) rotate(-25)")
            .style("text-anchor", "end");

        y_axis = d3.scaleLinear()
            .domain([0, 50])
            .range([chart_height, 0]);
        content.append("g")
            .call(d3.axisLeft(y_axis));

    };

    const reset_chart = function () {
        chart.style("display", "none").select("svg g").selectAll(".BackBar")
            .remove();
    };

    const reset_textfield = function () {
        textfield.style("display", "none");
    };

    const update_chart = function (data, show_back_bars) {

        let duration = 1000;
        if (first_draw) {
            duration = 0;
            first_draw = false;
        }

        if (!x_axis && !y_axis) {
            init_chart(data);
        }

        textfield.style("display", "none");
        const front_bars = chart.style("display", "block")
            .select("svg g").selectAll(".FrontBar")
            .data(data);
        front_bars
            .enter()
            .append("rect")
            .attr("class", "FrontBar")
            .merge(front_bars)
            .transition()
            .duration(duration)
            .attr("x", d => x_axis(get_party_property(d.id, "name")))
            .attr("y", d => y_axis(d.value))
            .attr("width", x_axis.bandwidth())
            .attr("height", d => chart_height - y_axis(d.value))
            .attr("fill", d => get_party_property(d.id, "color"));

        if (show_back_bars) {
            const back_bars = chart.select("svg g").selectAll(".BackBar")
                .data(data);
            back_bars
                .enter()
                .append("rect")
                .attr("class", "BackBar")
                .merge(back_bars)
                .lower()
                .attr("x", d => x_axis(get_party_property(d.id, "name")) - 8)
                .attr("y", d => y_axis(d.value))
                .attr("width", x_axis.bandwidth())
                .attr("height", d => chart_height - y_axis(d.value))
                .attr("fill", "#aaaaaa");
        }

    };

    const update_textfield = function (value) {
        chart.style("display", "none");
        textfield.style("display", "block");
        textfield.select(".Text").text(value);
    };

    const core = {};

    // TODO make the structure (also title names, etc) customizable through an options parameter
    core.init = function () {

        tooltip = d3.select(".AppBody").append("div").attr("class", "Tooltip");
        tooltip.append("p").attr("class", "Title");
        const content = tooltip.append("div").attr("class", "Content");

        textfield = content.append("div").style("display", "none");
        textfield.append("span")
            .attr("class", "Label")
            .text("Wahlbeteiligung");
        textfield
            .append("span")
            .attr("class", "Text");

        chart = content.append("div").style("display", "none");
        chart.append("p")
            .attr("class", "Label")
            .text("Wahlergebnisse");
        chart
            .append("div")
            .attr("class", "Content");

    };

    core.reset = function () {
        reset_chart();
        reset_textfield();
        core.hide();
    };

    core.update_position = function (x, y) {
        if (tooltip_visible) {

            const dom_node = tooltip.node();

            // horizontal correction, depending on whether the tooltip extends beyond the page
            const new_x = (dom_node.offsetWidth + x + 10 > window.innerWidth)
                ? x - 5 - dom_node.offsetWidth
                : x + 10;

            // vertical correction, depending on whether the tooltip extends beyond the page
            const new_y = (dom_node.offsetHeight + y + 20 > window.innerHeight)
                ? y - 85 - dom_node.offsetHeight
                : y - 65;

            dom_node.style.transform = `translate(${new_x}px, ${new_y}px)`;
        }
    };

    core.update_data = function (title, data, show_back_bars = false) {

        if (is_current_state(STATE.TURNOUT)) {
            update_textfield(data.turnout);
        } else if (is_current_state(STATE.DISTANCE)) {
            update_chart(data.votings, show_back_bars);
        }

        tooltip.select(".Title").text(title);
        tooltip.style("display", "block");
        tooltip_visible = true;

    };

    core.hide = function () {
        tooltip.style("display", "none");
        tooltip_visible = false;
    };

    return Object.freeze(core);
})();

const Data_Store = new Cache();

const init = function (parties_info) {

    if (parties_info) {
        parties = parties_info;
    }

    distance_scale = d3.scaleSequential(d3.interpolate("white", "purple"))
        .domain([0, 50]);

    turnout_scale = d3.scaleSequential()
        .domain([50, 90])
        .interpolator(d3.interpolateRdYlGn);

    Tooltip.init();
};

const calculate_color_from_votings = (votings1, votings2) => distance_scale(
    calculate_distance(
        votings1.map(result => result.value),
        votings2.map(result => result.value)
    )
);

const mouse_enter = function (event, features) {

    Tooltip.update_data(
        features.properties.name,
        Data_Store.getItem(features.properties.id)
    );

    // TODO optimize the highlighting of the selected part of the map
    // d3.selectAll(".District")
    //     .transition()
    //     .duration(200)
    //     .style("opacity", 0.3);

    // d3.select(this)
    //     .transition()
    //     .duration(200)
    //     .style("opacity", 1);
};

const mouse_leave = function (event) {

    Tooltip.hide();

    // d3.selectAll(".District")
    //     .transition()
    //     .duration(200)
    //     .style("opacity", 1);
};

const mouse_move = function (event) {
    Tooltip.update_position(event.clientX, event.clientY);
};

const mouse_click = function (event, features) {

    if (is_current_state(STATE.DISTANCE)) {

        const code = features.properties.id;
        const name = features.properties.name;
        const zone = Data_Store.getItem(code);

        Tooltip.update_data(name, zone, true);
        Tooltip.update_position(event.clientX, event.clientY);

        d3.selectAll(".District")
            .interrupt()
            .transition()
            .duration(500)
            // .style("opacity", 1)
            .style("fill", d => {
                let color = null;
                if (hasProperty(d.properties, "id")) {
                    const compare_zone = Data_Store.getItem(d.properties.id);
                    color = calculate_color_from_votings(compare_zone.votings, zone.votings);
                }
                return color;
            });
    }

};

const reset_maps = function () {

    d3.selectAll(".District")
        .interrupt()
        .transition()
        .duration(500)
        .style("opacity", 1)
        .style("fill", "#ffffff");

    Tooltip.reset();

};

const show_turnouts = function () {
    d3.selectAll(".District")
        .interrupt()
        .transition()
        .duration(500)
        .style("opacity", 1)
        .style("fill", d => {
            let scale_value = 0;
            if (hasProperty(d.properties, "id")) {
                const zone = Data_Store.getItem(d.properties.id);
                scale_value = zone.turnout;
            }
            return turnout_scale(scale_value);
        });
};

const create_map = function (dataset, container_class_name, options) {

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
    const projection = d3.geoMercator().fitSize([width, height], dataset.map);
    const geoGenerator = d3.geoPath().projection(projection);

    // fetch map container and create svg container for map
    d3.select(container_class_name)
        .append("svg").attr("width", width).attr("height", height)
        .append("g").attr("class", "Map");

    // create description container and insert description text
    const description = (hasProperty(options, "description") && isString(options.description))
        ? options.description : null;
    d3.select(container_class_name)
        .append("p")
        .attr("class", "Name")
        .text(description);

    // add geo.json data to svg container
    d3.select(container_class_name + " .Map")
        .selectAll("path")
        .data(dataset.map.features)
        .join("path")
        .attr("d", geoGenerator)
        .attr("class", "District")
        .attr("fill", d => {

            if (hasProperty(d.properties, "id")) {

                const current_code = d.properties.id;
                const current_district = dataset.election.find(district => district.id === current_code);

                // store additional data, which cannot be bind to svg elements in a cache
                Data_Store.setItem(
                    current_code,
                    {
                        votings: current_district.results,
                        turnout: current_district.turnout
                    }
                );
            }

            return "#ffffff";
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
