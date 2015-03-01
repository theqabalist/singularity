/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Reader Type", function () {
    "use strict";
    var Reader = require("../reader").Reader;

    function prop(p) { return function (o) { return o[p]; }; }

    describe(".from", function () {
        it("should take a value and return a trivial reader", function () {
            var r = Reader.from(5);
            expect(r.run(null)).toBe(5);
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var r = Reader.from(5);
            expect(r.map(function (x) { return x * 5; }).run(null)).toBe(25);
        });
    });

    describe("#ap", function () {
        it("should serially apply monadic values", function () {
            var env = {
                    field: "value",
                    other: "random"
                },
                r = Reader.lift(function (a, b) { return a + b; })
                    .ap(Reader.asks(prop("field")).map(function (x) { return x.length; }))
                    .ap(Reader.ask().map(function (x) { return Object.keys(x).length; }));

            expect(r.run(env)).toBe(7);
        });
    });

    describe("#flatMap", function () {
        it("should implement monadic bind", function () {
            var r = Reader.from(5)
                .flatMap(function (t) {
                    return Reader.from(t * 5);
                });
            expect(r.run(null)).toBe(25);
            function typeChecked() {
                return r.flatMap(function (x) { return x; }).run(null);
            }
            expect(typeChecked).toThrow();
        });
    });

    describe(".ask/.asks", function () {
        it("should allow environment querying", function () {
            var env = {
                    envSize: 2,
                    random: "other"
                },
                r = Reader.from(5)
                    .flatMap(function (v) {
                        return Reader.asks(prop("envSize"))
                            .flatMap(function (size) {
                                return Reader.ask()
                                    .flatMap(function (e) {
                                        return Reader.from(size + v === Object.keys(e).length + v);
                                    });
                            });
                    });
            expect(r.run(env)).toBe(true);
        });
    });

    describe("#combine", function () {
        it("should allow for a nicer interface for chaining asks", function () {
            var env = {
                    envSize: 2,
                    random: "other"
                },
                r = Reader.from(5)
                    .combine(prop("envSize"), function (size, v) {
                        return Reader.from(size + v);
                    })
                    .combine(function (env, v) {
                        return Reader.from(Object.keys(env).length + 5 === v);
                    });

            expect(r.run(env)).toBe(true);
        });
    });

    describe("#local", function () {
        it("should provide a way to modify the environment", function () {
            var env = "hello",
                r = Reader
                    .from(11)
                    .combine(function (env, v) {
                        return Reader.from(env.length === v);
                    })
                    .local(function (x) { return x + " world"; });
            expect(r.run(env)).toBe(true);
        });
    });
});