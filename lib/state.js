module.exports = (function (adt) {
    "use strict";
    return adt.data("State", {_State: 1})
        .abstract()
        .static("from", function (v, t) {
            return t._State.from(function (s) {
                return [v, s];
            });
        })
        .static("get", function (t) {
            return t._State.from(function (s) {
                return [s, s];
            });
        })
        .implements("get", {
            _State: function (m, f, t) {
                return t._State.from(m).flatMap(function (t1) {
                    return t.State.get().flatMap(function (state) {
                        return f(state, t1);
                    });
                });
            }
        })
        .static("gets", function (f, t) {
            return t._State.from(function (s) {
                return [f(s), s];
            });
        })
        .implements("gets", {
            _State: function (m, f, g, t) {
                return t._State.from(m).flatMap(function (t1) {
                    return t.State.gets(f).flatMap(function (query) {
                        return g(query, t1);
                    });
                });
            }
        })
        .static("put", function (v, t) {
            return t._State.from(function () {
                return [null, v];
            });
        })
        .implements("put", {
            _State: function (m, ns, t) {
                return t._State.from(m).flatMap(function (t1) {
                    return t.State.put(ns).flatMap(function () {
                        return t.State.from(t1);
                    });
                });
            }
        })
        .static("modify", function (f, t) {
            return t.State.get()
                .flatMap(function (s) {
                    return t.State.put(f(s));
                });
        })
        .implements("modify", {
            _State: function (m, f, t) {
                return t._State.from(m).flatMap(function (t1) {
                    return t.State.modify(f).flatMap(function () {
                        return t.State.from(t1);
                    });
                });
            }
        })
        .implements("run", {
            _State: function (m, s) {
                return m(s);
            }
        })
        .implements("evalState", {
            _State: function (m, s) {
                return m(s)[0];
            }
        })
        .implements("execState", {
            _State: function (m, s) {
                return m(s)[1];
            }
        })
        .implements("map", {
            _State: function (m, f, t) {
                return t._State.from(function (s) {
                    var out = m(s);
                    return [f(out[0]), s];
                });
            }
        })
        .implements("flatMap", {
            _State: function (m, f, t) {
                return t._State.from(function (s) {
                    var out = m(s);
                    return f(out[0]).run(out[1]);
                });
            }
        });
}(
    require("./algebraic")
));