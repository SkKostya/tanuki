'use strict';

var gulp         = require('gulp'), // Подключаем Gulp
	sass         = require('gulp-sass'), //Подключаем Sass пакет,
	browserSync  = require('browser-sync'), // Подключаем Browser Sync
	concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
	uglify       = require('gulp-uglifyjs'), // Подключаем gulp-uglifyjs (для сжатия JS)
	imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
	pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
	autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src('src/scss/main.scss') // Берем источник
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('public/css')) // Выгружаем результата в папку public/css
		.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'public' // Директория для сервера - public
		},
		notify: false // Отключаем уведомления
	});
});

gulp.task('scripts', function() {
	return gulp.src([ // Берем все необходимые библиотеки
		    'src/js/**/*.js' // Берем JS
		])
		.pipe(concat('main.min.js')) // Собираем их в кучу в новом файле main.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('public/js')); // Выгружаем в папку public/js
});

gulp.task('img', function() {
	return gulp.src('src/images/**/*') // Берем все изображения из public
    .pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))/**/)
		.pipe(gulp.dest('public/images')); // Выгружаем на продакшен
});

gulp.task('build', ['img', 'sass', 'scripts'], function() {
    
	var buildCss = gulp.src([ // Переносим библиотеки в продакшен
		'src/css/main.css'
		])
	.pipe(gulp.dest('public/css'))
    
	var buildFonts = gulp.src('src/fonts/**/*') // Переносим шрифты в продакшен
	.pipe(gulp.dest('public/fonts'))

	var buildJs = gulp.src('src/js/**/*') // Переносим скрипты в продакшен
	.pipe(gulp.dest('public/js'))
    
});

gulp.task('clear', function (callback) {
	return cache.clearAll();
})

gulp.task('watch', ['browser-sync', 'scripts'], function() {
    gulp.watch('src/scss/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch('public/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('src/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('default', ['watch']);