import { BufferLoader } from "./bufferloader";

$(function () {
	var allPButtons = document.querySelectorAll('.input_fileexistence');
	for (let i = 0; i < allPButtons.length; i++) {
		allPButtons[i].innerHTML = ` <a href="#" class="btn-ico btn-ico--blue btn-ico--play btn-ico--big">
		<svg width="18px" height="24px">
			<path fill-rule="evenodd"
				d="M16.639,10.388 L2.423,0.694 C2.203,0.545 1.958,0.470 1.713,0.470 C1.467,0.470 1.222,0.545 1.002,0.694 C0.562,0.995 0.291,1.549 0.291,2.149 L0.291,21.535 C0.291,22.136 	0.562,22.690 1.002,22.990 C1.222,23.139 1.467,23.215 1.713,23.215 C1.958,23.215 2.203,23.140 2.423,22.990 L16.639,13.297 C17.079,12.997 17.350,12.443 17.350,11.842 	C17.350,11.242 17.079,10.688 16.639,10.388 Z">
			</path>
		</svg>
		</a>`;
	}
});

let $pressedElement = $('.input_fileexistence');

$pressedElement.on('click', (e) => {
	console.log("Let us check!!!!", e.delegateTarget.innerHTML == ` <a href="#" class="btn-ico btn-ico--blue btn-ico--play btn-ico--big">
	<svg width="18px" height="24px">
		<path fill-rule="evenodd"
			d="M16.639,10.388 L2.423,0.694 C2.203,0.545 1.958,0.470 1.713,0.470 C1.467,0.470 1.222,0.545 1.002,0.694 C0.562,0.995 0.291,1.549 0.291,2.149 L0.291,21.535 C0.291,22.136 	0.562,22.690 1.002,22.990 C1.222,23.139 1.467,23.215 1.713,23.215 C1.958,23.215 2.203,23.140 2.423,22.990 L16.639,13.297 C17.079,12.997 17.350,12.443 17.350,11.842 	C17.350,11.242 17.079,10.688 16.639,10.388 Z">
		</path>
	</svg>
	</a>`);

	e.delegateTarget.innerHTML = ` <a href="#" class="btn-ico btn-ico--blue btn-ico--play btn-ico--big">
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px" height="24px">
			<path fill-rule="evenodd"
				d="M14.242,23.209 L14.242,0.464 L19.929,0.464 L19.929,23.209 L14.242,23.209 ZM0.026,0.464 L5.713,0.464 L5.713,23.209 L0.026,23.209 L0.026,0.464 Z">
			</path>
		</svg> 
	</a>`;
	e.preventDefault();
	var ImgSrc = e.delegateTarget.previousElementSibling.querySelector("img").src.slice(0, -3);
	const index = ImgSrc.lastIndexOf("/");
	var mp3Src = ImgSrc.substring(index + 1) + "mp3";
	handleFiles(mp3Src);
});

var rafID = null;
var analyser = null;
var c = null;
var cDraw = null;
var ctx = null;
var microphone = null;
var ctxDraw = null;

var loader;
var filename;
var fileChosen = false;
var hasSetupUserMedia = false;

//handle different prefix of the audio context
var AudioContext = window.AudioContext || window.webkitAudioContext;
//create the context.
var context = new AudioContext();

//using requestAnimationFrame instead of timeout...
if (!window.requestAnimationFrame)
	window.requestAnimationFrame = window.webkitRequestAnimationFrame;

$(function () {
	"use strict";
	loader = new BufferLoader();
	initBinCanvas();
});

function handleFiles(mp3Src) {
	fileChosen = true;
	setupAudioNodes();
	const filePath1 = "../../assets/audio/" + mp3Src;
	const fileURL = new URL(filePath1, window.location.href).href;
	var request = new XMLHttpRequest();

	request.addEventListener("progress", updateProgress);
	request.addEventListener("load", transferComplete);
	request.addEventListener("error", transferFailed);
	request.addEventListener("abort", transferCanceled);

	request.open('GET', fileURL, true);
	request.responseType = 'arraybuffer';
	// When loaded decode the data
	request.onload = function () {
		// decode the data
		context.decodeAudioData(request.response, function (buffer) {

			// when the audio is decoded play the sound
			sourceNode.buffer = buffer;
			sourceNode.start(0);
			$("#freq, body").addClass("animateHue");
			//on error
		}, function (e) {
			console.log(e);
		});
	};
	request.send();
	$("button, input").prop("disabled", true);
}


// progress on transfers from the server to the client (downloads)
function updateProgress(oEvent) {
	if (oEvent.lengthComputable) {
		$("button, input").prop("disabled", true);
		var percentComplete = oEvent.loaded / oEvent.total;
		console.log("Loading music file... " + Math.floor(percentComplete * 100) + "%");
		$("#loading").html("Loading... " + Math.floor(percentComplete * 100) + "%");
	} else {
		// Unable to compute progress information since the total size is unknown
		console.log("Unable to compute progress info.");
	}
}

function transferComplete(evt) {
	console.log("The transfer is complete.");
	$("#loading").html("");
	//$("button, input").prop("disabled",false);
}

function transferFailed(evt) {
	console.log("An error occurred while transferring the file.");
	$("#loading").html("Loading failed.");
	$("button, input").prop("disabled", false);
}

function transferCanceled(evt) {
	console.log("The transfer has been canceled by the user.");
	$("#loading").html("Loading canceled.");
}

function initBinCanvas() {

	//add new canvas
	"use strict";
	c = document.getElementById("freq");
	c.width = window.innerWidth;
	c.height = window.innerHeight;
	//get context from canvas for drawing
	ctx = c.getContext("2d");

	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	window.addEventListener('resize', onWindowResize, false);

	//create gradient for the bins
	var gradient = ctx.createLinearGradient(0, c.height - 300, 0, window.innerHeight - 25);
	gradient.addColorStop(1, '#00f'); //black
	gradient.addColorStop(0.75, '#f00'); //red
	gradient.addColorStop(0.25, '#f00'); //yellow
	gradient.addColorStop(0, '#ffff00'); //white

	ctx.fillStyle = "#9c0001";
}

function onWindowResize() {
	ctx.canvas.width = window.innerWidth;
	ctx.canvas.height = window.innerHeight;

	var containerHeight = $("#song_info_wrapper").height();
	var topVal = $(window).height() / 2 - containerHeight / 2;
	$("#song_info_wrapper").css("top", topVal);
	console.log(topVal);

	if ($(window).width() <= 500) {
		//TODO: not yet working
		$("#title").css("font-size", "40px");
	}
}

var audioBuffer;
var sourceNode;
function setupAudioNodes() {
	audioBuffer = null;
	// setup a analyser
	analyser = context.createAnalyser();
	// create a buffer source node
	sourceNode = context.createBufferSource();
	//connect source to analyser as link
	sourceNode.connect(analyser);
	// and connect source to destination
	sourceNode.connect(context.destination);
	//start updating
	rafID = window.requestAnimationFrame(updateVisualization);
}


function reset() {
	if (typeof sourceNode !== "undefined") {
		sourceNode.stop(0);
	}
}


function updateVisualization() {

	// get the average, bincount is fftsize / 2
	if (fileChosen || hasSetupUserMedia) {
		var array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(array);

		drawBars(array);
	}
	// setTextAnimation(array);


	rafID = window.requestAnimationFrame(updateVisualization);
}

function drawBars(array) {

	//just show bins with a value over the treshold
	var threshold = 0;
	// clear the current state
	ctx.clearRect(0, 0, c.width, c.height);
	//the max count of bins for the visualization
	var maxBinCount = array.length;
	//space between bins
	var space = 3;

	ctx.save();


	ctx.globalCompositeOperation = 'source-over';

	ctx.scale(0.5, 0.5);
	ctx.translate(window.innerWidth, window.innerHeight);
	ctx.fillStyle = "#fff";

	var bass = Math.floor(array[1]); //1Hz Frequenz 
	var radius = 0.45 * $(window).width() <= 450 ? -(bass * 0.25 + 0.45 * $(window).width()) : -(bass * 0.25 + 450);

	var bar_length_factor = 1;
	if ($(window).width() >= 785) {
		bar_length_factor = 1.0;
	}
	else if ($(window).width() < 785) {
		bar_length_factor = 1.5;
	}
	else if ($(window).width() < 500) {
		bar_length_factor = 20.0;
	}
	// console.log($(window).width());
	//go over each bin
	for (var i = 0; i < maxBinCount; i++) {

		var value = array[i];
		if (value >= threshold) {
			//draw bin
			//ctx.fillRect(0 + i * space, c.height - value, 2 , c.height);
			//ctx.fillRect(i * space, c.height, 2, -value);
			ctx.fillRect(0, radius, $(window).width() <= 450 ? 2 : 3, -value / bar_length_factor);
			ctx.rotate((180 / 128) * Math.PI / 180);
		}
	}

	for (var i = 0; i < maxBinCount; i++) {

		var value = array[i];
		if (value >= threshold) {

			//draw bin
			//ctx.fillRect(0 + i * space, c.height - value, 2 , c.height);
			//ctx.fillRect(i * space, c.height, 2, -value);
			ctx.rotate(-(180 / 128) * Math.PI / 180);
			ctx.fillRect(0, radius, $(window).width() <= 450 ? 2 : 3, -value / bar_length_factor);
		}
	}

	for (var i = 0; i < maxBinCount; i++) {

		var value = array[i];
		if (value >= threshold) {

			//draw bin
			//ctx.fillRect(0 + i * space, c.height - value, 2 , c.height);
			//ctx.fillRect(i * space, c.height, 2, -value);
			ctx.rotate((180 / 128) * Math.PI / 180);
			ctx.fillRect(0, radius, $(window).width() <= 450 ? 2 : 3, -value / bar_length_factor);
		}
	}

	ctx.restore();
}

//function setTextAnimation(array)
//{
//    var bass = Math.floor(array[1]); //4Hz Frequenz
//
//
//    var fontSize = bass * 0.25 + 50;
//
//    ctx.save();
//    ctx.globalCompositeOperation='destination-over';
//    ctx.fillStyle = "#fff";
//    ctx.filter = "blur(16px)";
//
//    var neueFontsize = 70;
//    if (fontSize > neueFontsize) {
//        neueFontsize = fontSize;
//    }
//
//    //ctx.font = neueFontsize.toString() + "px Arial";
//    if (navigator.userAgent.indexOf("Chrome/53.0.2764.0") > -1) { //besserer Look in Chrome Canary
//        console.log("Chrome Canary User Agent detected");
//        ctx.font="normal normal 300 350px Roboto";
//        if (filename !== undefined) {
//            ctx.fillText(filename, 0, c.height - 200);
//        }
//    }
//    ctx.filter = "blur(0px)";
//    //ctx.font="normal normal 100 " + neueFontsize.toString() + "px Roboto";
//    ctx.font="normal normal 100 70px Roboto";
//    if (filename !== undefined) {
//        ctx.fillText(filename, window.innerWidth / 2 - 125, c.height / 2);
//    }
//    ctx.restore();
//}
