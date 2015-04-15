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
        .static("callback", function (f, t) {
            return t.Callback.from(f);
        })
        .static("delay", function (f, t) {
            return t.Callback.from(function (cb) {
                setTimeout(function () {
                    cb(f());
                }, 0);
            });
        })
        .implements("map", {
            Immediate: function (x, f, t) {
                return t.Immediate.from(x).mbind(function (a) {
                    return t.mreturn(f(a));
                });
            },
            Callback: function (handle, f, t) {
                return t.Callback.from(handle).mbind(function (a) {
                    return t.mreturn(f(a));
                });
            },
            Bind: function (thunk, b, f, t) {
                return t.Bind.from(thunk, b).mbind(function (a) {
                    return t.mreturn(f(a));
                });
            }
        })
        .implements("mbind", {
            Immediate: function (x, f, t) {
                return t.Bind.from(t.Immediate.from(x), f);
            },
            Callback: function (handle, f, t) {
                return t.Bind.from(t.Callback.from(handle), f);
            },
            Bind: function (thunk, b, f, t) {
                return t.Bind.from(thunk, function (a) {
                    b(a).mbind(f);
                });
            }
        })
        .implements("$", {
            Immediate: function (x, cb) {
                cb(x);
            },
            Callback: function (handle, cb) {
                handle(cb);
            },
            Bind: function (thunk, b, cb) {
                thunk.$(function (a) {
                    b(a).$(cb);
                });
            }
        });
}(
    require("./algebraic")
));