/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Future", function () {
    "use strict";
    var Future = require("../lib/future").Future,
        Either = require("../lib/either").Either,
        _ = require("../lib/core"),
        eitherValue = Either.destructure().Left(_.id).Right(_.id);
    describe("#mreturn", function () {
        it("should produce a right either during callback", function (done) {
            Future.mreturn(5).$(function (r) {
                expect(r.isRight).toEqual(true);
                done();
            });
        });
    });
    describe("#fail", function () {
        it("should produce a left with an error", function (done) {
            Future.fail(5).$(function (r) {
                expect(r.isLeft).toEqual(true);
                done();
            });
        });
        it("should propagate through", function (done) {
            Future.fail(5).map(function (x) { return x + 1; })
                .$(function (r) {
                    expect(r.isLeft).toEqual(true);
                    done();
                });
        });
    });
    describe("#handleE", function () {
        it("should do nothing in the case of success", function (done) {
            Future.mreturn(5).handleE(_.constant(Future.mreturn(4)))
                .$(function (r) {
                    expect(r.isRight).toEqual(true);
                    expect((eitherValue(r)))
                        .toEqual(5);
                    done();
                });
        });
        it("should offer the chance to correct errors on failure", function (done) {
            Future.fail(5).handleE(_.constant(Future.mreturn(4)))
                .$(function (r) {
                    expect(r.isRight).toEqual(true);
                    expect(eitherValue(r))
                        .toEqual(4);
                    done();
                });
        });
    });
    describe("#resumeE", function () {
        it("should do nothing in the case of success", function (done) {
            Future.mreturn(5).resumeE(Future.mreturn(4))
                .$(function (r) {
                    expect(r.isRight).toEqual(true);
                    expect(eitherValue(r)).toEqual(5);
                    done();
                });
        });
        it("should return the value from the passed Future in the case of failure", function (done) {
            Future.fail(5).resumeE(Future.mreturn(4))
                .$(function (r) {
                    expect(r.isRight).toEqual(true);
                    expect(eitherValue(r)).toEqual(4);
                    done();
                });
        });
    });
});