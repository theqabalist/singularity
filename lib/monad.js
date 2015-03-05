module.exports = (function (maybe, either, io, reader, array, writer) {
    "use strict";
    return {
        Maybe: maybe.Maybe,
        Just: maybe.Just,
        None: maybe.None,
        Either: either.Either,
        Right: either.Right,
        Left: either.Left,
        IO: io.IO,
        Reader: reader.Reader,
        Arr: array.Arr,
        Writer: writer.Writer
    };
}(
    require("./maybe"),
    require("./either"),
    require("./io"),
    require("./reader"),
    require("./array"),
    require("./writer")
));