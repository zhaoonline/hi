var gulp = require('gulp'),
    gutil = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    // js
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    // scss
    sass = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    // html
    ejs = require('gulp-ejs'),
    htmlmin = require('gulp-htmlmin'),
    // images
    imagemin = require('gulp-imagemin'),
    // concat
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename');

var paths = {
    src: {
        js: './src/js/*.js',
        scss: './src/scss/*.scss',
        ejs: './src/*.ejs',
        img: './src/img/*',
        fonts: './src/fonts/*'
    },
    dist: {
        js: './dist/js',
        css: './dist/css',
        html: './dist',
        img: './dist/img',
        fonts: './dist/fonts'
    }
};

// js
gulp.task('js', function (done) {
    return gulp.src(paths.src.js)
        .pipe(sourcemaps.init())
        .pipe(jshint.reporter('default'))
        .pipe(concat('hi.js'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dist.js))
        .pipe(reload({stream: true}))
        .pipe(notify({message: 'Script task complete'}));
});

// scss to css
gulp.task('scss', function(done) {
    return gulp.src(paths.src.scss)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(reload({stream: true}))
        .pipe(notify({message: 'Style task complete'}));
});

// ejs to html
gulp.task('ejs', function (done) {
    return gulp.src(paths.src.ejs)
        .pipe(ejs({}, {ext: '.html'}).on('error', gutil.log))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest(paths.dist.html))
        .pipe(reload({stream: true}))
        .pipe(notify({message: 'Html task complete'}));
});

// images
gulp.task('img', function(){
    return gulp.src(paths.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.img))
        .pipe(reload({stream: true}))
        .pipe(notify({message: 'Image task complete'}));
});

// fonts
gulp.task('fonts', function(){
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dist.img))
        .pipe(reload({stream: true}))
        .pipe(notify({message: 'Fonts task complete'}));
});

// clean
gulp.task('clean', function() {
    return gulp.src([paths.dist.js, paths.dist.css, paths.dist.img, paths.dist.html], {read: false})
        .pipe(clean());
});

// build
gulp.task('build', ['ejs', 'scss', 'js', 'img', 'fonts']);

// watch
gulp.task('watch', function() {
   	gulp.watch(paths.src.js, ['js']);
  	gulp.watch(paths.src.scss, ['scss']);
    gulp.watch(paths.src.ejs, ['ejs']);
    gulp.watch(paths.src.img, ['img']);
    gulp.watch(paths.src.fonts, ['fonts']);
});

// serve
gulp.task('serve', ['ejs', 'scss', 'js', 'img', 'fonts', 'watch'], function () {
    browserSync.init(null, {
        server: {
            baseDir: 'dist',
            directory: true
        },
        debugInfo: true,
        open: true
    }, function (err, bs) {
        // require('opn')(bs.options.urls.local);
        console.log('Started connect web server on ' + JSON.parse(JSON.stringify(bs.options)).urls.local);
    });
});

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

