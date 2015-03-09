module.exports = (function () {
    "use strict";

    function id(x) { return x; }

    function reduceObj(f, acc, obj) {
        var i;
        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                acc = f(acc, obj[i], i);
            }
        }
        return acc;
    }

    function reduceArray(f, acc, arr) {
        var i = 0,
            len = arr.length;
        for (i; i < len; i += 1) {
            acc = f(acc, arr[i], i);
        }
        return acc;
    }

    function isObject(x) { return typeof x === "object"; }
    function isArray(x) {
        return isObject(x) && x instanceof Array;
    }

    function reduce(f, acc, coll) {
        return isArray(coll) ? reduceArray(f, acc, coll) : reduceObj(f, acc, coll);
    }

    function map(f, coll) {
        return reduce(function (acc, item) {
            var val = f(item);
            val = isArray(val) ? [val] : val;
            return acc.concat(val);
        }, [], coll);
    }

    /*jslint unparam: true*/
    function keys(obj) {
        return reduce(function (acc, value, key) {
            return acc.concat(key);
        }, [], obj);
    }
    /*jslint unparam: false*/

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

    function partialRight() {
        var partArgs = toList(arguments),
            f = first(partArgs),
            parts = rest(partArgs);
        return function () {
            return f.apply(null, toList(arguments).concat(parts));
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

    function property(x, h) {
        return h[x];
    }

    function isFunction(x) {
        return typeof x === "function";
    }

    function multi(curryOrder) {
        var methods = [],
            other = function () {
                var args = toList(arguments);
                throw "No predicate matches inputs: " + args;
            },
            method,
            otherwise;

        function buildMethod() {
            var doCurry = curryOrder ? partial(curryN, curryOrder) : id,
                newMethod = doCurry(function () {
                    var args = toList(arguments),
                        result = reduce(function (acc, item) {
                            var pred = item[0],
                                g = item[1],
                                res = pred.apply(null, args);

                            if (!acc.match && res && !isFunction(res)) {
                                acc.value = g.apply(null, args);
                                acc.match = true;
                            }
                            return acc;
                        }, {value: undefined, match: false}, methods);
                    return result.match ? result.value : other.apply(null, args);
                });
            newMethod.method = method;
            newMethod.otherwise = otherwise;
            return newMethod;
        }

        otherwise = function (f) {
            other = f;
            return buildMethod();
        };

        method = function (pred, f) {
            methods.push([pred, f]);
            return buildMethod();
        };

        return buildMethod();
    }

    function contains(needle, haystack) {
        return reduce(function (acc, item) {
            return acc || needle === item;
        }, false, haystack);
    }

    function pick(fields, obj) {
        return reduce(function (acc, item, key) {
            if (contains(key, fields)) {
                acc[key] = item;
            }
            return acc;
        }, {}, obj);
    }

    function omit(fields, obj) {
        return reduce(function (acc, item, key) {
            if (!contains(key, fields)) {
                acc[key] = item;
            }
            return acc;
        }, {}, obj);
    }

    function compose2(f, g) {
        return function () {
            return f(g.apply(null, arguments));
        };
    }

    function last(xs) {
        return xs[xs.length - 1];
    }

    function initial(xs) {
        return xs.slice(0, -1);
    }

    function compose() {
        var fs = toList(arguments),
            entry = last(fs),
            chain = initial(fs).reverse();

        return reduce(function (composed, f) {
            return compose2(f, composed);
        }, entry, chain);
    }

    function merge(a, b) {
        return reduce(function (obj, val, key) {
            obj[key] = val;
            return obj;
        }, a, b);
    }

    function flatten(a) {
        return reduce(function (acc, a) {
            return acc.concat(a);
        }, [], a);
    }

    return {
        partial: partial,
        partialRight: partialRight,
        constant: function (x) { return function () { return x; }; },
        curry: curry,
        curryN: curry(curryN),
        toList: toList,
        first: first,
        rest: rest,
        head: first,
        tail: rest,
        multi: multi,
        map: curry(map),
        keys: keys,
        id: id,
        this: function () { return this; },
        property: curry(property),
        reduce: curry(reduce),
        pick: curry(pick),
        omit: curry(omit),
        contains: curry(contains),
        compose: compose,
        last: last,
        initial: initial,
        merge: merge,
        flatten: flatten
    };
}());
