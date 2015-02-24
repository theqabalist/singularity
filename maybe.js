/*jslint unparam:true*/
module.exports = (function (_, adt) {
    "use strict";
    return adt
        .data("Maybe", {Just: 1, None: 0})
        .implements("map", {
            Just: function (val, f, t) { return t.Just.from(f(val)); },
            None: function (f, t) { return t.None.from(); }
        })
        .implements("ap", {
            Just: function (i, e, t) {
                return t.Maybe.destructure()
                    .Just(function (v) { return t.Just.from(i(v)); })
                    .None(function () { return t.None.from(); })
                    .call(null, e);
            },
            None: function (e, t) { return t.None.from(); }
        })
        .implements("flatMap", {
            Just: function (val, f) {
                var x = f(val);
                if (!x.isMaybe) { throw "Monadic bind must be to the same type."; }
                return x;
            },
            None: function (f, t) { return t.None.from(); }
        })
        .implements("orDefault", {
            Just: function (val) { return val; },
            None: function (other) { return other; }
        })
        .static("from", function (v, t) {
            return v === undefined || v === null ? t.None.from() : t.Just.from(v);
        })
        .static("lift", function (f, t) {
            return t.Just.from(_.curry(f));
        });
}(
    require("./core"),
    require("./algebraic")
));