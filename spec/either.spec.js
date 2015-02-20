/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Either", function () {
    "use strict";
    var Either = require("../either").Either,
        Left = require("../either").Left,
        Right = require("../either").Right,
        _ = require("../interfaces");

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
});