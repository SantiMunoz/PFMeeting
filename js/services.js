'use strict';

var baseURL = 'http://localhost:8080/PlanFeedAPI/api/';
var planfeedServices = angular.module('planfeedServices', ['ngResource', 'ngRoute']);

planfeedServices.factory('Mock', ['$resource',
  function($resource){
    return $resource('meetings/:meetingId.json', {}, {
      query: {method:'GET', params:{meetingId:'meetingEmpty'}, isArray:false}
    });
  }]);


planfeedServices.factory('Meeting', function($http){

    var planFeedAPI = {};

    planFeedAPI.get=function(meetingId){
      return $http.get(baseURL+'meetings/'+meetingId);
    }

    planFeedAPI.getUrlActa=function(meetingId){
      return baseURL+'meetings/'+meetingId+'/acta';
    }

    planFeedAPI.put=function(meeting){
      return $http.put(baseURL+'meetings',meeting);
    }
    planFeedAPI.putStatus=function(meetingId,status){
      return $http.put(baseURL+'meetings/'+new String(meetingId)+'/status', status,{headers: {'Content-Type':'text/plain'}});
    }
    return planFeedAPI;
  });

