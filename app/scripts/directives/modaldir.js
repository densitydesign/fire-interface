'use strict';

/**
 * @ngdoc directive
 * @name fireInterfaceApp.directive:modaldir
 * @description
 * # modaldir
 */
angular.module('fireInterfaceApp')
  .directive('modalDialog', function() {
    return {
      restrict: 'E',
      scope: {
        show: '=info',
        links: '='
      },
      link: function(scope, element, attrs) {
        scope.dialogStyle = {};
        if (attrs.width)
          scope.dialogStyle.width = attrs.width;
        if (attrs.height)
          scope.dialogStyle.height = attrs.height;
        scope.hideModal = function() {
          scope.show = false;
        };

        scope.$watch("links",function(n,o){
          console.log("new links", n);
        })

      },
      template: "<div ng-click='hideModal()' class='dial-back'><div class='ng-modal'><div class='ng-modal-overlay' ng-click='hideModal()'></div><div class='ng-modal-dialog' ng-style='dialogStyle'><div class='ng-modal-close' ng-click='hideModal()'>close <span class='fa fa-times'></span></div><div class='ng-modal-dialog-content'><div ng-repeat='l in links'><a ng-href='{{l}}' target='_blank'>{{l}}</a></div></div></div></div></div>"
    };
  });

