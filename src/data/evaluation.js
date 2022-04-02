
/** Calculates the distance of two points using Euclidean distance.
 * If a parameter (point) is not of array type, it will be overwritten with an array full of zeros.
 *
 * @param {Array<number>} point_x
 * @param {Array<number>} point_y
 * @returns {number} the distance as number
 */
const calculate_distance = function (point_x, point_y = null) {

    if (!(point_x instanceof Array)) {
        point_x = [];
    }

    if (!(point_y instanceof Array)) {
        point_y = [];
    }

    // autofill the smaller point with zeroes
    if (point_y.length !== point_x.length) {

        let smaller = null;
        let bigger = null;

        if (point_x.length < point_y.length) {
            smaller = point_x;
            bigger = point_y;
        } else {
            smaller = point_y;
            bigger = point_x;
        }

        for (let i = smaller.length; i < bigger.length; i = i + 1) {
            smaller[i] = 0;
        }

    }

    let distance = 0;
    for (let i = 0; i < point_x.length; i = i + 1) {
        distance = distance + Math.pow(point_x[i] - point_y[i], 2);
    }
    return Math.sqrt(distance);

};

const convert_turnout_to_percent = function (dataset) {
    dataset.turnout = parseFloat((dataset.turnout.voted * 100 / dataset.turnout.eligible).toFixed(1));
};

const convert_votings_to_percent = function (dataset, votes) {
    dataset.results = dataset.results.map(result => {
        result.value = parseFloat((result.value * 100 / votes).toFixed(1));
        return result;
    });
};

const convert_to_percent = function (data_source) {
    if (data_source instanceof Array) {
        data_source.forEach(dataset => {
            const votes = dataset.turnout.voted;
            convert_turnout_to_percent(dataset);
            convert_votings_to_percent(dataset, votes);
        });
    }
};


export {
    calculate_distance,
    convert_to_percent
};
