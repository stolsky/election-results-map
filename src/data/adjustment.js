
import {hasProperty} from "../../lib/jst/native/typecheck.js";


const replace_keys = function (data, ...keys) {

    keys.forEach(key => {
        key = key.split(":");
        const path = key[0].split(".");
        const new_key = key[1];
        const old_key = path.pop();

        let selection = data;
        path.forEach(property_name => {
            selection = selection[property_name];
        });
        selection.forEach(element => {
            element[new_key] = element[old_key];
            delete element[old_key];
        });

    });

};

/** @todo proprietaty method */
const restructure = function (dataset, options) {

    dataset.forEach(district => {

        const results = [];

        Object.keys(district)
            .filter(key_votings => key_votings.includes("zweitstimme"))
            .forEach(voting => {

                let index = -1;

                // TODO get `index` (id) and `name` from parties.json
                if (voting.includes("cdu")) {
                    index = 0;
                } else if (voting.includes("spd")) {
                    index = 1;
                } else if (voting.includes("linke")) {
                    index = 2;
                } else if (voting.includes("fdp")) {
                    index = 3;
                } else if (voting.includes("gruene")) {
                    index = 4;
                } else if (voting.includes("afd")) {
                    index = 5;
                }

                if (index !== -1) {
                    results[index] = {id: index, value: district[voting]};
                    delete district[voting];
                }
            });

        if (results.length > 0) {
            district.results = results;
        }
    });

};

export {
    replace_keys,
    restructure
};
