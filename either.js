/*jslint unparam: true*/
module.exports = (function (_, adt) {
    "use strict";
    function failLeft(v, __, t) { return t.Left.from(v); }
    return adt
        .data("Either", {Left: 1, Right: 1})
        .implements("map", {
            Left: failLeft,
            Right: function (v, f, t) { return t.Right.from(f(v)); }
        })
        .implements("ap", {
            Left: failLeft,
            Right: function (i, e, t) {
                return t.Either.destructure()
                    .Right(function (v) { return t.Right.from(i(v)); })
                    .Left(function (v) { return t.Left.from(v); })
                    .call(null, e);
            }
        })
        .implements("flatMap", {
            Left: failLeft,
            Right: function (v, f, t) {
                var x = f(v);
                if (!x.isEither) { throw "Monadic bind must be to the same type."; }
                return x;
            }
        })
        .static("lift", function (f, t) {
            return t.Right.from(_.curry(f));
        });
}(
    require("./core"),
    require("./algebraic")
));