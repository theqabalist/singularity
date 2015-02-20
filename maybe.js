module.exports = (function (_) {
    "use strict";
    var none;

    function just(js) {
        var val = js;
        return {
            isOption: true,
            isJust: true,
            isNone: false,
            map: function (f) {
                return just(f(val));
            },
            ap: _.multi()
                .method(_.property("isJust"), function (j) {
                    var internal = j.orDefault();
                    return just(val(internal));
                })
                .otherwise(none),
            orDefault: function () { return val; }
        };
    }

    none = function () {
        var singleton = {
            isOption: true,
            isJust: false,
            isNone: true,
            map: none,
            ap: none,
            orDefault: function (v) { return v; }
        };
        return singleton;
    };

    function from(js) {
        return js === undefined || js === null ? none() : just(js);
    }

    function lift(f) {
        return just(_.curry(f));
    }

    return {
        Maybe: {from: from, lift: lift},
        Just: {from: just},
        None: {from: none}
    };
}(require("./core")));