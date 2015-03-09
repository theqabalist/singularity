/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Array", function () {
    "use strict";
    var Arr = require("../lib/array").Arr;
    describe(".mreturn", function () {
        it("should take a javascript value and produce an array", function () {
            expect(Arr.mreturn(1).toJs()).toEqual([1]);
            expect(Arr.mreturn(undefined).toJs()).toEqual([]);
            expect(Arr.mreturn(null).toJs()).toEqual([]);
            expect(Arr.mreturn([1, 2, 3]).toJs()).toEqual([1, 2, 3]);
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var a = Arr.mreturn([1, 2, 3]).map(function (x) { return x * 2; });
            expect(a.toJs()).toEqual([2, 4, 6]);
        });
    });

    describe("#ap", function () {
        it("should serially apply monadic values", function () {
            var fs = Arr.lift(function (a, b) { return a + b; }),
                m = fs.ap(Arr.mreturn([1, 2]))
                      .ap(Arr.mreturn([3, 4]));
            expect(m.toJs()).toEqual([4, 5, 5, 6]);
        });
    });

    describe("#mbind", function () {
        it("should implement monadic bind", function () {
            var m = Arr.mreturn([1, 2, 3])
                .mbind(function (x) { return Arr.mreturn([x + 1, x - 1]); });
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
                var a1 = Arr.mreturn([1, 2]),
                    a2 = Arr.mreturn([3, 4]);
                expect(a1.mappend(a2).toJs()).toEqual([1, 2, 3, 4]);
            });
        });

        describe("mplus", function () {
            it("should provide a binary additive function", function () {
                var a1 = Arr.mreturn([1, 2]),
                    a2 = Arr.mreturn([3, 4]);
                expect(Arr.mplus(a1, a2).toJs()).toEqual([1, 2, 3, 4]);
            });
        });
    });
});