/*global
    describe: true,
    it: true,
    expect: true
*/
describe("State Monad", function () {
    "use strict";
    var State = require("../lib/state").State,
        _ = require("../lib/core");
    describe(".from", function () {
        it("should provide a data constructor", function () {
            var s = State.from(5);
            expect(s.run(2)).toEqual([5, 2]);
        });
    });

    describe("fmap", function () {
        it("should implement functor mapping", function () {
            var s = State.from(5).map(function (t) { return t * 5; });
            expect(s.run(2)).toEqual([25, 2]);
        });
    });

    describe("#ap", function () {
        it("should serially apply monadic values", function () {
            var s = State.lift(function (a, b) { return a + b; })
                .ap(State.from(5))
                .ap(State.from(6));
            expect(s.evalState(null)).toBe(11);
        });
    });

    describe(".get", function () {
        it("should provide a constructor to return the state", function () {
            var s = State.get();
            expect(s.run(2)).toEqual([2, 2]);
        });
    });

    describe("#flatMap", function () {
        it("should implement monadic bind", function () {
            var s = State.from(5).flatMap(function (t) {
                return State.get().flatMap(function (v) {
                    return State.from(v + t);
                });
            });
            expect(s.run(2)).toEqual([7, 2]);
        });
    });

    describe(".gets", function () {
        it("should provide a querying constructor", function () {
            var s = State.gets(_.property("hello"));
            expect(s.run({hello: 2})).toEqual([2, {hello: 2}]);
        });
    });

    describe(".put", function () {
        it("should provide a constructor to replace the state", function () {
            var s = State.put(5);
            expect(s.run(2)).toEqual([null, 5]);
        });
    });

    describe(".modify", function () {
        it("should provide a constructor to change the state", function () {
            var s = State.modify(function (x) { return x * 5; });
            expect(s.run(5)).toEqual([null, 25]);
        });
    });

    describe("#evalState", function () {
        it("should return the result of the computation", function () {
            var s = State.from(5);
            expect(s.evalState(10)).toBe(5);
        });
    });

    describe("#execState", function () {
        it("should return the state of the computation", function () {
            var s = State.from(5);
            expect(s.execState(10)).toBe(10);
        });
    });

    describe("object helpers", function () {
        describe("inline helpers", function () {
            it("should provide modify inline", function () {
                var s = State.put({a: "b"})
                    .modify(function (s) { return s.a; });
                expect(s.run({a: "c"})).toEqual([null, "b"]);
            });

            it("should provide get inline", function () {
                var s = State.from(5)
                    .get(function (s, t) {
                        return State.from(s + t);
                    });
                expect(s.evalState(2)).toBe(7);
            });

            it("should provide gets inline", function () {
                var s = State.from(5)
                    .gets(function (s) { return s.a; }, function (a, t) {
                        return State.from(a + t);
                    });
                expect(s.evalState({a: 2})).toBe(7);
            });

            it("should provide puts inline", function () {
                var s = State.from(5)
                    .put({a: 2})
                    .gets(function (s) { return s.a; }, function (a, t) {
                        return State.from(a + t);
                    });
                expect(s.evalState({a: 3})).toBe(7);
            });
        });
        it("should provide a nicer version of the constructors", function () {
            var s = State.put({a: "b"})
                .modify(function (s) { return s.a; })
                .flatMap(function () { return State.from(5); })
                .get(function (s, t) {
                    var newState = {};
                    newState[s] = t;
                    return State.put(newState).flatMap(function () {
                        return State.from(t);
                    });
                })
                .gets(function (s) { return s.b; }, function (b, t) {
                    return State.from(b + t);
                });
            expect(s.evalState()).toBe(10);
        });
    });

    describe("a somewhat useful example", function () {
        it("should do simple string parsing", function () {
            // example ported from https://wiki.haskell.org/State_Monad
            var playGame = _.multi()
                .method(function (x) { return x === ""; }, function () {
                    return State.get().flatMap(function (t) {
                        return State.from(t[1]);
                    });
                })
                .otherwise(function (str) {
                    return State.get().flatMap(function (t) {
                        var x = str[0],
                            xs = str.slice(1),
                            on = t[0],
                            score = t[1],
                            update;
                        switch (x) {
                        case "a":
                            update = on ? State.put([on, score + 1]) : State.put([on, score]);
                            break;
                        case "b":
                            update = on ? State.put([on, score - 1]) : State.put([on, score]);
                            break;
                        case "c":
                            update = State.put([!on, score]);
                            break;
                        default:
                            update = State.put([on, score]);
                            break;
                        }
                        return update.flatMap(function () {
                            return playGame(xs);
                        });
                    });
                });
            expect(playGame("abcaaacbbcabbab").execState([false, 0])).toEqual([true, 2]);
        });
    });
});