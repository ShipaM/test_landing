$(function() {//функция срабатывает после загузки страницы

	// Custom JS
	//banner__slide
	$('.banner').slick();


	//bannerЬ__slide
	$('.bannerM__js').slick({
		slidesToShow: 1,
		slidesToScroll: 1,
		prevArrow: ".bannerM__navigation_prev",
		nextArrow: ".bannerM__navigation_next"
	});
});
