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


const QUERY_TYPE = {
    ONLINE: "ONLINE",
    BACKUP: "BACKUP"
};

const fetch_json = async (url) => {
    const response = await fetch(url, {mode: "same-origin"});
    return response.json();
};

const get_data = async function (year, query_type) {

    return fetch_json("dat/files_index.json")
    .then(results => {
        const promises = [];
        if (results instanceof Object) {
            const query_base = (query_type === QUERY_TYPE.ONLINE) ? "ONLINE" : "BACKUP";

            Object.keys(results).forEach(key => {

                let query_object = results[key];

                let fetch_method = null;
                if (query_object.TYPE === "json" || query_object.TYPE === "geojson") {
                    fetch_method = fetch_json;
                }
                // else if TYPE === "csv"

                let current_query = query_object[query_base];
                if (current_query !== "" && fetch_method instanceof Function) {
                    if (current_query.includes("%YEAR%")) {
                        current_query = current_query.replace(/%YEAR%/, year);
                    }
                    promises.push(fetch_method(current_query));
                }
            });    
        }

        return Promise.all(promises);//.then(..)
    })
    .catch(error => console.error("Error while loading data.", error));
    
};

export {
    get_data,
    QUERY_TYPE
};
