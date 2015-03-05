/*global
    describe: true,
    it: true,
    expect: true,
    beforeEach: true
*/
/*jslint unparam: true*/
var util = require("util");
describe("algebraic", function () {
    "use strict";
    var data = require("../lib/algebraic").data;
    describe("data type creator", function () {
        var type;

        beforeEach(function () {
            type = data("Maybe", {
                Just: 1,
                None: 0
            })
                .static("from", function (v, t) {
                    return v === undefined || v === null ? t.None.from() : t.Just.from(v);
                });
        });

        it("should take a type name and disjoint subtype specs", function () {
            expect(type.Just.from(5).isJust).toBe(true);
            expect(type.Just.from(5).isMaybe).toBe(true);
            expect(type.None.from(5).isNone).toBe(true);
            expect(type.None.from(5).isMaybe).toBe(true);
        });

        it("should allow method extension on top of type system", function () {
            var t = type
                .implements("map", {
                    Just: function (val, f, t) { return t.Just.from(f(val)); },
                    None: function (f, t) { return t.None.from(); }
                }),
                m = t.Just.from(5).map(function (x) { return x + 5; });
            expect(m.isJust).toBe(true);
            expect(m.val(function (x) { return x; })).toBe(10);
        });

        it("should throw an exception if an implementation doesn't exist", function () {
            var t = type
                .implements("map", {
                    None: function (f, t) { return t.None.from(); }
                });
            expect(function () {
                t.Just.from(5).map(function (x) { return x; });
            }).toThrow();
        });

        it("should provide a general destructure mechanism on the base type", function () {
            var f = type.Maybe.destructure()
                .Just(function (x) { return x; })
                .None(function () { return undefined; });

            expect(f(type.Just.from(5))).toBe(5);
            expect(f(type.None.from())).toBeUndefined();
        });

        it("should allow 'static' helper methods on the parent type", function () {
            var t = type;
            expect(t.Maybe.from(5).isJust).toBe(true);
            expect(t.Maybe.from(undefined).isNone).toBe(true);
        });

        it("should be able to call static methods from implements context", function () {
            var t = type
                .implements("bogus", {
                    Just: function (x, t2) { return t2.Maybe.from(x); },
                    None: function (t2) { return t2.Maybe.from(null); }
                });
            expect(t.Maybe.from(5).bogus().isJust).toBe(true);
            expect(t.Maybe.from(null).bogus().isNone).toBe(true);
        });

        it("should allow access to base type through instances", function () {
            var t = type,
                m1 = t.Just.from(5),
                m2 = t.None.from();
            expect(m1.type.from(undefined).isNone).toBe(true);
            expect(m2.type.from(5).isJust).toBe(true);
        });

        describe("abstract", function () {
            var t;
            beforeEach(function () {
                t = type
                    .abstract()
                    .implements("map", {
                        Just: function (x, f, t2) { return t2.Just.from(f(x)); },
                        None: function (f, t2) { return t2.None.from(); }
                    });
            });

            it("should allow for abstract types", function () {
                expect(t.Maybe.from(5).map(function (x) { return x * 2; }).isMaybe).toBe(true);
                expect(t.Maybe.destructure).toBeUndefined();
                expect(t.Just).toBeUndefined();
            });

            it("should allow for destructuring during implements", function () {
                t = t.implements("mappend", {
                    Just: function (x, m, t) {
                        return t.Maybe.destructure()
                            .Just(function (internal) { return t.Just.from(x + internal); })
                            .None(function () { return t.Just.from(x); })(m);
                    },
                    None: function (v, t) {
                        return t.None.from();
                    }
                });
                expect(t.Maybe.from(5).mappend(t.Maybe.from(10)).isMaybe).toBe(true);
                expect(t.Maybe.destructure).toBeUndefined();
            });
        });
    });
});