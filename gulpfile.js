var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');

var rollup = require('rollup');
var rollupJSON  = require('rollup-plugin-json');
var rollupBabel = require('rollup-plugin-babel');
var rollupHtml = require('rollup-plugin-html');

gulp.task('build', function () {
    return rollup.rollup({
        entry: 'src/public/scripts/app.js',
        plugins: [ 
            rollupHtml({
                include: [
                    'src/public/components/**/*.html',
                    './toast.html'
                ]
            }),
            rollupJSON(), 
            rollupBabel({
                presets: [
                    [
                        'es2015-rollup'
                    ]
                ]
            })
        ]
    }).then(function (bundle) {
        bundle.write({
            format: "cjs",
            dest: "./dist/public/scripts/app.js",
            sourceMap: true
        });
    });
});

gulp.task('copy', function () {
    return merge(
        gulp.src([
            'src/public/scripts/lib/*.js',
            'src/public/index.html',
            'src/public/sw.js'
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist')), gulp.src([
            'node_modules/webcomponentsjs/full.js'
        ])
        .pipe(gulp.dest('dist/public/scripts/lib/'))
    );
});

gulp.task('clean:output', function () {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('default', function () {
    return runSequence('clean:output', ['build', 'copy']);
});