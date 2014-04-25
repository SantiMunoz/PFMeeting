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

