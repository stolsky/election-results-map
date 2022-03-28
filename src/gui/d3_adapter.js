/* global d3 */

import {hasProperty, isNumber, isString} from "../../lib/jst/native/typecheck.js";
import {Cache} from "../../lib/jst/resource/cache.js";
import {calculate_distance} from "../data/evaluation.js";


const MODE = {
    TURNOUT: {
        id: 1,
        title: "Wahlbeteiligung",
        description: ""
    },
    DISTANCE: {
        id: 2,
        title: "Abstand der Wahlergebnisse",
        description: ""
    }
};
// affects mouse events
let current_mode = MODE.TURNOUT.id;

let parties = null;

let distance_scale = null;
let turnout_scale = null;
let density_scale = null;

const get_party_property = (id, property) => parties.find(party => party.id === id)[property];

const Tooltip = (function () {

    let turnout = null;
    let turnout_visible = false;

    let chart = null;
    let chart_visible = false;
    let chart_width = 0;
    let chart_height = 0;
    let x_axis = null;
    let y_axis = null;

    const init_votings = function (data) {

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
            .padding(0.2);
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

    const core = {};

    core.init = function () {

        turnout = d3.select(".AppBody").append("div").attr("class", "Tooltip");
        turnout.append("p").attr("class", "Title");
        const content = turnout.append("div").attr("class", "Content");
        content
            .append("span")
            .attr("class", "Label")
            .text("Wahlbeteiligung");
        content
            .append("span")
            .attr("class", "Text");

        chart = d3.select(".AppBody").append("div").attr("class", "Tooltip");
        chart.append("p").attr("class", "Title");
        chart.append("p").attr("class", "ChartDescription")
            .text("Wahlergebnisse");
        chart.append("div").attr("class", "Content");

        chart_width = 200;
        chart_height = 200;

    };

    core.update_position = function (x, y) {

        let dom_elem = null;
        if (turnout_visible) {
            dom_elem = turnout.node();
        }
        if (chart_visible) {
            dom_elem = chart.node();
        }

        if (dom_elem) {

            const new_x = (dom_elem.offsetWidth + x + 5 > window.innerWidth)
                ? x - 5 - dom_elem.offsetWidth
                : x + 5;

            const new_y = (dom_elem.offsetHeight + y + 25 > window.innerHeight)
                ? y - 85 - dom_elem.offsetHeight
                : y - 65;

            dom_elem.style.translate = `${new_x}px ${new_y}px`;
        }

    };

    core.update_turnout = function (title, value) {

        turnout.select(".Title").text(title);
        turnout.select(".Text").text(value);

        turnout_visible = true;
        chart_visible = false;
        // turnout.style("opacity", 1);
        turnout.style("display", "block");
    };

    core.update_votings = function (title, data) {

        chart.select(".Title").text(title);

        if (!x_axis && !y_axis) {
            init_votings(data);
        }

        const content = chart.select("svg g").selectAll("rect")
            .data(data);

        content
            .enter()
            .append("rect")
            .merge(content)
            .transition()
            .duration(500)
            .attr("x", d => x_axis(get_party_property(d.id, "name")))
            .attr("y", d => y_axis(d.value))
            .attr("width", x_axis.bandwidth())
            .attr("height", d => chart_height - y_axis(d.value))
            .attr("fill", d => get_party_property(d.id, "color"));

        chart_visible = true;
        turnout_visible = false;
        // chart.style("opacity", 1);
        chart.style("display", "block");

    };

    core.hide = function () {
        if (turnout_visible) {
            // turnout.style("opacity", 0);
            turnout.style("display", "none");
            turnout_visible = false;
        }
        if (chart_visible) {
            // chart.style("opacity", 0);
            chart.style("display", "none");
            chart_visible = false;
        }
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

    console.log(event.target);

    const zone = Data_Store.getItem(features.properties.id);
    const name = features.properties.name;

    if (current_mode === MODE.TURNOUT.id) {
        Tooltip.update_turnout(name, zone.turnout);
    } else if (current_mode === MODE.DISTANCE.id) {
        Tooltip.update_votings(name, zone.votings);
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

    Tooltip.hide();

    d3.selectAll(".District")
        .transition()
        .duration(200)
        .style("opacity", 1);
};

const mouse_move = function (event) {
    Tooltip.update_position(event.clientX, event.clientY);
};

const mouse_click = function (event, features) {

    const code = features.properties.id;
    const name = features.properties.name;
    const zone = Data_Store.getItem(code);

    current_mode = MODE.DISTANCE.id;
    // TODO remember current zone to not display results over already displayed results

    Tooltip.hide();
    Tooltip.update_votings(name, zone.votings);
    Tooltip.update_position(event.clientX, event.clientY);

    d3.selectAll(".District")
        .interrupt()
        .transition()
        .duration(500)
        .style("opacity", 1)
        .style("fill", d => {
            let color = null;
            if (hasProperty(d.properties, "id")) {
                const compare_zone = Data_Store.getItem(d.properties.id);
                color = calculate_color_from_votings(compare_zone.votings, zone.votings);
            }
            return color;
        });

};

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

            let scale_value = 0;

            if (hasProperty(d.properties, "id")) {

                const current_code = d.properties.id;
                const current_district = dataset.election.find(district => district.id === current_code);

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
    create_data_map,
    init
};
