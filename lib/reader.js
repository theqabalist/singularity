/*jslint unparam: true*/
module.exports = (function (adt, _) {
    "use strict";

    return adt.data("Reader", {_Reader: 1})
        .abstract()
        .static("mreturn", function (v, t) { return t._Reader.from(_.constant(v)); })
        .static("lift", adt.monad.lift)
        .implements("run", {
            _Reader: function (r, e) {
                return r(e);
            }
        })
        .implements("map", {_Reader: adt.monad.map})
        .implements("ap", {_Reader: adt.monad.ap})
        .implements("mbind", {
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
                return this.mbind(function (t1) {
                    return t.ask().mbind(function (e) {
                        return g(e, t1);
                    });
                });
            }
        })
        .static("asks", function (f, t) { return t._Reader.from(f); })
        .implements("asks", {
            _Reader: function (r, f, g, t) {
                return this.mbind(function (t1) {
                    return t.asks(f).mbind(function (e) {
                        return g(e, t1);
                    });
                });
            }
        })
        .static("local", function (f, c, t) {
            return t._Reader.from(function (e) {
                return c.run(f(e));
            });
        })
        .implements("local", {
            _Reader: function (r, f, g, t) {
                return this.mbind(function (t1) {
                    return t.local(f, g(t1));
                });
            }
        });
}(
    require("./algebraic"),
    require("./core")
));