module.exports = (function () {
    "use strict";
    var core;
    try {
        core = require("./core.ld");
        core.usesLodash = true;
    } catch (_) {
        core = require("./core.ref");
        core.usesLodash = false;
    } finally {
        return core;
    }
}());