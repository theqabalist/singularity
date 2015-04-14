module.exports = (function (adt) {
    "use strict";
    return adt.data({Point: 1, Async: 1, Bind: 2})
        .abstract()
        .static("mreturn", function (v) {

        })
        .implements("bind", {
            Point: function (v, mb, t) {
                return t.Bind.from(t.Point.from(v), mb);
            },
            Async: function (f, mb, t) {
                return t.Bind.from(t.Async.from(f), mb);
            },
            Bind: function (thunk, f, mb, t) {
                return t.Bind.from(thunk, function (t) {
                    return f(t).bind(mb);
                });
            }
        })
        .implements("step", {

        });
}(
    require("./algebraic")
));