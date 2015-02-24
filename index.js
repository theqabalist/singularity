module.exports = (function (adt, either, iface, maybe) {
    "use strict";
    return {
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
}(
    require("./algebraic"),
    require("./either"),
    require("./interfaces"),
    require("./maybe")
));