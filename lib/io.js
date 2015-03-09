module.exports = (function (adt, _) {
    "use strict";
    function hasTwoArgs() { return _.toList(arguments).length === 2; }
    return adt
        .data("IO", {_IO: 2})
        .abstract()
        .static("mreturn",
            _.multi()
            .method(hasTwoArgs, function (v, t) {
                return typeof v === "function" ? t._IO.from(v, []) : t._IO.from(function () { return v; }, []);
            })
            .otherwise(function (t) {
                return t._IO.from(function () { return null; }, []);
            }))
        .static("lift", adt.monad.lift)
        .implements("$", {
            _IO: function (origin, instructions) {
                var args = _.initial(_.rest(_.rest(_.toList(arguments))));
                return _.reduce(function (val, instruction) {
                    return instruction(val).$();
                }, origin.apply(null, args), instructions);
            }
        })
        .implements("map", {_IO: adt.monad.map})
        .implements("ap", {_IO: adt.monad.ap})
        .implements("mbind", {
            _IO: function (origin, instructions, g, t) {
                return t._IO.from(origin, instructions.concat(g));
            }
        });
}(
    require("./algebraic"),
    require("./core")
));