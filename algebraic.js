module.exports = (function (_) {
    "use strict";
    function noSuchImplementation(type, method) {
        throw "No implementation for " + method + " on type " + type;
    }
    function data(typeName, subtypes) {
        var impls = {},
            fromBuilder = function (subtypeName) {
                /*jslint unparam: true*/
                var args = _.rest(_.toList(arguments)),
                    s = _.reduce(function (inst, stSize, stName) {
                        inst["is" + stName] = stName === subtypeName;
                        return inst;
                    }, _.reduce(function (base, implSpec, implName) {
                        var specMethod = implSpec[subtypeName],
                            implMethod = specMethod ?
                                    _.partial(specMethod, args) :
                                    _.partial(noSuchImplementation, subtypeName, implName);
                        base[implName] = implMethod;
                        return base;
                    }, {
                        val: function (f) { return f.apply(null, args); }
                    }, impls), subtypes);
                /*jslint unparam: false*/
                s["is" + typeName] = true;
                return s;
            },
            buildConstructors = function () {
                var cs = _.reduce(function (type, subtypeSize, subtypeName) {
                    var builder = _.partial(fromBuilder, subtypeName);
                    type[subtypeName] = {
                        from: subtypeSize > 0 ? _.curryN(subtypeSize, builder) : builder
                    };
                    return type;
                }, {}, subtypes);

                cs.implements = function (key, spec) {
                    impls[key] = spec;
                    return buildConstructors();
                };

                return cs;
            },
            t = buildConstructors();

        return t;
    }
    return {
        data: data
    };
}(require("./core")));