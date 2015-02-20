module.exports = (function (_) {
    "use strict";
    function noSuchImplementation(type, method) {
        throw "No implementation for " + method + " on type " + type;
    }

    function noSuchPattern(type) {
        throw "Destructure has no pattern for " + type;
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
            buildDestructure = function () {
                var dimpls = {};
                function buildMethod() {
                    var names = _.keys(subtypes),
                        method = _.reduce(function (m, name) {
                            return m.method(_.property("is" + name), function (x) {
                                var impl = dimpls[name] || _.partial(noSuchPattern, name);
                                return x.val(impl);
                            });
                        }, _.multi(), names);

                    method = _.reduce(function (m, name) {
                        m[name] = function (f) {
                            dimpls[name] = f;
                            return buildMethod();
                        };
                        return m;
                    }, method, names);

                    return method;
                }

                return buildMethod();
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

                cs[typeName] = {
                    destructure: buildDestructure
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