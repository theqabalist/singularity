module.exports = (function (adt, _) {
    "use strict";

    return adt.data("Reader", {_Reader: 1})
        .abstract()
        .static("from", function (v, t) { return t._Reader.from(_.constant(v)); })
        .static("lift", adt.builders.lift("Reader"))
        .implements("run", {
            _Reader: function (r, e) {
                return r(e);
            }
        })
        .implements("map", {_Reader: adt.builders.map("_Reader", "Reader")})
        .implements("ap", {_Reader: adt.builders.ap("_Reader", "Reader")})
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
                return t._Reader.from(r).flatMap(function (t1) {
                    return t.Reader.ask().flatMap(function (e) {
                        return g(e, t1);
                    });
                });
            }
        })
        .static("asks", function (f, t) { return t._Reader.from(f); })
        .implements("asks", {
            _Reader: function (r, f, g, t) {
                return t._Reader.from(r).flatMap(function (t1) {
                    return t.Reader.asks(f).flatMap(function (e) {
                        return g(e, t1);
                    });
                });
            }
        })
        .static("local", function (f, t) { return t._Reader.from(f); })
        .implements("local", {
            _Reader: function (r, f, g, t) {
                return t._Reader.from(r).flatMap(function (t1) {
                    return t.Reader.local(f).flatMap(function (e) {
                        return g(e, t1);
                    });
                });
            }
        });
}(
    require("./algebraic"),
    require("./core")
));