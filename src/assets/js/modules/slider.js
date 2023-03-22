/* Slider Gallery */

import 'slick-carousel';

$('.js-slider').each((index, slider) => {
	let $slider = $(slider)
	let $sliderMedia = $slider.find('.slider__media-slides')
	let $sliderContent = $slider.find('.slider__content-slides')

	$sliderMedia.on('init', function(event, slick){
	}).slick({
	  	slidesToShow: 5,
	  	centerPadding: '0',
	  	slidesToScroll: 1,
	  	arrows: false,
	  	centerMode: true,
	  	dots: true,
	  	fade: false,
	  	asNavFor: $sliderContent,
	  	focusOnSelect: true,
	  	responsive: [
	  	    {
	  	      	breakpoint: 1024,
	  	      	settings: {
	  				slidesToShow: 3,
	  	      	}
	  	    },
	  	    {
	  	      	breakpoint: 480,
	  	      	settings: {
	  	        	slidesToShow: 1,
	  	        	centerPadding: '80px',
	  	      	}
	  	    }
	  	]
	}).on('beforeChange', function(event, slick, currentSlide, nextSlide){
	});
	
	$sliderContent.slick({
	  	fade: true,
	  	slidesToShow: 1,
	  	slidesToScroll: 1,
	  	asNavFor: $sliderMedia,
	  	dots: false,
	  	arrows: false,
	});
})