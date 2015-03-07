/*jslint unparam:true*/
module.exports = (function (_, adt) {
    "use strict";
    function failNone(f, t) { return t.None.from(); }
    return adt
        .data("Maybe", {Just: 1, None: 0})
        .static("from", function (v, t) {
            return v === undefined || v === null ? t.None.from() : t.Just.from(v);
        })
        .static("lift", adt.monad.lift("Just"))
        .implements("map", {
            Just: adt.monad.map("Just", "Maybe"),
            None: failNone
        })
        .implements("ap", {
            Just: adt.monad.ap("Just", "Maybe"),
            None: failNone
        })
        .implements("flatMap", {
            Just: function (val, f) {
                var x = f(val);
                if (!x.isMaybe) { throw "Monadic bind must be to the same type."; }
                return x;
            },
            None: failNone
        })
        .implements("orDefault", {
            Just: function (val) { return val; },
            None: function (other) { return other; }
        });
}(
    require("./core"),
    require("./algebraic")
));