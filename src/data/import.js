// structure of complete REST API REQUEST:
// const rest_api_request = function (query) {
//     fetch("https://www.opendata-hro.de/api/action/package_search?q=" + query)
//         .then(response => response.json())
//         .then(data => {
//             if (data.success) {
//                  // filter ergebnisse und wahlbezirke
//                 return data.result.results.map(entry => entry.resources.filter(set => set.format.toLowerCase() === "json"));
//             }
//         });
// }
// rest_api_reuqest("bundestagswahl");

import {hasProperty, isString} from "../../lib/jst/native/typecheck.js";


const SOURCE = Object.freeze({
    ONLINE: "ONLINE",
    BACKUP: "BACKUP"
});

const fetch_json = async (url) => {
    if (isString(url)) {
        const response = await fetch(url, {mode: "same-origin"});
        return response.json();
    } else {
        return null;
    }
};

// TODO use d3.json & d3.csv ?
// https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js

/**
 * @param {integer} year
 * @param {Object} options
 * @returns {Object} `{city_district: {map, population, votings},
        federal_state: {map, population, votings},
        country: {map, population, votings}}`
 */
const get_election_results_by_year = async function (year, options) {

    return fetch_json("dat/files_index.json")
        .then(async files_index => {

            if (files_index instanceof Object) {

                const source = (hasProperty(options, "query") && options.query === SOURCE.ONLINE) ? "ONLINE" : "BACKUP";

                const regions = ["ROSTOCK_DISTRICTS", "MECKLENBURGVORPOMMERN", "GERMANY"];
                const categories = ["RESULTS", "DEMOGRAPHIC_STRUCTURE", "BORDERS"];

                const result = d3.csv("dat/btw2005_kerg.csv");
                console.log(result);

                const to_be_loaded = [];
                regions.forEach(region => {
                    categories.forEach(category => {
                        const query = files_index[region][category][source];
                        to_be_loaded.push(fetch_json(query.replace(/%YEAR%/g, year)));
                    });
                });
                const results = await Promise.all(to_be_loaded);

                return {
                    city_districts: {votings: results[0], population: results[1], borders: results[2]},
                    federal_state: {votings: results[3], population: results[4], borders: results[5]},
                    country: {votings: results[6], population: results[7], borders: results[8]}
                };

            } else {
                return null;
            }
        })
        .catch(error => console.error("Error while loading data.", error));

};


export {
    SOURCE,
    get_election_results_by_year
};
