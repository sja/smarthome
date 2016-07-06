'use strict';

import 'jquery-ui/draggable';
const TEMPLATE = require('html!./ColorPickerComponent.html');

export default function ColorPickerComponent($log, itemService, colorUtils) {

  var throttle = (func, ms = 50, context = window) => {
    let to;
    let wait = false;
    return (...args) => {
      let later = () => {
        func.apply(context, args);
      };
      if (!wait) {
        later();
        wait = true;
        to = setTimeout(() => {
          wait = false;
        }, ms);
      }
    };
  };

  return {
    restrict: 'E',
    scope: {
      item: '='
    },
    template: TEMPLATE,
    link: function (scope, elem) {

      $log.debug('ColorPickerCtrl has entered the stage!');

      var canvas = $('canvas', elem)[0];
      var context = canvas.getContext('2d');
      colorUtils.paintColorBallToCanvas(canvas);
      updateDragger($('.dragger', elem), [0, 0, 0]);

      $('.dragger', elem).draggable({drag: dragHandler});

      let throttledItemUpdate = throttle(function (hsl) {
        itemService.sendCommand({itemName: 'hue_LLC011_001788167587_2_color'}, hsl.join(','));
      }, 200);

      let throttledColorValueUpdate = throttle(updateDragger, 200);


      function dragHandler() {
        var $canvas = $('canvas', elem);
        var $dragger = $('.dragger', elem);
        var context = canvas.getContext('2d');

        var canvasOffset = $canvas.offset();
        var draggerOffset = $dragger.offset();
        var canvasX = draggerOffset.left - canvasOffset.left;
        var canvasY = draggerOffset.top - canvasOffset.top;

        var imageData = context.getImageData(canvasX, canvasY, 1, 1);
        var hsl = colorUtils.rgb2hsl.apply(null, imageData.data);

        throttledColorValueUpdate($dragger, hsl);
        throttledItemUpdate(hsl);

        var pixelColor = 'hsl(' + hsl[0] + ',' + hsl[1] + '%,' + hsl[2] + '%)';
        $dragger.css('backgroundColor', pixelColor);
      }

      function updateDragger($dragger, hsl) {
        var i = 0, lis = $dragger.find('li');
        for (; i < 3; i++) {
          lis.get(i).innerHTML = hsl[i];
        }
      }

    }
  };
}
