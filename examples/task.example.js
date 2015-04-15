/*jslint stupid: true*/
(function (fs, Task, Either, Left, Right) {
    "use strict";
    function readFile(path, options) {
        return Task.callback(function (handle) {
            fs.readFile(path, options, function (err, data) {
                if (err) {
                    handle(Left.from(err));
                } else {
                    handle(Right.from(data));
                }
            });
        });
    }

    // Example
    readFile("examples/io.txt", {encoding: "utf8"})
        .map(function (txt) {
            return parseInt(txt, 10);
        })
        .$(Either.destructure()
            .Left(function (err) {
                console.error(err);
            })
            .Right(function (x) {
                console.log(x);
            }));
}(
    require("fs"),
    require("../lib/task").Task,
    require("../lib/either").Either,
    require("../lib/either").Left,
    require("../lib/either").Right
));
