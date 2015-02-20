module.exports = (function (_) {
    "use strict";
    var none;

    function just(js) {
        var val = js;
        return {
            isMaybe: true,
            isJust: true,
            isNone: false,
            map: function (f) {
                return just(f(val));
            },
            val: function (f) { return f(val); },
            ap: _.multi()
                .method(_.property("isJust"), function (j) {
                    var internal = j.orDefault();
                    return just(val(internal));
                })
                .otherwise(none),
            flatMap: function (f) {
                var x = f(val);
                if (!x.isMaybe) { throw "Monadic bind must be to the same type."; }
                return x;
            },
            orDefault: function () { return val; }
        };
    }

    none = function () {
        var singleton = {
            isMaybe: true,
            isJust: false,
            isNone: true,
            map: none,
            ap: none,
            flatMap: none,
            val: _.constant(undefined),
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

    function noPatternMatch() { throw "No matching patterns found."; }

    function destructure() {
        var doJust = noPatternMatch,
            doNone = noPatternMatch,
            buildMethod;

        function setJust(g) {
            doJust = g;
            return buildMethod();
        }
        function setNone(g) {
            doNone = g;
            return buildMethod();
        }

        buildMethod = function () {
            var f = function (m) {
                return m.isJust ? doJust(m.val(_.id)) : doNone();
            };
            f.Just = setJust;
            f.None = setNone;
            return f;
        };

        return buildMethod();
    }

    return {
        Maybe: {destructure: destructure, from: from, lift: lift},
        Just: {from: just},
        None: {from: none}
    };
}(require("./core")));