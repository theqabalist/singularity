/*jslint unparam: true */
module.exports = (function (adt) {
    "use strict";
    return adt
        .data("Async", {
            Now: 1,
            Async: 1,
            FlatMap: 2
        })
        .abstract()
        .static("pure", function (v, t) {
            return t.Now.from(v);
        })
        .static("delay", function (f, t) {
            return t.async(function (cb) {
                setTimeout(function () {
                    cb(f());
                }, 0);
            });
        })
        .static("async", function (f, t) {
            return t.Async.from(f);
        })
        .implements("flatMap", {
            Now: function (v, f, t) {
                return t.FlatMap.from(t.Now.from(v), f);
            },
            Async: function (cb, f, t) {
                return t.FlatMap.from(t.Async.from(cb), f);
            },
            FlatMap: function (prev, bind, f, t) {
                return t.FlatMap.from(t.FlatMap.from(prev, bind), f);
            }
        })
        .implements("$", {
            Now: function (v, cb, _) {
                cb(v);
            },
            Async: function (f, cb, _) {
                f(cb);
            },
            FlatMap: function (prev, bf, cb, t) {
                return null;
            }
        });
}(
    require("./algebraic")
));