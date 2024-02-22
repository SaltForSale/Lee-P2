// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (/* function */ callback, /* DOMElement */ element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
	requestAnimFrame(animate);
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() {
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source

	if (mCurrentIndex >= mImages.length) {
		mCurrentIndex = 0;
	}
	if (mCurrentIndex < 0) {
		mCurrentIndex = mImages.length - 1;
	}

	document.getElementById('photo').src = mImages[mCurrentIndex].img;
	let location = document.getElementsByClassName('location')[0];
	location.innerHTML = "Location: " + mImages[mCurrentIndex].location;
	//change location
	let description = document.getElementsByClassName('description')[0];
	description.innerHTML = "Description: " + mImages[mCurrentIndex].description;
	//change description
	let date = document.getElementsByClassName('date')[0];
	date.innerHTML = "Date: " + mImages[mCurrentIndex].date;
	//change date
	mLastFrameTime = 0;
	mCurrentIndex += 1;

	//with a new image from your images array which is loaded 
	//from the JSON string
	console.log('swap photo');
}

// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = 'extra.json';


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function (e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready(function () {

	// This initially hides the photos' metadata information
	//$('.details').eq(0).hide();
	fetchJSON(mUrl);

});

window.addEventListener('load', function () {

	console.log('window loaded');

}, false);

function GalleryImage() {
	//implement me as an object to hold the following data about an image:
	//1. location where photo was taken
	var location;
	//2. description of photo
	var description;
	//3. the date when the photo was taken
	var date;
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
	var img;
}

function fetchJSON(mUrl) {

	mRequest.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var mJson = JSON.parse(mRequest.responseText);
			console.log(mJson);
			iterateJSON(mJson);

		} else {
			console.log('We connected to the server but returned an error')
		}

	}
	mRequest.open('GET', mUrl)
	mRequest.send()
}
function iterateJSON(mJson) {
	for (x = 0; x < mJson.images.length; x++) {
		mImages[x] = new GalleryImage();
		mImages[x].location = mJson.images[x].imgLocation;
		mImages[x].description = mJson.images[x].description;
		mImages[x].date = mJson.images[x].date;
		mImages[x].img = mJson.images[x].imgPath;
	}
}

$('.moreIndicator').on('click', function () {
	if ($('.moreIndicator').hasClass("rot90")) {
		$('.moreIndicator').removeClass("rot90");
		$('.moreIndicator').addClass("rot270");
		$('.details').slideToggle();

	} else {
		$('.moreIndicator').removeClass("rot270");
		$('.moreIndicator').addClass("rot90");
		$('.details').slideToggle();
	}
})

$('#nextPhoto').position({
	my: 'right',
	at: 'right',
	of: '#nav'
});


// Click handler for navigating to the next photo
$('#nextPhoto').click(function () {
	swapPhoto()
});


// Click handler for navigating to the previous photo
$('#prevPhoto').click(function () {
	mCurrentIndex = mCurrentIndex - 2;
	swapPhoto()
});