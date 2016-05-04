'use strict';

import colorPicker from '../components/colorPicker/component.js'

angular
  .module('eshUiApp', [
    'PaperUI.controllers',
    'ngRoute',
    colorPicker.name
  ])

  .run(($log) => {

    $log.info('Application has started.');

  });
