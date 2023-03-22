import {
	$body
} from "../utils/globals.js"

$('.js-nav-trigger').on("click", (e) => {
	e.preventDefault();
	$body.toggleClass('min-aside')
	setTimeout(function() {
		$('.js-slider .slider__media-slides').slick('setPosition');
		$('.js-slider .slider__content-slides').slick('setPosition');
	}, 300);
})