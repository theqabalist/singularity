(function (browserify, gulp, source, buffer, uglify, sourcemaps, jslint, jscs, jshint) {
    "use strict";
    function getBundleName() {
        var version = require("./package.json").version,
            name = require("./package.json").name;
        return name + "." + version + "." + "min";
    }

    var sources = ["*.js", "spec/*.js"];

    gulp.task("jslint", function () {
        return gulp
            .src(sources)
            .pipe(jslint({
                nomen: true,
                node: true
            }))
            .on("error", function (error) {
                console.error(String(error));
            });
    });

    gulp.task("jscs", function () {
        return gulp
            .src(sources)
            .pipe(jscs());
    });

    gulp.task("jshint", function () {
        return gulp
            .src(sources)
            .pipe(jshint())
            .pipe(jshint.reporter("fail"));
    });

    gulp.task("style", ["jslint", "jscs", "jshint"]);

    gulp.task("default", function () {
        var bundler = browserify({
            entries: ["./index.js"],
            debug: true
        });

        function bundle() {
            return bundler
                .bundle()
                .pipe(source(getBundleName() + ".js"))
                .pipe(buffer())
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(uglify())
                .pipe(sourcemaps.write("./"))
                .pipe(gulp.dest("./dist/"));
        }

        return bundle();
    });
}(
    require("browserify"),
    require("gulp"),
    require("vinyl-source-stream"),
    require("vinyl-buffer"),
    require("gulp-uglify"),
    require("gulp-sourcemaps"),
    require("gulp-jslint"),
    require("gulp-jscs"),
    require("gulp-jshint")
));
