'use strict';

export default function DeomoPageConfig($routeProvider) {
  $routeProvider.when('/colorPicker', {
    template: '<color-picker item="colorItem"></color-picker>',
    controller: function ($log) {

      $log.warn('Created a fake color item.');

      this.colorItem = {
        state: '0,100,50',
        name: 'myFakeColorItem',
        label: 'My Fake Color Item'
      };

    }
  });
}
