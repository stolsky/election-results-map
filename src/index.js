/* global L */

// use colors     	FF9933	003399	99CCCC	CCCCCC
// https://www.colorcombos.com/color-schemes/89/ColorCombo89.html

import * as Fetch from "./fetch.js";

const hasProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

// Fetch.get_electoral_borders_from_backup(2002, 2005, 2009, 2013, 2017, 2021)
//     .then(data => data);

const map_canvas = document.createElement("div");
map_canvas.id = "Map";
document.body.appendChild(map_canvas);

// if (feature.properties) {
//     layer.bindPopup(feature.properties.nummer);
// }

let map = null;
let geojson = null;


function highlight_feature (e) {
    const layer = e.target;
    if (hasProperty(layer.feature.properties, "bezeichnung")) {

        layer.setStyle({
            weight: 2,
            color: "#FF3333",
            fillColor: "#FF3333",
            dashArray: "",
            fillOpacity: 0.3
        });

        layer.bringToFront();
    }
}

function reset_highlight (e) {
    const layer = e.target;
    if (hasProperty(layer.feature.properties, "bezeichnung")) {
        geojson.resetStyle(layer);
    }
}

function zoom_to_feature (e) {
    map.fitBounds(e.target.getBounds(), {maxZoom: 16});
    console.log(map.getZoom());
}

function add_geojson_layer (geojson_data, style) {
    geojson = L.geoJSON(
        geojson_data, {
            style,
            onEachFeature: (feature, layer) => {
                layer.on({
                    mouseover: highlight_feature,
                    mouseout: reset_highlight,
                    click: zoom_to_feature
                });
            }
        }
    ).addTo(map);
}

Fetch.get_data_by_year_from_backup(2005)
    .then(data => {

        //                               enter        start zoom
        map = L.map("Map").setView([54.1429, 12.2395], 11);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "Kartendaten &copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>",
            tileSize: 256
        }).addTo(map);

        // data.results
        // data.districts
        // data.demographics

        add_geojson_layer(data.electorals[0], {color: "#ff9933", weight: 2, opacity: 1, fillColor: "transparent"});
        add_geojson_layer(data.districts, {color: "#003399", weight: 2, opacity: 0.8, fillColor: "transparent"});

    });
