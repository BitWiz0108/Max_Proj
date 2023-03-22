/*	Custom Scroll */
import 'jquery-mousewheel';
import 'malihu-custom-scrollbar-plugin';


$(window).on('load', () =>{
	$(".js-scroll-hor").mCustomScrollbar({
		axis:"x",
		advanced:{
			autoExpandHorizontalScroll:true
		}
	});
})		