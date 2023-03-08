import { expect } from "chai";
import { describe, it } from "mocha";
import { calculate_distance, convert_to_percent } from "../src/data/evaluation.js";

// test implementation
const euclidean_distance = (point1, point2) => {
    let distance = 0;
    for (let i = 0; i < point1.length; i = i + 1) {
        distance = distance + (point1[`${i}`] - point2[`${i}`]) ** 2;
    }
    return Math.sqrt(distance);
};

describe("calculate_distance() always returns a number", () => {

    it("correct parameters", () => {

        const point1 = [3, 5, 7];
        const point2 = [2, 4, 6];
        const result = calculate_distance(point1, point2);

        expect(result).to.be.a("number");
    });

    it("first parameters is correct and second is wrong", () => {

        const point1 = [3, 5, 7];
        const point2 = "2";
        const result = calculate_distance(point1, point2);

        expect(result).to.be.a("number");
    });

    it("first parameter is wrong and second is correct", () => {

        const point1 = "3";
        const point2 = [2, 4, 6];
        const result = calculate_distance(point1, point2);

        expect(result).to.be.a("number");
    });

    it("both parameters are wrong", () => {

        const point1 = "3";
        const point2 = "2";
        const result = calculate_distance(point1, point2);

        expect(result).to.be.a("number");
    });

});

describe("calculate_distance() and typical results of the Euclidean distance", () => {

    it("the distance between two zero points must be 0", () => {

        const point1 = [0, 0, 0];
        const point2 = [0, 0, 0];
        const result = calculate_distance(point1, point2);

        expect(result).to.be.a("number");
        expect(result).to.equal(0);
    });

    it("the distance between two equal points must be 0", () => {

        const point1 = [1, 3, 5];
        const point2 = [1, 3, 5];
        const result = calculate_distance(point1, point2);

        expect(result).to.be.a("number");
        expect(result).to.equal(0);
    });

    it("the distance between two different points must be not equal 0", () => {

        const point1 = [1, 3, 5];
        const point2 = [2, 4, 6];
        const result = calculate_distance(point1, point2);

        expect(result).to.be.a("number");
        expect(result).to.not.equal(0);
    });

    it("the distance between the zero point and another point  must be not equal 0", () => {

        const point1 = [1, 3, 5];
        const point2 = [0, 0, 0];
        const result = calculate_distance(point1, point2);

        expect(result).to.be.a("number");
        expect(result).to.not.equal(0);
    });

});

describe("test calculate_distance() against a test implementation of the Euclidean distance", () => {

    let point1 = [1, 3, 5];
    let point2 = [2, 4, 6];

    it("calculate_distance() and the test implementation calculate the same results", () => {

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result1).to.equal(result2);
    });

    it("the order of the points as parameters is irrelevant for the result", () => {

        const dist = calculate_distance(point1, point2);
        const dist_reverse = calculate_distance(point2, point1);
        const euclid_dist = euclidean_distance(point1, point2);
        const euclid_dist_reverse = euclidean_distance(point2, point1);

        expect(dist).to.be.a("number");
        expect(dist_reverse).to.be.a("number");
        expect(euclid_dist).to.be.a("number");
        expect(euclid_dist_reverse).to.be.a("number");

        expect(dist).to.equal(dist_reverse);
        expect(euclid_dist).to.equal(euclid_dist_reverse);

        expect(dist).to.equal(euclid_dist);
    });

    it("check calculate_distance() and test implementation with zero points.", () => {

        point1 = [0, 0, 0];
        point2 = [0, 0, 0];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result1).to.equal(result2);
        expect(result1).to.equal(0);
    });

});

describe("calculate_distance() works with points of different length", () => {

    it("length of 0 must be 0", () => {

        const point1 = [];
        const point2 = [];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result1).to.equal(result2);
        expect(result1).to.equal(0);
    });

    it("length of 1 (check with test implementation)", () => {

        const point1 = [1];
        const point2 = [4];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result1).to.equal(result2);
    });

    it("length of 2 (check with test implementation)", () => {

        const point1 = [1, 3];
        const point2 = [4, 6];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result1).to.equal(result2);
    });

    it("length of 3 (check with test implementation)", () => {

        const point1 = [1, 3, 5];
        const point2 = [4, 6, 8];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result1).to.equal(result2);
    });

    it("length of 6 (check with test implementation)", () => {

        const point1 = [1, 3, 5, 7, 9, 11];
        const point2 = [4, 6, 8, 10, 12, 14];

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result1).to.equal(result2);
    });

});

describe("calculate_distance() creates a zero point for all parameters of the wrong data type", () => {

    it("test point with length of 0 and empty object must be 0", () => {

        const point1 = [];
        const point2 = {};

        const result1 = calculate_distance(point1, point2);
        const result2 = euclidean_distance(point1, point2);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result1).to.equal(result2);
        expect(result1).to.equal(0);
    });

    it("test point1 with length of 6 and string must be equal to point1 and the zero point", () => {

        const point1 = [1, 3, 5, 7, 9, 11];
        const point2 = "test";
        const point3 = [0, 0, 0, 0, 0, 0];

        const result1 = calculate_distance(point1, point2);
        const result2 = calculate_distance(point1, point3);
        const result3 = euclidean_distance(point1, point3);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result3).to.be.a("number");
        expect(result1).to.equal(result2);
        expect(result1).to.equal(result3);
        expect(result2).to.equal(result3);
    });

    it("test point1 with length of 6 and point2 with length of 3. So point2 must be extended with zeros", () => {

        const point1 = [1, 3, 5, 7, 9, 11];
        const point2 = [6, 8, 10];
        const point3 = [6, 8, 10, 0, 0, 0];

        const result1 = calculate_distance(point1, point2);
        const result2 = calculate_distance(point1, point3);
        const result3 = euclidean_distance(point1, point3);

        expect(result1).to.be.a("number");
        expect(result2).to.be.a("number");
        expect(result3).to.be.a("number");
        expect(result1).to.equal(result2);
        expect(result1).to.equal(result3);
        expect(result2).to.equal(result3);
    });

});

describe("correct percentage conversion", () => {

    convert_to_percent();

});
