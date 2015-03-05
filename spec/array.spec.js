/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Array", function () {
    "use strict";
    var Arr = require("../array").Arr,
        _ = require("../interfaces");
    describe(".from", function () {
        it("should take a javascript value and produce an array", function () {
            expect(Arr.from(1).toJs()).toEqual([1]);
            expect(Arr.from(undefined).toJs()).toEqual([]);
            expect(Arr.from(null).toJs()).toEqual([]);
            expect(Arr.from([1, 2, 3]).toJs()).toEqual([1, 2, 3]);
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var mapper = _.fmap(function (x) { return x * 2; }),
                a = Arr.from([1, 2, 3]);
            expect(mapper(a).toJs()).toEqual([2, 4, 6]);
        });
    });

    describe("#ap", function () {
        it("should serially apply monadic values", function () {
            var fs = Arr.lift(function (a, b) { return a + b; }),
                m = fs.ap(Arr.from([1, 2]))
                      .ap(Arr.from([3, 4]));
            expect(m.toJs()).toEqual([4, 5, 5, 6]);
        });
    });

    describe("#flatMap", function () {
        it("should implement monadic bind", function () {
            var m = Arr.from([1, 2, 3])
                .flatMap(function (x) { return [x + 1, x - 1]; });
            expect(m.toJs()).toEqual([2, 0, 3, 1, 4, 2]);
        });
    });

    describe("additive monad", function () {
        describe("mzero", function () {
            it("should provide monoidal zero", function () {
                expect(Arr.mzero().toJs()).toEqual([]);
            });
        });

        describe("mappend", function () {
            it("should provide monoidal append", function () {
                var a1 = Arr.from([1, 2]),
                    a2 = Arr.from([3, 4]);
                expect(a1.mappend(a2).toJs()).toEqual([1, 2, 3, 4]);
            });
        });

        describe("mplus", function () {
            it("should provide a binary additive function", function () {
                var a1 = Arr.from([1, 2]),
                    a2 = Arr.from([3, 4]);
                expect(Arr.mplus(a1, a2).toJs()).toEqual([1, 2, 3, 4]);
            });
        });
    });
});