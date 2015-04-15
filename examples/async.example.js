/*jslint stupid: true*/
(function (Async) {
    "use strict";
    function think(v) {
        return Async.callback(function (cb) {
            setTimeout(function () {
                cb(v);
            }, 1000);
        });
    }

    think(1).mbind(function (x) {
        return think(x + 1);
    }).$(console.log);

}(
    require("../lib/async").Async
));