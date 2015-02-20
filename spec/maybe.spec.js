/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Maybe", function () {
    "use strict";
    var Maybe = require("../maybe").Maybe,
        Just = require("../maybe").Just,
        None = require("../maybe").None,
        _ = require("../interfaces");
    describe(".from", function () {
        it("should take a javascript value and produce a correct Maybe", function () {
            expect(Maybe.from(undefined).isNone).toBe(true);
        });

        it("should allow arbitrary subtype construction", function () {
            expect(None.from(5).isNone).toBe(true);
            expect(Just.from(undefined).isJust).toBe(true);
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var val1 = Maybe.from(1),
                val2 = Maybe.from(undefined),
                incr = _.fmap(function (x) { return x + 1; });

            expect(incr(val1).isJust).toBe(true);
            expect(incr(val2).isNone).toBe(true);
            expect(incr(val1).orDefault(5)).toBe(2);
            expect(incr(val2).orDefault(5)).toBe(5);
        });
    });

    describe("ap", function () {
        it("should serially apply monadic values", function () {
            var m = Maybe.lift(function (a, b) { return a + b; });

            expect(m.ap(Just.from(5)).ap(Just.from(10)).orDefault(0)).toEqual(15);
        });
    });
});