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


planfeedControllers.controller('PlanfeedGeneralCtrl',['$scope', '$routeParams', 'Mock','Meeting','$timeout','$location','$filter','calendarEventService', function ($scope, $routeParams, Mock,Meeting, $timeout,$location,$filter,calendarEventService){


	//notificación cuando queden 3 minutos
	var timeToAlert=3;
	var putDnDChange=false;
	var onMobileDevice=false;
	$scope.doingPut=false;
	$scope.ignoreGet=false;
	var showDate;
	var meeting;
	var getEmptyMeeting = function () { return Mock.query();};
	var getMeeting= function(){
		return Meeting.get($routeParams.meetingId).success(function(response){

			
		if(!angular.equals(response, $scope.meeting)&& !$scope.ignoreGet){
			var statusChange=false;
			var dateChange=false;
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
			if(!angular.equals(response.initOffTime,oldMeeting.initOffTime)){
				oldMeeting.initOffTime=angular.copy(response.initOffTime)
			}
			if(!angular.equals(response.calendarEventId,oldMeeting.calendarEventId)){oldMeeting.calendarEventId=angular.copy(response.calendarEventId) }
			if(!angular.equals(response.creatorEmail,oldMeeting.creatorEmail)){oldMeeting.creatorEmail=angular.copy(response.creatorEmail) }
			if(!angular.equals(response.calendarId,oldMeeting.calendarId)){oldMeeting.calendarId=angular.copy(response.calendarId) }
			if(!angular.equals(response.timeFinish,oldMeeting.timeFinish)){oldMeeting.timeFinish=angular.copy(response.timeFinish) }

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

	var putMeeting = function(updateEventCalendar){
		$scope.ignoreGet=true;
		$scope.doingPut=true;
		Meeting.put($scope.meeting, updateEventCalendar).success(function(response){
		if(!angular.equals(response.agenda, $scope.auxAgenda)){
			$scope.meeting.agenda = angular.copy(response.agenda);
			actAuxAgenda();
		}
		if(putDnDChange){
			putStatus("orderChange");
			putDnDChange=false;

		}
		$scope.ignoreGet=false;

	}).error(function(response, status){
		$('.ngview').load('partials/error-view.html');
	}); 
	}
	var putStatus = function(stat){
		$scope.ignoreGet=true;
		$scope.doingPut=true;
		Meeting.putStatus($routeParams.meetingId,stat ).error(function(response, status){
		$('.ngview').load('partials/error-view.html');
		});
		$scope.ignoreGet=false;
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
		
			
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))onMobileDevice = true})(navigator.userAgent||navigator.vendor||window.opera);
		
		var isIE11 = !!navigator.userAgent.match(/Trident.*rv[ :]*11\./);
		if ( navigator.userAgent.indexOf("MSIE")>0 || isIE11 || (navigator.userAgent.match(/iPad/i) != null) ||(navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1)){
	     
			onMobileDevice=true;
		}	

		if(!onMobileDevice){
		
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
			negativeTimed=negativeTime=false;
			negativeSeconds=0;
			$scope.indexx = 0;
			angular.forEach($scope.meeting.agenda, function(point){
				point.duration = point.originalDuration;
			});
			$scope.auxAgenda = angular.copy($scope.meeting.agenda);
		}else if(angular.equals($scope.meeting.status, "finished")){
			play=false;
			angular.forEach($scope.meeting.agenda, function(point){
		 		point.duration = 0;
				
		 	});
		 	$scope.auxAgenda = angular.copy($scope.meeting.agenda);
		 	if($scope.meeting.initOffTime!=0&&$scope.meeting.initOffTime!=null){
		 		negativeTimed=true;
		 		negativeTime=false;

		 		negativeSeconds=0- Math.round(($scope.meeting.timeFinish - $scope.meeting.initOffTime)/1000);
		 	}
		}else if(angular.equals($scope.meeting.status, "offTime")){
			play=false;
			angular.forEach($scope.meeting.agenda, function(point){
		 		point.duration = 0;
				
		 	});
		 	$scope.auxAgenda = angular.copy($scope.meeting.agenda);

		 	negativeSeconds=0- Math.round(((new Date()).getTime() - $scope.meeting.initOffTime)/1000);
		 	negativeTimed=negativeTime=true;
		 	cronoNegative();
		 	
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




	var negativeTimed = false; //control timeRemaining, popover and canvas
	var negativeTime = false;  //control cronoNegative
	var negativeSeconds=0;
	var cronoPlayed = false;

	$scope.getTotalRemaining = function(){
		var totalRemaining={
			value:parseInt(0),
			percentage:parseInt(0),
			total:parseInt(0),
		}
		if(!negativeTimed){
			angular.forEach($scope.auxAgenda, function(point) {
				totalRemaining.value = totalRemaining.value+parseInt(point.duration);
				totalRemaining.total = totalRemaining.total+parseInt(point.originalDuration);

			});
			if(totalRemaining.value==0){
				if(cronoPlayed&&play&&!angular.equals($scope.meeting.status,"finished")){
					
					$timeout(startNegative,1000);
				}else{
					play=false;
				}
			
				
			}
			totalRemaining.percentage = totalRemaining.value*100/totalRemaining.total;
		}else{

			totalRemaining.value= negativeSeconds;
			totalRemaining.percentage = 100;
		}
		return totalRemaining;
		
	};

	var startNegative = function(){
		if(cronoPlayed&&play&&!angular.equals($scope.meeting.status,"finished")){
			play=false;
			negativeTimed=negativeTime=true;
			cronoNegative();
			$scope.meeting.status="offTime";
			putStatus("offTime");
		}
	};

  	$scope.addPoint = function() {
  		var durationInSec = $scope.formPointDuration * 60;
  		$scope.auxAgenda.push({name:$scope.formPointName, duration:durationInSec, originalDuration:durationInSec});
	    $scope.meeting.agenda.push({name:$scope.formPointName, duration:durationInSec, originalDuration:durationInSec});
	    $scope.formPointName = '';
	    $scope.formPointDuration = '';

	    if(!angular.equals("", $scope.meeting.calendarId)){
	 		putMeeting(true);
	 	}else{
	 		putMeeting();
	 	}
	    document.getElementById("nameNewPoint").focus();
	  };

	 $scope.removePoint = function(point) {
	 	var index = $scope.auxAgenda.indexOf(point);
	 	$scope.auxAgenda.splice(index,1);
	 	$scope.meeting.agenda.splice(index,1);
	 	if($scope.auxAgenda.length==0){
	 		play=false;
			if($scope.meeting.status != "stop"){
				$scope.meeting.status="stop";
	 			//putStatus("stop");
	 			negativeTimed=negativeTime = false;
	 			$scope.meeting.initOffTime=0;
	 		}
	 	}

	 	if(!angular.equals("", $scope.meeting.calendarId)){
	 		putMeeting(true);
	 	}else{
	 		putMeeting();
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
	 	
	 	if(!angular.equals($scope.meeting.status,"play") &&$scope.auxAgenda.length!=0 &&!negativeTime&&!angular.equals($scope.meeting.status,"finished")){
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
		 	$scope.meeting.agenda=angular.copy($scope.auxAgenda);

		 	putMeeting();
	 	}
	 };

	 $scope.stop = function(){
	 	if(!angular.equals($scope.meeting.status,"stop")){
		 	$scope.meeting.status="stop";
		 	$scope.meeting.initOffTime=0;
		 	$scope.meeting.timeFinish=0;
		 	play = false;
		 	$scope.indexx = 0;
		 	cronoPlayed =negativeTimed=negativeTime=false;
		 	negativeSeconds=0;

		 	angular.forEach($scope.auxAgenda, function(point){
		 		point.duration = point.originalDuration;
				
		 	});
		 	$scope.meeting.agenda=angular.copy($scope.auxAgenda);

		 	putMeeting();
	 	}
	 };

	 $scope.timeRemainingWhenFinish=null;
	 $scope.finishMeeting=function(){
	 	

	 	if(!angular.equals($scope.meeting.status,"finished")){
	 		$scope.meeting.status="finished";
	 		$scope.timeRemainingWhenFinish=$filter('HHmmssFormat')($scope.getTotalRemaining().value);
		 	angular.forEach($scope.auxAgenda, function(point){
			 		point.duration = 0;
			 	});
		 	$scope.meeting.agenda=angular.copy($scope.auxAgenda);

			 putMeeting();
			 negativeTime=false;
		}else{
			$scope.timeRemainingWhenFinish=$filter('HHmmssFormat')($scope.getTotalRemaining().value);
		}
	 };

	 $scope.getMessageFinish=function(){
	 	if(negativeTimed){
	 		
	 		return "Meeting finished "+$scope.timeRemainingWhenFinish+" later, you can plan next meeting better ;)";
	 	}else{
	 		return "Congratulations, you have finished the meeting "+$scope.timeRemainingWhenFinish+" early!";
	 	}
	 };

	 //close popover 
	$('body').on('click', function (e) {
	   $('*[popover]').each(function () {
	                //Only do this for all popovers other than the current one that cause this event
	                if (!($(this).is(e.target) || $(this).has(e.target).length > 0) 
	                     && $(this).siblings('.popover').length !== 0 
	                     && $(this).siblings('.popover').has(e.target).length === 0)                  
	                {
	                     //Remove the popover element from the DOM          
	                     $(this).siblings('.popover').remove();
	                     //Set the state of the popover in the scope to reflect this          
	                     angular.element(this).scope().tt_isOpen = false;
	                }
	    });
	});



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
	 	if(!angular.equals("", $scope.meeting.calendarId)){
	 		putMeeting(true);
	 	}else{
	 		putMeeting();
	 	}
	 	
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

	 var crono = function(){
 		
	 	if($scope.auxAgenda[$scope.indexx] && play){
 			$scope.auxPoint = $scope.auxAgenda[$scope.indexx]
 			if($scope.auxPoint.duration>0){
 				$scope.auxAgenda[$scope.indexx].duration = parseInt($scope.auxPoint.duration) -1;
 				cronoPlayed=true;
 				if($scope.auxAgenda[$scope.indexx].duration ==timeToAlert*60){
 					if(!onMobileDevice){
	 					if (Notification && Notification.permission === "granted") { 						
					        var n = new Notification("Alert!", {body: $scope.auxAgenda[$scope.indexx].name+" of "+$scope.meeting.title+": less than "+timeToAlert+" minutes.",
					   											icon: "img/warning.png"});

						    n.onclick = function () { 
								n.close();
							 }
					    }
					}else{
						var alertDate=new Date().getTime();
						alert($scope.auxAgenda[$scope.indexx].name+" of "+$scope.meeting.title+": less than "+timeToAlert+" minutes.");
						var elapsedTime = Math.round(((new Date()).getTime() - alertDate)/1000);
						actPointsDuration(elapsedTime);
					}
 				} 

 			}else{
 			$scope.indexx +=1;
 			}

 			$scope.timer = $timeout(crono, 1000);
 		}	
	 }


	 var cronoNegative = function(){
	 	if(negativeTime){
	 		negativeSeconds-=1;

	 		$scope.negativeTimer = $timeout(cronoNegative, 1000);
	 	}
	 }

	function refresh(){
		if(!$scope.doingPut){
			getMeeting();
		}else{
			$scope.doingPut=false;
		}
		$scope.timerRefresh=$timeout(refresh, 5000);

	};

function pasteIntoInput(el, text) {
    el.focus();
    if (typeof el.selectionStart == "number"
            && typeof el.selectionEnd == "number") {
        var val = el.value;
        var selStart = el.selectionStart;
        el.value = val.slice(0, selStart) + text + val.slice(el.selectionEnd);
        el.selectionEnd = el.selectionStart = selStart + text.length;
    } else if (typeof document.selection != "undefined") {
        var textRange = document.selection.createRange();
        textRange.text = text;
        textRange.collapse(false);
        textRange.select();
    }
}
	$('textarea').bind('keypress', function (e) {
	   if (e.keyCode == 13 && e.shiftKey)
	    {
	        pasteIntoInput(this, "\n");
	        e.preventDefault();
	    }else if ((e.keyCode || e.which) == 13) {
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

    var firstDate=true;
    $("#datetimepicker").on("dp.change",function (e) {
    	if(firstDate){
    		firstDate=false;
    	}else{
	       $scope.meeting.date=$('#datetimepicker').data("DateTimePicker").getDate().valueOf();
	      
	       if(!angular.equals("", $scope.meeting.calendarId)){
	 			putMeeting(true);
		 	}else{
		 		putMeeting();
		 	}
    	}

    });

	 $scope.$on(
            "$destroy",
            function( event ) {

                $timeout.cancel( $scope.timer );
                $timeout.cancel($scope.timerRefresh);
      			$timeout.cancel($scope.negativeTimer);
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


planfeedControllers.controller('NewMeetingCtrl',['$scope', '$routeParams', 'Mock','Meeting','$location','calendarEventService', function ($scope, $routeParams, Mock,Meeting,$location,calendarEventService){

	var newMeeting = Mock.query();
	var calendarEvent = calendarEventService.getCalendarEvent();
	
	if(calendarEvent!=null){


		newMeeting.title=calendarEvent.summary;
		newMeeting.description=calendarEvent.description;

		var auxDate = new Date(calendarEvent.start.dateTime);
		newMeeting.date=auxDate.getTime();
		newMeeting.calendarEventId=calendarEvent.id;
		newMeeting.creatorEmail=calendarEventService.getEmail();
		newMeeting.calendarId=calendarEventService.getCalendarId();
	}
	Meeting.put(newMeeting).success(function(meet){
		var meettingLink = "\nMeeting in Plan&Feedback Meeting Tool:\nhttp://pfmeeting.com/#/meeting/"+meet.meetingId;
		if(calendarEvent!=null){
			if(calendarEvent.description!=null){ 
				calendarEvent.description=calendarEvent.description.concat(meettingLink);
			}else{
				calendarEvent.description = meettingLink
			}
			var request=gapi.client.calendar.events.update({calendarId: calendarEventService.getCalendarId(),eventId:calendarEvent.id,resource:calendarEvent});
			request.execute(function(response){
				//console.log(response);
			});
		}

		

		$location.url('/meeting/'+ meet.meetingId);
	}).error(function(response, status){
		$('.ngview').load('partials/error-view.html');
	});



}]);

planfeedControllers.controller('MainCtrl',['$window','$scope', '$routeParams', 'Mock','Meeting','$location', function ($window,$scope, $routeParams, Mock,Meeting,$location){
	$scope.myInterval = 5000;
  var slides = $scope.slides = [];




    slides.push({
  	image:'img/createBtns.png',
  	title:'Create New Meeting',
  	description: 'Only click there!'
  });
        slides.push({
  	image:'img/import.png',
  	title:'Import from Google Calendar',
  	description: 'You can import your own meetings from Google Calendar'
  });
            slides.push({
  	image:'img/meeting1.png',
  	title:'Make your meeting',
  	description: ''
  });
  
    slides.push({
  	image:'img/chromeStore.png',
  	title:'P&FMeeting Plugin',
  	description: 'Create your meetings quickly'
  });
}]);



planfeedControllers.controller('NavBarCtrl',['GoogleService','BaseURLService','$modal','$window','$scope', '$routeParams', 'Mock','Meeting','$location','$timeout','calendarEventService', function (GoogleService,BaseURLService,$modal,$window,$scope, $routeParams, Mock,Meeting,$location,$timeout,calendarEventService){

$scope.showSignInButton=true;
$scope.isSignedIn=false;
var firstTime=true;
$scope.isSignedIn = false;

$scope.newMeeting=function(){
	calendarEventService.setCalendarEvent(null);
	calendarEventService.setEmail(null);
	calendarEventService.setCalendarId(null);
	$location.url('/meeting');
};

$scope.signIn = function(authResult) {

  if(firstTime){
		firstTime=false;

		var elem = document.getElementById("importBtn");
		var elem2 = document.getElementById("importBtnDis");
		elem2.style.display="none";
		elem.style.display = "block";

  }else{

	$scope.$apply(function() {
	    $scope.processAuth(authResult);
	  });
 	  
	  $scope.openModal();
  }


};

$scope.processAuth = function(authResult) {
   
	gapi.client.load('oauth2', 'v2', function () {
	    var request = gapi.client.oauth2.userinfo.get();
	    request.execute(function (resp) {
	        calendarEventService.setEmail(resp.email);
	        
	    });
	});
   	if ($scope.isSignedIn) {
     	return 0;
   	}

   	if (authResult['code']) {

		gapi.client.load('oauth2', 'v2', function () {
			    var request = gapi.client.oauth2.userinfo.get();
			    request.execute(function (resp) {
			        GoogleService.postToken(resp.email,authResult['code']).success(function(){
			   			
			   			$scope.isSignedIn=true;
			   			
			   		}).error(function(response, status){
						//no problem. token already exist
					});
			        
			    });
			});
   		
    
    }

}

$window.renderSignIn = function() {
  gapi.signin.render('importBtn', {
    'callback': $scope.signIn,
    'clientid': '17189049228-c3epg67458ki9p2k3udm9d31edra77l8.apps.googleusercontent.com',
    'redirecturi':'postmessage',
    'scope': 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email',
    'cookiepolicy': "single_host_origin",
    'accesstype': 'offline',
    'response_type':'code'
  });
};


function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

var modalInstance=null;
 	$scope.openModal = function(size){
 		 modalInstance= $modal.open({
	      templateUrl: 'partials/calendarModal.html',
	      controller: CalendarModalCtrl,
	      size: size
	    });

    modalInstance.result.then(function (event) {

      calendarEventService.setCalendarEvent(event);
     
	      var uuid=guid();
	      var idBasedOnCalendar = calendarEventService.getCalendarId().split('.').join("");
	      idBasedOnCalendar = idBasedOnCalendar.split('@').join("");
	      idBasedOnCalendar=idBasedOnCalendar+"3216";
	      var request=gapi.client.request({
	      	path: '/calendar/v3/calendars/'+calendarEventService.getCalendarId()+'/events/watch',
	      	method: 'POST',
		    body:{id:idBasedOnCalendar,
		      	type:'web_hook',
		      	address: 'https://pfmeetingapi.appspot.com/api/googlerest/notifications',
		      	params:{ttl:999999999999999999}
		      	},
		    headers: {'Content-Type':'application/json'}

	      });
	      request.execute(function(resp){
	    
	      });

      $location.url('/meeting');


    });


 };


 var CalendarModalCtrl = function ($modalInstance,$window,$scope, $routeParams, Mock,Meeting,$location,calendarEventService) {
 	$scope.emptyEvents=false;

	gapi.client.load('calendar', 'v3', function(){
    	
    	var request=gapi.client.calendar.calendarList.list();
    	request.execute(function(resp) {
				$scope.calendars= resp.items;
				$scope.calendarSelectedSummary = $scope.calendars[0].summary;
				calendarEventService.setCalendarId($scope.calendars[0].id);
		   	getCalendarEvents($scope.calendars[0].id);
    	 	
    	});
    });

      $scope.status = {
	    isopen: false
	  };


	  $scope.toggleDropdown = function($event) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    
	  };

	  $scope.cancel = function () {
	    $modalInstance.dismiss('cancel');
	  };

	  $scope.eventSelected = function(event){
	  	$modalInstance.close(event);
	  };

	  var getCalendarEvents = function(calendarSelectedId){
        	var startDate=new Date();
        	var request=gapi.client.calendar.events.list({calendarId: calendarSelectedId,orderBy:'updated',singleEvents:true, timeMin:startDate.toISOString()});
        	request.execute(function(resp) {
        		calendarEventService.setCalendarId(calendarSelectedId);
  				if(typeof resp.items === 'undefined'){
  					$scope.emptyEvents=true;
  				}else{
  					$scope.emptyEvents=false;
  					$scope.events= resp.items.reverse();
  				}
			   	$scope.$apply();
        	 	
        	});
	  };
	  $scope.calendarSelected = function(calendarSelected){
	  	$scope.calendarSelectedSummary=calendarSelected.summary;
	  	getCalendarEvents(calendarSelected.id);
	  }

  };


  $scope.redirectToHome = function() {
    	 $timeout.cancel( $scope.timer );
         $timeout.cancel($scope.timerRefresh);
		 $timeout.cancel($scope.negativeTimer);
    	 $location.url("/"); 
	};


}]);



planfeedControllers.controller('ActaCtrl',['$scope', '$routeParams','Mock', 'Meeting', '$location','pdfservice', function ($scope, $routeParams,Mock,Meeting, $location,pdfservice){

	 $scope.actaMeeting = Mock.query();
	
	Meeting.get($routeParams.meetingId).success(function(response){
		$scope.actaMeeting=response;

		});
	$scope.getDocumentName=function(){
	
		
		return "Acta of "+$scope.actaMeeting.title+".pdf";
	};

	$scope.getUrlActa= function(){
		return Meeting.getUrlActa($routeParams.meetingId).error(function(response, status){
		$('.ngview').load('partials/error-view.html');
		});
	
	};
	$scope.linkActa=Meeting.getUrlActa($routeParams.meetingId);
	pdfservice.render('pdfCanvas', Meeting.getUrlActa($routeParams.meetingId));
	 

}]);
