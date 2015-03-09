module.exports = (function (adt, _) {
    "use strict";
    return adt.data("Cont", {cont: 1})
        .static("from", function (v, t) {
            return t.cont.from(function (f) {
                return f(v);
            });
        })
        .static("lift", adt.monad.lift("Cont"))
        .implements("run", {
            cont: function (c, f) {
                return c(f);
            }
        })
        .implements("map", {cont: adt.monad.map("cont", "Cont")})
        .implements("ap", {cont: adt.monad.ap("cont", "Cont")})
        .implements("mbind", {
            cont: function (c, f, t) {
                return t.cont.from(function (k) {
                    return c(function (t1) {
                        return f(t1).run(k);
                    });
                });
            }
        });
}(
    require("./algebraic"),
    require("./core")
));