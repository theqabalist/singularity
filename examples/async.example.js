/*jslint stupid: true*/
(function (fs, Async) {
    "use strict";
    function left(v) {
        return v;
    }
    function right(v) {
        return v;
    }
    function readFile(path, options) {
        return Async.callback(function (handle) {
            fs.readFile(path, options, function (err, data) {
                if (err) {
                    handle(left(err));
                } else {
                    handle(right(data));
                }
            });
        });
    }

    function writeFile(path, options) {
        return function (data) {
            return Async.callback(function (handle) {
                fs.writeFile(path, data, options, function (err, data) {
                    if (err) {
                        handle(left(err));
                    } else {
                        handle(right(data));
                    }
                });
            });
        };
    }

    // Example
    var task = readFile("io.txt", {encoding: "utf8"})
        .flatMap(writeFile("io2.txt", {encoding: "utf8"}));

    task.run(function (result) {
        console.log(result);
    });

    return {
        rf: readFile,
        wf: writeFile
    };
}(
    require("fs"),
    require("../async")
));