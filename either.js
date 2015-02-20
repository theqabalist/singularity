module.exports = (function (core) {
    "use strict";
    var left, destructure;

    function right(js) {
        var val = js;
        return {
            isEither: true,
            isRight: true,
            isLeft: false,
            map: function (f) {
                return right(f(val));
            },
            val: function (f) { return f(val); },
            ap: destructure()
                .Right(function (x) { return right(val(x)); })
                .Left(function (x) { return left(x); })
        };
    }

    left = function (js) {
        var val = js;
        return {
            isEither: true,
            isRight: false,
            isLeft: true,
            val: function (f) { return f(val); },
            map: function () {
                return left(val);
            },
            ap: function () { return left(val); }
        };
    };

    function lift(f) {
        return right(core.curry(f));
    }

    function noPatternMatch() { throw "No matching patterns found."; }

    destructure = function () {
        var doLeft = noPatternMatch,
            doRight = noPatternMatch,
            buildMethod;

        function setLeft(g) {
            doLeft = g;
            return buildMethod();
        }

        function setRight(g) {
            doRight = g;
            return buildMethod();
        }

        buildMethod = function () {
            var f = function (m) {
                var internal = m.val(core.id);
                return m.isRight ? doRight(internal) : doLeft(internal);
            };
            f.Right = setRight;
            f.Left = setLeft;
            return f;
        };

        return buildMethod();
    };

    return {
        Either: {destructure: destructure, lift: lift},
        Right: {from: right},
        Left: {from: left}
    };
}(
    require("./core")
));