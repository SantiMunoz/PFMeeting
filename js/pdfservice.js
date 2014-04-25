'use strict';

planfeedApp.service('pdfservice', [ function(){
	
	this.render = function (canvasId, pdfFile) {
            PDFJS.getDocument(pdfFile).then(function (pdf) {
                
                pdf.getPage(1).then(function (page) {
                    var scale = 1.3;
                    var viewport = page.getViewport(scale);

                    var canvas = document.getElementById(canvasId);
                    var context = canvas.getContext('2d');
                   	canvas.height = viewport.height;
					canvas.width = viewport.width;
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                });
            });
        }

	


}]);