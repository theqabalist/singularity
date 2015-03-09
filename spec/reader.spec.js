/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Reader Type", function () {
    "use strict";
    var Reader = require("../lib/reader").Reader;

    function prop(p) { return function (o) { return o[p]; }; }

    describe(".mreturn", function () {
        it("should take a value and return a trivial reader", function () {
            var r = Reader.mreturn(5);
            expect(r.run(null)).toBe(5);
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var r = Reader.mreturn(5);
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

    describe("#mbind", function () {
        it("should implement monadic bind", function () {
            var r = Reader.mreturn(5)
                .mbind(function (t) {
                    return Reader.mreturn(t * 5);
                });
            expect(r.run(null)).toBe(25);
            function typeChecked() {
                return r.mbind(function (x) { return x; }).run(null);
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
                r = Reader.mreturn(5).mbind(function (v) {
                    return Reader.asks(prop("envSize")).mbind(function (size) {
                        return Reader.local(function () { return {a: 1, b: 2}; }).mbind(function (l) {
                            return Reader.mreturn(Reader.ask().mbind(function (env) {
                                return Reader.mreturn(size + v + env.a);
                            }).run(l));
                        }).mbind(function (v2) {
                            return Reader.asks(prop("envSize")).mbind(function (size2) {
                                return Reader.mreturn(v2 + size2);
                            });
                        });
                    });
                });
            expect(r.run(env)).toBe(10);
        });
    });

    describe("#asks", function () {
        it("should allow for a nicer interface for chaining asks", function () {
            var env = {
                    envSize: 2,
                    random: "other"
                },
                r = Reader.mreturn(5)
                    .asks(prop("envSize"), function (size, v) {
                        return Reader.mreturn(size + v);
                    })
                    .local(function () { return {a: 1, b: 2}; }, function (env, v) {
                        return Reader.mreturn(env.a + v);
                    })
                    .asks(prop("envSize"), function (size, v2) {
                        return Reader.mreturn(size + v2);
                    });

            expect(r.run(env)).toBe(10);
        });
    });

    describe("#ask", function () {
        it("should allow for a nicer version of ask", function () {
            var env = {
                    envSize: 2,
                    random: "other"
                },
                r = Reader.mreturn(5)
                    .ask(function (env, v) {
                        return Reader.mreturn(Object.keys(env).length + 3 === v);
                    });
            expect(r.run(env)).toBe(true);
        });
    });

    describe("#local", function () {
        it("should provide a way to modify the environment", function () {
            var env = "hello",
                r = Reader
                    .mreturn(11)
                    .local(function (x) { return x + " world"; }, function (env, v) {
                        return Reader.mreturn(env.length === v);
                    });
            expect(r.run(env)).toBe(true);
        });
    });
});