/*global
    describe: true,
    it: true,
    expect: true
*/
describe("IO Type", function () {
    "use strict";
    var IO = require("../io").IO,
        rand = function () { return IO.from(Math.random()); };

    /*jslint unparam: true*/
    function dummySideEffect() { return Math.random(); }
    /*jslint unparam: false*/
    describe(".from", function () {
        it("should provide a constructor for a function that wraps a side effect.", function () {
            var recorder,
                action = IO.from(function () {
                    recorder = dummySideEffect();
                });
            action.$();
            expect(typeof recorder).toEqual("number");
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var recorder,
                action = IO.from(function () {
                    return Math.random();
                }),
                action2 = action
                    .map(function (x) { return Math.floor(x + 5); })
                    .flatMap(function (a) {
                        recorder = a;
                        return IO.from(a);
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

    describe("#flatMap", function () {
        it("should implement monadic bind", function () {
            var recorder,
                action = rand()
                    .flatMap(function (rand1) {
                        return rand()
                            .flatMap(function (rand2) {
                                return IO.from(rand1 + rand2);
                            })
                            .flatMap(function (rand3) {
                                recorder = rand3;
                                return IO.from();
                            });
                    });
            expect(recorder).toBeUndefined();
            action.$();
            expect(typeof recorder).toEqual("number");
        });
    });
});