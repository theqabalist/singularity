/*global
    window: true
*/
module.exports = (function (adt, core, iface) {
    "use strict";
    var obj = {
        adt: adt,
        monad: require("./lib/monad"),
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
    require("./lib/algebraic"),
    require("./lib/core"),
    require("./lib/interfaces")
));