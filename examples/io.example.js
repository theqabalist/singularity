/*jslint stupid: true*/
(function (fs, IO) {
    "use strict";
    function rand() {
        return IO.from(Math.random());
    }
    function fileContentsAsInt(path) {
        return IO.from(function () {
            return parseInt(fs.readFileSync(path), 10);
        });
    }
    function putStrLn(s) {
        return IO.from(function () {
            console.log(s);
        });
    }
    function simpleAdd(a, b) { return a + b; }
    function times5(x) { return x * 5; }
    IO.lift(simpleAdd)
        .ap(rand())
        .ap(fileContentsAsInt("io.txt"))
        .map(times5)
        .mbind(putStrLn)
        .$();
}(
    require("fs"),
    require("../index").monad.IO
));