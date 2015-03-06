module.exports = (function (adt, _) {
    "use strict";

    return adt.data("Reader", {_Reader: 1})
        .abstract()
        .static("from", function (v, t) { return t._Reader.from(_.constant(v)); })
        .static("lift", function (f, t) { return t._Reader.from(_.constant(_.curry(f))); })
        .implements("run", {
            _Reader: function (r, e) {
                return r(e);
            }
        })
        .implements("map", {
            _Reader: function (r, f, t) {
                return t._Reader.from(function (e) {
                    return f(r(e));
                });
            }
        })
        .implements("ap", {
            _Reader: function (r, m, t) {
                return t._Reader.from(function (e) {
                    return r(e)(m.run(e));
                });
            }
        })
        .implements("flatMap", {
            _Reader: function (r, f, t) {
                return t._Reader.from(function (e) {
                    var x = f(r(e));
                    if (!x.isReader) { throw "Monadic bind must be to the same type."; }
                    return x.run(e);
                });
            }
        })
        .static("ask", function (t) { return t._Reader.from(_.id); })
        .implements("ask", {
            _Reader: function (r, g, t) {
                return t._Reader.from(function (e) {
                    return t.Reader.ask()
                        .flatMap(function (e) {
                            return g(e, r(e));
                        })
                        .run(e);
                });
            }
        })
        .static("asks", function (f, t) { return t._Reader.from(f); })
        .implements("asks", {
            _Reader: function (r, f, g, t) {
                return t._Reader.from(function (e) {
                    return t.Reader.asks(f)
                        .flatMap(function (v) {
                            return g(v, r(e));
                        })
                        .run(e);
                });
            }
        })
        .static("local", function (f, t) { return t._Reader.from(f); })
        .implements("local", {
            _Reader: function (r, f, g, t) {
                return t._Reader.from(function (e) {
                    return g(t.Reader.from(r(e))).run(f(e));
                });
            }
        });
}(
    require("./algebraic"),
    require("./core")
));