/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Either", function () {
    "use strict";
    var Either = require("../lib/either").Either,
        Left = require("../lib/either").Left,
        Right = require("../lib/either").Right,
        _ = require("../lib/interfaces");

    describe(".from", function () {
        it("should allow arbitrary subtype construction", function () {
            var l = Left.from(undefined),
                l2 = Left.from(5),
                r = Right.from(undefined),
                r2 = Right.from(5);

            expect(l.isLeft).toBe(true);
            expect(l2.isLeft).toBe(true);
            expect(r.isRight).toBe(true);
            expect(r2.isRight).toBe(true);
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var l = Left.from(5),
                r = Right.from(5),
                f = _.fmap(function (x) { return x + 5; });

            expect(f(l).isLeft).toBe(true);
            expect(f(r).isRight).toBe(true);
        });
    });

    describe("#ap", function () {
        it("should serially apply monadic values", function () {
            var f = Either.lift(function (a, b) { return a + b; });
            expect(f.ap(Right.from(5)).ap(Right.from(10)).isRight).toBe(true);
            expect(f.ap(Left.from(5)).ap(Right.from(10)).isLeft).toBe(true);
            expect(f.ap(Right.from(5)).ap(Left.from(10)).isLeft).toBe(true);
        });
    });

    describe("#flatMap", function () {
        it("should apply the contained value to a function", function () {
            var m = Right.from(5),
                bound = m.flatMap(function (x) { return Right.from(x + 5); }),
                bound2 = m.flatMap(function () { return Left.from("error message"); });
            expect(bound.isRight).toBe(true);
            expect(bound2.isLeft).toBe(true);
            function typeChecked() {
                return m.flatMap(function (x) { return x; });
            }
            expect(typeChecked).toThrow();
        });
    });
});