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

planfeedApp.factory("IntervalService",['$q',function($q){

    var worker = new Worker('js/timerworker.js');
    var  callbacks= {};
    //var defer;
    worker.addEventListener('message', function(e) {
      switch (e.data.message) {
            case 'interval:tick':
                var callback = callbacks[e.data.id];
                if (callback && callback.fn) callback.fn.apply(callback.context);
                break;
            case 'interval:cleared':
                delete callbacks[e.data.id];
               // defer.resolve(e.data);
                break;
        }
      
    }, false);

    return {
    	id: 0,


        // doWork : function(myData){
        //     defer = $q.defer();
        //     worker.postMessage(myData); // Send data to our worker. 
        //     return defer.promise;
        // },
        setInterval: function(cb, interval, context) {
	        this.id++;
	        var id = this.id;
	        callbacks[id] = { fn: cb, context: context };
	        worker.postMessage({ command: 'interval:start', interval: interval, id: id });
	        return id;
    	},

	    clearInterval: function(id) {
	        worker.postMessage({ command: 'interval:clear', id: id });
	    }

	    };

}]);