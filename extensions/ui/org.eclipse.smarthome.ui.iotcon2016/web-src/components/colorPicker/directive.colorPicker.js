'use strict';

export default angular
    .module('colorPicker')
    .directive('colorPicker', function () {
        return {
            restrict: 'E',
            scope: {
                item: '='
            },
            controller: function ColorPickerCtrl ($scope, $log, itemService) {

                $log.debug('ColorPickerCtrl has entered the stage!');

            }
        };
    });