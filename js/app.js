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

var planfeedApp = angular.module ('planfeedApp', [
  'ngRoute',
  'ngResource',
  'ngAnimate',
  'planfeedControllers',
  'planfeedFilters',
  'planfeedServices'
]);


planfeedApp.config(['$routeProvider',function($routeProvider) {
	$routeProvider.when('/meeting/:meetingId/acta', {
		templateUrl: 'partials/acta-meeting.html',
		controller: 'ActaCtrl'
	}).when('/meeting/:meetingId', {
		templateUrl: 'partials/general-view.html',
		controller: 'PlanfeedGeneralCtrl'
	}).when('/meeting', {
		templateUrl: 'partials/new-meeting.html',
		controller: 'NewMeetingCtrl'
	}).when('/', {
		templateUrl: 'partials/main.html',
		controller: 'MainCtrl'
	}).otherwise({
		redirectTo: '/'
	});
	
}]); 

