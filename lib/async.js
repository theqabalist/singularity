module.exports = (function (adt) {
    "use strict";
    return adt.data("Async", {
        Immediate: 1,
        Callback: 1,
        Bind: 2
    })
        .static("mreturn", function (x, t) {
            return t.Immediate.from(x);
        })
        .static("async", function (f, t) {
            return t.Callback.from(f);
        })
        .static("delay", function (f, t) {
            return t.Callback.from(function (cb) {
                cb(f());
            });
        })
        .implements("map", {
            Immediate: function (x, f, t) {
                return t.Immediate.from(x).bind(function (a) {
                    return t.mreturn(f(a));
                });
            },
            Callback: function (handle, f, t) {
                return t.Callback.from(handle).bind(function (a) {
                    return t.mreturn(f(a));
                });
            },
            Bind: function (thunk, b, f, t) {
                return t.Bind.from(thunk, b).bind(function (a) {
                    return t.mreturn(f(a));
                });
            }
        })
        .implements("mbind", {
            Immediate: function (x, f, t) {
                return t.Bind.from(t.Immediate.from(x), f);
            },
            Async: function (handle, f, t) {
                return t.Bind.from(t.Async.from(handle), f);
            }
        })
        .implements("$", {
            Immediate: function (x, cb) {
                cb(x);
            },
            Async: function (handle, cb) {
                handle(cb);
            },
            Bind: function (thunk, b, cb) {
                thunk.listen(function (a) {
                    b(a).listen(cb);
                });
            }
        });
}(
    require("./algebraic")
));