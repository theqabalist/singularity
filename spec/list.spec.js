describe("list", function() {
    "use strict";
    var List = require("../list");
    var Cons = List.Cons;
    var Nil = List.Nil;
    var ListType = List.List;
    describe("List", function () {
        describe("conversion", function() {
            it("should be convertable from to and from an array", function () {
                expect(ListType.toArray(ListType.fromArray([1, 2]))).toEqual([1, 2]);
            });
        });
        describe("Functor", function() {
            it("should implement map", function () {
                function inc(x) { return x + 1; }
                expect(ListType.toArray(ListType.fromArray([1, 2, 3]).map(inc))).toEqual([2, 3, 4]);
            });
        });
        describe("Applicative", function() {
            it("should apply", function () {

            });
        });
        describe("Foldable", function() {
            function add(x, y) { return x + y; }
            function sub(x, y) { return x - y; } // To ensure associativity is correct
            it("should fold right", function() {
                expect(ListType.fromArray([1, 2, 3]).foldRight(0, add)).toBe(6);
            });
            it("should fold left", function() {
                expect(ListType.fromArray([1, 2, 3]).foldLeft(0, add)).toBe(6);
            });
        });
        describe("Monoid", function() {
            it("should append", function() {

            })
        })
    });
});