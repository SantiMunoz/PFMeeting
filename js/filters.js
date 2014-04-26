/*Copyright 2014 Santi Muñoz Mallofre

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */
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