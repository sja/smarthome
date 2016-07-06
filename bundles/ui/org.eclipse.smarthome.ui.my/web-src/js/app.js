'use strict';

const angular = require('angular');
require('angular-touch');
require('angular-resource');
const pages = require('../components/pages/');
const colorPicker = require('../components/colorPicker/');
require('angular-route');

angular
  .module('eshUiApp', [
    'ngRoute',
    'ngResource',
    pages.name,
    colorPicker.name
  ])

  .run(($log) => {

    $log.info('Application has started.');

  });
