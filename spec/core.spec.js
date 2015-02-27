/*global
    describe: true,
    it: true,
    expect: true
*/
describe("core", function () {
    "use strict";
    function add(x, y) { return x + y; }
    var core = require("../core");
    describe("partial", function () {
        it("should take a function and some arguments and return a partially applied function", function () {
            var add5 = core.partial(add, 5);
            expect(add5(10)).toBe(15);
        });

        it("should allow for multiple arguments", function () {
            function addSub(x, y, z) { return x + y - z; }
            var addSub5 = core.partial(addSub, 2, 3);
            expect(addSub5(10)).toBe(-5);
        });
    });

    describe("curry", function () {
        it("should take a function and return a curried function", function () {
            var curried = core.curry(add),
                add5 = curried(5);

            expect(add5(10)).toBe(15);
        });

        it("should throw an error if unable to implicitly curry", function () {
            function scenario() {
                core.curry(function () { console.log("hello"); });
            }
            expect(scenario).toThrow();
        });

        it("should provide a way to coerce or limit variadic functions with currying", function () {
            function variadic() {
                var args = core.toList(arguments),
                    a = args[0],
                    b = args[1];
                return a + b;
            }
            var add5 = core.curryN(2)(variadic)(5);
            expect(add5(10)).toBe(15);
        });

        it("should allow immediate evaluation", function () {
            var curried = core.curry(add);
            expect(curried(5, 10)).toBe(15);
        });
    });

    describe("property", function () {
        it("should allow getting a property off an arbitrary object", function () {
            var f = core.property("hello");
            expect(f({hello: "goodbye"})).toEqual("goodbye");
        });
    });

    function isString(x) { return typeof x === 'string'; }
    function isNumber(x) { return typeof x === 'number'; }

    describe("multi", function () {
        it("should provide a multidispatch builder.", function () {
            var fancy = core
                .multi()
                .method(isString, function (x) { return x + x; })
                .method(isNumber, function (x) { return x * x; })
                .otherwise(core.id);
            expect(fancy("h")).toEqual("hh");
            expect(fancy(5)).toBe(25);
            expect(fancy(null)).toBe(null);
        });

        it("should allow curryability under restriction", function () {
            function addStrings(x, y) { return x + y; }
            function multNumbers(x, y) { return x * y; }
            function asPair(x, y) { return [x, y]; }
            var fancy = core
                .multi(2)
                .method(isString, addStrings)
                .method(isNumber, multNumbers)
                .otherwise(asPair),
                fancy1 = fancy("h"),
                fancy2 = fancy(5),
                fancy3 = fancy(undefined);

            expect(fancy1("e")).toEqual("he");
            expect(fancy2(10)).toBe(50);
            expect(fancy3(null)).toEqual([undefined, null]);
        });

        it("should allow immutable reopening", function () {
            function isUndefined(x) { return x === undefined; }
            var fancy = core
                .multi()
                .method(isString, function (x) { return x + x; })
                .method(isNumber, function (x) { return x * x; })
                .otherwise(core.id)
                .method(isUndefined, function () { return "undefined"; });
            expect(fancy("h")).toEqual("hh");
            expect(fancy(5)).toBe(25);
            expect(fancy(undefined)).toEqual("undefined");
            expect(fancy(null)).toBe(null);
        });

        it("should throw exceptions if no otherwise is provided", function () {
            var fancy = core.multi();
            expect(fancy).toThrow();
        });
    });

    describe("toList", function () {
        it("should safely support working with nested lists", function () {
            var d = [[1], [2], [3]];
            expect(core.toList(d)).toEqual(d);
        });
    });

    describe("pick", function () {
        it("should take a list of keys to keep and return a shallow copy with them", function () {
            var obj = {
                item1: "hello",
                item2: "goodbye"
            },
                picker = core.pick(["item1"]);
            expect(picker(obj)).toEqual({item1: "hello"});
        });
    });
});
