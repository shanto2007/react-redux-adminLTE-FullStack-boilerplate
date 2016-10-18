const gulp = require('gulp')
const cssmin = require('gulp-cssmin')
const sass = require('gulp-sass')
const path = require('path')
const concat = require('gulp-concat')

const Assets = {
  scss: path.join(__dirname, 'src/styles'),
}

gulp.task('sass', () => {
  return gulp.src(`${Assets.scss}/public.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssmin())
    .pipe(gulp.dest('./public/css'))
})

gulp.task('vendors_styles', () => {
  return gulp.src([
    'node_modules/foundation-sites/dist/foundation.min.css',
  ])
  .pipe(concat('vendors.css'))
  .pipe(gulp.dest('./public/css'))
})

gulp.task('default', ['sass', 'vendors_styles'])

gulp.task('watch', () => {
  return gulp.watch(`${Assets.scss}/**/*.scss`, ['sass'])
})
