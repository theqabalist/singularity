// example ported from example 1 -- https://wiki.haskell.org/State_Monad
/*jslint unparam: true*/
(function (st, IO, _) {
    "use strict";
    var State = st.State,
        state = st.state;
    function valFromState(s) { return -s; }
    function nextState(x) { return 1 + x; }
    function getNext() {
        return state.from(function (s) {
            var stp = nextState(s);
            return [valFromState(stp), stp];
        });
    }
    function inc3() {
        return getNext().flatMap(function (x) {
            return getNext().flatMap(function (y) {
                return getNext().flatMap(function (z) {
                    return State.from(z);
                });
            });
        });
    }
    function inc3Sugared() {
        return getNext()
            .flatMap(getNext)
            .flatMap(getNext)
            .flatMap(function (z) { return State.from(z); });
    }
    function inc3DiscardedValues() {
        return getNext().flatMap(function () {
            return getNext().flatMap(function () {
                return getNext();
            });
        });
    }
    function inc3DiscardedValuesSugared() {
        return getNext()
            .flatMap(getNext)
            .flatMap(getNext);
    }
    function inc3AlternateResult() {
        return getNext().flatMap(function () {
            return getNext().flatMap(function () {
                return getNext()
                    .get(function (s) {
                        return State.from(s * s);
                    });
            });
        });
    }
    function inc4() {
        return inc3AlternateResult()
            .flatMap(getNext);
    }
    function printIO(x) {
        return IO.from(function () {
            console.log(x);
        });
    }
    printIO(inc3().evalState(0))
        .flatMap(_.constant(printIO(inc3Sugared().evalState(0))))
        .flatMap(_.constant(printIO(inc3DiscardedValues().evalState(0))))
        .flatMap(_.constant(printIO(inc3DiscardedValuesSugared().evalState(0))))
        .flatMap(_.constant(printIO(inc3AlternateResult().evalState(0))))
        .flatMap(_.constant(printIO(inc4().evalState(0))))
        .$();
}(
    require("../lib/state"),
    require("../lib/io").IO,
    require("../lib/core")
));