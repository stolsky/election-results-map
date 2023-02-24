/* global describe, it, unitjs */

import {calculate_distance, convert_to_percent} from "../src/data/evaluation.js";

const test = unitjs;

// test implementation
const euclidean_distance = function (point1, point2) {
    let distance = 0;
    for (let i = 0; i < point1.length; i = i + 1) {
        distance = distance + Math.pow(point1[i] - point2[i], 2);
    }
    return Math.sqrt(distance);
};

describe("calculate_distance() always returns a number", () => {

    it("correct parameters", () => {

        const point1 = [3, 5, 7];
        const point2 = [2, 4, 6];
        const result = calculate_distance(point1, point2);

        test
            .value(result)
            .isType("number");

    });

    it("first parameters is correct and second is wrong", () => {

        const point1 = [3, 5, 7];
        const point2 = "2";
        const result = calculate_distance(point1, point2);

        test
            .value(result)
            .isType("number");

    });

    it("first parameter is wrong and second is correct", () => {

        const point1 = "3";
        const point2 = [2, 4, 6];
        const result = calculate_distance(point1, point2);

        test
            .value(result)
            .isType("number");

    });

    it("both parameters are wrong", () => {

        const point1 = "3";
        const point2 = "2";
        const result = calculate_distance(point1, point2);

        test
            .value(result)
            .isType("number");

    });

});

describe("calculate_distance() and typical results of the Euclidean distance", () => {

    it("the distance between two zero points must be 0", () => {

        const point1 = [0, 0, 0];
        const point2 = [0, 0, 0];
        const result = calculate_distance(point1, point2);

        test
            .number(result)
            .is(0);

    });

    it("the distance between two equal points must be 0", () => {

        const point1 = [1, 3, 5];
        const point2 = [1, 3, 5];
        const result = calculate_distance(point1, point2);

        test
            .number(result)
            .is(0);

    });

    it("the distance between two different points must be not equal 0", () => {

        const point1 = [1, 3, 5];
        const point2 = [2, 4, 6];
        const result = calculate_distance(point1, point2);

        test
            .number(result)
            .isNot(0);

    });

    it("the distance between the zero point and another point  must be not equal 0", () => {

        const point1 = [1, 3, 5];
        const point2 = [0, 0, 0];
        const result = calculate_distance(point1, point2);

        test
            .number(result)
            .isNot(0);

    });

});

describe("test calculate_distance() against a test implementation of the Euclidean distance", () => {

    const point1 = [1, 3, 5];
    const point2 = [2, 4, 6];

    it("calculate_distance() and the test implementation calculate the same results", () => {

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        test
            .number(result1).isIdenticalTo(result2);

    });

    it("the order of the points as parameters is irrelevant for the result", () => {

        let result1 = calculate_distance(point2, point1);
        let result2 = euclidean_distance(point1, point2);

        test
            .number(result1).isIdenticalTo(result2)

            .given(result1 = calculate_distance(point1, point2))
            .given(result2 = calculate_distance(point2, point1))
            .number(result1).isIdenticalTo(result2);

    });

    it("check calculate_distance() and test implementation with zero points.", () => {

        const point1 = [0, 0, 0];
        const point2 = [0, 0, 0];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        test
            .number(result1)
            .isIdenticalTo(result2)
            .isIdenticalTo(0);

    });

});

describe("calculate_distance() works with points of different length", () => {

    it("length of 0 must be 0", () => {

        const point1 = [];
        const point2 = [];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        test
            .number(result1)
            .isIdenticalTo(0)
            .isIdenticalTo(result2);

    });

    it("length of 1 (check with test implementation)", () => {

        const point1 = [1];
        const point2 = [4];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        test
            .number(result1)
            .isIdenticalTo(result2);

    });

    it("length of 2 (check with test implementation)", () => {

        const point1 = [1, 3];
        const point2 = [4, 6];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        test
            .number(result1)
            .isIdenticalTo(result2);

    });

    it("length of 3 (check with test implementation)", () => {

        const point1 = [1, 3, 5];
        const point2 = [4, 6, 8];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        test
            .number(result1)
            .isIdenticalTo(result2);

    });

    it("length of 6 (check with test implementation)", () => {

        const point1 = [1, 3, 5, 7, 9, 11];
        const point2 = [4, 6, 8, 10, 12, 14];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        test
            .number(result1)
            .isIdenticalTo(result2);

    });

});

describe("calculate_distance() creates a zero point for all parameters of the wrong data type", () => {

    it("test point with length of 0 and empty object must be 0", () => {

        const point1 = [];
        const point2 = {};

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        test
            .number(result1)
            .isIdenticalTo(0)
            .isIdenticalTo(result2);

    });

    it("test point1 with length of 6 and string must be equal to point1 and the zero point", () => {

        const point1 = [1, 3, 5, 7, 9, 11];
        const point2 = "test";
        const point3 = [0, 0, 0, 0, 0, 0];

        const result1 = calculate_distance(point1, point2);
        const result2 = calculate_distance(point1, point3);
        const result3 = euclidean_distance(point1, point3);

        test
            .number(result1)
            .isIdenticalTo(result2)
            .isIdenticalTo(result3);

    });

    it("test point1 with length of 6 and point2 with length of 3. So point2 must be extended with zeros", () => {

        const point1 = [1, 3, 5, 7, 9, 11];
        const point2 = [6, 8, 10];
        const point3 = [6, 8, 10, 0, 0, 0];

        const result1 = calculate_distance(point1, point2);
        const result2 = calculate_distance(point1, point3);
        const result3 = euclidean_distance(point1, point3);

        test
            .number(result1)
            .isIdenticalTo(result2)
            .isIdenticalTo(result3);

    });

});
