/*global
    describe: true,
    it: true,
    expect: true
*/
describe("IO Type", function () {
    "use strict";
    var IO = require("../lib/io").IO,
        rand = function () { return IO.mreturn(Math.random()); };

    /*jslint unparam: true*/
    function dummySideEffect() { return Math.random(); }
    /*jslint unparam: false*/
    describe(".mreturn", function () {
        it("should provide a constructor for a function that wraps a side effect.", function () {
            var recorder,
                action = IO.mreturn(function () {
                    recorder = dummySideEffect();
                });
            action.$();
            expect(typeof recorder).toEqual("number");
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var recorder,
                action = IO.mreturn(function () {
                    return Math.random();
                }),
                action2 = action
                    .map(function (x) { return Math.floor(x + 5); })
                    .mbind(function (a) {
                        recorder = a;
                        return IO.mreturn(a);
                    });
            expect(recorder).toBeUndefined();
            action2.$();
            expect(recorder).toBe(5);
        });
    });

    describe("#ap", function () {
        it("should serially apply monadic values", function () {
            var recorder,
                action = IO.lift(function (a, b) { recorder = a + b; })
                    .ap(rand())
                    .ap(rand());
            expect(recorder).toBeUndefined();
            action.$();
            expect(typeof recorder).toEqual("number");
        });
    });

    describe("#mbind", function () {
        it("should implement monadic bind", function () {
            var recorder,
                action = rand()
                    .mbind(function (rand1) {
                        return rand()
                            .mbind(function (rand2) {
                                return IO.mreturn(rand1 + rand2);
                            })
                            .mbind(function (rand3) {
                                recorder = rand3;
                                return IO.mreturn();
                            });
                    });
            expect(recorder).toBeUndefined();
            action.$();
            expect(typeof recorder).toEqual("number");
        });
    });
});