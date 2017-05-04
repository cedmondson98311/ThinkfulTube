if(location.href.indexOf('?') < 0){
	window.location = location.href + '?';
}

//global variables
var googleEndpoint = "https://www.googleapis.com/youtube/v3/search";
var userQuery = '';
var videoImageHTML = '';
var nextPageToken = '';
	
//API Functions
function getInitialAPIData(searchTerm,callback) {
	var settings = {
		part: 'snippet',
		key: 'AIzaSyASvfSIkuHPH8YG2lcxX9I1DColaBwq8CM',
		q: searchTerm,
	}
	var response = $.getJSON(googleEndpoint,settings,callback);

	console.log(response)
	$.getJSON(googleEndpoint,settings,callback);
};

function getNextAPIData(searchTerm,spTerm,callback) {
	var settings = {
		part: 'snippet',
		key: 'AIzaSyASvfSIkuHPH8YG2lcxX9I1DColaBwq8CM',
		q: searchTerm,
		pageToken: spTerm
	}
	$.getJSON(googleEndpoint,settings,callback);
};

function getChannelAPIData(channel,callback) {
	videoImageHTML = '';
	var settings = {
		part: 'snippet',
		key: 'AIzaSyASvfSIkuHPH8YG2lcxX9I1DColaBwq8CM',
		channelId: channel
	}
	$.getJSON(googleEndpoint,settings,callback);
}

//state modification functions
function useAPIData(data) {
	nextPageToken = data.nextPageToken;
	$.each(data.items, function(i,imgURL) {
		var channelID = this.snippet.channelId;
		var channelTitle = this.snippet.channelTitle;
		var videoTitle = this.snippet.title;
		var URL = this.snippet.thumbnails.medium.url;
		var videoLink = this.id.videoId;
		//reverse conditional; this says that if URL contains a profile img
		//or channel img instead of a video img, then do nothing
		if(URL.includes('hq1.jpg') || URL.includes('photo.jpg') || URL.includes('mq1.jpg')) {}
		else {videoImageHTML +='<div class="video-container col-4"><p class="video-title">' + videoTitle + '</p><a href=\"https://www.youtube.com/watch?v=' + videoLink + 
			'\"><img src=\"' + URL + '\"></a><p class="channel-title">Channel: ' + channelTitle + '</p><button class="more-from-channel-button" channel=\"' + channelID + 
			'\">See Only Videos From This Channel</button></div>'}
	});
	$('.js-search-results').html(videoImageHTML);
};

//event listeners
$(function() {
	$('.js-search-form').submit(function() {
		videoImageHTML = '';
		userQuery = $('.js-search-query').val();
		getInitialAPIData(userQuery,useAPIData);
		//$('.search-box').addClass('hidden');
		$('.js-next-button').removeClass('hidden');
		$('.js-restart-search').removeClass('hidden');
	});
	
	$('.js-next-button').on('click', function() {
		getNextAPIData(userQuery,nextPageToken,useAPIData);
	});

	$('.js-search-results').on('click', '.more-from-channel-button', function() {
		var channelID = $(this).attr('channel');
		getChannelAPIData(channelID,useAPIData);
	});
});
