/**
 * @for generator-django-axiacore
 */

var gulp        = require('gulp');
var compass     = require('gulp-compass');
var plumber     = require('gulp-plumber');
var livereload  = require('gulp-livereload');
var coffee      = require('gulp-coffee');
var git         = require('gulp-git');
var bump        = require('gulp-bump');
var filter      = require('gulp-filter');
var tag_version = require('gulp-tag-version');

var plumber_options = {
    errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }
};

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */
function inc(importance) {
    return gulp.src(['./package.json', './bower.json'])
        .pipe(bump({type: importance}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit('bumps package version'))
        .pipe(filter('package.json'))
        .pipe(tag_version());
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });

var compass_options = {
    config_file : 'app/static/config.rb',
    css         : 'app/static/css',
    sass        : 'app/static/sass',
    image       : 'app/static/img',
    font        : 'app/static/fonts',
    bundle_exec : true,
    sourcemap   : true
};


gulp.task('compile', function() {
    return gulp.src('app/static/sass/*.sass')
        .pipe(plumber(plumber_options))
        .pipe(compass(compass_options))
        .pipe(livereload());
});

gulp.task('coffee', function() {
    return gulp.src('app/static/coffeescript/*.coffee')
        .pipe(plumber(plumber_options))
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest('app/static/js'));
});

gulp.task('watch', function() {
    livereload.listen();

    // When a sass file is changed compile and reload
    gulp.watch('app/static/sass/*.sass', ['compile']);

    // When a js file is changed reload
    gulp.watch('app/static/js/**/*').on('change', livereload.changed);

    // When a django template is changed reload
    gulp.watch('*/templates/**/*').on('change', livereload.changed);

    // Generate JavaScript on file change.
    gulp.watch('app/static/coffeescript/*.coffee', ['coffee']);

});

gulp.task('default', [
  'compile',
  'coffee',
  'watch'
]);
