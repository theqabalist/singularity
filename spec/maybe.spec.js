/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Maybe", function () {
    "use strict";
    var Maybe = require("../lib/maybe").Maybe,
        Just = require("../lib/maybe").Just,
        None = require("../lib/maybe").None,
        _ = require("../lib/interfaces");
    describe(".mreturn", function () {
        it("should take a javascript value and produce a correct Maybe", function () {
            expect(Maybe.mreturn(undefined).isNone).toBe(true);
        });

        it("should allow arbitrary subtype construction", function () {
            expect(None.from(5).isNone).toBe(true);
            expect(Just.from(undefined).isJust).toBe(true);
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var val1 = Maybe.mreturn(1),
                val2 = Maybe.mreturn(undefined),
                incr = _.fmap(function (x) { return x + 1; });

            expect(incr(val1).isJust).toBe(true);
            expect(incr(val2).isNone).toBe(true);
            expect(incr(val1).orDefault(5)).toBe(2);
            expect(incr(val2).orDefault(5)).toBe(5);
        });
    });

    describe("#ap", function () {
        it("should serially apply monadic values", function () {
            var m = Maybe.lift(function (a, b) { return a + b; }),
                m2 = Maybe.mreturn(null);

            expect(m.ap(Just.from(5)).ap(Just.from(10)).orDefault(0)).toEqual(15);
            expect(m.ap(Maybe.mreturn(null)).ap(Just.from(5)).orDefault("failed")).toEqual("failed");
            expect(m.ap(Just.from(5)).ap(Maybe.mreturn(undefined)).orDefault("failed")).toEqual("failed");
            expect(m2.ap(Maybe.mreturn(null)).orDefault("failed")).toEqual("failed");
            expect(m2.ap(Just.from(5)).orDefault("failed")).toEqual("failed");
        });
    });

    describe("#mbind", function () {
        it("should apply the contained value to a function", function () {
            var m = Maybe.mreturn(5),
                bound = m.mbind(function (x) { return Maybe.mreturn(x + 5); }),
                bound2 = m.mbind(function () { return Maybe.mreturn(undefined); });
            expect(bound.isJust).toBe(true);
            expect(bound2.isNone).toBe(true);
            function typeChecked() {
                return m.mbind(function (x) { return x; });
            }
            expect(typeChecked).toThrow();
        });
    });

    describe("join", function () {
        it("should flatten the monadic structure, preserving semantics", function () {
            var m = Maybe.mreturn(Maybe.mreturn(undefined)),
                m2 = Maybe.mreturn(Maybe.mreturn(5));
            expect(m.isJust).toBe(true);
            expect(_.join(m).isNone).toBe(true);
            expect(m2.isJust).toBe(true);
            expect(_.join(m2).isJust).toBe(true);
        });
    });

    describe("destructure", function () {
        it("should provide a generic destructuring function", function () {
            var f = _.destructure(Maybe)
                .Just(function (x) {
                    return x + 5;
                })
                .None(function () {
                    return 5;
                }),
                m1 = Maybe.mreturn(5),
                m2 = Maybe.mreturn(undefined);

            expect(f(m1)).toBe(10);
            expect(f(m2)).toBe(5);
        });
    });
});