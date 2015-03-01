module.exports = (function (adt, _) {
    "use strict";
    function hasTwoArgs() { return _.toList(arguments).length === 2; }
    return adt
        .data("IO", {_IO: 2})
        .abstract()
        .static("from",
            _.multi()
            .method(hasTwoArgs, function (v, t) {
                return typeof v === "function" ? t._IO.from(v, []) : t._IO.from(function () { return v; }, []);
            })
            .otherwise(function (t) {
                return t._IO.from(function () { return null; }, []);
            }))
        .static("lift", function (f, t) {
            return t._IO.from(_.curry(f), []);
        })
        .implements("$", {
            _IO: function (origin, instructions) {
                var args = _.initial(_.rest(_.rest(_.toList(arguments))));
                return _.reduce(function (val, instruction) {
                    var type = instruction[0],
                        f = instruction[1],
                        newVal;
                    switch (type) {
                    case "map":
                        newVal = f(val);
                        break;
                    case "ap":
                        newVal = val(f.$());
                        break;
                    case "bind":
                        newVal = f(val).$();
                        break;
                    }
                    return newVal;
                }, origin.apply(null, args), instructions);
            }
        })
        .implements("map", {
            _IO: function (origin, instructions, g, t) {
                return t._IO.from(origin, instructions.concat([["map", g]]));
            }
        })
        .implements("ap", {
            _IO: function (origin, instructions, v, t) {
                return t._IO.from(origin, instructions.concat([["ap", v]]));
            }
        })
        .implements("flatMap", {
            _IO: function (origin, instructions, g, t) {
                return t._IO.from(origin, instructions.concat([["bind", g]]));
            }
        });
}(
    require("./algebraic"),
    require("./core")
));