/*!Original document:
 * AngularJS Round Progress Directive
 *
 * Copyright 2013 Stephane Begaudeau
 * Released under the MIT license

  Modifications:
  Copyright 2014 Santi Muñoz Mallofre

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
planfeedApp.directive('angRoundProgress', [function () {
  var compilationFunction = function (templateElement, templateAttributes, transclude) {
    if (templateElement.length === 1) {
      var node = templateElement[0];

      var defaultRad = 280;
      var canvasWidth=defaultRad;
      var canvasOCW=20;
      var canvasICW=10;
      var canvasOCR=120;
      var canvasICR=90;
      var canvasLabel=30;

      if (window.innerWidth<325){
          canvasWidth=window.innerWidth-45;
          canvasOCW=canvasOCW*canvasWidth/defaultRad;
          canvasICW=canvasICW*canvasWidth/defaultRad;
          canvasOCR=canvasOCR*canvasWidth/defaultRad;
          canvasICR=canvasICR*canvasWidth/defaultRad;
          canvasLabel=canvasLabel*canvasWidth/defaultRad;
        }

      var width = node.getAttribute('data-round-progress-width') || canvasWidth;
      var height = node.getAttribute('data-round-progress-height') || canvasWidth;


      var canvas = document.createElement('canvas');
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      canvas.setAttribute('data-round-progress-model', node.getAttribute('data-round-progress-model'));

      node.parentNode.replaceChild(canvas, node);

      var outerCircleWidth = node.getAttribute('data-round-progress-outer-circle-width') || canvasOCW;
      var innerCircleWidth = node.getAttribute('data-round-progress-inner-circle-width') || canvasICW;

      var outerCircleBackgroundColor = node.getAttribute('data-round-progress-outer-circle-background-color') || '#505769';
      var outerCircleForegroundColor = node.getAttribute('data-round-progress-outer-circle-foreground-color') || '#12eeb9';
      var innerCircleColor = node.getAttribute('data-round-progress-inner-circle-color') || '#505769';
      var labelColor = node.getAttribute('data-round-progress-label-color') || '#12eeb9';

      var outerCircleRadius = node.getAttribute('data-round-progress-outer-circle-radius') || canvasOCR;
      var innerCircleRadius = node.getAttribute('data-round-progress-inner-circle-radius') || canvasICR;

      var labelFont = node.getAttribute('data-round-progress-label-font') || canvasLabel+'pt Arial';

      return {
        pre: function preLink(scope, instanceElement, instanceAttributes, controller) {
          var expression = canvas.getAttribute('data-round-progress-model');
          scope.$watch(expression, function (newValue, oldValue) {
            // Create the content of the canvas
            var ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, width, height);

            // The "background" circle
            var x = width / 2;
            var y = height / 2;
            ctx.beginPath();
            ctx.arc(x, y, parseInt(outerCircleRadius), 0, Math.PI * 2, false);
            ctx.lineWidth = parseInt(outerCircleWidth);
            ctx.strokeStyle = outerCircleBackgroundColor;
            ctx.stroke();

            // The inner circle
            ctx.beginPath();
            ctx.arc(x, y, parseInt(innerCircleRadius), 0, Math.PI * 2, false);
            ctx.lineWidth = parseInt(innerCircleWidth);
            ctx.strokeStyle = innerCircleColor;
            ctx.stroke();

            // The inner number
            ctx.font = labelFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = labelColor;

            var input=newValue.value;
            var out="";
            var hours = Math.floor(input/3600);
            input= input-hours*3600;
            var minutes = Math.floor(input/60);
            var seconds = input-minutes*60;
            if(hours<10){
              hours="0"+hours.toString();
            }
            if(minutes<10){
              minutes="0"+minutes.toString();
            }
            if(seconds<10){
              seconds="0"+seconds.toString();
            }
            out = hours + ":" + minutes + ":" + seconds;

            ctx.fillText(out, x, y);


            // The "foreground" circle
            var startAngle = - (Math.PI / 2);
            var endAngle = ((Math.PI * 2 ) * newValue.percentage/100) - (Math.PI / 2);
            var anticlockwise = false;
            ctx.beginPath();
            ctx.arc(x, y, parseInt(outerCircleRadius), startAngle, endAngle, anticlockwise);
            ctx.lineWidth = parseInt(outerCircleWidth);
            ctx.strokeStyle = outerCircleForegroundColor;
            ctx.stroke();
          }, true);
        },
        post: function postLink(scope, instanceElement, instanceAttributes, controller) {}
      };
    }
  };

  var roundProgress = {
    compile: compilationFunction,
    replace: true
  };

  return roundProgress;
}]);