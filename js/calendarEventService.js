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

planfeedApp.service('calendarEventService', function(){
	var calendarEvent = null;
    var calendarId=null;
    var email=null;
	return {
            getCalendarEvent: function () {
                return calendarEvent;
            },
            setCalendarEvent: function(value) {
                calendarEvent = value;
            },
            getCalendarId: function() {
                return calendarId;
            },
            setCalendarId: function(value) {
                calendarId = value;
            },
            setEmail: function(value){
                email=value;
            },
            getEmail: function(){
                return email;
            }
        };
});