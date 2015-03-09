// example ported from example 1 -- https://wiki.haskell.org/State_Monad
(function (State, _) {
    "use strict";
    var playGame = _.multi()
        .method(function (x) { return x === ""; }, function () {
            return State.get().mbind(function (t) {
                return State.from(t[1]);
            });
        })
        .otherwise(function (str) {
            return State.get().mbind(function (t) {
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
                return update.mbind(function () {
                    return playGame(xs);
                });
            });
        });
    console.log(playGame("abcaaacbbcabbab").evalState([false, 0]));
}(
    require("../lib/state").State,
    require("../lib/core")
));