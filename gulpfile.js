var gulp = require('gulp');
    htmlmin = require('gulp-htmlmin');
    htmlclean = require('gulp-htmlclean');
// 压缩 public 目录内 html
gulp.task('minify-html', function() {
  return gulp.src('./public/**/*.html')
    .pipe(htmlclean())
    .pipe(htmlmin({
        removeComments: true,//清除 HTML 注释
        collapseWhitespace: true,//压缩 HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除 <script> 的 type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除 <style> 和 <link> 的 type="text/css"
        minifyJS: true,//压缩页面 JS
        minifyCSS: true//压缩页面 CSS
    }))
    .pipe(gulp.dest('./public'))
});
gulp.task('default', [
    'minify-html'
]);
