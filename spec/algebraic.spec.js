/*global
    describe: true,
    it: true,
    expect: true,
    beforeEach: true
*/
describe("algebraic", function () {
    "use strict";
    var data = require("../algebraic").data;
    describe("data type creator", function () {
        var type;

        beforeEach(function () {
            type = data("Maybe", {
                Just: 1,
                None: 0
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
            var t = type
                .static("from", function (v, t) {
                    return v === undefined || v === null ? t.None.from() : t.Just.from(v);
                });
            expect(t.Maybe.from(5).isJust).toBe(true);
            expect(t.Maybe.from(undefined).isNone).toBe(true);
        });
    });
});