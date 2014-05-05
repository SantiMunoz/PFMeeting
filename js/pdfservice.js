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

planfeedApp.service('pdfservice', [ function(){
	
	this.render = function (canvasId, pdfFile) {
            PDFJS.getDocument(pdfFile).then(function (pdf) {
                
                pdf.getPage(1).then(function (page) {
                    var scale = 1.3;
                    var width = document.getElementById('mainContent').offsetWidth-45;
                    console.log(width);
                    var viewport = page.getViewport(width / page.getViewport(1.0).width);

                    var canvas = document.getElementById(canvasId);
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = width;
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                });
            });
        }

	


}]);