/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Writer Type", function () {
    "use strict";
    var Writer = require("../lib/writer").Writer,
        Arr = require("../lib/array").Arr;
    function getLog(x) { return x.toJs(); }
    describe(".from", function () {
        it("should take a value and return a trivial writer", function () {
            var w = Writer.from(Arr.mzero(), 0),
                log = w.val(getLog);
            expect(log).toEqual([]);
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            /*jslint unparam: true*/
            var w = Writer.from(Arr.mzero(), 0).map(function (x) { return x + 1; }),
                v = w.val(function (x, y) { return y; });
            /*jslint unparam: false*/
            expect(v).toBe(1);
        });
    });

    function add5(v) {
        return Writer.from(Arr.from("added 5"), v + 5);
    }

    function mult5(v) {
        return Writer.from(Arr.from("mult by 5"), v * 5);
    }

    describe("#ap", function () {
        it("should serially apply monadic values", function () {
            var w = Writer.lift(Arr.mzero(), function (a, b) { return a + b; }),
                m1 = Writer.from(Arr.mzero(), 0).mbind(add5),
                m2 = Writer.from(Arr.mzero(), 2).mbind(mult5);
            expect(w.ap(m1).ap(m2).val(getLog)).toEqual(["added 5", "mult by 5"]);
        });
    });

    describe(".typed", function () {
        it("should provide a partial constructor, that takes a monoidal type", function () {
            var aWriter = Writer.typed(Arr),
                w = aWriter.lift(function (a, b) { return a + b; }),
                m1 = aWriter.from(0).mbind(add5),
                m2 = aWriter.from(2).mbind(mult5);
            expect(w.ap(m1).ap(m2).val(getLog)).toEqual(["added 5", "mult by 5"]);
        });
    });

    describe("#output", function () {
        it("should provide a convenience method for the output", function () {
            var log = Writer.typed(Arr).from(0).output();
            expect(log.toJs()).toEqual([]);
        });
    });

    describe("#data", function () {
        it("should provide a convenience method for the data", function () {
            var data = Writer.typed(Arr).from(0).data();
            expect(data).toBe(0);
        });
    });
});