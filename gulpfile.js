var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');

var rollup = require('rollup');
var rollupJSON  = require('rollup-plugin-json');
var rollupBabel = require('rollup-plugin-babel');

gulp.task('build', function () {
    return rollup.rollup({
        entry: 'src/public/scripts/main.js',
        plugins: [ rollupJSON(), rollupBabel() ]
    }).then(function (bundle) {
        bundle.write({
            format: "cjs",
            dest: "./dist/public/scripts/bundle.js",
            sourceMap: true
        });
    });
});

gulp.task('copy:input', function () {
    return gulp.src([
        'src/public/index.html',
        'src/public/sw.js'
    ], {
        base: 'src'
    }).pipe(gulp.dest('dist'));
});

gulp.task('clean:output', function () {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('default', runSequence('clean:output', ['copy:input', 'build']));