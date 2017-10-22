var gulp           = require('gulp'),						// Подключаем Gulp
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),				//Подключаем Sass пакет
		browserSync    = require('browser-sync'),			// Подключаем Browser Sync
		concat         = require('gulp-concat'),			// Подключаем gulp-concat (для конкатенации файлов)
		uglify         = require('gulp-uglify'),			// Подключаем gulp-uglifyjs (для сжатия JS)
		cleanCSS       = require('gulp-clean-css'),			
		rename         = require('gulp-rename'),			// Подключаем библиотеку для переименования файлов
		del            = require('del'),					// Подключаем библиотеку для удаления файлов и папок
		imagemin       = require('gulp-imagemin'),			// Подключаем библиотеку для работы с изображениями
		cache          = require('gulp-cache'),				// Подключаем библиотеку кеширования
		autoprefixer   = require('gulp-autoprefixer'),		// Подключаем библиотеку для автоматического добавления префиксов
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify");

// Скрипты проекта

gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/bootstrap/js/bootstrap.min.js',
		'app/js/common.min.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

gulp.task('sass', function() {                    // Создаем таск Sass
	return gulp.src('app/sass/**/*.sass')         // Берем источник
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))  // Преобразуем Sass в CSS посредством gulp-sass
	.pipe(rename({suffix: '.min', prefix : ''}))  
	.pipe(autoprefixer(['last 15 versions']))      // Создаем префиксы
	.pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/css'))                    // Выгружаем результата в папку app/css
	.pipe(browserSync.reload({stream: true}));     // Обновляем CSS на странице при изменении
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);
	gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['removedist', 'imagemin', 'sass', 'js'], function() {

	var buildFiles = gulp.src([
		'app/*.html',
		'app/.htaccess',
		]).pipe(gulp.dest('dist'));

	var buildCss = gulp.src([
		'app/css/main.min.css',
		]).pipe(gulp.dest('dist/css'));

	var buildJs = gulp.src([
		'app/js/scripts.min.js',
		]).pipe(gulp.dest('dist/js'));

	var buildFonts = gulp.src([
		'app/fonts/**/*',
		]).pipe(gulp.dest('dist/fonts'));

});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'hostname.com',
		user:      'username',
		password:  'userpassword',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/path/to/folder/on/server'));

});

gulp.task('removedist', function() { return del.sync('dist'); });
gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);
