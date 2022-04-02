/* global
    unitjs,
    describe,
    it
*/

const test = unitjs;

describe("Learning by the example", () => {
    it("example variable", () => {

        // just for example of tested value
        let example = "hello world";

        test
            .string(example)
            .startsWith("hello")
            .match(/[a-z]/)

            .given(example = "you are welcome")
            .string(example)
            .endsWith("welcome")
            .contains("you")

            .when("\"example\" becomes an object", () => {
                example = {
                    message: "hello world",
                    name: "Nico",
                    job: "developper",
                    from: "France"
                };
            })

            .then("test the \"example\" object", () => {
                test
                    .object(example)
                    .hasValue("developper")
                    .hasProperty("name")
                    .hasProperty("from", "France")
                    .contains({message: "hello world"})
                ;
            })

            .if(example = "bad value")
            .error(() => example.badMethod());

    });

    it("other test case", () => {
        // other tests ...
    });

});
