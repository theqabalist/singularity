var util = require("util");
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
            t = {},
            typeKeywords = ["abstract", "implements", "static"],
            conditionAbstract = function (t) {
                var type = t[typeName],
                    cluster = _.pick(typeKeywords, t);
                cluster[typeName] = _.omit(["destructure"], type);

                return abstract ? cluster : t;
            },
            constructor = function (subtypeName) {
                /*jslint unparam: true*/
                var args = _.rest(_.toList(arguments)),
                    s = _.reduce(function (inst, stSize, stName) {
                        inst["is" + stName] = stName === subtypeName;
                        return inst;
                    }, _.reduce(function (base, implSpec, implName) {
                        var specMethod = implSpec[subtypeName],
                            implMethod = specMethod ?
                                    _.partialRight(_.partial.apply(base, [specMethod].concat(args)), t) :
                                    _.partial(noSuchImplementation, subtypeName, implName);
                        base[implName] = implMethod;
                        return base;
                    }, {
                        val: function (f) { return f.apply(null, args); },
                        type: t[typeName]
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
                var typeSpec = _.reduce(function (type, subtypeSize, subtypeName) {
                    var builder = _.partial(constructor, subtypeName);
                    type[subtypeName] = {
                        from: subtypeSize > 0 ? _.curryN(subtypeSize, builder) : builder
                    };
                    return type;
                }, {}, subtypes);

                typeSpec[typeName] = _.reduce(function (t2, methodImpl, methodName) {
                    t2[methodName] = methodImpl;
                    return t2;
                }, {
                    destructure: buildDestructure
                }, stat);

                typeSpec.implements = function (key, spec) {
                    impls[key] = spec;
                    t = buildConstructors();
                    return conditionAbstract(t);
                };

                typeSpec.static = function (key, impl) {
                    stat[key] = _.partialRight(impl, typeSpec);
                    t = buildConstructors();
                    return conditionAbstract(t);
                };

                typeSpec.abstract = function () {
                    abstract = true;
                    t = buildConstructors();
                    return conditionAbstract(t);
                };

                return _.merge(typeSpec, typeSpec[typeName]);
            };

        t = buildConstructors();

        return conditionAbstract(t);
    }
    return {
        data: data,
        monad: {
            lift: function (f, t) { return t.mreturn(_.curry(f)); },
            map: function () {
                var args = _.toList(arguments),
                    t = _.last(args),
                    f = _.last(_.initial(args));
                return this.mbind(function (t1) {
                    return t.mreturn(f(t1));
                });
            },
            ap: function () {
                var args = _.toList(arguments),
                    t = _.last(args),
                    m = _.last(_.initial(args));
                return this.mbind(function (f) {
                    return m.mbind(function (t1) {
                        return t.mreturn(f(t1));
                    });
                });
            }
        }
    };
}(require("./core")));