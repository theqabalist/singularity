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
        return getNext().mbind(function (x) {
            return getNext().mbind(function (y) {
                return getNext().mbind(function (z) {
                    return State.from(z);
                });
            });
        });
    }
    function inc3Sugared() {
        return getNext()
            .mbind(getNext)
            .mbind(getNext)
            .mbind(function (z) { return State.from(z); });
    }
    function inc3DiscardedValues() {
        return getNext().mbind(function () {
            return getNext().mbind(function () {
                return getNext();
            });
        });
    }
    function inc3DiscardedValuesSugared() {
        return getNext()
            .mbind(getNext)
            .mbind(getNext);
    }
    function inc3AlternateResult() {
        return getNext().mbind(function () {
            return getNext().mbind(function () {
                return getNext()
                    .get(function (s) {
                        return State.from(s * s);
                    });
            });
        });
    }
    function inc4() {
        return inc3AlternateResult()
            .mbind(getNext);
    }
    function printIO(x) {
        return IO.from(function () {
            console.log(x);
        });
    }
    printIO(inc3().evalState(0))
        .mbind(_.constant(printIO(inc3Sugared().evalState(0))))
        .mbind(_.constant(printIO(inc3DiscardedValues().evalState(0))))
        .mbind(_.constant(printIO(inc3DiscardedValuesSugared().evalState(0))))
        .mbind(_.constant(printIO(inc3AlternateResult().evalState(0))))
        .mbind(_.constant(printIO(inc4().evalState(0))))
        .$();
}(
    require("../lib/state"),
    require("../lib/io").IO,
    require("../lib/core")
));