'use strict';

// const discoveryService = require('./discoveryService.js');
// const groupSetupService = require('./groupSetupService.js');
// const inboxService = require('./inboxService.js');
// const labelSetupService = require('./labelSetupService.js');
// const linkService = require('./linkService.js');
// const thingService = require('./thingService.js');
// const thingSetupService = require('./thingSetupService.js');
// const thingTypeService = require('./thingTypeService.js');

const MODULE_ID = 'esh.rest-services';
export {MODULE_ID as name};

angular.module(MODULE_ID, [])
  .factory('bindingService', require('./bindingService').default)
  .factory('itemService', require('./itemService').default);
