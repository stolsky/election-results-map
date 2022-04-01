
import {hasProperty} from "../../lib/jst/native/typecheck.js";


/**
 * @param {Array} data_table
 * @param {Object} options
 * @returns {Object}
 */
const extract_turnout = function (data_table, options) {

    if (!(data_table instanceof Array)) {
        return null;
    }

    // check if all important options properties exist
    if (
        !hasProperty(options, "group_column_id")
        || !hasProperty(options, "eligible_voters_key")
        || !hasProperty(options, "voters_key")
    ) {
        return null;
    }

    const turnout = data_table
        .filter(col => col[options.group_column_id] === options.eligible_voters_key
            || col[options.group_column_id] === options.voters_key)
        .map(row => parseInt(row[options.votes_column_id], 10))
        // sort from smallest to biggest
        // the compareFunction must return 1 for greater, -1 for smaller or 0 for equal
        .sort((a, b) => a > b ? 1 : -1);

    // only 2 values remain: eligible voters (always the bigger number) and actual number of voters
    if (turnout.length !== 2) {
        return null;
    }

    return {voted: turnout[0], eligible: turnout[1]};
};

/**
 * @param {Array} data_table
 * @param {Object} options
 * @returns {Array}
 */
const extract_votings = function (data_table, options) {

    if (!(data_table instanceof Array)) {
        return null;
    }

    // check if all important options properties exist
    if (
        !hasProperty(options, "group_column_id")
        || !hasProperty(options, "votes_type_column_id")
        || !hasProperty(options, "votes_type_value")
        || !hasProperty(options, "votes_column_id")
        || !hasProperty(options, "parties_names")
    ) {
        return null;
    }

    return data_table
        .filter(col => options.parties_names.includes(col[options.group_column_id])
            && col[options.votes_type_column_id] === options.votes_type_value)
        .map(row => ({id: row[options.group_column_id], value: row[options.votes_column_id]}));
};


export {
    extract_turnout,
    extract_votings
};
