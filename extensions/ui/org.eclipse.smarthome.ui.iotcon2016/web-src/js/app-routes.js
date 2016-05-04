'use strict';

angular
  .module('eshUiApp')
  .config(($routeProvider) => {

    $routeProvider.when('/colorPicker', {
      template: '<color-picker item="colorItem"></color-picker>'
    }).otherwise({
      redirectTo: '/colorPicker'
    });

  });
