module.exports = (function (adt, _) {
    "use strict";
    function js(x) { return x.toJs(); }
    return adt.data("Arr", {_Arr: 1})
        .abstract()
        .static("mreturn", function (v, t) {
            v = v || [];
            return t._Arr.from([].concat(v));
        })
        .static("lift", function (f, t) {
            return t._Arr.from([_.curry(f)]);
        })
        .static("mzero", function (t) { return t._Arr.from([]); })
        .static("mplus", function (a1, a2, t) {
            return t._Arr.from(a1.toJs().concat(a2.toJs()));
        })
        .implements("toJs", {_Arr: _.id})
        .implements("map", {_Arr: adt.monad.map})
        .implements("ap", {_Arr: adt.monad.ap})
        .implements("mbind", {
            _Arr: function (a, f, t) {
                return t._Arr.from(_.flatten(_.map(_.compose(js, f), a)));
            }
        })
        .implements("mappend", {
            _Arr: function (a1, m, t) {
                return t._Arr.from(a1.concat(m.toJs()));
            }
        });
}(
    require("./algebraic"),
    require("./core"),
    require("./core.ref")
));