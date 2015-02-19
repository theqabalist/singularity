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
    });
});
