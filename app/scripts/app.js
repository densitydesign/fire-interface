'use strict';

/**
 * @ngdoc overview
 * @name fireInterfaceApp
 * @description
 * # fireInterfaceApp
 *
 * Main module of the application.
 */
angular
  .module('fireInterfaceApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/shootings', {
        templateUrl: 'views/shootings.html',
        controller: 'ShootingsCtrl',
        controllerAs: 'shootings',
        resolve: {
          shootings: function (dataservice) {
            return dataservice.getFile("data/shootings.tsv");
          }
        }
      })
      .when('/seizures', {
        templateUrl: 'views/seizures.html',
        controller: 'SeizuresCtrl',
        controllerAs: 'seizures',
        resolve: {
          seizures: function (dataservice) {
            return dataservice.getFile("data/seizures.tsv");
          }
        }
      })
      .otherwise({
        redirectTo: '/shootings'
      });
  });
