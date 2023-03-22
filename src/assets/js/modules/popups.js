import {
	$body
} from "../utils/globals.js"


let $popupsBtns = $('.js-show-popup');

export let updatePopupsBtns = () => {
	$popupsBtns = $('.js-show-popup')

	$popupsBtns
	.unbind('click')
	.on("click", (e) => {
		e.preventDefault();
		let $this = $(e.currentTarget);

		let content = loadAjax($this.attr('href'));
		
		$body.append(`
			<div class="popup">
				<a href="#" class="popup__close js-close-popup">
					<img
						src="assets/images/icos/ico-x.png" 
						srcset="assets/images/icos/ico-x.png 1x, assets/images/icos/ico-x@2x.png 2x"
						alt="ico-x"
					>
				</a>

				<div class="popup__content">
					${content}
				</div><!-- /.popup__content -->

				<a href="#" class="popup__overlay js-close-popup"></a><!-- /.popup__overlay -->
			</div><!-- /.popup -->
		`)

		$body.addClass('is-popup-visible');

		$('.js-close-popup').on('click', (e) => {
			e.preventDefault();
			$body.removeClass('is-popup-visible');

			setTimeout(function() {
				$body.find('.popup').remove();
			}, 400);
			
		})
	})
};


updatePopupsBtns();

function loadAjax(filePath) {
    return $.ajax({
        async: false,
        global: false,
        url: filePath,
    }).responseText;
}