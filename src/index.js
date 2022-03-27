
import * as Adjustment from "./data/adjustment.js";
import * as Analysis from "./data/analysis.js";
import * as Evaluation from "./data/evaluation.js";
import * as Import from "./data/import.js";
import * as Selection from "./data/selection.js";
import * as Visualization from "./gui/visualization.js";


let parties = null;

// Pipeline
Import.load_files(
    {name: "dat/parties.json"},

    // {name: "https://geo.sv.rostock.de/download/opendata/stadtbereiche/stadtbereiche.json"},
    {name: "dat/rostock_districts.geo.json"},

    // {name: "https://geo.sv.rostock.de/download/opendata/bundestagswahl_2017/bundestagswahl_2017_ergebnisse.json"},
    {name: "dat/btw_2017_hro_districts.json"},

    // {name: "https://geo.sv.rostock.de/download/opendata/bevoelkerungsstruktur_2017/bevoelkerungsstruktur_2017_insgesamt.json"},
    {name: "dat/structure_2017_hro_districts.json"},

    {name: "dat/mecklenburgvorpommern.geo.json"},
    {name: "dat/germany.geo.json"},

    // https://www.bundeswahlleiter.de/dam/jcr/0d1ea773-f3ca-40ea-b8ff-b031712707e1/btw17_kerg2.csv
    {name: "dat/btw_2017_de.csv", delimiter: ";", comments: "#"}
).then(loaded_data => {

    // order by year of establishment (property "est")
    // important for comparison (distance method)
    parties = loaded_data[0].sort((a, b) => a.est > b.est);

    const results_de = loaded_data[6].filter(col => col[4] === "Bundesgebiet");
    const results_mv = loaded_data[6].filter(col => col[4] === "Mecklenburg-Vorpommern");

    const options_turnout = {
        group_column_id: 8,
        votes_column_id: 11,
        eligible_voters_key: "Wahlberechtigte",
        voters_key: "Wähler"
    };

    const options_votings = {
        group_column_id: 8,
        votes_type_column_id: 10,
        votes_type_value: "2", // use the second vote only
        votes_column_id: 11,
        parties_names: parties.map(party => party.name)
    };

    const turnout_mv = Selection.calculate_turnout(results_mv, options_turnout);
    const votings_mv = Selection.extract_votings(results_mv, options_votings);

    const turnout_de = Selection.calculate_turnout(results_de, options_turnout);
    const votings_de = Selection.extract_votings(results_de, options_votings);

    // TODO do all aggregations -> calulate percentages of turnouts and votes and its precision to Evaluation
    return {
        city_districts: {
            map: loaded_data[1],
            election: loaded_data[2],
            population: null // loaded_data[3]
        },
        federal_state: {
            map: loaded_data[4],
            election: [{
                id: "DE-MV",
                name: "Mecklenburg-Vorpommern",
                turnout: Selection.finalize_turnout(turnout_mv),
                results: Selection.finalize_votings(votings_mv, turnout_mv)
            }],
            population: null
        },
        country: {
            map: loaded_data[5],
            election: [{
                id: "DE",
                name: "Deutschland",
                turnout: Selection.finalize_turnout(turnout_de),
                results: Selection.finalize_votings(votings_de, turnout_de)
            }],
            population: null
        }
    };

}).then(data => {

    // adjustments necessary to process all data the same
    // key mapping like "code"->"id", "bezeichnung"->"name"
    // use generic key names used in evaluate and visualize

    Adjustment.replace_keys(
        data,

        "city_districts.map.features.properties.code:id",
        "city_districts.map.features.properties.bezeichnung:name",

        "city_districts.election.stadtbereich_code:id",
        "city_districts.election.stadtbereich_bezeichnung:name",
        "city_districts.election.wahlbeteiligung:turnout"
    );

    // TODO FIX PROPRIETARY METHOD
    Adjustment.restructure(
        data.city_districts.election,
        {
            new_name: "results", // collection_name
            // {party: "", votes: ""} // object_property1, ...
            query: "zweitstimmenanteile_" // to replace
        }
    );

    Adjustment.sort_election_results(
        parties,
        data.city_districts.election,
        data.federal_state.election,
        data.country.election
    );

    // TODO automate in Analysis
    data.country.map.features[0].properties.id = "DE";
    data.country.map.features[0].properties.name = "Deutschland";

    return data;

}).then(data => {

    // Analysis. ... (data, {}))
    // give places where to find data to check -> quality criteria formulae

    return data;

}).then(data => {

    // Evaluation. ...(results, {}))
    // console.log(data);

    return data;

}).then(data => {

    Visualization.init({
        title: "Wahlergebnisse 2017",
        subtitle: "Visuelle Darstellung der Wahlergebnisse",
        area: "a b,a c",
        cols: "70% 30%",
        parties
    });

    Visualization.add_data_map(data.city_districts, {description: "Rostock, Stadtbereiche"});
    Visualization.add_data_map(data.federal_state, {description: "Mecklenburg-Vorpommern"});
    Visualization.add_data_map(data.country, {description: "Deutschland"});

});
