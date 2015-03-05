module.exports = (function (adt, _) {
    "use strict";
    return adt.data("Arr", {_Arr: 1})
        .abstract()
        .static("from", function (v, t) {
            v = v || [];
            return t._Arr.from([].concat(v));
        })
        .static("lift", function (f, t) {
            return t._Arr.from([_.curry(f)]);
        })
        .static("mzero", function (t) {
            return t._Arr.from([]);
        })
        .static("mplus", function (a1, a2, t) {
            return t._Arr.from(a1.toJs().concat(a2.toJs()));
        })
        .implements("toJs", {
            _Arr: _.id
        })
        .implements("map", {
            _Arr: function (a, f, t) {
                return t._Arr.from(_.map(f, a));
            }
        })
        .implements("ap", {
            _Arr: function (fs, l, t) {
                var shrunk = _.reduce(function (acc, f) {
                    return acc.concat(_.map(f, l.toJs()));
                }, [], fs);
                return t._Arr.from(shrunk);
            }
        })
        .implements("flatMap", {
            _Arr: function (a, f, t) {
                return t._Arr.from(_.flatten(_.map(f, a)));
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