/*jslint unparam: true*/
module.exports = (function (_, adt) {
    "use strict";
    return adt
        .data("Either", {Left: 1, Right: 1})
        .static("mreturn", function (v, t) { return t.Right.from(v); })
        .static("lift", adt.monad.lift)
        .implements("map", {
            Left: _.this,
            Right: adt.monad.map
        })
        .implements("ap", {
            Left: function () { return this; },
            Right: adt.monad.ap
        })
        .implements("mbind", {
            Left: _.this,
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