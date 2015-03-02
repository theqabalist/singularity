/*global
    describe: true,
    it: true,
    expect: true
*/
describe("list", function () {
    "use strict";
    var List = require("../list"),
        // Cons = List.Cons,
        // Nil = List.Nil,
        ListType = List.List;
    describe("List", function () {
        describe("conversion", function () {
            it("should be convertable from to and from an array", function () {
                expect(ListType.toArray(ListType.fromArray([1, 2]))).toEqual([1, 2]);
            });
        });
        describe("manipulation", function () {
            it("should return the head of a non empty list", function () {
                expect(ListType.fromArray([1, 2]).head()).toEqual(1);
            });
            it("should return the tail of a non empty list", function () {
                expect(ListType.toArray(ListType.fromArray([1, 2]).tail())).toEqual([2]);
            });
            it("should return an accurate count", function () {
                expect(ListType.fromArray([1, 2, 3]).count()).toEqual(3);
            });
        });
        describe("Functor", function () {
            it("should implement map", function () {
                function inc(x) { return x + 1; }
                expect(ListType.toArray(ListType.fromArray([1, 2, 3]).map(inc))).toEqual([2, 3, 4]);
            });
        });
        describe("Applicative", function () {
            function add(x) {
                return function (y) {
                    return x + y;
                };
            }
            it("should apply", function () {
                expect(ListType
                    .toArray(ListType.fromArray([add])
                        .ap(ListType.fromArray([1, 2]))
                        .ap(ListType.fromArray([3, 4]))))
                    .toEqual([4, 5, 5, 6]);
            });
        });
        describe("Monad", function () {
            function unproject(x) {
                return ListType.fromArray([x, x]);
            }
            it("should flatMap", function () {
                expect(ListType.toArray(ListType.fromArray([1, 2, 3]).flatMap(unproject)))
                    .toEqual([1, 1, 2, 2, 3, 3]);
            });

            it("should return", function () {
                expect(ListType.toArray(ListType.mreturn(1))).toEqual([1]);
            });

            // it("should be constrained under the monad laws", function() {
            //
            // });
        });
        describe("Foldable", function () {
            function add(x, y) { return x + y; }
            // function sub(x, y) { return x - y; } // To ensure associativity is correct
            it("should fold right", function () {
                expect(ListType.fromArray([1, 2, 3]).foldRight(0, add)).toBe(6);
            });
            it("should fold left", function () {
                expect(ListType.fromArray([1, 2, 3]).foldLeft(0, add)).toBe(6);
            });
        });
        describe("Monoid", function () {
            it("should produce empty list for zero", function () {
                expect(ListType.mzero().isNil).toEqual(true);
            });
            it("should append", function () {
                expect(ListType.toArray(ListType.mplus(ListType.fromArray([1, 2]), ListType.fromArray([3, 4]))))
                    .toEqual([1, 2, 3, 4]);
            });
            it("should append with empty", function () {
                expect(ListType.toArray(ListType.mplus(ListType.fromArray([1, 2]), ListType.mzero()))).toEqual([1, 2]);
                expect(ListType.toArray(ListType.mplus(ListType.mzero(), ListType.fromArray([1, 2])))).toEqual([1, 2]);
            });
        });
    });
});
