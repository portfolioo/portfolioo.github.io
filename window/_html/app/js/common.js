$(document).ready(function() {

$(".header-nav .hamburger").click(function(){
		$(this).toggleClass("is-active");
		$(".header-menu").slideToggle();
	});

$(".recommend-also .hamburger").click(function(){
		$(this).toggleClass("is-active");
		$(".content-menu").slideToggle();
	});

		
	$('.window-color li').click(function(){            //функция выбора цвета окон
		$('.window-color li').each(function(i,elem) {
			if ($(this).hasClass("cheked")) {			
				$(this).removeClass("cheked");
			} 
		});
		$(this).addClass( "cheked" );

	});	


 var showComent = $('.show-coment');
 var more = $('.more');
    
showComent.click(function(event) {
    event.preventDefault();
    var n = $(this).parent().index();
    n -=2;
	if(more.eq(n).is(':visible')) {
		    more.eq(n).fadeOut(500);
			$(this).text('прочитать полностью');
	} else {
			more.eq(n).fadeIn(500);
			$(this).text('Скрыть');
		}
 	});
     
     
		
	
	
	
});

// $(window).on('load',function(){
// 	$('.preloader').delay(1000).fadeOut('slow');
// })