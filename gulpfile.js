 var gulp = require("gulp");

 var plugins = require("gulp-load-plugins")();


 gulp.task('styles', function() {
  return plugins.rubySass('./app/styles/main.scss', { compass: true, style : 'expanded' })
  .pipe(gulp.dest('dist/css'))
  .pipe(plugins.connect.reload());
});



 gulp.task('templates',function(){
  return gulp.src(['app/scripts/templates/jsx/alert.jsx',
    'app/scripts/templates/jsx/stats.jsx',
    'app/scripts/templates/jsx/app.jsx'
    ])
  .pipe(plugins.concat('templates.js'))
  .pipe(plugins.react())
  .pipe(gulp.dest('dist/templates'))
  .pipe(plugins.connect.reload());
})


 gulp.task('scripts',['templates'],function() {
  return gulp.src([
    //  order matters!
    'app/scripts/lib/jquery-2.1.3.min.js',
    'app/scripts/lib/react-with-addons-0.13.1.js',
    'app/scripts/common/common.js'])
  .pipe(plugins.concat('main.js'))
  .pipe(plugins.rename({suffix:'.min'}))
  .pipe(gulp.dest('dist/js'))
  .pipe(plugins.connect.reload());
});


 gulp.task('html',function(){
  return gulp.src('app/index.html')
  .pipe(plugins.htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('dist'))
  .pipe(plugins.connect.reload());
});


 gulp.task('clean', function() {

  return gulp.src(['dist/**'], {read: false})
  .pipe(plugins.clean());

});


gulp.task('default',['clean'], function() {

  return gulp.start('templates', 'styles', 'scripts','html','connect','watch');

});


 gulp.task('connect', function() {
  plugins.connect.server({basePath: './',
    root: 'dist',
    port:'1324',
    livereload: true
  });
});
 

 gulp.task('watch',['connect'], function() {

  // Watch .scss files

  gulp.watch('app/styles/**/*.scss',['styles']);

  // Watch .jsx files

  gulp.watch('app/scripts/templates/**/*.jsx',['templates']);

  // Watch .js files

  gulp.watch('app/scripts/**/*.js',['scripts']);


  // Watch .html file

  gulp.watch('app/index.html',['html']);

});










// deployment specific tasks

gulp.task('deploy-styles', function() {
  return plugins.rubySass('./app/styles/main.scss', { compass: true, style : 'compressed' })
  .pipe(plugins.stripCssComments())
  .pipe(plugins.minifyCss())
  .pipe(gulp.dest('deploy/app/css'))
});

gulp.task('deploy-server',function(){
  return gulp.src('server/webservices.js')
  .pipe(plugins.stripDebug())
  .pipe(plugins.uglify())
  .pipe(gulp.dest('deploy/server'));
})


gulp.task('deploy-templates',function(){
  return gulp.src(['app/scripts/templates/jsx/alert.jsx',
    'app/scripts/templates/jsx/stats.jsx',
    'app/scripts/templates/jsx/app.jsx'
    ])
  .pipe(plugins.concat('templates.js'))
  .pipe(plugins.react())
  .pipe(plugins.stripDebug())
  .pipe(plugins.uglify())
  .pipe(gulp.dest('deploy/app/templates'));
});


gulp.task('deploy-scripts',['deploy-templates'],function() {
  return gulp.src([
    //  order matters!
    'app/scripts/lib/jquery-2.1.3.min.js',
    'app/scripts/lib/react-with-addons-0.13.1.js',
    'app/scripts/common/common.js'])
  .pipe(plugins.concat('main.js'))
  .pipe(plugins.stripDebug())
  .pipe(plugins.rename({suffix:'.min'}))
  .pipe(plugins.uglify())
  .pipe(gulp.dest('deploy/app/js'));
});


gulp.task('deploy-html',function(){
  return gulp.src('app/index.html')
  .pipe(plugins.htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('deploy/app'));
});


gulp.task('deploy-clean', function() {

  return gulp.src(['deploy/**/*'], {read: false})
  .pipe(plugins.clean());

});


gulp.task('deploy',['deploy-clean'],function(){

  return gulp.start('deploy-templates', 'deploy-styles', 'deploy-scripts','deploy-html','deploy-server');

});


