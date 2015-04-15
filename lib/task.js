module.exports = (function (adt, Either, Left, Right, Async) {
    "use strict";
    /* A wrapper for async that handles errors. A Task is effectively a Future[Either[Error, T]] */
    return adt
        .data("Task", {_Task: 1})
        .abstract()
        .static("mreturn", function (x, t) {
            return t._Task.from(Async.mreturn(Right.from(x)));
        })
        .static("fail", function (err, t) {
            return t._Task.from(Async.mreturn(Left.from(err)));
        })
        .static("callback", function (f, t) {
            return t._Task.from(Async.callback(f));
        })
        .static("delay", function (f, t) {
            return t._Task.from(Async.delay(f));
        })
        .static("node", function (f, t) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return t._Task.from(Async.callback(function (cb) {
                    args.push(function (err, res) {
                        if (err) {
                            cb(Left.from(err));
                        } else {
                            cb(Right.from(res));
                        }
                    });
                    f.apply(null, args);
                }));
            };
        })
        .implements("map", {
            _Task: function (async, f, t) {
                return t._Task.from(async.mbind(function (res) {
                    return Either.destructure()
                        .Left(function (err) {
                            return Async.mreturn(Left.from(err));
                        })
                        .Right(function (val) {
                            return Async.mreturn(Right.from(f(val)));
                        })(res);
                }));
            }
        })
        .implements("mbind", {
            _Task: function (async, f, t) {
                return t._Task.from(async.mbind(function (res) {
                    return Either.destructure()
                        .Left(function (err) {
                            return Async.mreturn(Left.from(err));
                        })
                        .Right(function (val) {
                            /* Call f with value and then pluck out the inner async to return */
                            return t.destructure()._Task(function (inner) {
                                return inner;
                            })(f(val));
                        })(res);
                }));
            }
        })
        .implements("handle", {
            _Task: function (async, f, t) {
                return t._Task.from(async.mbind(function (res) {
                    return Either.destructure()
                        .Left(function (err) {
                            /* Call f with the error then pluck out the inner async to return */
                            return t.destructure()._Task(function (inner) {
                                return inner;
                            })(f(err));
                        })
                        .Right(function (val) {
                            return Async.mreturn(Right.from(val));
                        })(res);
                }));
            }
        })
        .implements("$", {
            _Task: function (async, cb) {
                async.$(cb);
            }
        });
}(
    require("./algebraic"),
    require("./either").Either,
    require("./either").Left,
    require("./either").Right,
    require("./async").Async
));