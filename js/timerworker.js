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

var intervalIds = {};
self.addEventListener('message', function(e) {

    switch (e.data.command) {

        case 'interval:start':

            var intvalId = setInterval(function() {
                postMessage({
                    message: 'interval:tick',
                    id: e.data.id
                });
            }, e.data.interval);

            postMessage({
                message: 'interval:started',
                id: e.data.id
            });

            intervalIds[e.data.id] = intvalId;

            break;

        case 'interval:clear':

            //clearInterval(intervalIds[e.data.id]);
            clearInterval(intervalIds[e.data.id]);
            postMessage({
                message: 'interval:cleared',
                id: e.data.id
            });

            delete intervalIds[e.data.id];

            break;

    }

}, false);