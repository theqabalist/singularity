/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Continuation Monad", function () {
    var type = require("../lib/continuation"),
        Cont = type.Cont,
        cont = type.cont;
    describe(".from", function () {
        it("should provide a monadic return function", function () {
            var c = Cont.from(5);
            expect(c.run(function (x) { return x * 10; })).toBe(50);
        });
    });
    describe("#mbind", function () {
        it("should implement monadic bind", function () {
            var c = Cont.from(5).
                mbind(function (t) {
                    return Cont.from(t + 5);
                });
            expect(c.run(function (x) { return x * 10; })).toBe(100);
        });
    });
    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var c = Cont.from(5).map(function (x) { return x * 5; });
            expect(c.run(function (x) { return x * 5; })).toBe(125);
        });
    });
    describe("#ap", function () {
        it("should serially apply monadic values", function () {
            var c = Cont.lift(function (a, b) { return a + b; }),
                m1 = Cont.from(5),
                m2 = Cont.from(5).map(function (x) { return -x; });
            expect(m1.run(function (x) { return x; })).toBe(5);
            expect(m2.run(function (x) { return x; })).toBe(-5);
            expect(c.ap(m1).ap(m2).run(function (x) { return !x; })).toBe(true);
        });
    });
});