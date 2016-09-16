'use strict';

/**
 * @ngdoc filter
 * @name fireInterfaceApp.filter:mynumber
 * @function
 * @description
 * # mynumber
 * Filter in the fireInterfaceApp.
 */
angular.module('fireInterfaceApp')
  .filter('mynumber', function () {
    return function (input) {
      var ret = parseInt(input);
      if(isNaN(ret)) {ret = input}
      return ret;
    };
  });
