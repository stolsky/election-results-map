// /* global L */

// // use colors     	FF9933	003399	99CCCC	CCCCCC
// // https://www.colorcombos.com/color-schemes/89/ColorCombo89.html

// import * as Fetch from "./fetch.js";

// // const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

// // Fetch.get_electoral_borders_from_backup(2002, 2005, 2009, 2013, 2017, 2021)
// //     .then(data => data);

// let data_to_plot = null;

// const map_canvas = document.createElement("div");
// map_canvas.id = "Map";
// document.body.appendChild(map_canvas);

// // if (feature.properties) {
// //     layer.bindPopup(feature.properties.nummer);
// // }

// let map = null;
// let geojson = null;

// function highlight_feature (e) {
//     const layer = e.target;
//     layer.setStyle({
//         weight: 2,
//         color: "#003399",
//         fillColor: "#003399",
//         dashArray: "",
//         fillOpacity: 0.3
//     });
//     layer.bringToFront();
// }

// function reset_highlight (e) {
//     const layer = e.target;
//     geojson.resetStyle(layer);
// }

// function zoom_to_feature (e) {
//     map.fitBounds(e.target.getBounds(), {maxZoom: 16});
//     console.log(map.getZoom());
// }

// function add_geojson_layer (geojson_data, style, interactive = false) {

//     let on_each_feature = null;
//     if (interactive) {
//         on_each_feature = (feature, layer) => {
//             layer.on({
//                 mouseover: highlight_feature,
//                 mouseout: reset_highlight,
//                 click: zoom_to_feature
//             });
//         };
//     }

//     return L.geoJSON(
//         geojson_data, {
//             style,
//             onEachFeature: on_each_feature
//         }
//     ).addTo(map);
// }

// function calculate_color_density (district_code) {

//     const current = data_to_plot.find(district => district.stadtbereich_code === district_code);
//     const density = current.bevoelkerungsdichte;

//     if (density > 4000) {
//         return "#800026";
//     } else if (density > 3000) {
//         return "#BD0026";
//     } else if (density > 2000) {
//         return "#E31A1C";
//     } else if (density > 1000) {
//         return "#FC4E2A";
//     } else if (density > 500) {
//         return "#FD8D3C";
//     } else if (density > 200) {
//         return "#FEB24C";
//     } else if (density > 100) {
//         return "#FED976";
//     } else {
//         return "#FFEDA0";
//     }
// }

// function set_style_density (feature) {
//     return {
//         color: "transparent",
//         weight: 2,
//         opacity: 1,
//         fillColor: calculate_color_density(feature.properties.code),
//         fillOpacity: 0.5
//     };
// }

// function calculate_color_election (district_code) {
//     const current = data_to_plot.find(district => district.stadtbereich_code === district_code);
//     const turnout = current.wahlbeteiligung;

//     if (turnout > 90) {
//         return "#800026";
//     } else if (turnout > 85) {
//         return "#BD0026";
//     } else if (turnout > 80) {
//         return "#E31A1C";
//     } else if (turnout > 75) {
//         return "#FC4E2A";
//     } else if (turnout > 70) {
//         return "#FD8D3C";
//     } else if (turnout > 65) {
//         return "#FEB24C";
//     } else if (turnout > 60) {
//         return "#FED976";
//     } else {
//         return "#FFEDA0";
//     }

// }

// function set_style_election (feature) {
//     return {
//         color: "transparent",
//         weight: 2,
//         opacity: 1,
//         fillColor: calculate_color_election(feature.properties.code),
//         fillOpacity: 0.5
//     };
// }

// Fetch.get_data_by_year_from_backup(2005)
//     .then(data => {

//         //                               enter        start zoom
//         map = L.map("Map").setView([54.1429, 12.2395], 11);

//         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//             attribution: "Kartendaten &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
//             tileSize: 256
//         }).addTo(map);

//         // data_to_plot = data.demographics[0];
//         data_to_plot = data.results[0];

//         // L.geoJson(data.districts, {style: set_style_density}).addTo(map);

//         L.geoJSON(data.districts, {style: set_style_election}).addTo(map);

//         add_geojson_layer(
//             data.electorals[0],
//             {color: "white", weight: 2, opacity: 1, fillColor: "transparent"}
//         );
//         geojson = add_geojson_layer(
//             data.districts,
//             {color: "transparent", weight: 2, opacity: 1, fillColor: "transparent"},
//             true
//         );

//     });

fetch("dat/gemeinden 2005.csv", {method: "get", headers: {"content-type": "text/csv;charset=utf-8"}})
    .then(response => response.text()).then(data => {
        data.split("\r\n").forEach(row => document.write(`<p>${row}</p>`))
    });
