module.exports = (function (adt, _, Either, Left, Right, Async) {
    "use strict";
    /* A wrapper for async that handles errors. A Task is effectively a Future[Either[Error, T]] */
    return adt
        .data("Future", {_Future: 1})
        .abstract()
        .static("mreturn", function (x, t) {
            return t._Future.from(Async.mreturn(Right.from(x)));
        })
        .static("fail", function (err, t) {
            return t._Future.from(Async.mreturn(Left.from(err)));
        })
        .static("callback", function (f, t) {
            return t._Future.from(Async.callback(f));
        })
        .static("delay", function (f, t) {
            return t._Future.from(Async.delay(f));
        })
        .static("node", function (f, t) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return t._Future.from(Async.callback(function (cb) {
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
            _Future: function (async, f, t) {
                return t._Future.from(async.mbind(function (res) {
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
            _Future: function (async, f, t) {
                return t._Future.from(async.mbind(function (res) {
                    return Either.destructure()
                        .Left(function (err) {
                            return Async.mreturn(Left.from(err));
                        })
                        .Right(function (val) {
                            /* Call f with value and then pluck out the inner async to return */
                            return t.destructure()._Future(function (inner) {
                                return inner;
                            })(f(val));
                        })(res);
                }));
            }
        })
        .implements("handleE", {
            _Future: function (async, f, t) {
                return t._Future.from(async.mbind(function (res) {
                    return Either.destructure()
                        .Left(function (err) {
                            // Unpack the cont task for the async
                            return t.destructure()
                                ._Future(_.id)(f(err));
                        })
                        .Right(function (v) {
                            return Async.mreturn(Right.from(v));
                        })(res);
                }));
            }
        })
        .implements("resumeE", {
            _Future: function (async, errorTask, t) {
                return t._Future.from(async).handleE(_.constant(errorTask));
            }
        })
        .implements("$", {
            _Future: function (async, cb) {
                async.$(cb);
            }
        });
}(
    require("./algebraic"),
    require("./core"),
    require("./either").Either,
    require("./either").Left,
    require("./either").Right,
    require("./async").Async
));