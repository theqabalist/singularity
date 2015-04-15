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
    describe("#listen", function () {
        it("should immediately call the response for points", function (done) {
            Async.mreturn(5).$(function (a) {
                expect(a).toEqual(5);
                done();
            });
        });
    });
});