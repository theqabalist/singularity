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
            stat = {},
            abstract = false,
            t,
            typeKeywords = ["abstract", "implements", "static"],
            conditionAbstract = function (t) {
                var type = t[typeName],
                    cluster = _.pick(typeKeywords, t);
                cluster[typeName] = _.omit(["destructure"], type);

                return abstract ? cluster : t;
            },
            constructorFactory = function (subtypeName) {
                /*jslint unparam: true*/
                var args = _.rest(_.toList(arguments)),
                    s = _.reduce(function (inst, stSize, stName) {
                        inst["is" + stName] = stName === subtypeName;
                        return inst;
                    }, _.reduce(function (base, implSpec, implName) {
                        var specMethod = implSpec[subtypeName],
                            implMethod = specMethod ?
                                    _.partialRight(_.partial.apply(null, [specMethod].concat(args)), t) :
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
                var typeSpec = abstract ? {} : _.reduce(function (type, subtypeSize, subtypeName) {
                    var builder = _.partial(constructorFactory, subtypeName);
                    type[subtypeName] = {
                        from: subtypeSize > 0 ? _.curryN(subtypeSize, builder) : builder
                    };
                    return type;
                }, {}, subtypes),
                    newType = _.compose(conditionAbstract, buildConstructors);

                typeSpec.implements = function (key, spec) {
                    impls[key] = spec;
                    return newType();
                };

                typeSpec.static = function (key, impl) {
                    stat[key] = _.partialRight(impl, t);
                    return newType();
                };

                typeSpec.abstract = function () {
                    abstract = true;
                    return newType();
                };

                typeSpec[typeName] = _.reduce(function (t, methodImpl, methodName) {
                    t[methodName] = methodImpl;
                    return t;
                }, {
                    destructure: buildDestructure
                }, stat);

                return typeSpec;
            };

        t = buildConstructors();

        return conditionAbstract(t);
    }
    return {
        data: data
    };
}(require("./core")));