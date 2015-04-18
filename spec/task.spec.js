/*global
    describe: true,
    it: true,
    expect: true
*/
describe("Task", function () {
    "use strict";
    var Task = require("../lib/task").Task,
        Either = require("../lib/either").Either,
        _ = require("../lib/core"),
        eitherValue = Either.destructure().Left(_.id).Right(_.id);
    describe("#mreturn", function () {
        it("should produce a right either during callback", function (done) {
            Task.mreturn(5).$(function (r) {
                expect(r.isRight).toEqual(true);
                done();
            });
        });
    });
    describe("#fail", function () {
        it("should produce a left with an error", function (done) {
            Task.fail(5).$(function (r) {
                expect(r.isLeft).toEqual(true);
                done();
            });
        });
        it("should propagate through", function (done) {
            Task.fail(5).map(function (x) { return x + 1; })
                .$(function (r) {
                    expect(r.isLeft).toEqual(true);
                    done();
                });
        });
    });
    describe("#handleE", function () {
        it("should do nothing in the case of success", function (done) {
            Task.mreturn(5).handleE(_.constant(Task.mreturn(4)))
                .$(function (r) {
                    expect(r.isRight).toEqual(true);
                    expect((eitherValue(r)))
                        .toEqual(5);
                    done();
                });
        });
        it("should offer the chance to correct errors on failure", function (done) {
            Task.fail(5).handleE(_.constant(Task.mreturn(4)))
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
            Task.mreturn(5).resumeE(Task.mreturn(4))
                .$(function (r) {
                    expect(r.isRight).toEqual(true);
                    expect(eitherValue(r)).toEqual(5);
                    done();
                });
        });
        it("should return the value from the passed task in the case of failure", function (done) {
            Task.fail(5).resumeE(Task.mreturn(4))
                .$(function (r) {
                    expect(r.isRight).toEqual(true);
                    expect(eitherValue(r)).toEqual(4);
                    done();
                });
        });
    });
});