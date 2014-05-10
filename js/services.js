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

//var baseURL = 'http://pfmeeting.com/api/';
var baseURL ='http://localhost:8080/PlanFeedAPI/api/'
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
      var antiCached=new Date().getTime();
      return $http.get(baseURL+'meetings/'+meetingId+"/?cache="+antiCached);
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

planfeedServices.factory('GoogleService', function($http){
  
  var googleService={};

  googleService.postToken=function(code){
    return  $http.post(baseURL+'googlerest/token', code,{headers: {'Content-Type':'text/plain'}});
  }
  return googleService;

  });
