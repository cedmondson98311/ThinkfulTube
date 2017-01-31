$(function() {
	var googleURL = "https://www.googleapis.com/youtube/v3/search";
	var videoImageHTML = '';

	function getAPIData(searchTerm,callback) {
		var settings = {
			part: 'snippet',
			key: 'AIzaSyASvfSIkuHPH8YG2lcxX9I1DColaBwq8CM',
			q: searchTerm
		}
		$.getJSON(googleURL,settings,callback);
	};

	function useAPIData(data) {
		$.each(data.items, function(i,imgURL) {
			var URL = this.snippet.thumbnails.high.url;
			//reverse conditional; line 19 says that if URL contains a profile img
			//or channel img instead of a video img, then do nothing
			if(URL.includes('hq1.jpg') || URL.includes('photo.jpg')) {}
			else {videoImageHTML +='<div><img src=\"' + URL + '\"></div>';}
		});
		$('.js-search-results').html(videoImageHTML);
	};

	$('.js-search-form').submit(function() {
		videoImageHTML = '';
		var userQuery = $('.js-search-query').val();
		getAPIData(userQuery,useAPIData);
	})
});