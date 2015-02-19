module.exports = (function () {
    "use strict";
    function id(x) { return x; }

    function reduce(f, acc, coll) {
        var i = 0,
            len = coll.length;
        for (i; i < len; i += 1) {
            acc = f(acc, coll[i]);
        }
        return acc;
    }

    function map(f, coll) {
        return reduce(function (acc, item) {
            return acc.concat(f(item));
        }, [], coll);
    }

    function toList(listy) {
        return map(id, listy);
    }

    function first(l) { return l[0]; }
    function rest(l) { return l.slice(1); }

    function partial() {
        var partArgs = toList(arguments),
            f = first(partArgs),
            parts = rest(partArgs);
        return function () {
            return f.apply(null, parts.concat(toList(arguments)));
        };
    }

    function curryN(n, f) {
        return function () {
            var applied = toList(arguments);
            return applied.length >= n ?
                    f.apply(null, applied) :
                    curryN(n - applied.length, partial.apply(null, [f].concat(applied)));
        };
    }

    function curry(f) {
        if (f.length === 0) {
            throw "Cannot curry variadic or void input function.";
        }
        return curryN(f.length, f);
    }
    return {
        partial: partial,
        curry: curry,
        curryN: curry(curryN),
        toList: toList,
        first: first,
        rest: rest,
        head: first,
        tail: rest
    };
}());
