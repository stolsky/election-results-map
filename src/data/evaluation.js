
const evaluate = function (data, options) {

    // TODO analysis here

    return data;
};

/** Calculates the distance of two vectors.
 * If the second vector (parameter vector2) is omitted, the distance to the zero vector will be calculated.
 *
 * @param {Array<number>} point1
 * @param {Array<number>} point2
 * @returns {number}
 */
const calculate_distance = function (vector_x, vector_y = null) {

    if (vector_x instanceof Array && vector_x.length > 0) {

        if (!(vector_y instanceof Array)) {
            vector_y = [];
        }

        // autofill the smaller vector with zeroes
        if (vector_y.length !== vector_x.length) {

            let smaller = null;
            let bigger = null;

            if (vector_x.length < vector_y.length) {
                smaller = vector_x;
                bigger = vector_y;
            } else {
                smaller = vector_y;
                bigger = vector_x;
            }

            for (let i = smaller.length; i < bigger.length; i = i + 1) {
                smaller[i] = 0;
            }

        }

        let distance = 0;
        for (let i = 0; i < vector_x.length; i = i + 1) {
            distance = distance + Math.pow(vector_x[i] - vector_y[i], 2);
        }
        return Math.sqrt(distance);
    }

    return null;
};


export {
    calculate_distance,
    evaluate
};
