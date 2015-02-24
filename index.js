/*global
    window: true
*/
module.exports = (function (adt, either, iface, maybe) {
    "use strict";
    var obj = {
        adt: adt,
        monad: {
            Maybe: maybe.Maybe,
            Just: maybe.Just,
            None: maybe.None,
            Either: either.Either,
            Right: either.Right,
            Left: either.Left
        },
        fmap: iface.fmap,
        destructure: iface.destructure,
        join: iface.join
    };

    if (window) {
        window.S = obj;
    }

    return obj;
}(
    require("./algebraic"),
    require("./either"),
    require("./interfaces"),
    require("./maybe")
));