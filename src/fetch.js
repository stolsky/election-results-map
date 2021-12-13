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

// RAQ = REST API Query

const DEMOGRAPHIC_STRUCTURE_RAQ = "";
const DEMOGRAPHIC_STRUCTURE_BACKUP = "dat/demographic_structure_%YEAR%.json";

const DISTRICT_BORDERS_RAQ = "https://geo.sv.rostock.de/download/opendata/stadtbereiche/stadtbereiche.json";
const DISTRIC_BORDERS_BACKUP = "dat/district_borders.json";

const ELECTORAL_DISTRICTS_RAQ = "https://geo.sv.rostock.de/download/opendata/bundestagswahl_%YEAR%/bundestagswahl_%YEAR%_wahlbezirke.json";
const ELECTORAL_DISTRICTS_BACKUP = "dat/electoral_districts_%YEAR%.json";

const FEDERAL_ELECTION_RESULTS_RAQ = "https://geo.sv.rostock.de/download/opendata/bundestagswahl_%YEAR%/bundestagswahl_%YEAR%_ergebnisse.json";
const FEDERAL_ELECTION_RESULTS_BACKUP = "dat/federal_election_results_%YEAR%.json";


const fetchJSON = async (url) => {
    const response = await fetch(url, {mode: "same-origin"});
    return await response.json();
};

const fetch_muliple_resources = async (base_url, replace_pattern, resources) => {
    const promises = [];
    if (resources instanceof Array) {
        resources.forEach(value => promises.push(fetchJSON(base_url.replaceAll(replace_pattern, String(value)))));
    }
    return await Promise.all(promises);
};

const get_data_by_year = async function (...years) {
    return {
        districts: await fetchJSON(DISTRICT_BORDERS_RAQ),
        electorals: await fetch_muliple_resources(ELECTORAL_DISTRICTS_RAQ, "%YEAR%", years),
        demographics: await fetch_muliple_resources(DEMOGRAPHIC_STRUCTURE_RAQ, "%YEAR%", years),
        results: await fetch_muliple_resources(FEDERAL_ELECTION_RESULTS_RAQ, "%YEAR%", years)
    };
};

const get_data_by_year_from_backup = async function (...years) {
    return {
        districts: await fetchJSON(DISTRIC_BORDERS_BACKUP),
        electorals: await fetch_muliple_resources(ELECTORAL_DISTRICTS_BACKUP, "%YEAR%", years),
        demographics: await fetch_muliple_resources(DEMOGRAPHIC_STRUCTURE_BACKUP, "%YEAR%", years),
        results: await fetch_muliple_resources(FEDERAL_ELECTION_RESULTS_BACKUP, "%YEAR%", years)
    };
};


export {
    get_data_by_year,
    get_data_by_year_from_backup
};
