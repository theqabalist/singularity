/*jslint unparam: true */
module.exports = (function (adt) {
    "use strict";
    return adt
        .data("Async", {
            Now: 1,
            Callback: 1,
            FlatMap: 2
        })
        .abstract()
        .static("mreturn", function (v, t) {
            return t.Now.from(v);
        })
        .static("delay", function (f, t) {
            return t.Callback.from(function (done) {
                setTimeout(function () {
                    done(f());
                }, 0);
            });
        })
        .static("callback", function (f, t) {
            return t.Callback.from(f);
        })
        .implements("mbind", {
            Now: function (v, mf, t) {
                return t.FlatMap.from(t.mreturn(v), mf);
            },
            Callback: function (f, mf, t) {
                return t.FlatMap.from(t.Callback.from(f), mf);
            },
            FlatMap: function (l, bf, mf, t) {
                return t.FlatMap.from(t.FlatMap.from(l, bf), mf);
            }
        })
        .implements("step", {

        })
        .implements("$", {

        });
}(
    require("./algebraic")
));