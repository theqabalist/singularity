(function (browserify, gulp, source, buffer, uglify, sourcemaps) {
    "use strict";
    function getBundleName() {
        var version = require("./package.json").version,
            name = require("./package.json").name;
        return name + "." + version + "." + "min";
    }

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
    require("gulp-sourcemaps")
));

