import {
	$body
} from "../utils/globals.js"

/* Set Active State */

$('.nav li').each((index, item) => {
	let $item = $(item);

	if ($item.attr("data-id") == $body.attr('data-active-page')) {
		$item.addClass("is-active")
	}
})