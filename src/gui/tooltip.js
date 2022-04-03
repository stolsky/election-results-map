/* global d3 */

import {is_current_state, STATE} from "./visualization.js";


let first_draw = true;
let tooltip = null;
let tooltip_visible = false;

let textfield = null;

let chart = null;
let chart_width = 0;
let chart_height = 0;
let x_axis = null;
let y_axis = null;

let parties = null;

const get_party_property = (id, property) => parties.find(party => party.id === id)[property];

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

const update_chart = function (data, update_back_bars) {

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

    if (update_back_bars) {
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

// TODO make the structure (also title names, etc) customizable through an options parameter
const init = function (parties_info) {

    if (parties_info) {
        parties = parties_info;
    }

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

const hide = function () {
    tooltip.style("display", "none");
    tooltip_visible = false;
};

const reset = function () {
    reset_chart();
    reset_textfield();
    hide();
};

const update_data = function (title, data, update_back_bars = false) {

    if (is_current_state(STATE.TURNOUT)) {
        update_textfield(data.turnout);
    } else if (is_current_state(STATE.DISTANCE)) {
        update_chart(data.votings, update_back_bars);
    }

    tooltip.select(".Title").text(title);
    tooltip.style("display", "block");
    tooltip_visible = true;

};

const update_position = function (x, y) {
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


export {
    hide,
    init,
    reset,
    update_data,
    update_position
};
