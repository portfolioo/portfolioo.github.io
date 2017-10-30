$(document).ready(function() {

$(".hamburger").click(function(){
		$(this).toggleClass("is-active");
		$(".header-menu").slideToggle();
	});


});

// $(window).on('load',function(){
// 	$('.preloader').delay(1000).fadeOut('slow');
// })