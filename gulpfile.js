const syntax        = 'sass'; // Syntax: sass or scss;
      gulpversion   = '4'; // Gulp version: 3 or 4

const gulp            = require('gulp')// Подключаем Gulp; require [ri'kwaie] включение или подключение
/*Данной строчкой мы подключаем Gulp к нашему проекту,
посредством функции require. Данная функция подключает
пакеты из папки node_modules в наш проект, присваивая их
переменной. В данном случае, мы создаем переменную gulp.*/
const uglify          = require('gulp-uglify');//минифицирование js файлов
const concat 					= require('gulp-concat'); //склеивает файлы;
const sass         		= require('gulp-sass');//подключаем  gulp-sass
const imagemin        = require('gulp-imagemin'); //оптимизация изображений
const clean           = require('gulp-clean'); //удаляет файл или папку
const shell           = require('gulp-shell');//очередность запуска
const browserSync 		= require ('browser-sync');//локальный сервер
const reload  				= browserSync.reload; //перезагрузка сервера
const notify          = require('gulp-notify');//отслеживание ошибок
const autoprefixer    = require('gulp-autoprefixer');//автоматически добавляет автопрефиксы
const runSequence = require('run-sequence'); //запускает задачи по очереди

//Создаем миниархитектуру путей
const path = {//создаем переменную path (путь)
	src: {
		html: [
			'app/*.html'
		],

		styles: [
			'app/'+syntax+'/**/*.'+syntax+''
		],

		js: [//!!! в той последовательности в которой подключали их!!!
			'app/libs/jquery/dist/jquery.min.js',
      'app/libs/slick-carousel/slick/slick.min.js',
			'app/js/common.js'
		],

		fonts: 'app/fonts/**/*',

		images: 'app/img/**/*'
	},
	dist: {//корневая папка назначения
		js: 'dist/js/',// путь выгрузки js
		css: 'dist/css/',//путь выгрузки css
		html: 'dist',//путь выгрузки html
		fonts: 'dist/fonts/',
		img: 'dist/img/'
	}
}

/* Создаем таск js который, объединяет, 
 минифицирует, улучшает и складывает все файлы и библиотеки js в
 отдельный файлик main.js*/
gulp.task('js', function() {
  return gulp.src(path.src.js)// 1.Берем все необходимые файлы и библиотеки
  	.pipe(uglify())//2.минифицируем их
  	.pipe(concat('main.js'))//3.конкатенируем(соединяем их)
  	.pipe(gulp.dest(path.dist.js))//4.Выгружаем полученный результат
  	//в папку назначения в нашем случае это пака js внутри папки dist
  	.pipe(reload({stream: true}));//3. Перезагрузка тех файлов за которыми мы следим
});

/* Создаем таск styles который, объединяет, 
 минифицирует, улучшает и складывает все файлы и библиотеки sass в
 отдельный файлик main.css*/
 gulp.task('styles', function() {
    return gulp.src(path.src.styles)// 1.Берем все необходимые файлы и библиотеки
    	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
    	.pipe(autoprefixer(['last 15 versions']))//автоматическое добавление автопрефиксов
      .pipe(gulp.dest(path.dist.css))//Выгружаем полученный результат
    	//в папку назначения в нашем случае это пака css внутри папки dist
    	.pipe(reload({stream: true}));//3. Перезагрузка тех файлов за которыми мы следим
});

/* Создаем таск html который, переносит наш файл в папку продакшена dist*/
gulp.task('html', function() {
  return gulp.src(path.src.html)// 1.Берем файл index.html
  	.pipe(gulp.dest(path.dist.html))//2.Выгружаем полученный результат
  	.pipe(reload({stream: true}));//3. Перезагрузка тех файлов за которыми мы следим
});

/* Создаем таск fonts который, переносит наши файлы со шрифтами в папку продакшена dist*/
gulp.task('fonts', function() {
  return gulp.src(path.src.fonts)// 1.Берем файлы со шрифтами
    .pipe(gulp.dest(path.dist.fonts));//2.Выгружаем полученный результат в папку fonts
    // внутри папки dist
});

/* Создаем таск images который, объединяет, 
 минифицирует, улучшает и складывает картинки форматов 'svg' 'png' 'jpg' и 'gif'в
 папку images в папке dist */
gulp.task('images', function() {
  return gulp.src(path.src.images)//берем файлы скартинками 
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
  ], 
  {
    verbose: true//показывает насколько сжались картинки
  }
  )
  )
  .pipe(gulp.dest(path.dist.img))//выгружает результат в папку назначения dist
});

/* Создаем таск clean который, удаляет папку dist*/
gulp.task('clean', function() {
    return gulp.src('dist')//1. берем папку dist 
      .pipe(clean());//2.удаляем ее
});

/* Создаем task dist с пакетом shell который
 задает последовательность выполнения задач*/
gulp.task('dist', shell.task([
    'gulp clean',//1. запускаем удаление папки продакшена
    'gulp images',//2. запускаем task images
    'gulp html',//3. запускаем task html
    'gulp fonts',//4. запускаем task fonts
    'gulp styles',//5. запускаем task css
    'gulp js'//6. запускаем task js
    ]) 
);



// Создаем таск browser-sync
gulp.task('browser-sync',  function() {
    browserSync({// Выполняем browserSync
        startPath: "/",
        server: {// Определяем параметры сервера
          baseDir: "dist"// Директория для сервера - dist
        },
        notify: false//отключаем уведомления  notify ['noutifai'] уведомление, уведомлять;
        // open: false,
        // online: false, // Work Offline Without Internet Connection
        // tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
    });
});



/* Создаем таск watch для старой версии gulp который отработает если
выполнится условие  (gulpversion == 3). Он будет мониторить файловую систему 
и обновлять браузер при изменении в файлах*/
if (gulpversion == 3) {
  gulp.task('server', function() {
    runSequence('dist', 'browser-sync', 'watch');//последовательность выполнения задач
  });

  gulp.task('watch',  function() {
    gulp.watch([//!!! в той последовательности в которой подключали их!!!
      'app/libs/jquery/dist/jquery.min.js',
      'app/libs/slick-carousel/slick/slick.min.js',
      'app/js/common.js'
    ], ['js']);
    gulp.watch('app/'+syntax+'/**/*.'+syntax+'', ['styles']);
    gulp.watch('app/*.html', ['html']);
    
  });
  //Создаем таск 'default'
  gulp.task('default', ['server']);
}

/* Создаем таск watch для новой версии gulp который отработает если
выполнится условие  (gulpversion == 4). Он будет мониторить файловую систему 
и обновлять браузер при изменении в файлах*/
if (gulpversion == 4) {
  gulp.task('watch', function() {
    gulp.watch([//!!! в той последовательности в которой подключали их!!!
      'app/libs/jquery/dist/jquery.min.js',
      'app/libs/slick-carousel/slick/slick.min.js',
      'app/js/common.js'], gulp.parallel('js'));
    gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
    gulp.watch('app/*.html', gulp.parallel('html'));
  });
  //Создаем таск 'default'
  gulp.task('default', gulp.parallel('dist','browser-sync','watch'));
}
