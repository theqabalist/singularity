/*jslint unparam: true*/
module.exports = (function (_, adt) {
    "use strict";
    function failLeft(v, __, t) { return t.Left.from(v); }
    return adt
        .data("Either", {Left: 1, Right: 1})
        .static("mreturn", function (v, t) { return t.Right.from(v); })
        .static("lift", adt.monad.lift("Either"))
        .implements("map", {
            Left: failLeft,
            Right: adt.monad.map("Right", "Either")
        })
        .implements("ap", {
            Left: failLeft,
            Right: adt.monad.ap("Right", "Either")
        })
        .implements("mbind", {
            Left: failLeft,
            Right: function (v, f, t) {
                var x = f(v);
                if (!x.isEither) { throw "Monadic bind must be to the same type."; }
                return x;
            }
        });
}(
    require("./core"),
    require("./algebraic")
));