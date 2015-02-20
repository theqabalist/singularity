module.exports = (function (_) {
    "use strict";
    /*jslint unparam: true*/
    return {
        fmap: _.multi(2)
            .method(function (f, m) { return typeof m.map === 'function'; }, function (f, m) {
                return m.map(f);
            })
    };
}(require("./core")));