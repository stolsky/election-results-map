
// use colors     	FF9933	003399	99CCCC	CCCCCC
// https://www.colorcombos.com/color-schemes/89/ColorCombo89.html

// http://opendatalab.de/projects/geojson-utilities/
// https://gdz.bkg.bund.de/index.php/default/open-data.html
// https://data.opendatasoft.com/api/v2/console
// https://regionalatlas.statistikportal.de/#


import * as Adjustment from "./data/adjustment.js";
import * as Analysis from "./data/analysis.js";
import * as Evaluation from "./data/evaluation.js";
import * as Import from "./data/import.js";
import * as Visualization from "./gui/visualization.js";


// pipeline
Import.get_election_results_by_year(2005, {query: Import.SOURCE.BACKUP})
    .then(data => {

        // Analysis. ... (data, {}))

        return data;
    })
    .then(data => {

        // key mapping like "code"->"id", "bezeichnung"->"name"
        // use generic key names used in evaluate and visualize

        Adjustment.replace_keys(
            data,
            // "city_districts.borders.features.properties.code:id",
            // "city_districts.borders.features.properties.bezeichnung:name",
            "city_districts.votings.stadtbereich_code:id",
            "city_districts.votings.stadtbereich_bezeichnung:name"
        );

        // bezeichnung -> name
        // Adjustment.replace_keys(results)
        // Adjustment.replace_keys(results.votings, "stadtbereich_code:code", "stadtbereich_bezeichnung:bezeichnung");
        // Adjustment.restructure()
        // Adjustment.replace_keys(results.population, "stadtbereich_code:code", "stadtbereich_bezeichnung:bezeichnung");

        return data;
    })
    .then(data => {

        // Evaluation. ...(results, {}))

        return data;
    })
    .then(data => {

        Visualization.init({area: "a b,a c", cols: "70% 30%"});

        Visualization.add_data_map(data.city_districts);
        Visualization.add_data_map(data.federal_state);
        Visualization.add_data_map(data.country);

    });
