/*jslint unparam: true*/
module.exports = (function (adt, _) {
    "use strict";
    var selectFirst = _.id,
        selectSecond = function () { return _.toList(arguments)[1]; },
        hasTwoArgs = function () { return _.toList(arguments).length === 2; };
    return adt.data("Writer", {_Writer: 2})
        .abstract()
        .static("mreturn", function (z, v, t) {
            return t._Writer.from(z, v);
        })
        .static("typed", function (type, t) {
            return {
                mreturn: _.multi()
                    .method(hasTwoArgs, t.from)
                    .otherwise(function (v) { return t._Writer.from(type.mzero(), v); }),
                lift: _.multi()
                    .method(hasTwoArgs, t.lift)
                    .otherwise(function (f) { return t._Writer.from(type.mzero(), _.curry(f)); })
            };
        })
        .static("lift", function (z, f, t) {
            return t._Writer.from(z, _.curry(f));
        })
        .implements("map", {
            _Writer: function (log, w, f, t) {
                return t._Writer.from(log, w).mbind(function (t1) {
                    return t.typed(log.type).mreturn(f(t1));
                });
            }
        })
        .implements("ap", {
            _Writer: function (log, w, m, t) {
                return t._Writer.from(log, w).mbind(function (f) {
                    return m.mbind(function (t1) {
                        return t.typed(log.type).mreturn(f(t1));
                    });
                });
            }
        })
        .implements("mbind", {
            _Writer: function (log, v, f, t) {
                var w = f(v),
                    other = w.val(selectFirst),
                    v2 = w.val(selectSecond);
                return t._Writer.from(log.mappend(other), v2);
            }
        })
        .implements("output", {_Writer: selectFirst})
        .implements("data", {_Writer: selectSecond});
}(
    require("./algebraic"),
    require("./core")
));