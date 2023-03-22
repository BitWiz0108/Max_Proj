/*	Player  */

import {
	$body,
	$window
} from "../utils/globals.js"

import {
	loadAjax
} from "./ajax.js"

import {
	updatePopupsBtns
} from './popups.js'

let $player = $('.player');
let $playerBtnPrev = $player.find('.js-btn-p-prev');
let $playerBtnNext = $player.find('.js-btn-p-next');
let $playerBtnFullScreen = $player.find('.js-full-screen');
let $playerSlides = $player.find('.player__scroll');
let $playerDemoFullScreen = $player.find('.player__media video');
let $playerVideoFullScreen = $player.find('.fullscreen-video video');
let $playerVideoContent = $player.find('.player__media-content');
let $playerFooterMedia = $player.find('.widget__media img');
let $playerFooterContent = $player.find('.widget__content');
let $widgetProgress = $player.find('.widget__progress');
let $playerContentArea = $player.find('.js-append-content');
let $playerVolume = $player.find('.js-volume');
let $playerList = $player.find('.js-play-list');
let setTimeline;
let data = loadAjax($player.attr('data'));

let timeline = ($video) => {
	let durTime = $video[0].duration
	let curTime = $video[0].currentTime

	setTimeline = setInterval(() =>{ 
		$widgetProgress.css("--progress", ($video[0].currentTime / $video[0].duration)*100 )
	}, 100);
}


let appendContent = (data) => {
	jQuery.each( data, function( i, item ) {
		let title = item.title;
		let autor = item.autor;
		let live = item.liveDate;
		let previewVideoPath = item.previewVideo;
		let fullVideoPath = item.fullVideo;
		let articleImagePath = item.articleImagePath;
		let popupContent = item.popupContent;

		$playerContentArea.append(`
			<div class="player__cell">
				<article 
					class="article"
					data-index="${i}"
				>
					<a href="#" class="article__media">
						<img src="${articleImagePath}" alt="article image">
				
						<span class="btn-ico btn-ico--blue btn-ico--play btn-ico--big js-full-screen"><!-- is-played -->
							<svg 
								xmlns="http://www.w3.org/2000/svg"
								xmlns:xlink="http://www.w3.org/1999/xlink"
								width="18px" height="24px">
								<path fill-rule="evenodd" d="M16.639,10.388 L2.423,0.694 C2.203,0.545 1.958,0.470 1.713,0.470 C1.467,0.470 1.222,0.545 1.002,0.694 C0.562,0.995 0.291,1.549 0.291,2.149 L0.291,21.535 C0.291,22.136 	0.562,22.690 1.002,22.990 C1.222,23.139 1.467,23.215 1.713,23.215 C1.958,23.215 2.203,23.140 2.423,22.990 L16.639,13.297 C17.079,12.997 17.350,12.443 17.350,11.842 	C17.350,11.242 17.079,10.688 16.639,10.388 Z"/>
							</svg>
				
							<svg 
							 	xmlns="http://www.w3.org/2000/svg"
							 	xmlns:xlink="http://www.w3.org/1999/xlink"
							 	width="20px" height="24px">
								<path fill-rule="evenodd" d="M14.242,23.209 L14.242,0.464 L19.929,0.464 L19.929,23.209 L14.242,23.209 ZM0.026,0.464 L5.713,0.464 L5.713,23.209 L0.026,23.209 L0.026,0.464 Z"/>
							</svg>
						</span>
					</a ><!-- /.article__media -->
				
					<div class="article__content">
						<h2>${title}</h2>
						<p>${autor} <span>*LIVE ${live}</span></p>
				
						<a href="${popupContent}" class="js-show-popup">
							<img src="assets/images/icos/ico-dots.svg" alt="icos">
						</a>
					</div><!-- /.article__content -->
				</article><!-- /.article -->
			</div>
		`);

		$playerBtnFullScreen = $player.find('.js-full-screen');
	})

	updatePopupsBtns();
}

let playListProgress = (active, length) => {
	$playerList.css('--progress', active/length*100 )
}


if ( $player.hasClass('js-player-streams') ){
	appendContent(data);

	$player.find('.article .article__media').on('click', (e) => {
		e.preventDefault();
		let $article = $(e.currentTarget).parent();
		let $articleMedia = $(e.currentTarget);
		let articleIndex = $article.attr('data-index')


		if ($articleMedia.parent().hasClass("is-active")) {
			return;
		}

		$articleMedia.parent().addClass('is-active').parent().siblings().find('article').removeClass('is-active');
		playListProgress(+articleIndex+1, data.length)

		//Update Videos
		$playerDemoFullScreen.attr('src', data[articleIndex].previewVideo)[0].play();
		$playerVideoFullScreen.attr('src', data[articleIndex].fullVideo)

		//Content Update 
		$playerVideoContent.find("h1").html(data[articleIndex].title)
		$playerVideoContent.find("h4").html(data[articleIndex].autor)
		$playerVideoContent.find("h5").html('NEXT LIVE STREAM ' + data[articleIndex].liveDate)

		//Footer Content Update 
		$playerFooterContent.find("h4").html(data[articleIndex].title)
		$playerFooterContent.find("h6").html(` ${data[articleIndex].autor}<span>*LIVE  ${data[articleIndex].liveDate}</span>`)
		$playerFooterMedia.attr('src', data[articleIndex].articleImagePath)

		clearInterval(setTimeline);
		timeline($playerDemoFullScreen);
	}).eq(0).trigger('click')
}

$playerBtnFullScreen.on('click', (e) => {
	e.preventDefault();
	$player.toggleClass('is-full-screen')
	$playerBtnFullScreen.toggleClass('is-played')
	$body.toggleClass('min-aside')

	clearInterval(setTimeline);
	timeline($playerVideoFullScreen);
	
	if ($playerBtnFullScreen.hasClass('is-played')) {
		$playerVideoFullScreen[0].play();

		updateVolume(20);
	}else {
		$playerVideoFullScreen[0].pause()
		updateVolume(0);
	}
})

$playerBtnPrev.on('click', (e) => {
	e.preventDefault();
	
	let $prevSlide = $playerSlides.find('.article.is-active').parent().prev()
	
	if (!!$prevSlide.length) {
		$playerSlides.find('.article.is-active').parent().prev().find('.article .article__media').trigger('click')

		if ($playerBtnFullScreen.hasClass('is-played')) {
			$playerVideoFullScreen[0].play()
		}
	}
})

$playerBtnNext.on('click', (e) => {
	e.preventDefault();
	
	let $nextSlide = $playerSlides.find('.article.is-active').parent().next()
	
	if (!!$nextSlide.length) {
		$playerSlides.find('.article.is-active').parent().next().find('.article .article__media').trigger('click')

		if ($playerBtnFullScreen.hasClass('is-played')) {
			$playerVideoFullScreen[0].play()
		}
	}
})


$playerVolume.each((index, volume) => {
	let $volume = $(volume);
	let startValue = $volume.parent('.progress-ico').css('--progress');

	$volume
		.toggleClass('muted', startValue < 1 )
		.find('.volume__slider').slider({
			orientation: "vertical",
			value: startValue,
			slide: function( event, ui ) {
				let value = ui.value;
		        $volume.parent('.progress-ico').css('--progress', value)
		        $volume.toggleClass('muted', value < 1 );

		        $playerVideoFullScreen[0].muted = !value>0;
		        $playerVideoFullScreen[0].volume = value/100;
		        $playerVideoFullScreen.attr("muted", !value>0);
		    },
		    change: function( event, ui ) {
				let value = ui.value;
		        $volume.parent('.progress-ico').css('--progress', value)
		        $volume.toggleClass('muted', value < 1 );

		        $playerVideoFullScreen[0].muted = !value>0;
		        $playerVideoFullScreen[0].volume = value/100;
		        $playerVideoFullScreen.attr("muted", !value>0);
		    }
		});
})

let updateVolume = (value) => {
	$playerVolume.each((index, volume) => {
		$(volume).find('.volume__slider').slider( "value", value );
	})
}


$window.on('load resize', () =>{
	$body.css('--player-height', $player.outerHeight() + "px")
})
