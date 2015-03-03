/*global
    window: true
*/
module.exports = (function (adt, core, either, iface, maybe, io, reader) {
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
            IO: io.IO,
            Reader: reader.Reader
        },
        fmap: iface.fmap,
        destructure: iface.destructure,
        join: iface.join,
        usesLodash: core.usesLodash
    };

    try {
        window.S = obj;
    } catch (ignore) {

    }

    return obj;
}(
    require("./algebraic"),
    require("./core"),
    require("./either"),
    require("./interfaces"),
    require("./maybe"),
    require("./io"),
    require("./reader")
));