'use strict';

var planfeedFilters = angular.module('planfeedFilters', []);

planfeedFilters.filter('mmssFormat', function() {
	return function(input){
		var out="";
		var minutes = Math.floor(input/60);
		var seconds = input-minutes*60;
		if(minutes<10){
			minutes="0"+minutes.toString();
		}
		if (seconds<10){
			seconds="0"+seconds.toString();
		}
		out = minutes + ":" + seconds;
		return out;
	};
});

planfeedFilters.filter('HHmmssFormat', function() {
	return function(input){
		var out="";
		var hours = Math.floor(input/3600);
		input= input-hours*3600;
		var minutes = Math.floor(input/60);
		var seconds = input-minutes*60;
		if(hours<10){
			hours="0"+hours.toString();
		}
		if(minutes<10){
			minutes="0"+minutes.toString();
		}
		if(seconds<10){
			seconds="0"+seconds.toString();
		}
		out = hours + ":" + minutes + ":" + seconds;
		return out;
	};
});