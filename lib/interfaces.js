module.exports = (function (_) {
    "use strict";
    /*jslint unparam: true*/

    function hasMethod(name) {
        return {
            onParam: function (param) {
                return function () {
                    var args = _.toList(arguments),
                        which = args[param],
                        prop = which[name];
                    return prop ? typeof prop === "function" : false;
                };
            }
        };
    }

    return {
        fmap: _.multi(2)
            .method(hasMethod("map").onParam(1), function (f, m) {
                return m.map(f);
            }),
        join: function (m) { return m.mbind(_.id); },
        destructure: function (adt) { return adt.destructure(); }
    };
}(require("./core")));