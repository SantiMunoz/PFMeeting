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

/*Controllers*/

var planfeedControllers = angular.module('planfeedControllers', ['ngResource', 'ngRoute','ui.bootstrap']);


planfeedControllers.controller('PlanfeedGeneralCtrl',['$scope', '$routeParams', 'Mock','Meeting','$timeout','$location', function ($scope, $routeParams, Mock,Meeting, $timeout,$location){


	//notificación cuando queden 3 minutos
	var timeToAlert=3;
	var putDnDChange=false;
	var showDate;
	var meeting;
	var getEmptyMeeting = function () { return Mock.query();};
	var getMeeting= function(){
		return Meeting.get($routeParams.meetingId).success(function(response){

			var statusChange=false;
			var dateChange=false;
		if(!angular.equals(response, $scope.meeting)){
			var oldMeeting =angular.copy($scope.meeting);
			if(!angular.equals(response.meetingId,oldMeeting.meetingId)){oldMeeting.meetingId=angular.copy(response.meetingId) }
			if(!angular.equals(response.title,oldMeeting.title)){oldMeeting.title=angular.copy(response.title) }
			if(!angular.equals(response.description,oldMeeting.description)){oldMeeting.description=angular.copy(response.description) }
			if(!angular.equals(response.date,oldMeeting.date)){
				oldMeeting.date=angular.copy(response.date);
				dateChange=true; }
			if(!angular.equals(response.agenda,oldMeeting.agenda)){oldMeeting.agenda=angular.copy(response.agenda); }
			if(!angular.equals(response.init,oldMeeting.init)){oldMeeting.init=angular.copy(response.init) }
			if(!angular.equals(response.pauseDate,oldMeeting.pauseDate)){oldMeeting.pauseDate=angular.copy(response.pauseDate) }
			if(!angular.equals(response.status,oldMeeting.status)){
				oldMeeting.status=angular.copy(response.status);
				statusChange=true;
			}

			$scope.meeting= angular.copy(oldMeeting);
			if(angular.equals("",$scope.meeting.title)){
				$scope.auxTitle="";
				$scope.onFocusTitle=true;
			}else{

				$scope.onFocusTitle=false;
			}

			if(angular.equals("",$scope.meeting.description)){
				$scope.auxDescription="";
				$scope.onFocusDescription=true;

			}else{
				$scope.onFocusDescription=false;
			}
			if($scope.meeting.date == 0){
				$scope.onFocusDate=true;
			}
			if(dateChange){actDate();}
			actAuxAgenda();
			if(statusChange){
				actStatus();
			}	

			if(response.date==0 || response.date==null){
				
				$('#datetimepicker').datetimepicker({

			    	defaultDate: new Date()    	
			    	
			    });
			}else{
				//cridar a una funcio per canviar la data
			}
		}
	}).error(function(response, status){
		$('.ngview').load('partials/error-view.html');
	});
	};

	var putMeeting = function(){Meeting.put($scope.meeting).success(function(response){
		if(!angular.equals(response.agenda, $scope.auxAgenda)){
			$scope.meeting.agenda = angular.copy(response.agenda);
			actAuxAgenda();
		}
		if(putDnDChange){
			putStatus("orderChange");
			putDnDChange=false;

		}

	}).error(function(response, status){
		$('.ngview').load('partials/error-view.html');
	}); 
	}
	var putStatus = function(stat){Meeting.putStatus($routeParams.meetingId,stat ).error(function(response, status){
		$('.ngview').load('partials/error-view.html');
		});
	};
	
	//init functions
	$('#alertReqDiv').hide();
	$scope.meeting = getEmptyMeeting();
	$scope.auxAgenda=[];
	getMeeting();
	refresh();
	reqPermissionOnLoad();


	//ask for notification permission
	function reqPermissionOnLoad(){
		if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
			if(Notification.permission!=="granted" && Notification.permission!=="denied"){
				$('#alertReqDiv').show();
			}
		}else{
			// At first, let's check if we have permission for notification
		 	// If not, let's ask for it
		 	if (Notification && Notification.permission !== "granted") {

		    	Notification.requestPermission(function (status) {
			    	if (Notification.permission !== status) {
			        	Notification.permission = status;
			      	}
		   	 	});
			}
		
		}
	};

	$("#linkNotiPerm").on('click', function (e){
		if (Notification && Notification.permission !== "denied") {
      		Notification.requestPermission(function (status) {
		        if (Notification.permission !== status) {
		          Notification.permission = status;
		        }
		        
		        	$(".alert").alert('close');
		        

		    });
		}

		

	});

	var actAuxAgenda = function(){
		$scope.indexx=0;
		if(!$scope.auxAgenda){
			var auxAgendaLength = 0;
		}else{
			var auxAgendaLength= $scope.auxAgenda.length;
		}
		
		var scopeAgendaLength = $scope.meeting.agenda.length;
		
		for(var i=0;i<scopeAgendaLength; i++){
			if(i<auxAgendaLength){
				if(!angular.equals($scope.auxAgenda[i].pointId,$scope.meeting.agenda[i].pointId )){
					$scope.auxAgenda[i] = $scope.meeting.agenda[i];
				}else{
					if(!angular.equals($scope.auxAgenda[i].comment,$scope.meeting.agenda[i].comment ))
						
						$scope.auxAgenda[i].comment=$scope.meeting.agenda[i].comment;
				}
			}else{
				if(!$scope.auxAgenda){

					$scope.auxAgenda=[$scope.meeting.agenda[i]];
				}else{
					$scope.auxAgenda.push($scope.meeting.agenda[i]);
				}	
			}
		}
		if(auxAgendaLength>scopeAgendaLength){
			for(var i=scopeAgendaLength;i<auxAgendaLength;i++){
				$scope.auxAgenda.splice(i,1);
			}
		}
	
	};

	 var play=false;

	 $scope.getStatus=function(){
	 	return play;
	 }
	var actStatus=function(){
		if(angular.equals($scope.meeting.status, "play")){
			var elapsedTime = Math.round(((new Date()).getTime() - $scope.meeting.init)/1000);
			actPointsDuration(elapsedTime);
			play=true;
			crono();
		}else if(angular.equals($scope.meeting.status, "pause")){

			play=false;
		}else if(angular.equals($scope.meeting.status, "stop")){
			play=false;
			$scope.indexx = 0;
			angular.forEach($scope.meeting.agenda, function(point){
				point.duration = point.originalDuration;
			});
			$scope.auxAgenda = angular.copy($scope.meeting.agenda);
		}
	};

	function actPointsDuration(elapsedTime){
		var done = false;
			var index=0;

			while((index<$scope.auxAgenda.length)&&!done){
				elapsedTime = $scope.auxAgenda[index].duration - elapsedTime;
				if(elapsedTime<0){
					$scope.auxAgenda[index].duration = 0;
					elapsedTime=Math.abs(elapsedTime);
					index+=1;
				}else{
					$scope.auxAgenda[index].duration = elapsedTime;
					done=true;
				}
			}

	};
	
	var actDate=function(){
		$('#datetimepicker').data("DateTimePicker").setDate(moment($scope.meeting.date));
	};


	$scope.getTotalRemaining = function(){
		var totalRemaining={
			value:parseInt(0),
			percentage:parseInt(0),
			total:parseInt(0),
		}
		angular.forEach($scope.auxAgenda, function(point) {
			totalRemaining.value = totalRemaining.value+parseInt(point.duration);
			totalRemaining.total = totalRemaining.total+parseInt(point.originalDuration);

		});
		if(totalRemaining.value==0){
			play=false;
		}
		totalRemaining.percentage = totalRemaining.value*100/totalRemaining.total;

		return totalRemaining;
		
	};

  	$scope.addPoint = function() {
  		var durationInSec = $scope.formPointDuration * 60;
  		$scope.auxAgenda.push({name:$scope.formPointName, duration:durationInSec, originalDuration:durationInSec});
	    $scope.meeting.agenda.push({name:$scope.formPointName, duration:durationInSec, originalDuration:durationInSec});
	    $scope.formPointName = '';
	    $scope.formPointDuration = '';
	    putMeeting();
	    document.getElementById("nameNewPoint").focus();
	  };

	 $scope.removePoint = function(point) {
	 	var index = $scope.auxAgenda.indexOf(point);
	 	$scope.auxAgenda.splice(index,1);
	 	$scope.meeting.agenda.splice(index,1);
	 	putMeeting();
	 	if($scope.auxAgenda.length==0){
			play=false;
	 		putStatus("stop");
	 	}
	 	
	 };

	 $scope.modifyPointComment = function(point){
	 	var index = $scope.auxAgenda.indexOf(point);
	 	$scope.auxAgenda[index].comment=point.comment;
	 	$scope.meeting.agenda[index].comment=point.comment;
	 	putMeeting();
	 }

	 $scope.actComment = function(point){
	 	var index = $scope.auxAgenda.indexOf(point);
	 	$scope.auxAgenda[index].comment = $scope.meeting.agenda[index].comment;

	 }
	
	 $scope.play = function(){
	 	
	 	if(!angular.equals($scope.meeting.status,"play")){
	 		$scope.meeting.status="play";
	 		play=true;
			crono();
			putStatus("play");
	 	}
	 	
	 }

	 $scope.pause = function(){
	 	if(!angular.equals($scope.meeting.status,"pause")){
		 	$scope.meeting.status="pause";
		 	play = false;
		 	$scope.meeting.agenda = $scope.auxAgenda;
		 	putStatus("pause");
		 	putMeeting();
	 	}
	 };

	 $scope.stop = function(){
	 	if(!angular.equals($scope.meeting.status,"stop")){
		 	$scope.meeting.status="stop";
		 	play = false;
		 	$scope.indexx = 0;
		 	putStatus('stop');
		 	angular.forEach($scope.auxAgenda, function(point){
		 		point.duration = point.originalDuration;
				
		 	});
		 	$scope.meeting.agenda = $scope.auxAgenda;
		 	putMeeting();
	 	}
	 };


	$scope.onFocusTitle = false;
	$scope.onFocusDescription=false;
	$scope.onFocusDate=false;

	$scope.auxTitle="";
	$scope.auxDescription="";


	 $scope.saveOldData = function(element){
	 	if(angular.equals(element,"title")){
		 	$scope.onFocusTitle=true;
		 	$scope.auxTitle = angular.copy($scope.meeting.title);
		 	$scope.oldTitle = angular.copy($scope.meeting.title);
		}else
		if(angular.equals(element,"description")){
		 	$scope.onFocusDescription=true;
		 	$scope.auxDescription = angular.copy($scope.meeting.description);
		 	$scope.oldDescription = angular.copy($scope.meeting.description);
		}

	 };

	 $scope.doneEditing=function(element){
	 	if(angular.equals(element,"title")){
		 	$scope.meeting.title=angular.copy($scope.auxTitle);
		 	$scope.oldTitle="";
		 	if(angular.equals("",$scope.auxTitle)){
		 		$scope.onFocusTitle=true;
		 	}else{
		 		 	$scope.onFocusTitle=false;
		 		 }
	 	}else
	 	if(angular.equals(element,"description")){
		 	$scope.meeting.description=angular.copy($scope.auxDescription);
		 	$scope.oldDescription="";
		 	if(angular.equals("",$scope.auxDescription)){
		 		$scope.onFocusDescription=true;
		 	}else{
		 		 	$scope.onFocusDescription=false;
		 		 }
	 	}

	 	putMeeting();
	 };

	 $scope.revertEditing = function (element) {
	 	if(angular.equals(element,"title")){
		 	$scope.meeting.title=$scope.oldTitle;

		 	if(angular.equals("",$scope.meeting.title)){
		 		$scope.onFocusTitle=true;

		 	}else{
		 		 	$scope.onFocusTitle=false;
		 		 }
	 	}
	 	if(angular.equals(element,"description")){
		 	$scope.meeting.description=angular.copy($scope.oldDescription);
		 	if(angular.equals("",$scope.meeting.description)){
		 		$scope.onFocusDescription=true;
		 	}else{
		 		 	$scope.onFocusDescription=false;
		 		 }
	 	}
	 };


	$scope.goacta = false;
	 $scope.goActa=function(){
	 	$scope.goacta = true;
	 	var path="/meeting/"+$routeParams.meetingId+"/acta"
       
        $location.path(path);
	 }

	 $scope.indexx = 0;
	 $scope.auxPoint = null;
	 var timer= null;
	 var crono = function(){
 		
	 	if($scope.auxAgenda[$scope.indexx] && play){
 			$scope.auxPoint = $scope.auxAgenda[$scope.indexx]
 			if($scope.auxPoint.duration>0){
 				$scope.auxAgenda[$scope.indexx].duration = parseInt($scope.auxPoint.duration) -1;
 				if($scope.auxAgenda[$scope.indexx].duration ==timeToAlert*60){
 					
 					if (Notification && Notification.permission === "granted") { 						
				        var n = new Notification("Alert!", {body: $scope.auxAgenda[$scope.indexx].name+" of "+$scope.meeting.title+": less than "+timeToAlert+" minutes.",
				   											icon: "img/warning.png"});

					    n.onclick = function () { 
							n.close();
						 }
				    }
 				} 				
 			}else{
 			$scope.indexx +=1;
 			}

 			timer = $timeout(crono, 1000);
 		}	
	 }



	 var timerRefresh = null
	function refresh(){

		getMeeting();

		timerRefresh=$timeout(refresh, 5000);

	};


	$('textarea').bind('keypress', function (e) {
	  if ((e.keyCode || e.which) == 13) {
	    $(this).parents('form').submit();
	    e.preventDefault();
	  }
	});

	$("#descriptionForm").on("submit", function (e) {
   		e.preventDefault();
	});

    $('#datetimepicker').datetimepicker({

    	defaultDate: new Date()    	
    	
    });

    $("#datetimepicker").on("dp.change",function (e) {
       $scope.meeting.date=$('#datetimepicker').data("DateTimePicker").getDate().valueOf();
       putMeeting();
    });


	 $scope.$on(
            "$destroy",
            function( event ) {

                $timeout.cancel( timer );
                $timeout.cancel(timerRefresh);
      
            }
        );

	 $scope.dndChange=0;
	 var first = true;
	 $scope.$watch("dndChange", function() {
	 	if(!first){
	
	 	$scope.meeting.agenda=angular.copy($scope.auxAgenda);

        putMeeting();
        putDnDChange=true;
        $scope.indexx=0;
        
    	}else{
    		first=false;
    	}
    },true);

	

}]);


planfeedControllers.controller('NewMeetingCtrl',['$scope', '$routeParams', 'Mock','Meeting','$location', function ($scope, $routeParams, Mock,Meeting,$location){

	var newMeeting = Mock.query();


	Meeting.put(newMeeting).success(function(meet){
		$location.url('/meeting/'+ meet.meetingId);
	}).error(function(response, status){
		$('.ngview').load('partials/error-view.html');
	});

}]);

planfeedControllers.controller('MainCtrl',['$scope', '$routeParams', 'Mock','Meeting','$location', function ($scope, $routeParams, Mock,Meeting,$location){

	// $scope.newMeeting = function(){
	// 	$location.url('/meeting');

	// };

}]);

planfeedControllers.controller('ActaCtrl',['$scope', '$routeParams','Meeting', '$location','pdfservice', function ($scope, $routeParams,Meeting, $location,pdfservice){

	var getEmptyMeeting = function () { return Mock.query();};
	$scope.getUrlActa= function(){
		return Meeting.getUrlActa($routeParams.meetingId).error(function(response, status){
		$('.ngview').load('partials/error-view.html');
		});
	
	};
	$scope.linkActa=Meeting.getUrlActa($routeParams.meetingId);
	pdfservice.render('pdfCanvas', Meeting.getUrlActa($routeParams.meetingId));
	 

}]);

