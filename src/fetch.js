
// RAQ = REST API Query
const RAQ_DISTRICT_BORDERS = "https://geo.sv.rostock.de/download/opendata/stadtbereiche/stadtbereiche.json";
const DISTRIC_BORDERS_BACKUP = "dat/district_borders.json";

const RAQ_FEDERAL_ELECTION_RESULTS = "https://geo.sv.rostock.de/download/opendata/bundestagswahl_%YEAR%/bundestagswahl_%YEAR%_ergebnisse.json";
const FEDERAL_ELECTION_RESULTS_BACKUP = "dat/federal_election_results_%YEAR%.json";


const fetchJSON = async (url) => {
    const response = await fetch(url);
    return await response.json();
};

const get_district_borders = async () => fetchJSON(RAQ_DISTRICT_BORDERS);

const get_district_borders_from_backup = async () => fetchJSON(DISTRIC_BORDERS_BACKUP);

const get_federal_election_results = async (...years) => {

    const promises = [];

    if (years instanceof Array) {
        years.forEach(year => promises.push(fetchJSON(RAQ_FEDERAL_ELECTION_RESULTS.replace(/%YEAR%/g, String(year)))));
    }

    return await Promise.all(promises);
};

const get_federal_election_results_from_backup = async (...years) => {

    const promises = [];

    if (years instanceof Array) {
        years.forEach(year => promises.push(fetchJSON(FEDERAL_ELECTION_RESULTS_BACKUP.replace(/%YEAR%/g, String(year)))));
    }

    return await Promise.all(promises);
};


export {
    get_district_borders,
    get_district_borders_from_backup,
    get_federal_election_results,
    get_federal_election_results_from_backup
};
