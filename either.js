/*jslint unparam: true*/
module.exports = (function (_, adt) {
    "use strict";
    return adt
        .data("Either", {Left: 1, Right: 1})
        .implements("map", {
            Left: function (v, __, t) { return t.Left.from(v); },
            Right: function (v, f, t) { return t.Right.from(f(v)); }
        })
        .implements("ap", {
            Left: function (i, __, t) { return t.Left.from(i); },
            Right: function (i, e, t) {
                return t.Either.destructure()
                    .Right(function (v) { return t.Right.from(i(v)); })
                    .Left(function (v) { return t.Left.from(v); })
                    .call(null, e);
            }
        })
        .static("lift", function (f, t) {
            return t.Right.from(_.curry(f));
        });
}(
    require("./core"),
    require("./algebraic")
));