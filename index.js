/*global
    window: true
*/
module.exports = (function (adt, either, iface, maybe, io) {
    "use strict";
    var obj = {
        adt: adt,
        monad: {
            Maybe: maybe.Maybe,
            Just: maybe.Just,
            None: maybe.None,
            Either: either.Either,
            Right: either.Right,
            Left: either.Left,
            IO: io.IO
        },
        fmap: iface.fmap,
        destructure: iface.destructure,
        join: iface.join
    };

    try {
        window.S = obj;
    } catch (ignore) {

    }

    return obj;
}(
    require("./algebraic"),
    require("./either"),
    require("./interfaces"),
    require("./maybe"),
    require("./io")
));