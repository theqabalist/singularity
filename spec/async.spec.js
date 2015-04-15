/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Async", function () {
    "use strict";
    var Async = require("../lib/async").Async;
    describe("#mreturn", function () {
        it("should create an immediate structure", function () {
            expect(Async.mreturn(5).isImmediate).toEqual(true);
        });
    });
    describe("#$", function () {
        it("should immediately call the response for points", function (done) {
            Async.mreturn(5).$(function (a) {
                expect(a).toEqual(5);
                done();
            });
        });
        it("should execute delayed event for Callbacks", function (done) {
            Async.callback(function (cb) {
                setTimeout(function () {
                    cb(42);
                }, 0);
            }).$(function (a) {
                expect(a).toEqual(42);
                done();
            });
        });
        it("should handle bind functions correctly", function (done) {
            Async.mreturn(5).mbind(function (x) {
                return Async.callback(function (cb) {
                    cb(x + 1);
                });
            }).$(function (a) {
                expect(a).toEqual(6);
                done();
            });
        });
    });
});