
import {hasProperty} from "../../lib/jst/native/typecheck.js";

// only tested with 1 array inside a path
const traverse_property_path = function (dataset, property_path) {

    let selection = dataset;

    while (property_path.length > 0) {

        const property_name = property_path.shift();
        selection = selection[property_name];

        if (selection instanceof Array && property_path.length > 0) {
            const new_selection = [];
            selection.forEach(element => new_selection.push(
                // [...property_path] clones the array, in javascript everything is a reference
                // but we need the content of the array multiple times for the recursive call
                traverse_property_path(element, [...property_path])
            ));
            selection = new_selection;
            break;
        }
    }

    return selection;

};

const replace_keys = function (data, ...keys) {

    keys.forEach(key => {

        key = key.split(":");
        const property_path = key[0].split(".");
        const new_key = key[1];
        const old_key = property_path.pop();

        const selection = traverse_property_path(data, property_path);
        selection.forEach(element => {
            element[new_key] = element[old_key];
            delete element[old_key];
        });

    });

};

// TODO
/** PROPRIETARY METHOD!
 * Change the structure of given data.
 *
 * @param {Object} source_object
 * @param {Object} options
 * @returns {boolean} success of changing process
 */
const restructure = function (source_object, options) {

    if (
        !hasProperty(options, "new_name")
        || !hasProperty(options, "query")
    ) {
        return false;
    }

    let success = false;

    source_object.forEach(district => {

        const results = [];

        Object.keys(district)
            .filter(key_votings => key_votings.includes(options.query))
            .forEach(voting => {

                results.push({id: voting.replace(options.query, ""), value: district[voting]});
                delete district[voting];

            });

        if (results.length > 0) {
            district[options.new_name] = results;
            success = true;
        }
    });

    return success;

};

const unify_name = name => name
    .toLowerCase()
    .replace(/ä/, "ae")
    .replace(/ö/, "oe")
    .replace(/ü/, "ue")
    .replace(/_/, " ");


// TODO it very depends on the parties structure and election structure
const sort_election_results = function (source_data, ...data_to_sort) {

    data_to_sort.forEach(dataset => {
        dataset.forEach(location => {
            const new_order = [];
            for (let i = 0; i < location.results.length; i = i + 1) {

                const current = location.results[i];
                const current_name = unify_name(current.id);
                const index = source_data.findIndex(party => unify_name(party.name) === current_name);

                if (index !== -1) {
                    current.id = source_data[index].id;
                    new_order[index] = current;
                }
            }
            location.results = new_order;
        });
    });

};


export {
    replace_keys,
    restructure,
    sort_election_results
};
