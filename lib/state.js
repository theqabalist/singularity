module.exports = (function (adt) {
    "use strict";
    return adt.data("State", {state: 1})
        .static("from", function (v, t) {
            return t.state.from(function (s) {
                return [v, s];
            });
        })
        .static("lift", adt.monad.lift("State"))
        .static("get", function (t) {
            return t.state.from(function (s) {
                return [s, s];
            });
        })
        .implements("get", {
            state: function (m, f, t) {
                return t.state.from(m).mbind(function (t1) {
                    return t.State.get().mbind(function (state) {
                        return f(state, t1);
                    });
                });
            }
        })
        .static("gets", function (f, t) {
            return t.state.from(function (s) {
                return [f(s), s];
            });
        })
        .implements("gets", {
            state: function (m, f, g, t) {
                return t.state.from(m).mbind(function (t1) {
                    return t.State.gets(f).mbind(function (query) {
                        return g(query, t1);
                    });
                });
            }
        })
        .static("put", function (v, t) {
            return t.state.from(function () {
                return [null, v];
            });
        })
        .implements("put", {
            state: function (m, ns, t) {
                return t.state.from(m).mbind(function (t1) {
                    return t.State.put(ns).mbind(function () {
                        return t.State.from(t1);
                    });
                });
            }
        })
        .static("modify", function (f, t) {
            return t.State.get()
                .mbind(function (s) {
                    return t.State.put(f(s));
                });
        })
        .implements("modify", {
            state: function (m, f, t) {
                return t.state.from(m).mbind(function (t1) {
                    return t.State.modify(f).mbind(function () {
                        return t.State.from(t1);
                    });
                });
            }
        })
        .implements("run", {
            state: function (m, s) {
                return m(s);
            }
        })
        .implements("evalState", {
            state: function (m, s) {
                return m(s)[0];
            }
        })
        .implements("execState", {
            state: function (m, s) {
                return m(s)[1];
            }
        })
        .implements("map", {state: adt.monad.map("state", "State")})
        .implements("ap", {state: adt.monad.ap("state", "State")})
        .implements("mbind", {
            state: function (m, f, t) {
                return t.state.from(function (s) {
                    var out = m(s);
                    return f(out[0]).run(out[1]);
                });
            }
        });
}(
    require("./algebraic")
));